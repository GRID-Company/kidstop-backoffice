#!/usr/bin/env node

/**
 * ClickUp Connection Test - Modern CLI
 * Tests connection to ClickUp API using new architecture
 */

import { getClickUpService } from '../../../src/features/clickup/domain/services/clickup.service';
import { validateClickUpEnvForCLI } from '../../../src/features/clickup/adapters/config/env-validator';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof COLORS = 'reset'): void {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logSection(title: string): void {
  console.log('\n' + '='.repeat(50));
  log(`  ${title}`, 'blue');
  console.log('='.repeat(50));
}

function logSuccess(message: string): void {
  log(`✅ ${message}`, 'green');
}

function logError(message: string): void {
  log(`❌ ${message}`, 'red');
}

function logWarning(message: string): void {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message: string): void {
  log(`ℹ️  ${message}`, 'cyan');
}

async function testConnection(): Promise<void> {
  logSection('ClickUp Connection Test - Modern CLI');
  
  logInfo('This script tests the ClickUp API connection using the new architecture');
  logInfo('It validates configuration and tests API endpoints');

  try {
    // Step 1: Validate environment configuration
    logSection('Step 1: Environment Configuration');
    log('Validating environment variables...');
    
    const envConfig = validateClickUpEnvForCLI();
    logSuccess('Environment variables validated successfully');
    
    log('Configuration:', 'cyan');
    log(`  - Workspace ID: ${envConfig.CLICKUP_WORKSPACE_ID}`);
    log(`  - Folder ID: ${envConfig.CLICKUP_FOLDER_ID || 'Not configured'}`);
    log(`  - Retry Attempts: ${envConfig.CLICKUP_RETRY_ATTEMPTS}`);
    log(`  - Retry Delay: ${envConfig.CLICKUP_RETRY_DELAY}ms`);
    log(`  - Timeout: ${envConfig.CLICKUP_TIMEOUT}ms`);
    log(`  - Log Level: ${envConfig.CLICKUP_LOG_LEVEL}`);

    // Step 2: Initialize service
    logSection('Step 2: Service Initialization');
    log('Initializing ClickUp service...');
    
    const clickUpService = getClickUpService();
    logSuccess('ClickUp service initialized');

    // Step 3: Test API connection
    logSection('Step 3: API Connection Test');
    log('Testing connection to ClickUp API...');
    
    const isConnected = await clickUpService.testConnection();
    
    if (!isConnected) {
      logError('Failed to connect to ClickUp API');
      process.exit(1);
    }
    
    logSuccess('Successfully connected to ClickUp API');

    // Step 4: Get workspace information
    logSection('Step 4: Workspace Information');
    log('Fetching workspace details...');
    
    const workspaceInfo = await clickUpService.getWorkspaceInfo();
    
    logSuccess(`Workspace: ${workspaceInfo.workspace.name}`);
    log(`  - ID: ${workspaceInfo.workspace.id}`);
    log(`  - Members: ${workspaceInfo.workspace.members?.length || 0}`);
    log(`  - Spaces: ${workspaceInfo.spaces.length}`);
    
    workspaceInfo.spaces.forEach((space: any, index: number) => {
      log(`  ${index + 1}. ${space.name} (${space.id})`, 'cyan');
    });

    // Step 5: Check folder configuration
    logSection('Step 5: Folder Configuration');
    
    if (envConfig.CLICKUP_FOLDER_ID) {
      log(`Checking configured folder: ${envConfig.CLICKUP_FOLDER_ID}`);
      
      try {
        const folder = await clickUpService.workspacesApi.getFolder(envConfig.CLICKUP_FOLDER_ID);
        logSuccess(`Folder found: ${folder.name}`);
        log(`  - Lists: ${folder.lists?.length || 0}`);
      } catch {
        logWarning('Configured folder not found or inaccessible');
        logInfo('The service will create a new folder if needed');
      }
    } else {
      logWarning('No folder ID configured');
      logInfo('The service will use folderless lists or create a new folder');
    }

    // Step 6: Health check
    logSection('Step 6: Service Health Check');
    log('Performing comprehensive health check...');
    
    const healthStatus = await clickUpService.getHealthStatus();
    
    log(`Overall Status: ${healthStatus.status.toUpperCase()}`, 
      healthStatus.status === 'healthy' ? 'green' : 
      healthStatus.status === 'degraded' ? 'yellow' : 'red'
    );
    
    log('Health Checks:', 'cyan');
    Object.entries(healthStatus.checks).forEach(([check, passed]) => {
      const status = passed ? '✅' : '❌';
      log(`  ${status} ${check}`, passed ? 'green' : 'red');
    });

    // Step 7: Auto-fix suggestions
    if (healthStatus.status !== 'healthy') {
      logSection('Step 7: Auto-Fix Suggestions');
      
      const healthCheck = await clickUpService.performHealthCheck();
      
      if (healthCheck.actions.length > 0) {
        log('Available auto-fix actions:', 'yellow');
        healthCheck.actions.forEach((action, index) => {
          const autoFix = action.autoFix ? ' (auto-fix available)' : '';
          log(`  ${index + 1}. ${action.description}${autoFix}`, 'cyan');
        });
        
        logInfo('Run the setup script to apply auto-fixes: npm run clickup:setup');
      }
    }

    // Step 8: Summary
    logSection('Test Summary');
    logSuccess('All tests completed successfully!');
    logInfo('ClickUp integration is ready to use');
    
    log('\nNext steps:', 'blue');
    log('1. Run setup script: npm run clickup:setup');
    log('2. Create tasks: npm run clickup:create-task');
    log('3. View dashboard: Visit /clickup in your browser');
    
    log('\n' + '='.repeat(50));
    log('🎉 ClickUp connection test completed successfully!', 'green');
    log('=' .repeat(50));

  } catch (error) {
    logSection('Test Failed');
    
    if (error instanceof Error) {
      logError(error.message);
      
      // Provide helpful suggestions based on common errors
      if (error.message.includes('API key')) {
        logInfo('\nSuggestions:');
        log('1. Check your CLICKUP_API_KEY in .env file');
        log('2. Ensure the API key is valid and not expired');
        log('3. Get a new API key from ClickUp Settings > Apps');
      } else if (error.message.includes('workspace')) {
        logInfo('\nSuggestions:');
        log('1. Check your CLICKUP_WORKSPACE_ID in .env file');
        log('2. Ensure you have access to the workspace');
        log('3. Get the workspace ID from ClickUp URL');
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        logInfo('\nSuggestions:');
        log('1. Check your internet connection');
        log('2. Verify ClickUp services are operational');
        log('3. Try increasing timeout in configuration');
      }
    } else {
      logError('Unknown error occurred');
    }
    
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection();
}

export default testConnection;
