/**
 * ClickUp Task Manager
 * Business logic for task operations
 */

import { TasksApi } from '@/features/clickup/adapters/api/endpoints/tasks.api';
import { 
  ClickUpTask, 
  CreateTaskData, 
  UpdateTaskData,
  GetTasksOptions,
} from '@/features/clickup/domain/types';
import { TASK_PRIORITY, TASK_PRIORITY_LABELS } from '@/features/clickup/domain/constants';
import { 
  PROJECT_TIMELINE, 
  MILESTONE_TARGETS, 
  PROJECT_DURATION,
  getDaysSinceStart,
  getDaysToMilestone,
  getCurrentMilestone,
  getExpectedCompletionByMilestone
} from '@/features/clickup/domain/constants/project-timeline.constants';
import { ErrorHandler } from '@/lib/clickup/error-handler';
import { logger } from '@/lib/clickup/logger';

export interface TaskValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TaskMetrics {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  // Emergency dashboard metrics
  daysBehind?: number;
  daysToCriticalMilestone?: number;
  requiredVelocity?: number;
  currentVelocity?: number;
  totalStoryPoints?: number;
  completedStoryPoints?: number;
  projectStartDate?: string;
  criticalMilestoneDate?: string;
  // Partial delivery milestones
  nextMilestone?: string;
  milestoneProgress?: number;
  daysToNextMilestone?: number;
  milestoneTargetDate?: string;
  expectedCompletionByMilestone?: number;
  expectedTasksForMilestone?: number;
  tasksNeededForMilestone?: number;
  phases?: Array<{
    name: string;
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    estimatedSP: number;
    color: string;
  }>;
  tags?: Record<string, number>;
}

export interface BulkTaskResult {
  successful: ClickUpTask[];
  failed: Array<{ taskData: CreateTaskData; error: Error }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
}

export class TaskManager {
  constructor(private tasksApi: TasksApi) {}

  /**
   * Creates a task with validation and business rules
   */
  async createTaskWithValidation(
    listId: string,
    taskData: CreateTaskData,
    options?: { skipValidation?: boolean; autoAssign?: boolean }
  ): Promise<ClickUpTask> {
    logger.info(`Creating task with validation: ${taskData.name}`, { listId });

    // Validate task data
    if (!options?.skipValidation) {
      const validation = this.validateTaskData(taskData);
      if (!validation.isValid) {
        const error = new Error(`Task validation failed: ${validation.errors.join(', ')}`);
        ErrorHandler.logError(ErrorHandler.classifyError(error), { validationErrors: validation.errors });
        throw error;
      }

      // Log warnings
      if (validation.warnings.length > 0) {
        logger.warn(`Task creation warnings: ${validation.warnings.join(', ')}`, {
          taskName: taskData.name,
          warnings: validation.warnings,
        });
      }
    }

    // Apply business rules
    const processedTaskData = await this.applyBusinessRules(taskData, options);

    try {
      const task = await this.tasksApi.createTask(listId, processedTaskData);
      
      logger.logTaskOperation('created with validation', task.id, task.name);
      return task;
    } catch (error) {
      const clickUpError = ErrorHandler.classifyError(error);
      ErrorHandler.logError(clickUpError, { taskName: taskData.name });
      throw clickUpError;
    }
  }

  /**
   * Updates a task with validation
   */
  async updateTaskWithValidation(
    taskId: string,
    updates: UpdateTaskData,
    options?: { skipValidation?: boolean; forceStatus?: boolean }
  ): Promise<ClickUpTask> {
    logger.debug(`Updating task with validation: ${taskId}`, { updates });

    // Get current task for validation
    const currentTask = await this.tasksApi.getTask(taskId);

    // Validate updates
    if (!options?.skipValidation) {
      const validation = this.validateTaskUpdate(currentTask, updates);
      if (!validation.isValid) {
        const error = new Error(`Task update validation failed: ${validation.errors.join(', ')}`);
        ErrorHandler.logError(ErrorHandler.classifyError(error), { 
          taskId, 
          validationErrors: validation.errors 
        });
        throw error;
      }
    }

    // Apply business rules
    const processedUpdates = await this.applyUpdateBusinessRules(currentTask, updates, options);

    try {
      const task = await this.tasksApi.updateTask(taskId, processedUpdates);
      
      logger.logTaskOperation('updated with validation', task.id, task.name);
      return task;
    } catch (error) {
      const clickUpError = ErrorHandler.classifyError(error);
      ErrorHandler.logError(clickUpError, { taskId });
      throw clickUpError;
    }
  }

