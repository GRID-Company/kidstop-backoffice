import { ClickUpConfig } from '../config/clickup.config';
import { RetryInterceptor } from './interceptors/retry.interceptor';
import { ClickUpError, ApiRequestOptions, ClickUpApiError } from '@/features/clickup/domain/types';
import { ErrorHandler } from '@/lib/clickup/error-handler';
import { logger } from '@/lib/clickup/logger';
import { CLICKUP_API_BASE_URL } from '@/features/clickup/domain/constants';

export interface RequestConfig extends ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class ClickUpClient {
  private baseUrl: string;
  private config: ClickUpConfig;
  private retryInterceptor: RetryInterceptor;

  constructor(config?: ClickUpConfig) {
    this.config = config || ClickUpConfig.getInstance();
    this.baseUrl = CLICKUP_API_BASE_URL;
    this.retryInterceptor = new RetryInterceptor(this.config.retryConfig);
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options: RequestConfig = {}
  ): Promise<T> {
    const executeRequest = async (): Promise<T> => {
      const startTime = Date.now();
      const url = this.buildUrl(endpoint, options.params);
      
      try {
        logger.logRequest(method, url.toString(), data);
        
        const result = await this.makeHttpRequest<T>(method, url, data, options);
        
        const duration = Date.now() - startTime;
        logger.logResponse(method, endpoint, result.status, duration);
        
        return result.data;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.logError(method, endpoint, error, duration);
        throw error;
      }
    };

    if (options.retry !== false) {
      return this.retryInterceptor.execute(executeRequest, {
        operation: `${method} ${endpoint}`,
        endpoint,
      });
    }

    return executeRequest();
  }

  private async makeHttpRequest<T>(
    method: string,
    url: URL,
    data?: unknown,
    options: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
        (requestOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
      }

      // Add timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, options.timeout || this.config.timeout);

      requestOptions.signal = controller.signal;

      const response = await fetch(url.toString(), requestOptions);
      clearTimeout(timeoutId);

      const body = await response.text();

      return this.parseResponse<T>(response, body);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ClickUpError(`Request timeout after ${options.timeout || this.config.timeout}ms`, 408);
        }
        throw ErrorHandler.createNetworkError('Network request failed', error);
      }
      throw new ClickUpError('Unknown request error');
    }
  }

  private parseResponse<T>(res: any, body: string): ApiResponse<T> {
    const statusCode = res.status || res.statusCode || 0;
    const statusText = res.statusText || res.statusMessage || '';

    // Parse response body
    let data: T;
    try {
      data = body ? JSON.parse(body) : ({} as T);
    } catch (parseError) {
      throw new ClickUpError(
        `Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        statusCode
      );
    }

    // Handle error responses
    if (statusCode >= 400) {
      const apiError: ClickUpApiError = {
        statusCode,
        message: (data as any)?.err || (data as any)?.message || statusText,
        err: (data as any)?.err,
      };
      
      throw ErrorHandler.fromApiError(apiError);
    }

    // Build headers object
    const headers: Record<string, string> = {};
    if (res.headers) {
      for (const [key, value] of Object.entries(res.headers)) {
        if (typeof value === 'string') {
          headers[key] = value;
        } else if (Array.isArray(value)) {
          headers[key] = value.join(', ');
        } else if (value !== undefined) {
          headers[key] = String(value);
        }
      }
    }

    // Handle rate limiting
    this.handleRateLimit(headers);

    return {
      data,
      status: statusCode,
      statusText,
      headers,
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): URL {
    const baseUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const url = new URL(baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            url.searchParams.append(key, JSON.stringify(value));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url;
  }

  async get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * HTTP POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * Updates client configuration
   */
  updateConfig(config: Partial<ClickUpConfig>): void {
    logger.warn('Client configuration update not implemented');
  }

  getConfig(): ClickUpConfig {
    return this.config;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.get(`/team/${this.config.workspaceId}`, { retry: false });
      return true;
    } catch (error) {
      logger.error('Connection test failed', error);
      return false;
    }
  }

  getRateLimitInfo(headers: Record<string, string>): {
    limit: number;
    remaining: number;
    resetTime?: number;
  } {
    return {
      limit: parseInt(headers['x-ratelimit-limit'] || '0'),
      remaining: parseInt(headers['x-ratelimit-remaining'] || '0'),
      resetTime: headers['x-ratelimit-reset'] 
        ? parseInt(headers['x-ratelimit-reset']) 
        : undefined,
    };
  }

  private handleRateLimit(headers: Record<string, string>): void {
    const rateLimit = this.getRateLimitInfo(headers);
    
    if (rateLimit.remaining < 10) {
      logger.logRateLimit(rateLimit.limit, rateLimit.remaining, rateLimit.resetTime);
    }
  }

  static create(config?: Partial<ClickUpConfig>): ClickUpClient {
    const clickUpConfig = config 
      ? ClickUpConfig.createInstance(config)
      : ClickUpConfig.getInstance();
    
    return new ClickUpClient(clickUpConfig);
  }
}

export const clickUpClient = new ClickUpClient();

export const createClickUpClient = (config?: Partial<ClickUpConfig>): ClickUpClient => {
  return ClickUpClient.create(config);
};
