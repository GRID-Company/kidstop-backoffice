/**
 * ClickUp Retry Interceptor
 * Handles retry logic with exponential backoff for API requests
 */

import { RetryConfig } from '@/features/clickup/domain/types';
import { ClickUpError } from '@/features/clickup/domain/types';
import { ErrorHandler } from '@/lib/clickup/error-handler';
import { logger } from '@/lib/clickup/logger';

export interface RetryContext {
  operation: string;
  endpoint: string;
  attempt: number;
  startTime: number;
}

export class RetryInterceptor {
  constructor(private config: RetryConfig) {}

  /**
   * Executes a function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    context: Omit<RetryContext, 'attempt' | 'startTime'>
  ): Promise<T> {
    const startTime = Date.now();
    let lastError: ClickUpError | undefined;

    for (let attempt = 1; attempt <= this.config.attempts; attempt++) {
      const retryContext: RetryContext = {
        ...context,
        attempt,
        startTime,
      };

      try {
        logger.debug(`Attempting ${context.operation} (attempt ${attempt}/${this.config.attempts})`, {
          endpoint: context.endpoint,
          attempt,
        });

        const result = await fn();
        
        if (attempt > 1) {
          logger.info(`${context.operation} succeeded after ${attempt} attempts`, {
            endpoint: context.endpoint,
            totalAttempts: attempt,
            duration: Date.now() - startTime,
          });
        }

        return result;
      } catch (error) {
        const clickUpError = ErrorHandler.classifyError(error);
        lastError = clickUpError;

        const duration = Date.now() - startTime;
        logger.warn(`${context.operation} failed (attempt ${attempt}/${this.config.attempts})`, {
          endpoint: context.endpoint,
          error: clickUpError.message,
          statusCode: clickUpError.statusCode,
          duration,
          isRetryable: ErrorHandler.isRetryable(clickUpError),
        });

        // Check if we should retry
        if (!ErrorHandler.shouldRetry(clickUpError, attempt, this.config.attempts)) {
          logger.error(`${context.operation} - Not retryable or max attempts reached`, clickUpError, {
            endpoint: context.endpoint,
            attempt,
            maxAttempts: this.config.attempts,
            duration,
          });
          break;
        }

        // If this is not the last attempt, wait before retrying
        if (attempt < this.config.attempts) {
          const delay = this.calculateDelay(attempt);
          logger.info(`Retrying ${context.operation} in ${delay}ms`, {
            endpoint: context.endpoint,
            attempt,
            nextAttempt: attempt + 1,
            delay,
          });
          await this.sleep(delay);
        }
      }
    }

    // All attempts failed
    const totalDuration = Date.now() - startTime;
    const finalError = lastError || new ClickUpError('All retry attempts failed');
    
    logger.error(`${context.operation} - All retry attempts exhausted`, finalError, {
      endpoint: context.endpoint,
      totalAttempts: this.config.attempts,
      totalDuration,
    });

    throw finalError;
  }

  /**
   * Calculates delay for retry with exponential backoff and jitter
   */
  private calculateDelay(attempt: number): number {
    const baseDelay = this.config.delay;
    let delay: number;

    switch (this.config.backoff) {
      case 'exponential':
        delay = baseDelay * Math.pow(2, attempt - 1);
        break;
      case 'linear':
        delay = baseDelay * attempt;
        break;
      default:
        delay = baseDelay * Math.pow(2, attempt - 1);
    }

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    delay += jitter;

    // Apply max delay limit
    if (this.config.maxDelay && delay > this.config.maxDelay) {
      delay = this.config.maxDelay;
    }

    return Math.round(delay);
  }

  /**
   * Sleep function for delay between retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Updates retry configuration
   */
  updateConfig(config: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...config };
    logger.debug('Retry configuration updated', { config: this.config });
  }

  /**
   * Gets current retry configuration
   */
  getConfig(): RetryConfig {
    return { ...this.config };
  }

  /**
   * Resets retry configuration to defaults
   */
  resetConfig(): void {
    this.config = {
      attempts: 3,
      delay: 1000,
      backoff: 'exponential',
      maxDelay: 30000,
    };
    logger.debug('Retry configuration reset to defaults');
  }
}

/**
 * Creates a retry interceptor with default configuration
 */
export const createRetryInterceptor = (config?: Partial<RetryConfig>): RetryInterceptor => {
  const defaultConfig: RetryConfig = {
    attempts: 3,
    delay: 1000,
    backoff: 'exponential',
    maxDelay: 30000,
  };

  const finalConfig = config ? { ...defaultConfig, ...config } : defaultConfig;
  return new RetryInterceptor(finalConfig);
};

/**
 * Higher-order function that adds retry capability to any async function
 */
export const withRetry = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config?: Partial<RetryConfig>,
  context?: Partial<RetryContext>
): T => {
  const retryInterceptor = createRetryInterceptor(config);
  
  return (async (...args: Parameters<T>) => {
    const operation = context?.operation || fn.name || 'unknown';
    const endpoint = context?.endpoint || 'unknown';
    
    return retryInterceptor.execute(() => fn(...args), {
      operation,
      endpoint,
    });
  }) as T;
};

/**
 * Utility function to execute multiple operations with retry
 */
export const executeWithRetry = async <T>(
  operations: Array<() => Promise<T>>,
  config?: Partial<RetryConfig>,
  context?: Partial<RetryContext>
): Promise<Array<{ success: boolean; result?: T; error?: ClickUpError }>> => {
  const retryInterceptor = createRetryInterceptor(config);
  const results = [];

  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    const operationContext = {
      operation: context?.operation || `operation_${i + 1}`,
      endpoint: context?.endpoint || `endpoint_${i + 1}`,
    };

    try {
      const result = await retryInterceptor.execute(operation, operationContext);
      results.push({ success: true, result });
    } catch (error) {
      const clickUpError = ErrorHandler.classifyError(error);
      results.push({ success: false, error: clickUpError });
    }
  }

  return results;
};
