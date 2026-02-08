/**
 * ClickUp Configuration Manager
 * Centralized configuration management for ClickUp integration
 */

import { ClickUpServiceConfig, ClickUpEnvConfig } from '@/features/clickup/domain/types';
import { validateClickUpEnv, createServiceConfig } from './env-validator';
import { logger } from '@/lib/clickup/logger';

export class ClickUpConfig {
  private static instance: ClickUpConfig | undefined;
  private config: ClickUpServiceConfig;
  private envConfig: ClickUpEnvConfig;

  private constructor() {
    this.envConfig = validateClickUpEnv();
    this.config = createServiceConfig();
    
    // Set logger level from configuration
    logger.setLevel(this.config.logLevel);
    logger.setContext({
      workspaceId: this.config.workspaceId,
      folderId: this.config.folderId,
    });
    
    logger.logConfiguration({
      workspaceId: this.config.workspaceId,
      folderId: this.config.folderId,
      retryAttempts: this.config.retryConfig.attempts,
      retryDelay: this.config.retryConfig.delay,
      timeout: this.config.timeout,
      logLevel: this.config.logLevel,
    });
  }

  /**
   * Gets the singleton instance of ClickUpConfig
   */
  static getInstance(): ClickUpConfig {
    if (!ClickUpConfig.instance) {
      ClickUpConfig.instance = new ClickUpConfig();
    }
    return ClickUpConfig.instance;
  }

  /**
   * Gets the API key
   */
  get apiKey(): string {
    return this.config.apiKey;
  }

  /**
   * Gets the workspace ID
   */
  get workspaceId(): string {
    return this.config.workspaceId;
  }

  /**
   * Gets the folder ID (optional)
   */
  get folderId(): string | undefined {
    return this.config.folderId;
  }

  /**
   * Gets the retry configuration
   */
  get retryConfig() {
    return this.config.retryConfig;
  }

  /**
   * Gets the timeout configuration
   */
  get timeout(): number {
    return this.config.timeout;
  }

  /**
   * Gets the log level
   */
  get logLevel(): ClickUpServiceConfig['logLevel'] {
    return this.config.logLevel;
  }

  /**
   * Gets the complete service configuration
   */
  getServiceConfig(): ClickUpServiceConfig {
    return { ...this.config };
  }

  /**
   * Gets the environment configuration
   */
  getEnvConfig(): ClickUpEnvConfig {
    return { ...this.envConfig };
  }

  /**
   * Updates the log level at runtime
   */
  setLogLevel(level: ClickUpServiceConfig['logLevel']): void {
    this.config.logLevel = level;
    logger.setLevel(level);
    logger.info('Log level updated', { level });
  }

  /**
   * Updates the retry configuration at runtime
   */
  updateRetryConfig(config: Partial<ClickUpServiceConfig['retryConfig']>): void {
    this.config.retryConfig = { ...this.config.retryConfig, ...config };
    logger.info('Retry configuration updated', { retryConfig: this.config.retryConfig });
  }

  /**
   * Updates the timeout at runtime
   */
  setTimeout(timeout: number): void {
    this.config.timeout = timeout;
    logger.info('Timeout updated', { timeout });
  }

  /**
   * Validates the current configuration
   */
  validate(): boolean {
    try {
      // Re-validate environment variables
      validateClickUpEnv();
      
      // Validate configuration values
      if (!this.config.apiKey || this.config.apiKey.trim().length === 0) {
        throw new Error('API key is required');
      }

      if (!this.config.workspaceId || this.config.workspaceId.trim().length === 0) {
        throw new Error('Workspace ID is required');
      }

      if (this.config.retryConfig.attempts < 1 || this.config.retryConfig.attempts > 10) {
        throw new Error('Retry attempts must be between 1 and 10');
      }

      if (this.config.retryConfig.delay < 100 || this.config.retryConfig.delay > 60000) {
        throw new Error('Retry delay must be between 100ms and 60s');
      }

      if (this.config.timeout < 1000 || this.config.timeout > 300000) {
        throw new Error('Timeout must be between 1s and 5min');
      }

      logger.debug('Configuration validation successful');
      return true;
    } catch (error) {
      logger.error('Configuration validation failed', error);
      return false;
    }
  }

  /**
   * Resets the singleton instance (useful for testing)
   */
  static resetInstance(): void {
    ClickUpConfig.instance = undefined;
  }

  /**
   * Creates a new instance with custom configuration (useful for testing)
   */
  static createInstance(config: Partial<ClickUpServiceConfig>): ClickUpConfig {
    const instance = new ClickUpConfig();
    
    // Override configuration with provided values
    if (config.apiKey) instance.config.apiKey = config.apiKey;
    if (config.workspaceId) instance.config.workspaceId = config.workspaceId;
    if (config.folderId !== undefined) instance.config.folderId = config.folderId;
    if (config.retryConfig) instance.config.retryConfig = { ...instance.config.retryConfig, ...config.retryConfig };
    if (config.timeout) instance.config.timeout = config.timeout;
    if (config.logLevel) {
      instance.config.logLevel = config.logLevel;
      logger.setLevel(config.logLevel);
    }
    
    return instance;
  }

  /**
   * Gets configuration summary for logging
   */
  getConfigSummary(): Record<string, unknown> {
    return {
      workspaceId: this.config.workspaceId,
      folderId: this.config.folderId,
      retryAttempts: this.config.retryConfig.attempts,
      retryDelay: this.config.retryConfig.delay,
      timeout: this.config.timeout,
      logLevel: this.config.logLevel,
      apiKeySet: !!this.config.apiKey,
    };
  }

  /**
   * Checks if the configuration is complete for operations
   */
  isComplete(): boolean {
    return !!(this.config.apiKey && this.config.workspaceId);
  }

  /**
   * Checks if the configuration has folder ID
   */
  hasFolderId(): boolean {
    return !!this.config.folderId;
  }

  /**
   * Gets the base URL for API requests
   */
  get baseUrl(): string {
    return 'https://api.clickup.com/api/v2';
  }

  /**
   * Gets the headers for API requests
   */
  get headers(): Record<string, string> {
    return {
      'Authorization': this.config.apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'kidstop-backoffice/1.0.0',
    };
  }
}

// Export the singleton instance getter
export const getClickUpConfig = (): ClickUpConfig => {
  return ClickUpConfig.getInstance();
};

// Export convenience functions
export const getApiKey = (): string => {
  return getClickUpConfig().apiKey;
};

export const getWorkspaceId = (): string => {
  return getClickUpConfig().workspaceId;
};

export const getFolderId = (): string | undefined => {
  return getClickUpConfig().folderId;
};

export const getRetryConfig = () => {
  return getClickUpConfig().retryConfig;
};

export const getTimeout = (): number => {
  return getClickUpConfig().timeout;
};

export const getLogLevel = () => {
  return getClickUpConfig().logLevel;
};
