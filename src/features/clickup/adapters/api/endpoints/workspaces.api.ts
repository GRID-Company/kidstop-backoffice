/**
 * ClickUp Workspaces API
 * Handles workspace and team operations
 */

import { ClickUpClient } from '../clickup-client';
import { ClickUpWorkspace, ClickUpSpace, ClickUpFolder } from '@/features/clickup/domain/types';
import { logger } from '@/lib/clickup/logger';

export class WorkspacesApi {
  constructor(private client: ClickUpClient) {}

  /**
   * Gets workspace/team information
   */
  async getWorkspace(workspaceId: string): Promise<ClickUpWorkspace> {
    logger.debug(`Fetching workspace: ${workspaceId}`);
    
    const response = await this.client.get<ClickUpWorkspace>(`/team/${workspaceId}`);
    
    logger.debug(`Retrieved workspace: ${response.name}`);
    return response;
  }

  /**
   * Gets all spaces in a workspace
   */
  async getSpaces(workspaceId: string): Promise<ClickUpSpace[]> {
    logger.debug(`Fetching spaces for workspace: ${workspaceId}`);
    
    const response = await this.client.get<{ spaces: ClickUpSpace[] }>(`/team/${workspaceId}/space`);
    
    logger.debug(`Retrieved ${response.spaces.length} spaces from workspace: ${workspaceId}`);
    return response.spaces || [];
  }

  /**
   * Gets a specific space by ID
   */
  async getSpace(spaceId: string): Promise<ClickUpSpace> {
    logger.debug(`Fetching space: ${spaceId}`);
    
    const response = await this.client.get<ClickUpSpace>(`/space/${spaceId}`);
    
    logger.debug(`Retrieved space: ${response.name}`);
    return response;
  }

