/**
 * ClickUp Domain Types
 * Core types for ClickUp integration
 */

export interface ClickUpTask {
  id: string;
  name: string;
  description?: string;
  status: string;
  assignees: string[];
  dueDate?: number;
  timeEstimate?: number;
  startDate?: number;
  parent?: string;
  customFields?: Record<string, unknown>;
  tags?: string[];
  priority?: number;
  orderindex?: number;
  dateCreated?: string;
  dateUpdated?: string;
}

export interface ClickUpList {
  id: string;
  name: string;
  taskCount?: number;
  statuses?: ClickUpStatus[];
  folderId?: string;
  spaceId?: string;
  content?: string;
  priority?: string;
  assignee?: string;
  start?: string;
  due?: string;
}

export interface ClickUpStatus {
  id: string;
  status: string;
  color: string;
  orderindex: number;
  type?: string;
}

export interface ClickUpSpace {
  id: string;
  name: string;
  color?: string;
  access?: boolean;
  features?: Record<string, unknown>;
  statuses?: ClickUpStatus[];
}

export interface ClickUpFolder {
  id: string;
  name: string;
  orderindex?: number;
  override_statuses?: boolean;
  lists?: ClickUpList[];
}

export interface ClickUpWorkspace {
  id: string;
  name: string;
  color?: string;
  avatar?: string;
  members?: ClickUpMember[];
}

export interface ClickUpMember {
  id: number;
  username: string;
  email: string;
  color?: string;
  initials?: string;
  profilePicture?: string;
  role?: number;
  lastActive?: string;
}

export interface ClickUpCustomField {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  options?: Array<{
    id: string;
    name: string;
    orderindex: number;
  }>;
  date_created?: string;
  hide_from_guests?: boolean;
  value?: unknown;
}

export interface ClickUpComment {
  id: string;
  comment_text: string;
  user: ClickUpMember;
  resolved?: boolean;
  assignee?: ClickUpMember;
  date: string;
  date_updated?: string;
}

export interface ClickUpApiError {
  statusCode: number;
  message: string;
  err?: string;
  code?: string;
}

export interface RetryConfig {
  attempts: number;
  delay: number;
  backoff?: 'exponential' | 'linear';
  maxDelay?: number;
}

export interface ApiRequestOptions {
  retry?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ClickUpDashboard {
  id: string;
  name: string;
  description?: string;
  widgets?: ClickUpWidget[];
  created_at?: string;
  updated_at?: string;
}

export interface ClickUpWidget {
  id: string;
  name: string;
  type: string;
  query?: Record<string, unknown>;
  display?: Record<string, unknown>;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

// Task creation/update interfaces
export interface CreateTaskData {
  name: string;
  description?: string;
  assignees?: string[];
  status?: string;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string;
  links_to?: string[];
  custom_task_id?: string;
  custom_fields?: Record<string, unknown>;
  tags?: string[];
  priority?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  archived?: boolean;
}

// List creation interfaces
export interface CreateListData {
  name: string;
  content?: string;
  due_date?: number;
  priority?: string;
  assignee?: string;
  start?: string;
  due?: string;
}

export interface UpdateListData extends Partial<CreateListData> {
  archived?: boolean;
}

// Dashboard creation interfaces
export interface CreateDashboardData {
  name: string;
  description?: string;
  widgets?: ClickUpWidget[];
}

// Query options
export interface GetTasksOptions {
  archived?: boolean;
  page?: number;
  order_by?: string;
  reverse?: boolean;
  subtasks?: boolean;
  statuses?: string[];
  include_closed?: boolean;
  assignees?: string[];
  tags?: string[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
  date_done_gt?: number;
  date_done_lt?: number;
}

// Response wrappers
export interface ClickUpPaginatedResponse<T> {
  tasks: T[];
  last_task_id?: string;
  next_page?: boolean;
  page?: number;
  total?: number;
}

export interface ClickUpResponse<T> {
  data: T;
  success?: boolean;
  err?: string;
}

// Environment configuration types
export interface ClickUpEnvConfig {
  CLICKUP_API_KEY: string;
  CLICKUP_WORKSPACE_ID: string;
  CLICKUP_FOLDER_ID?: string;
  CLICKUP_RETRY_ATTEMPTS: number;
  CLICKUP_RETRY_DELAY: number;
  CLICKUP_TIMEOUT: number;
  CLICKUP_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

// Service configuration
export interface ClickUpServiceConfig {
  apiKey: string;
  workspaceId: string;
  folderId?: string;
  retryConfig: RetryConfig;
  timeout: number;
  logLevel: ClickUpEnvConfig['CLICKUP_LOG_LEVEL'];
}

// Error types
export class ClickUpError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ClickUpError';
  }
}

export class ClickUpValidationError extends ClickUpError {
  constructor(message: string, public field?: string) {
    super(message, 400);
    this.name = 'ClickUpValidationError';
  }
}

export class ClickUpNetworkError extends ClickUpError {
  constructor(message: string, public originalError?: unknown) {
    super(message, 0, originalError);
    this.name = 'ClickUpNetworkError';
  }
}

export class ClickUpTimeoutError extends ClickUpError {
  constructor(timeout: number) {
    super(`Request timeout after ${timeout}ms`, 408);
    this.name = 'ClickUpTimeoutError';
  }
}
