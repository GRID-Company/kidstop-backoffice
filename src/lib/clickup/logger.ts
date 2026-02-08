/**
 * ClickUp Logger
 * Structured logging for ClickUp operations
 */

import { LOG_LEVELS } from '@/features/clickup/domain/constants';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel = 'info';
  private context: LogContext = {};

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private formatMessage(message: string, additionalContext?: LogContext): string {
    const timestamp = new Date().toISOString();
    const context = { ...this.context, ...additionalContext };
    const contextString = Object.keys(context).length > 0 
      ? ` ${JSON.stringify(context)}` 
      : '';
    return `[${timestamp}] [ClickUp] ${message}${contextString}`;
  }

  debug(message: string, additionalContext?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message, additionalContext));
    }
  }

  info(message: string, additionalContext?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message, additionalContext));
    }
  }

  warn(message: string, additionalContext?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message, additionalContext));
    }
  }

  error(message: string, error?: unknown, additionalContext?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = error instanceof Error 
        ? { 
            error: error.message, 
            stack: error.stack,
            name: error.name 
          }
        : { error };
      
      const finalContext = { ...additionalContext, ...errorContext };
      console.error(this.formatMessage(message, finalContext));
    }
  }

  // Performance logging
  time(label: string): void {
    if (this.shouldLog('debug')) {
      console.time(`[ClickUp] ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog('debug')) {
      console.timeEnd(`[ClickUp] ${label}`);
    }
  }

  // Request logging
  logRequest(method: string, url: string, data?: unknown): void {
    this.debug(`${method} ${url}`, { method, url, data });
  }

  logResponse(method: string, url: string, statusCode: number, duration: number): void {
    this.info(`${method} ${url} - ${statusCode} (${duration}ms)`, {
      method,
      url,
      statusCode,
      duration,
    });
  }

  logError(method: string, url: string, error: unknown, duration: number): void {
    this.error(`${method} ${url} - Failed`, error, {
      method,
      url,
      duration,
    });
  }

  // Business operation logging
  logTaskOperation(operation: string, taskId: string, taskName?: string): void {
    this.info(`Task ${operation}: ${taskId}`, {
      operation,
      taskId,
      taskName,
    });
  }

  logBulkOperation(operation: string, count: number, success: number, failed: number): void {
    this.info(`Bulk ${operation} completed`, {
      operation,
      total: count,
      successful: success,
      failed,
      successRate: count > 0 ? (success / count) * 100 : 0,
    });
  }

  logApiCall(endpoint: string, attempts: number, success: boolean): void {
    const level = success ? 'info' : 'warn';
    this[level](`API call: ${endpoint}`, {
      endpoint,
      attempts,
      success,
    });
  }

  // Configuration logging
  logConfiguration(config: Record<string, unknown>): void {
    // Sanitize config to avoid logging sensitive data
    const sanitizedConfig = { ...config };
    if (sanitizedConfig.apiKey) {
      sanitizedConfig.apiKey = '***';
    }
    
    this.debug('ClickUp configuration loaded', sanitizedConfig);
  }

  // Rate limiting logging
  logRateLimit(limit: number, remaining: number, resetTime?: number): void {
    this.warn('Rate limit approaching', {
      limit,
      remaining,
      resetTime,
    });
  }

  // Cache logging
  logCacheHit(key: string): void {
    this.debug(`Cache hit: ${key}`, { key });
  }

  logCacheMiss(key: string): void {
    this.debug(`Cache miss: ${key}`, { key });
  }

  logCacheSet(key: string, ttl: number): void {
    this.debug(`Cache set: ${key} (TTL: ${ttl}ms)`, { key, ttl });
  }
}

// Singleton instance
export const logger = new Logger();

// Export for testing
export { Logger };
