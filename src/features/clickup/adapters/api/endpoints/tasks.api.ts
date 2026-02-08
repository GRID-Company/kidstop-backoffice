import { ClickUpClient } from '../clickup-client';
import { 
  ClickUpTask, 
  GetTasksOptions, 
  CreateTaskData, 
  UpdateTaskData,
  ClickUpPaginatedResponse 
} from '@/features/clickup/domain/types';
import { logger } from '@/lib/clickup/logger';

export class TasksApi {
  constructor(private client: ClickUpClient) {}

  private transformTaskData(rawTask: any): ClickUpTask {
    // Handle status field - it might be an object with status property
    let status: string;
    if (typeof rawTask.status === 'object' && rawTask.status !== null) {
      status = rawTask.status.status || rawTask.status.name || String(rawTask.status);
    } else {
      status = String(rawTask.status || 'Unknown');
    }

    return {
      id: rawTask.id,
      name: rawTask.name,
      description: rawTask.description,
      status: status,
      assignees: rawTask.assignees?.map((a: any) => a.id || a) || [],
      dueDate: rawTask.due_date,
      timeEstimate: rawTask.time_estimate,
      startDate: rawTask.start_date,
      parent: rawTask.parent,
      customFields: rawTask.custom_fields,
      tags: rawTask.tags?.map((t: any) => t.name || t) || [],
      priority: rawTask.priority,
      orderindex: rawTask.orderindex,
      dateCreated: rawTask.date_created,
      dateUpdated: rawTask.date_updated,
    };
  }

  async getTask(taskId: string, options?: { includeSubtasks?: boolean }): Promise<ClickUpTask> {
    logger.debug(`Fetching task: ${taskId}`);
    
    const params = options?.includeSubtasks ? { subtasks: true } : undefined;
    const response = await this.client.get<ClickUpTask>(`/task/${taskId}`, { params });
    
    logger.logTaskOperation('retrieved', taskId, response.name);
    return response;
  }

  async getTasks(listId: string, options?: GetTasksOptions): Promise<ClickUpPaginatedResponse<ClickUpTask>> {
    logger.debug(`Fetching tasks for list: ${listId}`, { options });
    
    const params: Record<string, unknown> = {};
    
    if (options?.archived !== undefined) params.archived = options.archived;
    if (options?.page !== undefined) params.page = options.page;
    if (options?.order_by) params.order_by = options.order_by;
    if (options?.reverse !== undefined) params.reverse = options.reverse;
    if (options?.subtasks !== undefined) params.subtasks = options.subtasks;
    if (options?.statuses) params.statuses = JSON.stringify(options.statuses);
    if (options?.include_closed !== undefined) params.include_closed = options.include_closed;
    if (options?.assignees) params.assignees = JSON.stringify(options.assignees);
    if (options?.tags) params.tags = JSON.stringify(options.tags);
    if (options?.due_date_gt) params.due_date_gt = options.due_date_gt;
    if (options?.due_date_lt) params.due_date_lt = options.due_date_lt;
    if (options?.date_created_gt) params.date_created_gt = options.date_created_gt;
    if (options?.date_created_lt) params.date_created_lt = options.date_created_lt;
    if (options?.date_updated_gt) params.date_updated_gt = options.date_updated_gt;
    if (options?.date_updated_lt) params.date_updated_lt = options.date_updated_lt;
    if (options?.date_done_gt) params.date_done_gt = options.date_done_gt;
    if (options?.date_done_lt) params.date_done_lt = options.date_done_lt;

    const response = await this.client.get<{ tasks: any[] }>(`/list/${listId}/task`, { params });
    
    // Transform raw task data to ClickUpTask format
    const transformedTasks = response.tasks.map(task => this.transformTaskData(task));
    
    logger.debug(`Retrieved and transformed ${transformedTasks.length} tasks from list: ${listId}`);
    
    return {
      tasks: transformedTasks,
      last_task_id: transformedTasks[transformedTasks.length - 1]?.id,
      next_page: transformedTasks.length > 0,
      total: transformedTasks.length,
    };
  }

