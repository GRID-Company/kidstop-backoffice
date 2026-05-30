/**
 * ClickUp Error Handler
 * Centralized error handling and classification
 */

import { 
  ClickUpError, 
  ClickUpValidationError, 
  ClickUpNetworkError, 
  ClickUpTimeoutError,
  ClickUpApiError
} from '@/features/clickup/domain/types';
import { RETRYABLE_STATUS_CODES, CLICKUP_ERROR_MESSAGES } from '@/features/clickup/domain/constants';
import { logger } from './logger';

export class ErrorHandler {
  static classifyError(error: unknown): ClickUpError {
    if (error instanceof ClickUpError) {
      return error;
    }

    if (error instanceof Error) {
      // Network errors
      if (error.name === 'FetchError' || error.message.includes('ECONNRESET')) {
        return new ClickUpNetworkError(error.message, error);
      }

      // Timeout errors
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        return new ClickUpTimeoutError(30000); // Default timeout
      }

      // Validation errors
      if (error.message.includes('validation') || error.message.includes('required')) {
        return new ClickUpValidationError(error.message);
      }

      // Generic error with original error
      return new ClickUpError(error.message, undefined, error);
    }

    // String errors
    if (typeof error === 'string') {
      return new ClickUpError(error);
    }

    // Unknown error type
    return new ClickUpError('Unknown error occurred', undefined, error);
  }

  static fromApiError(apiError: ClickUpApiError): ClickUpError {
    const message = apiError.err || apiError.message || CLICKUP_ERROR_MESSAGES.UNKNOWN_ERROR;
    
    // Specific error types based on status code
    switch (apiError.statusCode) {
      case 400:
        return new ClickUpValidationError(message);
      case 401:
        return new ClickUpError(CLICKUP_ERROR_MESSAGES.UNAUTHORIZED, 401);
      case 403:
        return new ClickUpError('Access forbidden', 403);
      case 404:
        return new ClickUpError(CLICKUP_ERROR_MESSAGES.NOT_FOUND, 404);
      case 408:
        return new ClickUpTimeoutError(30000);
      case 429:
        return new ClickUpError(CLICKUP_ERROR_MESSAGES.RATE_LIMIT, 429);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ClickUpError(CLICKUP_ERROR_MESSAGES.SERVER_ERROR, apiError.statusCode as 500 | 502 | 503 | 504);
      default:
        return new ClickUpError(message, apiError.statusCode);
    }
  }

  static isRetryable(error: ClickUpError): boolean {
    if (!error.statusCode) {
      // Network errors are typically retryable
      return error instanceof ClickUpNetworkError;
    }

    return RETRYABLE_STATUS_CODES.includes(error.statusCode as typeof RETRYABLE_STATUS_CODES[number]);
  }

  static shouldRetry(error: ClickUpError, attempt: number, maxAttempts: number): boolean {
    if (attempt >= maxAttempts) {
      return false;
    }

    return this.isRetryable(error);
  }

  static getRetryDelay(attempt: number, baseDelay: number, maxDelay: number = 30000): number {
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
    const delay = exponentialDelay + jitter;
    
    return Math.min(delay, maxDelay);
  }

  static logError(error: ClickUpError, context?: Record<string, unknown>): void {
    const errorContext = {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      isRetryable: this.isRetryable(error),
      ...context,
    };

    if (error.statusCode && error.statusCode >= 500) {
      logger.error('Server error', error, errorContext);
    } else if (error.statusCode && error.statusCode >= 400) {
      logger.warn(`Client error: ${error.message}`, errorContext);
    } else {
      logger.error(`Application error: ${error.message}`, errorContext);
    }
  }

  static createValidationError(field: string, message: string): ClickUpValidationError {
    return new ClickUpValidationError(`${field}: ${message}`, field);
  }

  static createNetworkError(message: string, originalError?: unknown): ClickUpNetworkError {
    return new ClickUpNetworkError(message, originalError);
  }

  static createTimeoutError(timeout: number): ClickUpTimeoutError {
    return new ClickUpTimeoutError(timeout);
  }

  static wrapError(error: unknown, context?: string): ClickUpError {
    const clickUpError = this.classifyError(error);
    
    if (context) {
      clickUpError.message = `${context}: ${clickUpError.message}`;
    }

    return clickUpError;
  }

  // Error recovery suggestions
  static getRecoverySuggestion(error: ClickUpError): string | null {
    switch (error.statusCode) {
      case 401:
        return 'Check your API key and ensure it has the required permissions';
      case 403:
        return 'Ensure your API key has access to the requested resource';
      case 404:
        return 'Verify the resource ID exists and you have access to it';
      case 408:
        return 'Check your network connection and try again';
      case 429:
        return 'Rate limit exceeded. Please wait before making another request';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later';
      default:
        if (error instanceof ClickUpNetworkError) {
          return 'Check your network connection and try again';
        }
        if (error instanceof ClickUpValidationError) {
          return 'Check your input data and try again';
        }
        return null;
    }
  }

  // Error metrics
  static trackError(error: ClickUpError): void {
    // This could integrate with monitoring services
    const metrics = {
      type: error.name,
      statusCode: error.statusCode,
      isRetryable: this.isRetryable(error),
      timestamp: new Date().toISOString(),
    };

    logger.debug('Error metrics', metrics);
  }
}

// Utility functions for common error scenarios
export const handleApiError = (error: unknown, context?: string): ClickUpError => {
  const clickUpError = ErrorHandler.classifyError(error);
  
  if (context) {
    clickUpError.message = `${context}: ${clickUpError.message}`;
  }

  ErrorHandler.logError(clickUpError);
  ErrorHandler.trackError(clickUpError);

  return clickUpError;
};

export const handleValidationError = (field: string, value: unknown, rules: string[]): never => {
  const message = `Invalid ${field}. Expected: ${rules.join(', ')}`;
  const error = ErrorHandler.createValidationError(field, message);
  ErrorHandler.logError(error);
  throw error;
};

export const handleNetworkError = (error: unknown, context?: string): never => {
  const clickUpError = ErrorHandler.createNetworkError(
    context || 'Network request failed',
    error
  );
  ErrorHandler.logError(clickUpError);
  throw clickUpError;
};

export const handleTimeoutError = (timeout: number, context?: string): never => {
  const message = context ? `${context} timeout after ${timeout}ms` : `Request timeout after ${timeout}ms`;
  const error = ErrorHandler.createTimeoutError(timeout);
  error.message = message;
  ErrorHandler.logError(error);
  throw error;
};
