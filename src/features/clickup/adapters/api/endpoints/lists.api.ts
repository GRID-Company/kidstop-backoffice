/**
 * ClickUp Lists API
 * Handles list-related operations
 */

import { ClickUpClient } from '../clickup-client';
import { 
  ClickUpList, 
  ClickUpStatus, 
  ClickUpCustomField,
  CreateListData,
  UpdateListData 
} from '@/features/clickup/domain/types';
import { logger } from '@/lib/clickup/logger';

export class ListsApi {
  constructor(private client: ClickUpClient) {}

  /**
   * Gets a specific list by ID
   */
  async getList(listId: string): Promise<ClickUpList> {
    logger.debug(`Fetching list: ${listId}`);
    
    const response = await this.client.get<ClickUpList>(`/list/${listId}`);
    
    logger.debug(`Retrieved list: ${response.name}`);
    return response;
  }

  /**
   * Gets all lists in a folder
   */
  async getLists(folderId: string): Promise<ClickUpList[]> {
    logger.debug(`Fetching lists for folder: ${folderId}`);
    
    const response = await this.client.get<{ lists: ClickUpList[] }>(`/folder/${folderId}/list`);
    
    logger.debug(`Retrieved ${response.lists?.length || 0} lists from folder: ${folderId}`);
    return response.lists || [];
  }

  /**
   * Gets folderless lists in a space
   */
  async getFolderlessLists(spaceId: string): Promise<ClickUpList[]> {
    logger.debug(`Fetching folderless lists for space: ${spaceId}`);
    
    const response = await this.client.get<{ lists: ClickUpList[] }>(`/space/${spaceId}/list`);
    
    logger.debug(`Retrieved ${response.lists?.length || 0} folderless lists from space: ${spaceId}`);
    return response.lists || [];
  }