  async createTask(listId: string, taskData: CreateTaskData): Promise<ClickUpTask> {
    logger.info(`Creating task: ${taskData.name}`, { listId });
    
    const payload = this.buildTaskPayload(taskData);
    const response = await this.client.post<ClickUpTask>(`/list/${listId}/task`, payload);
    
    logger.logTaskOperation('created', response.id, response.name);
    return response;
  }

  async updateTask(taskId: string, updates: UpdateTaskData): Promise<ClickUpTask> {
    logger.debug(`Updating task: ${taskId}`, { updates });
    
    const payload = this.buildTaskPayload(updates);
    const response = await this.client.put<ClickUpTask>(`/task/${taskId}`, payload);
    
    logger.logTaskOperation('updated', taskId, response.name);
    return response;
  }

  async deleteTask(taskId: string): Promise<void> {
    logger.info(`Deleting task: ${taskId}`);
    
    await this.client.delete(`/task/${taskId}`);
    
    logger.logTaskOperation('deleted', taskId);
  }

  async updateTaskStatus(taskId: string, status: string, notifyAll?: boolean): Promise<ClickUpTask> {
    logger.debug(`Updating task status: ${taskId} -> ${status}`);
    
    const payload = {
      status,
      notify_all: notifyAll !== false, // Default to true
    };
    
    const response = await this.client.put<ClickUpTask>(`/task/${taskId}`, payload);
    
    logger.logTaskOperation('status updated', taskId, response.name);
    return response;
  }

  /**
   * Adds a comment to a task
   */
  async addComment(taskId: string, commentText: string, assignee?: string, notifyAll?: boolean): Promise<any> {
    logger.debug(`Adding comment to task: ${taskId}`);
    
    const payload: any = {
      comment_text: commentText,
      notify_all: notifyAll !== false, // Default to true
    };
    
    if (assignee) {
      payload.assignee = assignee;
    }
    
    const response = await this.client.post(`/task/${taskId}/comment`, payload);
    
    logger.logTaskOperation('comment added', taskId);
    return response;
  }

  /**
   * Gets comments for a task
   */
  async getComments(taskId: string, options?: { start?: number; limit?: number }): Promise<any[]> {
    logger.debug(`Fetching comments for task: ${taskId}`);
    
    const params: Record<string, unknown> = {};
    if (options?.start) params.start = options.start;
    if (options?.limit) params.limit = options.limit;
    
    const response = await this.client.get<{ comments: any[] }>(`/task/${taskId}/comment`, { params });
    
    return response.comments || [];
  }

  /**
   * Sets custom field value for a task
   */
  async setCustomFieldValue(taskId: string, fieldId: string, value: unknown): Promise<void> {
    logger.debug(`Setting custom field value: ${taskId} -> ${fieldId}`);
    
    const payload = { value };
    await this.client.post(`/task/${taskId}/field/${fieldId}`, payload);
    
    logger.logTaskOperation('custom field updated', taskId);
  }

  /**
   * Gets time tracking data for a task
   */
  async getTimeTracking(taskId: string): Promise<any> {
    logger.debug(`Fetching time tracking for task: ${taskId}`);
    
    const response = await this.client.get(`/task/${taskId}/time`);
    return response;
  }

  /**
   * Starts time tracking for a task
   */
  async startTimeTracking(taskId: string): Promise<any> {
    logger.debug(`Starting time tracking for task: ${taskId}`);
    
    const response = await this.client.post(`/task/${taskId}/time`, {});
    
    logger.logTaskOperation('time tracking started', taskId);
    return response;
  }

  /**
   * Stops time tracking for a task
   */
  async stopTimeTracking(taskId: string, timeId: string): Promise<any> {
    logger.debug(`Stopping time tracking for task: ${taskId}`);
    
    const response = await this.client.put(`/task/${taskId}/time/${timeId}`, {});
    
    logger.logTaskOperation('time tracking stopped', taskId);
    return response;
  }

  /**
   * Gets attachments for a task
   */
  async getAttachments(taskId: string): Promise<any[]> {
    logger.debug(`Fetching attachments for task: ${taskId}`);
    
    const response = await this.client.get<{ attachments: any[] }>(`/task/${taskId}/attachment`);
    
    return response.attachments || [];
  }

