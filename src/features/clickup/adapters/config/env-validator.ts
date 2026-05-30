/**
 * ClickUp Environment Validator
 * Validates and normalizes environment variables for ClickUp integration
 */

import { z } from 'zod';
import { ClickUpEnvConfig, ClickUpServiceConfig } from '@/features/clickup/domain/types';
import { DEFAULT_RETRY_CONFIG, DEFAULT_TIMEOUT, CLICKUP_ERROR_MESSAGES } from '@/features/clickup/domain/constants';
import { logger } from '@/lib/clickup/logger';

// Environment variable schema
const clickupEnvSchema = z.object({
  CLICKUP_API_KEY: z.string().min(1, CLICKUP_ERROR_MESSAGES.API_KEY_REQUIRED),
  CLICKUP_WORKSPACE_ID: z.string().min(1, CLICKUP_ERROR_MESSAGES.WORKSPACE_ID_REQUIRED),
  CLICKUP_FOLDER_ID: z.string().optional(),
  CLICKUP_RETRY_ATTEMPTS: z.coerce.number().int().min(1).max(10).default(DEFAULT_RETRY_CONFIG.attempts),
  CLICKUP_RETRY_DELAY: z.coerce.number().int().min(100).max(60000).default(DEFAULT_RETRY_CONFIG.delay),
  CLICKUP_TIMEOUT: z.coerce.number().int().min(1000).max(300000).default(DEFAULT_TIMEOUT),
  CLICKUP_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type ClickUpEnvConfigSchema = z.infer<typeof clickupEnvSchema>;

/**
 * Validates environment variables and returns normalized configuration
 */
export const validateClickUpEnv = (): ClickUpEnvConfig => {
  try {
    const envVars = {
      CLICKUP_API_KEY: process.env.CLICKUP_API_KEY,
      CLICKUP_WORKSPACE_ID: process.env.CLICKUP_WORKSPACE_ID,
      CLICKUP_FOLDER_ID: process.env.CLICKUP_FOLDER_ID,
      CLICKUP_RETRY_ATTEMPTS: process.env.CLICKUP_RETRY_ATTEMPTS,
      CLICKUP_RETRY_DELAY: process.env.CLICKUP_RETRY_DELAY,
      CLICKUP_TIMEOUT: process.env.CLICKUP_TIMEOUT,
      CLICKUP_LOG_LEVEL: process.env.CLICKUP_LOG_LEVEL,
    };

    const result = clickupEnvSchema.safeParse(envVars);

    if (!result.success) {
      const errorMessages = result.error.issues.map((error) => {
        const field = error.path.join('.');
        const message = error.message;
        return `${field}: ${message}`;
      });

      const errorMessage = `Invalid ClickUp configuration:\n${errorMessages.join('\n')}`;
      logger.error('Environment validation failed', new Error(errorMessage));
      throw new Error(errorMessage);
    }

    logger.debug('Environment validation successful', { config: result.data });
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to validate environment variables', error);
      throw error;
    }
    throw new Error('Unknown error during environment validation');
  }
};

/**
 * Validates environment variables for CLI usage
 * Provides more user-friendly error messages
 */
export const validateClickUpEnvForCLI = (): ClickUpEnvConfig => {
  try {
    return validateClickUpEnv();
  } catch (error) {
    if (error instanceof Error) {
      console.error('\n❌ ClickUp Configuration Error');
      console.error('=====================================\n');
      console.error(error.message);
      console.error('\n💡 To fix this issue:');
      console.error('1. Copy .env.example to .env');
      console.error('2. Add your ClickUp API key and workspace ID');
      console.error('3. Run the script again\n');
      console.error('Example .env file:');
      console.error('CLICKUP_API_KEY=pk_your_api_key_here');
      console.error('CLICKUP_WORKSPACE_ID=your_workspace_id');
      console.error('CLICKUP_FOLDER_ID=optional_folder_id\n');
    }
    process.exit(1);
  }
};

/**
 * Creates service configuration from environment variables
 */
export const createServiceConfig = (): ClickUpServiceConfig => {
  const envConfig = validateClickUpEnv();

  return {
    apiKey: envConfig.CLICKUP_API_KEY,
    workspaceId: envConfig.CLICKUP_WORKSPACE_ID,
    folderId: envConfig.CLICKUP_FOLDER_ID,
    retryConfig: {
      attempts: envConfig.CLICKUP_RETRY_ATTEMPTS,
      delay: envConfig.CLICKUP_RETRY_DELAY,
      backoff: 'exponential',
      maxDelay: 30000,
    },
    timeout: envConfig.CLICKUP_TIMEOUT,
    logLevel: envConfig.CLICKUP_LOG_LEVEL,
  };
};

/**
 * Validates a subset of environment variables for specific operations
 */
export const validatePartialEnv = (requiredVars: (keyof ClickUpEnvConfig)[]): Partial<ClickUpEnvConfig> => {
  const envConfig = validateClickUpEnv();
  const partialConfig: Partial<ClickUpEnvConfig> = {};

  for (const varName of requiredVars) {
    const value = envConfig[varName];
    if (value !== undefined) {
      (partialConfig as any)[varName] = value;
    } else {
      throw new Error(`Required environment variable ${varName} is missing`);
    }
  }

  return partialConfig;
};

/**
 * Checks if environment variables are configured
 * Returns true if basic configuration is present
 */
export const isClickUpConfigured = (): boolean => {
  try {
    const config = validatePartialEnv(['CLICKUP_API_KEY', 'CLICKUP_WORKSPACE_ID']);
    return !!(config.CLICKUP_API_KEY && config.CLICKUP_WORKSPACE_ID);
  } catch {
    return false;
  }
};

/**
 * Validates API key format
 */
export const validateApiKeyFormat = (apiKey: string): boolean => {
  // ClickUp API keys start with 'pk_' followed by alphanumeric characters
  const apiKeyPattern = /^pk_[a-zA-Z0-9]+$/;
  return apiKeyPattern.test(apiKey);
};

/**
 * Validates workspace ID format
 */
export const validateWorkspaceIdFormat = (workspaceId: string): boolean => {
  // Workspace IDs are numeric strings
  const workspaceIdPattern = /^\d+$/;
  return workspaceIdPattern.test(workspaceId);
};

/**
 * Comprehensive validation with detailed feedback
 */
export const validateAndReport = (): { isValid: boolean; config?: ClickUpEnvConfig; errors: string[] } => {
  const errors: string[] = [];

  try {
    const config = validateClickUpEnv();

    // Additional format validations
    if (!validateApiKeyFormat(config.CLICKUP_API_KEY)) {
      errors.push('API key format is invalid (should start with "pk_")');
    }

    if (!validateWorkspaceIdFormat(config.CLICKUP_WORKSPACE_ID)) {
      errors.push('Workspace ID format is invalid (should be numeric)');
    }

    if (config.CLICKUP_FOLDER_ID && !validateWorkspaceIdFormat(config.CLICKUP_FOLDER_ID)) {
      errors.push('Folder ID format is invalid (should be numeric)');
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return { isValid: true, config, errors: [] };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error.message);
    } else {
      errors.push('Unknown validation error');
    }
    return { isValid: false, errors };
  }
};

