/**
 * ClickUp Dashboard Service
 * Business logic for dashboard aggregation and metrics
 */

import { ClickUpService } from './clickup.service';
import { TaskManager, TaskMetrics } from '../managers/task.manager';
import { ClickUpTask } from '../types';
import { DEFAULT_METRICS, PROJECT_TIMELINE, getExpectedCompletionByMilestone } from '../constants/project-timeline.constants';
import { logger } from '@/lib/clickup/logger';

export interface DashboardOptions {
  listId?: string;
  includeMetrics?: boolean;
  aggregateAll?: boolean;
}

export interface DashboardResult {
  tasks: ClickUpTask[];
  metrics: TaskMetrics;
  lastUpdated: string;
}

export class DashboardService {
  constructor(private clickUpService: ClickUpService) {}

  /**
   * Gets dashboard data for a specific list or aggregated across all lists
   */
  async getDashboardData(options: DashboardOptions = {}): Promise<DashboardResult> {
    logger.debug('Getting dashboard data', { options });

    try {
      // Handle "overall" aggregation
      if (options.aggregateAll) {
        return await this.getAggregatedDashboardData();
      }

      // Get specific list data OR aggregate all lists from configured folder
      if (options.listId) {
        // Use specific list
        const result = await this.clickUpService.tasks.getTasksWithBusinessLogic(options.listId, {
          include_closed: true,
          subtasks: false,
          includeMetrics: true,
        });

        return {
          tasks: result.tasks,
          metrics: result.metrics || DEFAULT_METRICS,
          lastUpdated: new Date().toISOString(),
        };
      } else {
        // Aggregate all lists from configured folder
        return await this.getFolderDashboardData();
      }
    } catch (error) {
      logger.error('Failed to get dashboard data', error as any);
      throw error;
    }
  }