  /**
   * Adds an attachment to a task
   */
  async addAttachment(taskId: string, file: Blob, filename: string): Promise<any> {
    logger.debug(`Adding attachment to task: ${taskId}`, { filename });
    
    // This would require multipart form data handling
    // For now, we'll use the simple approach
    const formData = new FormData();
    formData.append('attachment', file, filename);
    
    // Note: This would need to be implemented with a different approach
    // since our current client only handles JSON
    throw new Error('File upload not implemented in current client');
  }

  /**
   * Bulk creates tasks
   */
  async bulkCreateTasks(listId: string, tasks: CreateTaskData[]): Promise<ClickUpTask[]> {
    logger.info(`Bulk creating ${tasks.length} tasks`, { listId });
    
    const results: ClickUpTask[] = [];
    const errors: Array<{ task: CreateTaskData; error: Error }> = [];
    
    for (const taskData of tasks) {
      try {
        const task = await this.createTask(listId, taskData);
        results.push(task);
      } catch (error) {
        const clickUpError = error instanceof Error ? error : new Error('Unknown error');
        errors.push({ task: taskData, error: clickUpError });
        logger.error(`Failed to create task: ${taskData.name}`, clickUpError);
      }
    }
    
    logger.logBulkOperation('task creation', tasks.length, results.length, errors.length);
    
    if (errors.length > 0) {
      logger.warn(`${errors.length} tasks failed to create`, { errors });
    }
    
    return results;
  }

  /**
   * Searches tasks across lists
   */
  async searchTasks(workspaceId: string, query: string, options?: {
    listIds?: string[];
    assignees?: string[];
    statuses?: string[];
    priorities?: number[];
    dueDate?: string;
    tags?: string[];
    reverse?: boolean;
  }): Promise<ClickUpTask[]> {
    logger.debug(`Searching tasks: ${query}`, { options });
    
    const params: Record<string, unknown> = {
      query,
      ...options,
    };
    
    if (options?.listIds) params.list_ids = JSON.stringify(options.listIds);
    if (options?.assignees) params.assignees = JSON.stringify(options.assignees);
    if (options?.statuses) params.statuses = JSON.stringify(options.statuses);
    if (options?.priorities) params.priorities = JSON.stringify(options.priorities);
    if (options?.tags) params.tags = JSON.stringify(options.tags);
    
    const response = await this.client.get<{ tasks: ClickUpTask[] }>(`/workspace/${workspaceId}/search/task`, { params });
    
    logger.debug(`Found ${response.tasks.length} tasks matching query: ${query}`);
    return response.tasks;
  }

  private buildTaskPayload(taskData: CreateTaskData | UpdateTaskData): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    
    if (taskData.name !== undefined) payload.name = taskData.name;
    if (taskData.description !== undefined) payload.description = taskData.description;
    if (taskData.assignees !== undefined) payload.assignees = taskData.assignees;
    if (taskData.status !== undefined) payload.status = taskData.status;
    if (taskData.due_date !== undefined) payload.due_date = taskData.due_date;
    if (taskData.due_date_time !== undefined) payload.due_date_time = taskData.due_date_time;
    if (taskData.time_estimate !== undefined) payload.time_estimate = taskData.time_estimate;
    if (taskData.start_date !== undefined) payload.start_date = taskData.start_date;
    if (taskData.start_date_time !== undefined) payload.start_date_time = taskData.start_date_time;
    if (taskData.notify_all !== undefined) payload.notify_all = taskData.notify_all;
    if (taskData.parent !== undefined) payload.parent = taskData.parent;
    if (taskData.links_to !== undefined) payload.links_to = taskData.links_to;
    if (taskData.custom_task_id !== undefined) payload.custom_task_id = taskData.custom_task_id;
    if (taskData.custom_fields !== undefined) payload.custom_fields = taskData.custom_fields;
    if (taskData.tags !== undefined) payload.tags = taskData.tags;
    if (taskData.priority !== undefined) payload.priority = taskData.priority;
    if ('archived' in taskData && taskData.archived !== undefined) payload.archived = taskData.archived;
    
    return payload;
  }
}