/**
 * Environment variable helper for development
 */
export const getEnvHelper = (): void => {
  const validation = validateAndReport();

  console.log('\n🔍 ClickUp Environment Check');
  console.log('============================\n');

  if (validation.isValid && validation.config) {
    console.log('✅ Environment variables are valid!\n');
    console.log('Configuration:');
    console.log(`- API Key: ${validation.config.CLICKUP_API_KEY.substring(0, 8)}***`);
    console.log(`- Workspace ID: ${validation.config.CLICKUP_WORKSPACE_ID}`);
    console.log(`- Folder ID: ${validation.config.CLICKUP_FOLDER_ID || 'Not set'}`);
    console.log(`- Retry Attempts: ${validation.config.CLICKUP_RETRY_ATTEMPTS}`);
    console.log(`- Retry Delay: ${validation.config.CLICKUP_RETRY_DELAY}ms`);
    console.log(`- Timeout: ${validation.config.CLICKUP_TIMEOUT}ms`);
    console.log(`- Log Level: ${validation.config.CLICKUP_LOG_LEVEL}`);
  } else {
    console.log('❌ Environment variables have issues:\n');
    validation.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
    console.log('\n💡 To fix:');
    console.log('1. Ensure you have a .env file');
    console.log('2. Copy from .env.example');
    console.log('3. Fill in the required values');
  }

  console.log('\n');
};
