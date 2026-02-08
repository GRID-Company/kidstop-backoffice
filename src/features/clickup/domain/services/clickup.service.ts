/**
 * ClickUp Service
 * Main service that orchestrates all ClickUp operations
 */

import { ClickUpClient } from '@/features/clickup/adapters/api/clickup-client';
import { TasksApi } from '@/features/clickup/adapters/api/endpoints/tasks.api';
import { ListsApi } from '@/features/clickup/adapters/api/endpoints/lists.api';
import { WorkspacesApi } from '@/features/clickup/adapters/api/endpoints/workspaces.api';
import { DashboardsApi } from '@/features/clickup/adapters/api/endpoints/dashboards.api';
import { TaskManager } from '@/features/clickup/domain/managers/task.manager';
import { ClickUpConfig } from '@/features/clickup/adapters/config/clickup.config';
import { logger } from '@/lib/clickup/logger';

export interface ClickUpServiceOptions {
  config?: ClickUpConfig;
  enableMetrics?: boolean;
  enableCaching?: boolean;
}

export class ClickUpService {
  private static instance: ClickUpService | undefined;
  
  private client: ClickUpClient;
  private config: ClickUpConfig;
  
  // API instances
  public tasks: TaskManager;
  public tasksApi: TasksApi;
  public listsApi: ListsApi;
  public workspacesApi: WorkspacesApi;
  public dashboardsApi: DashboardsApi;
  
  // Service options
  private options: ClickUpServiceOptions;

  private constructor(options: ClickUpServiceOptions = {}) {
    this.options = options;
    this.config = options.config || ClickUpConfig.getInstance();
    this.client = new ClickUpClient(this.config);
    
    // Initialize API instances
    this.tasksApi = new TasksApi(this.client);
    this.listsApi = new ListsApi(this.client);
    this.workspacesApi = new WorkspacesApi(this.client);
    this.dashboardsApi = new DashboardsApi(this.client);
    
    // Initialize managers
    this.tasks = new TaskManager(this.tasksApi);
    
    logger.info('ClickUp service initialized', {
      workspaceId: this.config.workspaceId,
      folderId: this.config.folderId,
      enableMetrics: options.enableMetrics,
      enableCaching: options.enableCaching,
    });
  }

  /**
   * Gets the singleton instance of ClickUpService
   */
  static getInstance(options?: ClickUpServiceOptions): ClickUpService {
    if (!ClickUpService.instance) {
      ClickUpService.instance = new ClickUpService(options);
    }
    return ClickUpService.instance;
  }

  /**
   * Creates a new instance with custom configuration (useful for testing)
   */
  static createInstance(options: ClickUpServiceOptions): ClickUpService {
    return new ClickUpService(options);
  }

  /**
   * Resets the singleton instance (useful for testing)
   */
  static resetInstance(): void {
    ClickUpService.instance = undefined;
  }

  /**
   * Gets the service configuration
   */
  getConfig(): ClickUpConfig {
    return this.config;
  }

  /**
   * Gets the HTTP client
   */
  getClient(): ClickUpClient {
    return this.client;
  }

  /**
   * Tests connection to ClickUp API
   */
  async testConnection(): Promise<boolean> {
    try {
      logger.info('Testing ClickUp connection...');
      
      const workspace = await this.workspacesApi.getWorkspace(this.config.workspaceId);
      
      logger.info('ClickUp connection successful', {
        workspaceName: workspace.name,
        workspaceId: workspace.id,
      });
      
      return true;
    } catch (error) {
      logger.error('ClickUp connection failed', error);
      return false;
    }
  }

  /**
   * Gets workspace information with caching
   */
  async getWorkspaceInfo(): Promise<any> {
    logger.debug('Getting workspace information');
    
    try {
      const workspace = await this.workspacesApi.getWorkspace(this.config.workspaceId);
      const spaces = await this.workspacesApi.getSpaces(this.config.workspaceId);
      
      return {
        workspace,
        spaces,
        folderId: this.config.folderId,
      };
    } catch (error) {
      logger.error('Failed to get workspace information', error);
      throw error;
    }
  }

  /**
   * Sets up the workspace structure (creates folder/list if needed)
   */
  async setupWorkspaceStructure(options: {
    folderName?: string;
    listName?: string;
    createIfMissing?: boolean;
  } = {}): Promise<{
    folderId: string;
    listId: string;
    created: { folder?: boolean; list?: boolean };
  }> {
    logger.info('Setting up workspace structure', { options });
    
    const folderName = options.folderName || 'Kidstop Project';
    const listName = options.listName || 'Main Tasks';
    const createIfMissing = options.createIfMissing ?? true;
    
    const result = {
      folderId: this.config.folderId || '',
      listId: '',
      created: {} as { folder?: boolean; list?: boolean },
    };

    try {
      // Get workspace and spaces
      const workspace = await this.workspacesApi.getWorkspace(this.config.workspaceId);
      const spaces = await this.workspacesApi.getSpaces(this.config.workspaceId);
      
      if (spaces.length === 0) {
        throw new Error('No spaces found in workspace');
      }

      const firstSpace = spaces[0];
      
      // Find or create folder
      if (this.config.folderId) {
        // Try to find existing folder
        try {
          const folder = await this.workspacesApi.getFolder(this.config.folderId);
          result.folderId = folder.id;
        } catch {
          logger.warn('Configured folder not found, will create new one');
        }
      }

      if (!result.folderId && createIfMissing) {
        const folder = await this.workspacesApi.createFolder(firstSpace.id, folderName);
        result.folderId = folder.id;
        result.created.folder = true;
        logger.info(`Created folder: ${folderName} (${folder.id})`);
      }

      if (!result.folderId) {
        throw new Error('Folder ID not available and createIfMissing is false');
      }

      // Find or create list
      const lists = await this.listsApi.getLists(result.folderId);
      let existingList = lists.find(list => list.name === listName);

      if (!existingList && createIfMissing) {
        existingList = await this.listsApi.createList(result.folderId, {
          name: listName,
          content: `Main task list for ${folderName}`,
        });
        result.created.list = true;
        logger.info(`Created list: ${listName} (${existingList.id})`);
      }

      if (!existingList) {
        throw new Error(`List "${listName}" not found and createIfMissing is false`);
      }

      result.listId = existingList.id;
      
      logger.info('Workspace structure setup completed', result);
      return result;
    } catch (error) {
      logger.error('Failed to setup workspace structure', error);
      throw error;
    }
  }