  /**
   * Gets aggregated dashboard data from all lists in the configured folder
   */
  private async getFolderDashboardData(): Promise<DashboardResult> {
    const config = this.clickUpService.getConfig();
    
    if (!config.folderId) {
      throw new Error('No folder configured for folder dashboard');
    }

    logger.info(`Getting folder dashboard data from folder ${config.folderId}`);
    
    const lists = await this.clickUpService.listsApi.getLists(config.folderId);
    logger.info(`Found ${lists.length} lists in folder ${config.folderId}`, {
      listIds: lists.map(l => l.id),
      listNames: lists.map(l => l.name),
    });

    if (lists.length === 0) {
      throw new Error(`No lists found in configured folder ${config.folderId}`);
    }

    const allTasks: ClickUpTask[] = [];
    const allMetrics: TaskMetrics = {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      byPriority: {},
      byStatus: {},
    };

    // Process each list in the folder
    for (const list of lists) {
      await this.processListForAggregation(list.id, allTasks, allMetrics);
    }


    logger.info(`Folder dashboard aggregated ${allTasks.length} tasks from ${lists.length} lists`);

    return {
      tasks: allTasks,
      metrics: allMetrics,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Gets aggregated dashboard data across all lists
   */
  private async getAggregatedDashboardData(): Promise<DashboardResult> {
    logger.debug('Getting aggregated dashboard data across all lists');

    const workspaceInfo = await this.clickUpService.getWorkspaceInfo();
    const allTasks: ClickUpTask[] = [];
    const allMetrics: TaskMetrics = {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      byPriority: {},
      byStatus: {},
    };

    // Get all lists from all spaces
    for (const space of workspaceInfo.spaces) {
      try {
        // Get folderless lists
        const folderlessLists = await this.clickUpService.listsApi.getFolderlessLists(space.id);
        
        // Process each folderless list
        for (const list of folderlessLists) {
          await this.processListForAggregation(list.id, allTasks, allMetrics);
        }

        // Get folders and their lists
        try {
          const folders = await this.clickUpService.workspacesApi.getFolders(space.id);
          
          for (const folder of folders) {
            const folderLists = await this.clickUpService.listsApi.getLists(folder.id);
            
            for (const list of folderLists) {
              await this.processListForAggregation(list.id, allTasks, allMetrics);
            }
          }
        } catch (folderError) {
          logger.warn(`Failed to get folders for space ${space.id}`, folderError as any);
        }
      } catch (spaceError) {
        logger.warn(`Failed to process space ${space.id}`, spaceError as any);
      }
    }


    return {
      tasks: allTasks,
      metrics: allMetrics,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Processes a single list for aggregation
   */
  private async processListForAggregation(
    listId: string, 
    allTasks: ClickUpTask[], 
    allMetrics: TaskMetrics
  ): Promise<void> {
    try {
      const result = await this.clickUpService.tasks.getTasksWithBusinessLogic(listId, {
        include_closed: true,
        subtasks: false,
        includeMetrics: true,
      });

      // Add tasks
      allTasks.push(...result.tasks);

      // Aggregate metrics if available
      if (result.metrics) {
        const metrics = result.metrics;
        
        allMetrics.total += metrics.total || 0;
        allMetrics.completed += metrics.completed || 0;
        allMetrics.inProgress += metrics.inProgress || 0;
        allMetrics.overdue += metrics.overdue || 0;
        
        // Aggregate emergency metrics (use the first list's emergency metrics as reference)
        if (!allMetrics.daysBehind && metrics.daysBehind !== undefined) {
          allMetrics.daysBehind = metrics.daysBehind;
          allMetrics.daysToCriticalMilestone = metrics.daysToCriticalMilestone;
          allMetrics.requiredVelocity = metrics.requiredVelocity;
          allMetrics.currentVelocity = metrics.currentVelocity;
          allMetrics.totalStoryPoints = metrics.totalStoryPoints;
          allMetrics.completedStoryPoints = metrics.completedStoryPoints;
          allMetrics.projectStartDate = metrics.projectStartDate;
          allMetrics.criticalMilestoneDate = metrics.criticalMilestoneDate;
          allMetrics.nextMilestone = metrics.nextMilestone;
          allMetrics.milestoneProgress = metrics.milestoneProgress;
          allMetrics.daysToNextMilestone = metrics.daysToNextMilestone;
          allMetrics.milestoneTargetDate = metrics.milestoneTargetDate;
          allMetrics.expectedCompletionByMilestone = metrics.expectedCompletionByMilestone;
          allMetrics.expectedTasksForMilestone = metrics.expectedTasksForMilestone;
          allMetrics.tasksNeededForMilestone = metrics.tasksNeededForMilestone;
        } else if (metrics.daysBehind !== undefined) {
          // If we already have emergency metrics, take the worst case
          allMetrics.daysBehind = Math.max(allMetrics.daysBehind || 0, metrics.daysBehind);
          allMetrics.requiredVelocity = Math.max(allMetrics.requiredVelocity || 0, metrics.requiredVelocity || 0);
        }
        
        // Merge byPriority and byStatus
        Object.keys(metrics.byPriority || {}).forEach(priority => {
          allMetrics.byPriority[priority] = (allMetrics.byPriority[priority] || 0) + metrics.byPriority[priority];
        });
        
        Object.entries(metrics.byStatus || {}).forEach(([statusKey, statusCount]) => {
          const statusName = String(statusKey);
          const count = Number(statusCount) || 0;
          allMetrics.byStatus[statusName] = (allMetrics.byStatus[statusName] || 0) + count;
        });
      }
    } catch (error) {
      logger.warn(`Failed to process list ${listId} for aggregation`, error as any);
    }
  }

  /**
   * Gets the default list ID from configuration
   * STRICT: Only returns lists from the configured folder
   */
  private async getDefaultListId(): Promise<string | null> {
    const config = this.clickUpService.getConfig();
    
    logger.info('getDefaultListId called', {
      hasFolderId: !!config.folderId,
      folderId: config.folderId,
    });
    
    // Only use configured folder - no fallback to other spaces
    if (config.folderId) {
      try {
        logger.info(`Getting lists from folder ${config.folderId}`);
        const lists = await this.clickUpService.listsApi.getLists(config.folderId);
        logger.info(`Found ${lists.length} lists in folder ${config.folderId}`, {
          listIds: lists.map(l => l.id),
          listNames: lists.map(l => l.name),
        });
        
        if (lists.length > 0) {
          logger.debug(`Using list ${lists[0].id} from configured folder ${config.folderId}`);
          return lists[0].id;
        } else {
          logger.warn(`No lists found in configured folder ${config.folderId}`);
        }
      } catch (error) {
        logger.error(`Failed to get lists from configured folder ${config.folderId}`, error as any);
      }
    } else {
      logger.error('No folder configured - cannot determine default list');
    }
    
    return null;
  }

  }

// Export factory function
export const createDashboardService = (clickUpService: ClickUpService): DashboardService => {
  return new DashboardService(clickUpService);
};