  /**
   * Bulk creates tasks with error handling and reporting
   */
  async bulkCreateTasks(
    listId: string,
    tasks: CreateTaskData[],
    options?: { 
      continueOnError?: boolean; 
      batchSize?: number;
      skipValidation?: boolean;
    }
  ): Promise<BulkTaskResult> {
    logger.info(`Bulk creating ${tasks.length} tasks`, { listId, options });

    const batchSize = options?.batchSize || 10;
    const continueOnError = options?.continueOnError ?? true;
    const successful: ClickUpTask[] = [];
    const failed: Array<{ taskData: CreateTaskData; error: Error }> = [];

    // Process in batches
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      
      logger.debug(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tasks.length / batchSize)}`, {
        batchSize: batch.length,
      });

      for (const taskData of batch) {
        try {
          const task = await this.createTaskWithValidation(listId, taskData, {
            skipValidation: options?.skipValidation,
          });
          successful.push(task);
        } catch (error) {
          const clickUpError = ErrorHandler.classifyError(error);
          failed.push({ taskData, error: clickUpError });
          
          logger.error(`Failed to create task in bulk: ${taskData.name}`, clickUpError);
          
          if (!continueOnError) {
            throw clickUpError;
          }
        }
      }
    }

    const summary = {
      total: tasks.length,
      successful: successful.length,
      failed: failed.length,
      successRate: tasks.length > 0 ? (successful.length / tasks.length) * 100 : 0,
    };

    logger.logBulkOperation('task creation', tasks.length, successful.length, failed.length);

    return { successful, failed, summary };
  }

  /**
   * Gets tasks with filtering and business logic
   */
  async getTasksWithBusinessLogic(
    listId: string,
    options?: GetTasksOptions & { 
      includeMetrics?: boolean;
      groupBy?: 'status' | 'priority' | 'assignee';
    }
  ): Promise<{ tasks: ClickUpTask[]; metrics?: TaskMetrics; groups?: Record<string, ClickUpTask[]> }> {
    logger.debug(`Getting tasks with business logic for list: ${listId}`, { options });

    const tasks = await this.tasksApi.getTasks(listId, options);
    let metrics: TaskMetrics | undefined;
    let groups: Record<string, ClickUpTask[]> | undefined;

    if (options?.includeMetrics) {
      metrics = this.calculateTaskMetrics(tasks.tasks);
    }

    if (options?.groupBy) {
      groups = this.groupTasks(tasks.tasks, options.groupBy);
    }

    logger.debug(`Retrieved ${tasks.tasks.length} tasks with business logic`, {
      includeMetrics: !!options?.includeMetrics,
      groupBy: options?.groupBy,
    });

    return { tasks: tasks.tasks, metrics, groups };
  }

  /**
   * Validates task data
   */
  validateTaskData(taskData: CreateTaskData): TaskValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!taskData.name || taskData.name.trim().length === 0) {
      errors.push('Task name is required');
    }

    if (taskData.name && taskData.name.length > 255) {
      errors.push('Task name must be less than 255 characters');
    }

    // Priority validation
    if (taskData.priority !== undefined && ![1, 2, 3, 4].includes(taskData.priority)) {
      errors.push(`Invalid priority: ${taskData.priority}. Must be one of: 1, 2, 3, 4`);
    }

    // Due date validation
    if (taskData.due_date && taskData.start_date && taskData.due_date < taskData.start_date) {
      errors.push('Due date cannot be before start date');
    }

    // Time estimate validation
    if (taskData.time_estimate !== undefined && taskData.time_estimate < 0) {
      errors.push('Time estimate cannot be negative');
    }

    // Warnings
    if (taskData.name && taskData.name.length < 3) {
      warnings.push('Task name is very short (less than 3 characters)');
    }

    if (taskData.due_date && taskData.due_date < Date.now()) {
      warnings.push('Due date is in the past');
    }

    if (taskData.description && taskData.description.length > 10000) {
      warnings.push('Task description is very long (over 10,000 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates task update
   */
  private validateTaskUpdate(currentTask: ClickUpTask, updates: UpdateTaskData): TaskValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate status changes
    if (updates.status && currentTask.status !== updates.status) {
      // Business rule: Cannot move from completed to todo without reason
      if (currentTask.status === 'done' && updates.status === 'todo') {
        warnings.push('Moving task from completed to todo');
      }
    }

    // Validate priority changes
    if (updates.priority !== undefined && ![1, 2, 3, 4].includes(updates.priority)) {
      errors.push(`Invalid priority: ${updates.priority}`);
    }

    // Validate date changes
    if (updates.due_date && updates.start_date && updates.due_date < updates.start_date) {
      errors.push('Due date cannot be before start date');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Applies business rules to task data
   */
  private async applyBusinessRules(
    taskData: CreateTaskData,
    options?: { autoAssign?: boolean }
  ): Promise<CreateTaskData> {
    const processed = { ...taskData };

    // Auto-assign if enabled and no assignees specified
    if (options?.autoAssign && (!processed.assignees || processed.assignees.length === 0)) {
      // This would integrate with user management to find available assignees
      // For now, we'll leave it as is
      logger.debug('Auto-assign enabled but no assignees available');
    }

    // Set default priority if not specified
    if (processed.priority === undefined) {
      processed.priority = TASK_PRIORITY.NORMAL as any;
    }

    // Set default status if not specified
    if (!processed.status) {
      processed.status = 'todo';
    }

    // Validate and normalize due dates
    if (processed.due_date) {
      const now = Date.now();
      if (processed.due_date < now) {
        logger.warn('Due date is in the past, keeping as is', { dueDate: processed.due_date });
      }
    }

    return processed;
  }

  /**
   * Applies business rules to task updates
   */
  private async applyUpdateBusinessRules(
    currentTask: ClickUpTask,
    updates: UpdateTaskData,
    options?: { forceStatus?: boolean }
  ): Promise<UpdateTaskData> {
    const processed = { ...updates };

    // Business rule: When marking as complete, set completion time
    if (updates.status === 'done' && currentTask.status !== 'done') {
      // This would typically set a completed_at timestamp
      logger.debug('Task marked as complete', { taskId: currentTask.id });
    }

    // Business rule: When changing status, log the change
    if (updates.status && updates.status !== currentTask.status) {
      logger.info('Task status changed', {
        taskId: currentTask.id,
        from: currentTask.status,
        to: updates.status,
      });
    }

    return processed;
  }

  /**
   * Calculates task metrics including emergency dashboard metrics
   */
  private calculateTaskMetrics(tasks: ClickUpTask[]): TaskMetrics {
    const metrics: TaskMetrics = {
      total: tasks.length,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      byPriority: {},
      byStatus: {},
    };

    const now = Date.now();
    let totalStoryPoints = 0;
    let completedStoryPoints = 0;

    // Calculate basic metrics and story points
    for (const task of tasks) {
      // Status metrics
      if (task.status === 'done') {
        metrics.completed++;
      } else if (task.status === 'in progress' || task.status === 'inprogress') {
        metrics.inProgress++;
      }

      // Overdue tasks
      if (task.dueDate && task.dueDate < now && task.status !== 'done') {
        metrics.overdue++;
      }

      // Priority metrics
      const priority = task.priority || TASK_PRIORITY.NORMAL;
      const priorityLabel = TASK_PRIORITY_LABELS[priority as keyof typeof TASK_PRIORITY_LABELS] || 'Unknown';
      metrics.byPriority[priorityLabel] = (metrics.byPriority[priorityLabel] || 0) + 1;

      // Status metrics - ensure status is a string
      const status = String(task.status || 'Unknown');
      metrics.byStatus[status] = (metrics.byStatus[status] || 0) + 1;

      // Story points (if available in custom fields or description)
      const storyPoints = this.extractStoryPoints(task);
      totalStoryPoints += storyPoints;
      if (task.status === 'done') {
        completedStoryPoints += storyPoints;
      }
    }

    // Calculate emergency metrics
    const emergencyMetrics = this.calculateEmergencyMetrics(tasks);
    
    const result = {
      ...metrics,
      ...emergencyMetrics,
      totalStoryPoints,
      completedStoryPoints,
    };
    
    return result;
  }

  /**
   * Calculates emergency dashboard metrics for project recovery
   */
  private calculateEmergencyMetrics(tasks: ClickUpTask[]): Partial<TaskMetrics> {
    const now = new Date();
    const projectStartDate = PROJECT_TIMELINE.START_DATE;
    const criticalMilestoneDate = PROJECT_TIMELINE.CRITICAL_MILESTONE_DATE;
    
    const daysSinceStart = getDaysSinceStart(now);
    const daysToMilestone = getDaysToMilestone(criticalMilestoneDate, now);
    
    // Calculate expected progress based on 30-day natural delivery cycles
    const totalProjectDays = PROJECT_DURATION.TOTAL_DAYS;
    const expectedProgress = daysSinceStart / totalProjectDays;
    const actualProgress = tasks.length > 0 ? tasks.filter(t => t.status === 'done').length / tasks.length : 0;
    const daysBehind = Math.max(0, Math.floor((expectedProgress - actualProgress) * totalProjectDays));
    
    // Calculate velocities using natural days (as per client requirement)
    const currentVelocity = daysSinceStart > 0 ? tasks.filter(t => t.status === 'done').length / daysSinceStart : 0;
    
    const remainingTasks = tasks.filter(t => t.status !== 'done').length;
    const currentMilestone = getCurrentMilestone(now);
    const expectedCompletionByMilestone = getExpectedCompletionByMilestone(now);
    
    const expectedTasksForMilestone = Math.ceil(tasks.length * expectedCompletionByMilestone);
    const tasksNeededForMilestone = Math.max(0, expectedTasksForMilestone - tasks.filter(t => t.status === 'done').length);
    const requiredVelocity = currentMilestone.daysRemaining > 0 ? tasksNeededForMilestone / currentMilestone.daysRemaining : 0;
    
    // Calculate phases and tags
    const phases = this.calculatePhases(tasks);
    const tags = this.calculateTags(tasks);

    const result = {
      daysBehind,
      daysToCriticalMilestone: Math.max(0, daysToMilestone),
      requiredVelocity: Math.round(requiredVelocity * 100) / 100,
      currentVelocity: Math.round(currentVelocity * 100) / 100,
      projectStartDate: projectStartDate.toISOString(),
      criticalMilestoneDate: criticalMilestoneDate.toISOString(),
      // Partial delivery milestones
      nextMilestone: currentMilestone.name,
      milestoneProgress: ((daysSinceStart / PROJECT_DURATION.MILESTONE_CYCLE) * 100) % 100,
      daysToNextMilestone: currentMilestone.daysRemaining,
      milestoneTargetDate: currentMilestone.date.toISOString(),
      expectedCompletionByMilestone,
      expectedTasksForMilestone,
      tasksNeededForMilestone,
      phases,
      tags,
    };
    
    return result;
  }

  /**
   * Extracts story points from task (custom fields or description)
   */
  private extractStoryPoints(task: ClickUpTask): number {
    // Try to extract from custom fields first
    if (task.customFields) {
      for (const [fieldName, fieldValue] of Object.entries(task.customFields)) {
        if (fieldName.toLowerCase().includes('story points') || fieldName.toLowerCase().includes('sp')) {
          return Number(fieldValue) || 0;
        }
      }
    }
    
    // Try to extract from description using regex
    if (task.description) {
      // Look for "Estimación: X SP" pattern (from the task example)
      const spMatch = task.description.match(/Estimación[:\s]*(\d+(?:\.\d+)?)\s*SP/i);
      if (spMatch) {
        return Number(spMatch[1]) || 0;
      }
      
      // Look for other common patterns
      const otherPatterns = [
        /(?:story points?|sp)[:\s]*(\d+(?:\.\d+)?)/i,
        /(?:points?|pts)[:\s]*(\d+(?:\.\d+)?)/i,
        /(\d+(?:\.\d+)?)\s*(?:story points?|sp|points?|pts)/i
      ];
      
      for (const pattern of otherPatterns) {
        const match = task.description.match(pattern);
        if (match) {
          return Number(match[1]) || 0;
        }
      }
    }
    
    // Try to extract from task name
    const nameMatch = task.name.match(/(\d+(?:\.\d+)?)\s*SP/i);
    if (nameMatch) {
      return Number(nameMatch[1]) || 0;
    }
    
    // Default estimation based on priority or complexity
    if (task.priority === 1) return 5; // Urgent
    if (task.priority === 2) return 3; // High
    if (task.priority === 3) return 2; // Normal
    return 1; // Low
  }

  /**
   * Calculates working days between two dates (excluding weekends)
   */
  private getWorkingDays(startDate: Date, endDate: Date): number {
    let workingDays = 0;
    const current = new Date(startDate);
    
    while (current < endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Saturday or Sunday
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return workingDays;
  }

  /**
   * Calculates phases based on task tags or names
   */
  private calculatePhases(tasks: ClickUpTask[]): Array<{
    name: string;
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    estimatedSP: number;
    color: string;
  }> {
    const phaseConfig = [
      { name: 'Foundation', keywords: ['foundation', 'base', 'setup'], color: '#10b981' },
      { name: 'Catalog', keywords: ['catalog', 'catalogue', 'products'], color: '#3b82f6' },
      { name: 'Purchases', keywords: ['purchase', 'buy', 'procurement'], color: '#f59e0b' },
      { name: 'Sales', keywords: ['sale', 'sell', 'revenue'], color: '#ec4899' },
      { name: 'Extras', keywords: ['extra', 'bonus', 'additional'], color: '#06b6d4' },
    ];

    const phases = phaseConfig.map(config => {
      const phaseTasks = tasks.filter(task => {
        const searchText = (task.name + ' ' + (task.description || '')).toLowerCase();
        return config.keywords.some(keyword => searchText.includes(keyword));
      });

      const completed = phaseTasks.filter(t => t.status === 'done').length;
      const inProgress = phaseTasks.filter(t => t.status === 'in progress' || t.status === 'inprogress').length;
      const todo = phaseTasks.filter(t => t.status === 'todo').length;
      const estimatedSP = phaseTasks.reduce((sum, t) => sum + this.extractStoryPoints(t), 0);

      return {
        name: config.name,
        total: phaseTasks.length,
        completed,
        inProgress,
        todo,
        estimatedSP,
        color: config.color,
      };
    });

    return phases.filter(phase => phase.total > 0);
  }

  /**
   * Calculates tag distribution
   */
  private calculateTags(tasks: ClickUpTask[]): Record<string, number> {
    const tags: Record<string, number> = {};

    for (const task of tasks) {
      // Extract tags from task name and description
      const text = (task.name + ' ' + (task.description || '')).toLowerCase();
      
      // Common technical tags
      const tagPatterns = [
        'molecula', 'routing', 'settings', 'organismo', 'ui', 'atomo', 
        'domain', 'backend', 'graphql', 'users', 'forms', 'auth', 
        'profile', 'layout', 'tcg', 'store', 'catalog', 'purchases', 
        'sales', 'most-wanted'
      ];

      for (const tag of tagPatterns) {
        if (text.includes(tag)) {
          tags[tag] = (tags[tag] || 0) + 1;
        }
      }

      // Extract tags from ClickUp tags if available
      if (task.tags) {
        for (const tag of task.tags) {
          tags[tag] = (tags[tag] || 0) + 1;
        }
      }
    }

    return tags;
  }

  /**
   * Groups tasks by specified criteria
   */
  private groupTasks(tasks: ClickUpTask[], groupBy: 'status' | 'priority' | 'assignee'): Record<string, ClickUpTask[]> {
    const groups: Record<string, ClickUpTask[]> = {};

    for (const task of tasks) {
      let key: string;

      switch (groupBy) {
        case 'status':
          key = task.status || 'No Status';
          break;
        case 'priority':
          const priority = task.priority || TASK_PRIORITY.NORMAL;
          key = (TASK_PRIORITY_LABELS as any)[priority] || 'Unknown';
          break;
        case 'assignee':
          if (task.assignees && task.assignees.length > 0) {
            key = task.assignees.join(', ');
          } else {
            key = 'Unassigned';
          }
          break;
        default:
          key = 'Unknown';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
    }

    return groups;
  }

  /**
   * Finds tasks by name pattern
   */
  async findTasksByName(listId: string, pattern: string, options?: { caseSensitive?: boolean }): Promise<ClickUpTask[]> {
    logger.debug(`Finding tasks by pattern: ${pattern}`, { listId });

    const { tasks } = await this.getTasksWithBusinessLogic(listId);
    const regex = new RegExp(pattern, options?.caseSensitive ? 'g' : 'gi');
    
    const matchingTasks = tasks.filter(task => 
      regex.test(task.name) || (task.description && regex.test(task.description))
    );

    logger.debug(`Found ${matchingTasks.length} tasks matching pattern: ${pattern}`);
    return matchingTasks;
  }

  /**
   * Gets overdue tasks
   */
  async getOverdueTasks(listId: string): Promise<ClickUpTask[]> {
    logger.debug(`Getting overdue tasks for list: ${listId}`);

    const { tasks } = await this.getTasksWithBusinessLogic(listId);
    const now = Date.now();
    
    const overdueTasks = tasks.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      task.status !== 'done'
    );

    logger.debug(`Found ${overdueTasks.length} overdue tasks`);
    return overdueTasks;
  }

  /**
   * Updates task status with validation
   */
  async updateTaskStatus(taskId: string, status: string, options?: { notifyAll?: boolean }): Promise<ClickUpTask> {
    logger.debug(`Updating task status: ${taskId} -> ${status}`);

    try {
      const task = await this.tasksApi.updateTaskStatus(taskId, status, options?.notifyAll);
      
      logger.logTaskOperation('status updated', task.id, task.name);
      return task;
    } catch (error) {
      const clickUpError = ErrorHandler.classifyError(error);
      ErrorHandler.logError(clickUpError, { taskId });
      throw clickUpError;
    }
  }
}