  /**
   * Gets service health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: {
      connection: boolean;
      configuration: boolean;
      workspace: boolean;
      folder?: boolean;
      list?: boolean;
    };
    timestamp: string;
  }> {
    const checks = {
      connection: false,
      configuration: false,
      workspace: false,
      folder: false,
      list: false,
    };

    try {
      // Configuration check
      checks.configuration = this.config.validate();
      
      // Connection check
      checks.connection = await this.testConnection();
      
      if (checks.connection) {
        // Workspace check
        try {
          await this.workspacesApi.getWorkspace(this.config.workspaceId);
          checks.workspace = true;
        } catch {
          checks.workspace = false;
        }

        // Folder check (if configured)
        if (this.config.folderId) {
          try {
            await this.workspacesApi.getFolder(this.config.folderId);
            checks.folder = true;
          } catch {
            checks.folder = false;
          }
        }

        // List check (if folder exists)
        if (checks.folder && this.config.folderId) {
          try {
            const lists = await this.listsApi.getLists(this.config.folderId);
            checks.list = lists.length > 0;
          } catch {
            checks.list = false;
          }
        }
      }
    } catch (error) {
      logger.error('Health check failed', error);
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy';
    const allChecks = Object.values(checks);
    const passedChecks = allChecks.filter(Boolean).length;
    
    if (passedChecks === allChecks.length) {
      status = 'healthy';
    } else if (passedChecks >= 3) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      checks,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Gets service metrics
   */
  async getMetrics(): Promise<{
    uptime: number;
    requests: number;
    errors: number;
    cacheHits: number;
    cacheMisses: number;
    avgResponseTime: number;
  }> {
    // This would integrate with a metrics collection system
    // For now, return basic metrics
    return {
      uptime: process.uptime(),
      requests: 0,
      errors: 0,
      cacheHits: 0,
      cacheMisses: 0,
      avgResponseTime: 0,
    };
  }

  /**
   * Performs a comprehensive health check with recovery suggestions
   */
  async performHealthCheck(): Promise<{
    isHealthy: boolean;
    issues: string[];
    suggestions: string[];
    actions: Array<{ action: string; description: string; autoFix?: boolean }>;
  }> {
    const health = await this.getHealthStatus();
    const issues: string[] = [];
    const suggestions: string[] = [];
    const actions: Array<{ action: string; description: string; autoFix?: boolean }> = [];

    if (!health.checks.configuration) {
      issues.push('Configuration validation failed');
      suggestions.push('Check environment variables and configuration');
      actions.push({
        action: 'validate-config',
        description: 'Run configuration validation',
        autoFix: false,
      });
    }

    if (!health.checks.connection) {
      issues.push('API connection failed');
      suggestions.push('Check API key and network connectivity');
      actions.push({
        action: 'test-connection',
        description: 'Test API connection',
        autoFix: false,
      });
    }

    if (!health.checks.workspace) {
      issues.push('Workspace access failed');
      suggestions.push('Verify workspace ID and permissions');
      actions.push({
        action: 'verify-workspace',
        description: 'Check workspace access',
        autoFix: false,
      });
    }

    if (!health.checks.folder && this.config.folderId) {
      issues.push('Folder access failed');
      suggestions.push('Check folder ID or create new folder');
      actions.push({
        action: 'setup-structure',
        description: 'Setup workspace structure',
        autoFix: true,
      });
    }

    if (!health.checks.list && health.checks.folder) {
      issues.push('List access failed');
      suggestions.push('Create new list in folder');
      actions.push({
        action: 'create-list',
        description: 'Create default list',
        autoFix: true,
      });
    }

    return {
      isHealthy: health.status === 'healthy',
      issues,
      suggestions,
      actions,
    };
  }

  /**
   * Executes auto-fix actions
   */
  async executeAutoFix(action: string): Promise<boolean> {
    logger.info(`Executing auto-fix action: ${action}`);

    try {
      switch (action) {
        case 'setup-structure':
          await this.setupWorkspaceStructure();
          return true;
        
        case 'create-list':
          if (this.config.folderId) {
            await this.listsApi.createList(this.config.folderId, {
              name: 'Default Tasks',
              content: 'Default task list created by auto-fix',
            });
            return true;
          }
          return false;
        
        default:
          logger.warn(`Unknown auto-fix action: ${action}`);
          return false;
      }
    } catch (error) {
      logger.error(`Auto-fix action failed: ${action}`, error);
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    logger.info('Cleaning up ClickUp service resources');
    
    // Close any open connections, clear caches, etc.
    // For now, just log the cleanup
    logger.info('ClickUp service cleanup completed');
  }
}

// Export singleton getter
export const getClickUpService = (options?: ClickUpServiceOptions): ClickUpService => {
  return ClickUpService.getInstance(options);
};

// Export convenience function for creating service instances
export const createClickUpService = (options: ClickUpServiceOptions): ClickUpService => {
  return ClickUpService.createInstance(options);
};
