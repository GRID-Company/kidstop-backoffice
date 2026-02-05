#!/usr/bin/env node

/**
 * ClickUp API Client
 * Wrapper for ClickUp API v2
 */

const https = require('https');

class ClickUpAPI {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('ClickUp API key is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.clickup.com/api/v2';
  }

  /**
   * Make HTTP request to ClickUp API
   */
  async request(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      const options = {
        method,
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(url, options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const response = body ? JSON.parse(body) : {};
            
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(`ClickUp API Error: ${res.statusCode} - ${response.err || body}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Get workspace/team information
   */
  async getTeam(teamId) {
    return this.request('GET', `/team/${teamId}`);
  }

  /**
   * Get spaces in a team
   */
  async getSpaces(teamId) {
    return this.request('GET', `/team/${teamId}/space`);
  }

  /**
   * Create a new list
   */
  async createList(folderId, name, content = '', dueDate = null, priority = null) {
    const data = {
      name,
      content,
      due_date: dueDate,
      priority,
    };

    return this.request('POST', `/folder/${folderId}/list`, data);
  }

  /**
   * Get lists in a folder
   */
  async getLists(folderId) {
    return this.request('GET', `/folder/${folderId}/list`);
  }

  /**
   * Get lists in a space (folderless)
   */
  async getFolderlessLists(spaceId) {
    return this.request('GET', `/space/${spaceId}/list`);
  }

  /**
   * Create a custom field
   */
  async createCustomField(listId, fieldData) {
    return this.request('POST', `/list/${listId}/field`, fieldData);
  }

  /**
   * Get custom fields for a list
   */
  async getCustomFields(listId) {
    return this.request('GET', `/list/${listId}/field`);
  }

  /**
   * Create a task
   */
  async createTask(listId, taskData) {
    const data = {
      name: taskData.name,
      description: taskData.description || '',
      assignees: taskData.assignees || [],
      tags: taskData.tags || [],
      status: taskData.status || 'to do',
      priority: taskData.priority || null,
      due_date: taskData.dueDate || null,
      start_date: taskData.startDate || null,
      custom_fields: taskData.customFields || [],
    };

    return this.request('POST', `/list/${listId}/task`, data);
  }

  /**
   * Get task by ID
   */
  async getTask(taskId) {
    return this.request('GET', `/task/${taskId}`);
  }

  /**
   * Update task
   */
  async updateTask(taskId, updates) {
    return this.request('PUT', `/task/${taskId}`, updates);
  }

  /**
   * Get tasks in a list
   */
  async getTasks(listId, options = {}) {
    const params = new URLSearchParams();
    
    if (options.archived !== undefined) params.append('archived', options.archived);
    if (options.page !== undefined) params.append('page', options.page);
    if (options.orderBy) params.append('order_by', options.orderBy);
    if (options.reverse !== undefined) params.append('reverse', options.reverse);
    if (options.subtasks !== undefined) params.append('subtasks', options.subtasks);
    if (options.statuses) params.append('statuses', JSON.stringify(options.statuses));
    if (options.includeClosed !== undefined) params.append('include_closed', options.includeClosed);

    const queryString = params.toString();
    const endpoint = `/list/${listId}/task${queryString ? `?${queryString}` : ''}`;
    
    return this.request('GET', endpoint);
  }

  /**
   * Add comment to task
   */
  async addComment(taskId, commentText) {
    return this.request('POST', `/task/${taskId}/comment`, {
      comment_text: commentText,
    });
  }

  /**
   * Set custom field value for a task
   */
  async setCustomFieldValue(taskId, fieldId, value) {
    return this.request('POST', `/task/${taskId}/field/${fieldId}`, {
      value,
    });
  }

  /**
   * Get task statuses
   */
  async getStatuses(listId) {
    const list = await this.request('GET', `/list/${listId}`);
    return list.statuses || [];
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId, status) {
    return this.updateTask(taskId, { status });
  }

  /**
   * Get folders in a space
   */
  async getFolders(spaceId) {
    return this.request('GET', `/space/${spaceId}/folder`);
  }

  /**
   * Create folder in space
   */
  async createFolder(spaceId, name) {
    return this.request('POST', `/space/${spaceId}/folder`, { name });
  }

  /**
   * Get space by ID
   */
  async getSpace(spaceId) {
    return this.request('GET', `/space/${spaceId}`);
  }

  /**
   * Create space
   */
  async createSpace(teamId, name, features = {}) {
    return this.request('POST', `/team/${teamId}/space`, {
      name,
      features,
    });
  }
}

module.exports = ClickUpAPI;

// CLI usage
if (require.main === module) {
  const apiKey = process.env.CLICKUP_API_KEY;
  
  if (!apiKey) {
    console.error('Error: CLICKUP_API_KEY environment variable is required');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);
  const command = process.argv[2];
  const args = process.argv.slice(3);

  (async () => {
    try {
      switch (command) {
        case 'get-team':
          const team = await api.getTeam(args[0]);
          console.log(JSON.stringify(team, null, 2));
          break;
        
        case 'get-spaces':
          const spaces = await api.getSpaces(args[0]);
          console.log(JSON.stringify(spaces, null, 2));
          break;
        
        case 'get-task':
          const task = await api.getTask(args[0]);
          console.log(JSON.stringify(task, null, 2));
          break;
        
        default:
          console.log('Usage: node clickup-api.js <command> [args...]');
          console.log('Commands:');
          console.log('  get-team <teamId>');
          console.log('  get-spaces <teamId>');
          console.log('  get-task <taskId>');
          break;
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}
