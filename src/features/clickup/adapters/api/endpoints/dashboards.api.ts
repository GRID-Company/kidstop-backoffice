/**
 * ClickUp Dashboards API
 * Handles dashboard-related operations
 */

import { ClickUpClient } from '../clickup-client';
import { 
  ClickUpDashboard, 
  ClickUpWidget, 
  CreateDashboardData 
} from '@/features/clickup/domain/types';
import { logger } from '@/lib/clickup/logger';

export class DashboardsApi {
  constructor(private client: ClickUpClient) {}

  /**
   * Gets all dashboards in a workspace
   */
  async getDashboards(workspaceId: string): Promise<ClickUpDashboard[]> {
    logger.debug(`Fetching dashboards for workspace: ${workspaceId}`);
    
    const response = await this.client.get<{ dashboards: ClickUpDashboard[] }>(`/workspace/${workspaceId}/dashboard`);
    
    logger.debug(`Retrieved ${response.dashboards?.length || 0} dashboards from workspace: ${workspaceId}`);
    return response.dashboards || [];
  }

  /**
   * Gets a specific dashboard by ID
   */
  async getDashboard(dashboardId: string): Promise<ClickUpDashboard> {
    logger.debug(`Fetching dashboard: ${dashboardId}`);
    
    const response = await this.client.get<ClickUpDashboard>(`/dashboard/${dashboardId}`);
    
    logger.debug(`Retrieved dashboard: ${response.name}`);
    return response;
  }

