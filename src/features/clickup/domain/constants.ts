/**
 * ClickUp Domain Constants
 * Centralized constants for ClickUp integration
 */

// API Configuration
export const CLICKUP_API_BASE_URL = 'https://api.clickup.com/api/v2';
export const CLICKUP_API_VERSION = 'v2';

// Default Configuration
export const DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  delay: 1000,
  backoff: 'exponential' as const,
  maxDelay: 30000,
};

export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_PAGE_SIZE = 100;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  REQUEST_TIMEOUT: 408,
} as const;

// Retryable Status Codes
export const RETRYABLE_STATUS_CODES = [
  HTTP_STATUS.REQUEST_TIMEOUT,
  HTTP_STATUS.TOO_MANY_REQUESTS,
  HTTP_STATUS.INTERNAL_SERVER_ERROR,
  HTTP_STATUS.BAD_GATEWAY,
  HTTP_STATUS.SERVICE_UNAVAILABLE,
  HTTP_STATUS.GATEWAY_TIMEOUT,
];

// Task Priorities
export const TASK_PRIORITY = {
  URGENT: 1,
  HIGH: 2,
  NORMAL: 3,
  LOW: 4,
} as const;

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.URGENT]: 'Urgent',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.NORMAL]: 'Normal',
  [TASK_PRIORITY.LOW]: 'Low',
} as const;

// Task Status Colors
export const STATUS_COLORS = {
  DEFAULT: '#808080',
  PURPLE: '#7B68EE',
  BLUE: '#0075FF',
  TURQUOISE: '#00D9FF',
  GREEN: '#00C875',
  YELLOW: '#FDB900',
  ORANGE: '#FF7E00',
  RED: '#FF3B71',
  GRAY: '#808080',
} as const;

// Custom Field Types
export const CUSTOM_FIELD_TYPES = {
  CHECKBOX: 'checkbox',
  CURRENCY: 'currency',
  DATE: 'date',
  DROPDOWN: 'dropdown',
  EMAIL: 'email',
  LABELS: 'labels',
  LOCATION: 'location',
  NUMBERS: 'numbers',
  PHONE: 'phone',
  RATING: 'rating',
  TASK: 'task',
  TEXT: 'text',
  URL: 'url',
  USER: 'user',
  WEEK: 'week',
} as const;

// Widget Types
export const WIDGET_TYPES = {
  TASKS: 'tasks',
  CHART: 'chart',
  METRIC: 'metric',
  TEXT: 'text',
  IMAGE: 'image',
  LINK: 'link',
  COUNTDOWN: 'countdown',
  CLOCK: 'clock',
} as const;

// Order By Options
export const ORDER_BY_OPTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  DUE_DATE: 'due_date',
  START_DATE: 'start_date',
  PRIORITY: 'priority',
  ASSIGNEE: 'assignee',
  STATUS: 'status',
  NAME: 'name',
  ID: 'id',
} as const;

// ClickUp Error Messages
export const CLICKUP_ERROR_MESSAGES = {
  API_KEY_REQUIRED: 'ClickUp API key is required',
  WORKSPACE_ID_REQUIRED: 'ClickUp workspace ID is required',
  TASK_NAME_REQUIRED: 'Task name is required',
  LIST_NAME_REQUIRED: 'List name is required',
  INVALID_STATUS: 'Invalid task status',
  INVALID_PRIORITY: 'Invalid task priority',
  NETWORK_ERROR: 'Network request failed',
  TIMEOUT_ERROR: 'Request timeout',
  UNAUTHORIZED: 'Unauthorized access - check API key',
  NOT_FOUND: 'Resource not found',
  RATE_LIMIT: 'Rate limit exceeded - please try again later',
  SERVER_ERROR: 'Server error - please try again later',
  VALIDATION_ERROR: 'Validation error',
  UNKNOWN_ERROR: 'Unknown error occurred',
} as const;

// Log Levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE_ONLY: 'YYYY-MM-DD',
  TIMESTAMP: 'x',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  WORKSPACE: 'clickup_workspace',
  SPACES: 'clickup_spaces',
  FOLDERS: 'clickup_folders',
  LISTS: 'clickup_lists',
  TASKS: 'clickup_tasks',
  STATUSES: 'clickup_statuses',
  CUSTOM_FIELDS: 'clickup_custom_fields',
} as const;

// Cache TTL (in milliseconds)
export const CACHE_TTL = {
  WORKSPACE: 3600000, // 1 hour
  SPACES: 1800000,    // 30 minutes
  FOLDERS: 900000,    // 15 minutes
  LISTS: 300000,      // 5 minutes
  TASKS: 60000,       // 1 minute
  STATUSES: 1800000,  // 30 minutes
  CUSTOM_FIELDS: 1800000, // 30 minutes
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 1000,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FORMATS: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// Rate Limiting
export const RATE_LIMITING = {
  DEFAULT_DELAY: 1000, // 1 second between requests
  BURST_LIMIT: 100,    // Max requests in burst
  BURST_WINDOW: 60000, // 1 minute window
} as const;