  /**
   * Creates a new space in a workspace
   */
  async createSpace(workspaceId: string, name: string, features?: Record<string, unknown>): Promise<ClickUpSpace> {
    logger.info(`Creating space: ${name}`, { workspaceId });
    
    const payload = {
      name,
      features: features || {},
    };
    
    const response = await this.client.post<ClickUpSpace>(`/team/${workspaceId}/space`, payload);
    
    logger.info(`Space created: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Updates a space
   */
  async updateSpace(spaceId: string, updates: Partial<ClickUpSpace>): Promise<ClickUpSpace> {
    logger.debug(`Updating space: ${spaceId}`, { updates });
    
    const response = await this.client.put<ClickUpSpace>(`/space/${spaceId}`, updates);
    
    logger.info(`Space updated: ${response.name}`);
    return response;
  }

  /**
   * Deletes a space
   */
  async deleteSpace(spaceId: string): Promise<void> {
    logger.info(`Deleting space: ${spaceId}`);
    
    await this.client.delete(`/space/${spaceId}`);
    
    logger.info(`Space deleted: ${spaceId}`);
  }

  /**
   * Gets all folders in a space
   */
  async getFolders(spaceId: string): Promise<ClickUpFolder[]> {
    logger.debug(`Fetching folders for space: ${spaceId}`);
    
    const response = await this.client.get<{ folders: ClickUpFolder[] }>(`/space/${spaceId}/folder`);
    
    logger.debug(`Retrieved ${response.folders?.length || 0} folders from space: ${spaceId}`);
    return response.folders || [];
  }

  /**
   * Gets a specific folder by ID
   */
  async getFolder(folderId: string): Promise<ClickUpFolder> {
    logger.debug(`Fetching folder: ${folderId}`);
    
    const response = await this.client.get<ClickUpFolder>(`/folder/${folderId}`);
    
    logger.debug(`Retrieved folder: ${response.name}`);
    return response;
  }

  /**
   * Creates a new folder in a space
   */
  async createFolder(spaceId: string, name: string): Promise<ClickUpFolder> {
    logger.info(`Creating folder: ${name}`, { spaceId });
    
    const payload = { name };
    const response = await this.client.post<ClickUpFolder>(`/space/${spaceId}/folder`, payload);
    
    logger.info(`Folder created: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Updates a folder
   */
  async updateFolder(folderId: string, updates: Partial<ClickUpFolder>): Promise<ClickUpFolder> {
    logger.debug(`Updating folder: ${folderId}`, { updates });
    
    const response = await this.client.put<ClickUpFolder>(`/folder/${folderId}`, updates);
    
    logger.info(`Folder updated: ${response.name}`);
    return response;
  }

  /**
   * Deletes a folder
   */
  async deleteFolder(folderId: string): Promise<void> {
    logger.info(`Deleting folder: ${folderId}`);
    
    await this.client.delete(`/folder/${folderId}`);
    
    logger.info(`Folder deleted: ${folderId}`);
  }

  /**
   * Gets workspace members
   */
  async getMembers(workspaceId: string): Promise<ClickUpWorkspace['members']> {
    logger.debug(`Fetching members for workspace: ${workspaceId}`);
    
    const workspace = await this.getWorkspace(workspaceId);
    
    logger.debug(`Retrieved ${workspace.members?.length || 0} members from workspace: ${workspaceId}`);
    return workspace.members || [];
  }

  /**
   * Gets workspace settings
   */
  async getSettings(workspaceId: string): Promise<Record<string, unknown>> {
    logger.debug(`Fetching settings for workspace: ${workspaceId}`);
    
    const response = await this.client.get(`/team/${workspaceId}/settings`);
    
    return response as Record<string, unknown>;
  }

  /**
   * Updates workspace settings
   */
  async updateSettings(workspaceId: string, settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    logger.debug(`Updating settings for workspace: ${workspaceId}`, { settings });
    
    const response = await this.client.put(`/team/${workspaceId}/settings`, settings);
    
    logger.info(`Settings updated for workspace: ${workspaceId}`);
    return response as Record<string, unknown>;
  }

  /**
   * Gets workspace analytics
   */
  async getAnalytics(workspaceId: string, options?: {
    startDate?: string;
    endDate?: string;
    teamIds?: string[];
  }): Promise<Record<string, unknown>> {
    logger.debug(`Fetching analytics for workspace: ${workspaceId}`, { options });
    
    const params: Record<string, unknown> = {};
    if (options?.startDate) params.start_date = options.startDate;
    if (options?.endDate) params.end_date = options.endDate;
    if (options?.teamIds) params.team_ids = JSON.stringify(options.teamIds);
    
    const response = await this.client.get(`/team/${workspaceId}/analytics`, { params });
    
    return response as Record<string, unknown>;
  }

  /**
   * Gets workspace activity feed
   */
  async getActivity(workspaceId: string, options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    skip?: number;
  }): Promise<any[]> {
    logger.debug(`Fetching activity for workspace: ${workspaceId}`, { options });
    
    const params: Record<string, unknown> = {};
    if (options?.startDate) params.start_date = options.startDate;
    if (options?.endDate) params.end_date = options.endDate;
    if (options?.limit) params.limit = options.limit;
    if (options?.skip) params.skip = options.skip;
    
    const response = await this.client.get<{ history: any[] }>(`/team/${workspaceId}/activity`, { params });
    
    return response.history || [];
  }

  /**
   * Searches across workspace
   */
  async search(workspaceId: string, query: string, options?: {
    type?: 'task' | 'list' | 'folder' | 'space' | 'doc' | 'comment';
    limit?: number;
    skip?: number;
  }): Promise<any[]> {
    logger.debug(`Searching workspace: ${workspaceId}`, { query, options });
    
    const params: Record<string, unknown> = { query };
    if (options?.type) params.type = options.type;
    if (options?.limit) params.limit = options.limit;
    if (options?.skip) params.skip = options.skip;
    
    const response = await this.client.get<{ results: any[] }>(`/team/${workspaceId}/search`, { params });
    
    logger.debug(`Found ${response.results.length} results for query: ${query}`);
    return response.results;
  }
}