  /**
   * Creates a new dashboard
   */
  async createDashboard(workspaceId: string, dashboardData: CreateDashboardData): Promise<ClickUpDashboard> {
    logger.info(`Creating dashboard: ${dashboardData.name}`, { workspaceId });
    
    const payload = this.buildDashboardPayload(dashboardData);
    const response = await this.client.post<ClickUpDashboard>(`/workspace/${workspaceId}/dashboard`, payload);
    
    logger.info(`Dashboard created: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Updates a dashboard
   */
  async updateDashboard(dashboardId: string, updates: Partial<CreateDashboardData>): Promise<ClickUpDashboard> {
    logger.debug(`Updating dashboard: ${dashboardId}`, { updates });
    
    const payload = this.buildDashboardPayload(updates);
    const response = await this.client.put<ClickUpDashboard>(`/dashboard/${dashboardId}`, payload);
    
    logger.info(`Dashboard updated: ${response.name}`);
    return response;
  }

  /**
   * Deletes a dashboard
   */
  async deleteDashboard(dashboardId: string): Promise<void> {
    logger.info(`Deleting dashboard: ${dashboardId}`);
    
    await this.client.delete(`/dashboard/${dashboardId}`);
    
    logger.info(`Dashboard deleted: ${dashboardId}`);
  }

  /**
   * Gets widgets for a dashboard
   */
  async getWidgets(dashboardId: string): Promise<ClickUpWidget[]> {
    logger.debug(`Fetching widgets for dashboard: ${dashboardId}`);
    
    const dashboard = await this.getDashboard(dashboardId);
    const widgets = dashboard.widgets || [];
    
    logger.debug(`Retrieved ${widgets.length} widgets for dashboard: ${dashboardId}`);
    return widgets;
  }

  /**
   * Adds a widget to a dashboard
   */
  async addWidget(dashboardId: string, widgetData: {
    name: string;
    type: string;
    query?: Record<string, unknown>;
    display?: Record<string, unknown>;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }): Promise<ClickUpWidget> {
    logger.info(`Adding widget to dashboard: ${dashboardId}`, { widgetName: widgetData.name });
    
    const payload = this.buildWidgetPayload(widgetData);
    const response = await this.client.post<ClickUpWidget>(`/dashboard/${dashboardId}/widget`, payload);
    
    logger.info(`Widget added: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Updates a widget
   */
  async updateWidget(dashboardId: string, widgetId: string, updates: Partial<ClickUpWidget>): Promise<ClickUpWidget> {
    logger.debug(`Updating widget: ${widgetId}`, { updates });
    
    const payload = this.buildWidgetPayload(updates);
    const response = await this.client.put<ClickUpWidget>(`/dashboard/${dashboardId}/widget/${widgetId}`, payload);
    
    logger.info(`Widget updated: ${response.name}`);
    return response;
  }

  /**
   * Removes a widget from a dashboard
   */
  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    logger.info(`Removing widget from dashboard: ${dashboardId}`, { widgetId });
    
    await this.client.delete(`/dashboard/${dashboardId}/widget/${widgetId}`);
    
    logger.info(`Widget removed: ${widgetId}`);
  }

  /**
   * Reorders widgets in a dashboard
   */
  async reorderWidgets(dashboardId: string, widgetOrders: Array<{
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
  }>): Promise<void> {
    logger.info(`Reordering widgets in dashboard: ${dashboardId}`, { count: widgetOrders.length });
    
    const payload = { widgets: widgetOrders };
    await this.client.put(`/dashboard/${dashboardId}/widgets/reorder`, payload);
    
    logger.info(`Widgets reordered in dashboard: ${dashboardId}`);
  }

  /**
   * Duplicates a dashboard
   */
  async duplicateDashboard(dashboardId: string, newName: string): Promise<ClickUpDashboard> {
    logger.info(`Duplicating dashboard: ${dashboardId}`, { newName });
    
    const payload = { name: newName };
    const response = await this.client.post<ClickUpDashboard>(`/dashboard/${dashboardId}/duplicate`, payload);
    
    logger.info(`Dashboard duplicated: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Gets dashboard analytics data
   */
  async getDashboardAnalytics(dashboardId: string, options?: {
    startDate?: string;
    endDate?: string;
    refresh?: boolean;
  }): Promise<Record<string, unknown>> {
    logger.debug(`Fetching analytics for dashboard: ${dashboardId}`, { options });
    
    const params: Record<string, unknown> = {};
    if (options?.startDate) params.start_date = options.startDate;
    if (options?.endDate) params.end_date = options.endDate;
    if (options?.refresh !== undefined) params.refresh = options.refresh;
    
    const response = await this.client.get(`/dashboard/${dashboardId}/analytics`, { params });
    
    return response as Record<string, unknown>;
  }

  /**
   * Refreshes dashboard data
   */
  async refreshDashboard(dashboardId: string): Promise<void> {
    logger.info(`Refreshing dashboard: ${dashboardId}`);
    
    await this.client.post(`/dashboard/${dashboardId}/refresh`, {});
    
    logger.info(`Dashboard refreshed: ${dashboardId}`);
  }

  /**
   * Shares a dashboard
   */
  async shareDashboard(dashboardId: string, shareData: {
    public?: boolean;
    password?: string;
    expiresAt?: string;
    allowedEmails?: string[];
  }): Promise<{ shareUrl: string; shareId: string }> {
    logger.info(`Sharing dashboard: ${dashboardId}`, { public: shareData.public });
    
    const response = await this.client.post<{ shareUrl: string; shareId: string }>(`/dashboard/${dashboardId}/share`, shareData);
    
    logger.info(`Dashboard shared: ${dashboardId} (${response.shareId})`);
    return response;
  }

  /**
   * Revokes dashboard sharing
   */
  async revokeShare(dashboardId: string, shareId: string): Promise<void> {
    logger.info(`Revoking share for dashboard: ${dashboardId}`, { shareId });
    
    await this.client.delete(`/dashboard/${dashboardId}/share/${shareId}`);
    
    logger.info(`Share revoked: ${shareId}`);
  }

  /**
   * Gets dashboard sharing settings
   */
  async getShareSettings(dashboardId: string): Promise<Array<{
    shareId: string;
    shareUrl: string;
    public: boolean;
    createdAt: string;
    expiresAt?: string;
    allowedEmails?: string[];
  }>> {
    logger.debug(`Fetching share settings for dashboard: ${dashboardId}`);
    
    const response = await this.client.get<{ shares: any[] }>(`/dashboard/${dashboardId}/shares`);
    
    return response.shares || [];
  }

  /**
   * Exports dashboard data
   */
  async exportDashboard(dashboardId: string, format: 'json' | 'csv' | 'pdf' = 'json'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    logger.info(`Exporting dashboard: ${dashboardId}`, { format });
    
    const response = await this.client.post<{ downloadUrl: string; expiresAt: string }>(`/dashboard/${dashboardId}/export`, { format });
    
    logger.info(`Dashboard exported: ${dashboardId}`);
    return response;
  }

  /**
   * Builds dashboard payload for API requests
   */
  private buildDashboardPayload(dashboardData: CreateDashboardData | Partial<CreateDashboardData>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    
    if (dashboardData.name !== undefined) payload.name = dashboardData.name;
    if (dashboardData.description !== undefined) payload.description = dashboardData.description;
    if (dashboardData.widgets !== undefined) payload.widgets = dashboardData.widgets;
    
    return payload;
  }

  /**
   * Builds widget payload for API requests
   */
  private buildWidgetPayload(widgetData: Partial<ClickUpWidget>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    
    if (widgetData.name !== undefined) payload.name = widgetData.name;
    if (widgetData.type !== undefined) payload.type = widgetData.type;
    if (widgetData.query !== undefined) payload.query = widgetData.query;
    if (widgetData.display !== undefined) payload.display = widgetData.display;
    if (widgetData.width !== undefined) payload.width = widgetData.width;
    if (widgetData.height !== undefined) payload.height = widgetData.height;
    if (widgetData.x !== undefined) payload.x = widgetData.x;
    if (widgetData.y !== undefined) payload.y = widgetData.y;
    
    return payload;
  }
}