  /**
   * Creates a new list in a folder
   */
  async createList(folderId: string, listData: CreateListData): Promise<ClickUpList> {
    logger.info(`Creating list: ${listData.name}`, { folderId });
    
    const payload = this.buildListPayload(listData);
    const response = await this.client.post<ClickUpList>(`/folder/${folderId}/list`, payload);
    
    logger.info(`List created: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Creates a folderless list in a space
   */
  async createFolderlessList(spaceId: string, listData: CreateListData): Promise<ClickUpList> {
    logger.info(`Creating folderless list: ${listData.name}`, { spaceId });
    
    const payload = this.buildListPayload(listData);
    const response = await this.client.post<ClickUpList>(`/space/${spaceId}/list`, payload);
    
    logger.info(`Folderless list created: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Updates a list
   */
  async updateList(listId: string, updates: UpdateListData): Promise<ClickUpList> {
    logger.debug(`Updating list: ${listId}`, { updates });
    
    const payload = this.buildListPayload(updates);
    const response = await this.client.put<ClickUpList>(`/list/${listId}`, payload);
    
    logger.info(`List updated: ${response.name}`);
    return response;
  }

  /**
   * Deletes a list
   */
  async deleteList(listId: string): Promise<void> {
    logger.info(`Deleting list: ${listId}`);
    
    await this.client.delete(`/list/${listId}`);
    
    logger.info(`List deleted: ${listId}`);
  }

  /**
   * Gets statuses for a list
   */
  async getStatuses(listId: string): Promise<ClickUpStatus[]> {
    logger.debug(`Fetching statuses for list: ${listId}`);
    
    const list = await this.getList(listId);
    const statuses = list.statuses || [];
    
    logger.debug(`Retrieved ${statuses.length} statuses for list: ${listId}`);
    return statuses;
  }

  /**
   * Gets custom fields for a list
   */
  async getCustomFields(listId: string): Promise<ClickUpCustomField[]> {
    logger.debug(`Fetching custom fields for list: ${listId}`);
    
    const response = await this.client.get<{ fields: ClickUpCustomField[] }>(`/list/${listId}/field`);
    
    logger.debug(`Retrieved ${response.fields?.length || 0} custom fields for list: ${listId}`);
    return response.fields || [];
  }

  /**
   * Creates a custom field for a list
   */
  async createCustomField(listId: string, fieldData: {
    name: string;
    type: string;
    required?: boolean;
    options?: Array<{ id: string; name: string }>;
  }): Promise<ClickUpCustomField> {
    logger.info(`Creating custom field: ${fieldData.name}`, { listId });
    
    const response = await this.client.post<ClickUpCustomField>(`/list/${listId}/field`, fieldData);
    
    logger.info(`Custom field created: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Updates a custom field
   */
  async updateCustomField(listId: string, fieldId: string, updates: Partial<ClickUpCustomField>): Promise<ClickUpCustomField> {
    logger.debug(`Updating custom field: ${fieldId}`, { updates });
    
    const response = await this.client.put<ClickUpCustomField>(`/list/${listId}/field/${fieldId}`, updates);
    
    logger.info(`Custom field updated: ${response.name}`);
    return response;
  }

  /**
   * Deletes a custom field
   */
  async deleteCustomField(listId: string, fieldId: string): Promise<void> {
    logger.info(`Deleting custom field: ${fieldId}`, { listId });
    
    await this.client.delete(`/list/${listId}/field/${fieldId}`);
    
    logger.info(`Custom field deleted: ${fieldId}`);
  }

  /**
   * Gets list members
   */
  async getMembers(listId: string): Promise<any[]> {
    logger.debug(`Fetching members for list: ${listId}`);
    
    const response = await this.client.get<{ members: any[] }>(`/list/${listId}/member`);
    
    logger.debug(`Retrieved ${response.members?.length || 0} members for list: ${listId}`);
    return response.members || [];
  }

  /**
   * Adds a member to a list
   */
  async addMember(listId: string, memberId: number, accessLevel?: number): Promise<void> {
    logger.info(`Adding member to list: ${listId}`, { memberId, accessLevel });
    
    const payload: any = { member: { id: memberId } };
    if (accessLevel !== undefined) payload.member.access_level = accessLevel;
    
    await this.client.post(`/list/${listId}/member`, payload);
    
    logger.info(`Member added to list: ${listId}`);
  }

  /**
   * Removes a member from a list
   */
  async removeMember(listId: string, memberId: number): Promise<void> {
    logger.info(`Removing member from list: ${listId}`, { memberId });
    
    await this.client.delete(`/list/${listId}/member/${memberId}`);
    
    logger.info(`Member removed from list: ${listId}`);
  }

  /**
   * Gets list settings
   */
  async getSettings(listId: string): Promise<Record<string, unknown>> {
    logger.debug(`Fetching settings for list: ${listId}`);
    
    const response = await this.client.get(`/list/${listId}/settings`);
    
    return response as Record<string, unknown>;
  }

  /**
   * Updates list settings
   */
  async updateSettings(listId: string, settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    logger.debug(`Updating settings for list: ${listId}`, { settings });
    
    const response = await this.client.put(`/list/${listId}/settings`, settings);
    
    logger.info(`Settings updated for list: ${listId}`);
    return response as Record<string, unknown>;
  }

  /**
   * Archives a list
   */
  async archiveList(listId: string): Promise<ClickUpList> {
    logger.info(`Archiving list: ${listId}`);
    
    const response = await this.client.put<ClickUpList>(`/list/${listId}`, { archived: true });
    
    logger.info(`List archived: ${response.name}`);
    return response;
  }

  /**
   * Restores an archived list
   */
  async restoreList(listId: string): Promise<ClickUpList> {
    logger.info(`Restoring list: ${listId}`);
    
    const response = await this.client.put<ClickUpList>(`/list/${listId}`, { archived: false });
    
    logger.info(`List restored: ${response.name}`);
    return response;
  }

  /**
   * Duplicates a list
   */
  async duplicateList(listId: string, newName: string, options?: {
    includeTasks?: boolean;
    includeCustomFields?: boolean;
    includeStatuses?: boolean;
  }): Promise<ClickUpList> {
    logger.info(`Duplicating list: ${listId}`, { newName, options });
    
    const payload: any = { name: newName };
    if (options?.includeTasks !== undefined) payload.include_tasks = options.includeTasks;
    if (options?.includeCustomFields !== undefined) payload.include_custom_fields = options.includeCustomFields;
    if (options?.includeStatuses !== undefined) payload.include_statuses = options.includeStatuses;
    
    const response = await this.client.post<ClickUpList>(`/list/${listId}/duplicate`, payload);
    
    logger.info(`List duplicated: ${response.name} (${response.id})`);
    return response;
  }

  /**
   * Builds list payload for API requests
   */
  private buildListPayload(listData: CreateListData | UpdateListData): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    
    if (listData.name !== undefined) payload.name = listData.name;
    if (listData.content !== undefined) payload.content = listData.content;
    if (listData.due_date !== undefined) payload.due_date = listData.due_date;
    if (listData.priority !== undefined) payload.priority = listData.priority;
    if (listData.assignee !== undefined) payload.assignee = listData.assignee;
    if (listData.start !== undefined) payload.start = listData.start;
    if (listData.due !== undefined) payload.due = listData.due;
    if ('archived' in listData && listData.archived !== undefined) payload.archived = listData.archived;
    
    return payload;
  }
}
