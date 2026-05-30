#!/usr/bin/env node

/**
 * ClickUp Setup Script - Modern CLI
 * Sets up ClickUp workspace structure using new architecture
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
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'blue');
  console.log('='.repeat(60));
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

async function setupClickUp(): Promise<void> {
  logSection('ClickUp Setup - Modern CLI');
  
  logInfo('This script sets up ClickUp workspace structure');
  logInfo('It creates folders, lists, and custom fields as needed');

  try {
    // Step 1: Validate environment
    logSection('Step 1: Environment Validation');
    log('Validating environment variables...');
    
    const envConfig = validateClickUpEnvForCLI();
    logSuccess('Environment variables validated');

    // Step 2: Initialize service
    logSection('Step 2: Service Initialization');
    log('Initializing ClickUp service...');
    
    const clickUpService = getClickUpService();
    logSuccess('ClickUp service initialized');

    // Step 3: Test connection
    logSection('Step 3: Connection Test');
    log('Testing connection to ClickUp API...');
    
    const isConnected = await clickUpService.testConnection();
    
    if (!isConnected) {
      logError('Failed to connect to ClickUp API');
      logInfo('Please run: npm run clickup:test');
      process.exit(1);
    }
    
    logSuccess('Connection successful');

    // Step 4: Health check
    logSection('Step 4: Health Check');
    log('Performing health check...');
    
    const healthCheck = await clickUpService.performHealthCheck();
    
    if (!healthCheck.isHealthy) {
      logWarning('Some health checks failed');
      log('Issues found:', 'yellow');
      healthCheck.issues.forEach((issue, index) => {
        log(`  ${index + 1}. ${issue}`, 'yellow');
      });
      
      // Try auto-fix
      const autoFixActions = healthCheck.actions.filter(action => action.autoFix);
      if (autoFixActions.length > 0) {
        logInfo('Attempting auto-fix actions...');
        
        for (const action of autoFixActions) {
          log(`Executing: ${action.description}`, 'cyan');
          const success = await clickUpService.executeAutoFix(action.action);
          
          if (success) {
            logSuccess(`Auto-fix successful: ${action.description}`);
          } else {
            logWarning(`Auto-fix failed: ${action.description}`);
          }
        }
      }
    } else {
      logSuccess('All health checks passed');
    }

    // Step 5: Setup workspace structure
    logSection('Step 5: Workspace Structure Setup');
    log('Setting up workspace structure...');
    
    const setupOptions = {
      folderName: process.env.CLICKUP_FOLDER_NAME || 'Kidstop Project',
      listName: process.env.CLICKUP_LIST_NAME || 'Main Tasks',
      createIfMissing: true,
    };
    
    log(`Folder name: ${setupOptions.folderName}`, 'cyan');
    log(`List name: ${setupOptions.listName}`, 'cyan');
    
    const structure = await clickUpService.setupWorkspaceStructure(setupOptions);
    
    logSuccess('Workspace structure setup completed');
    log(`Folder ID: ${structure.folderId}`, 'cyan');
    log(`List ID: ${structure.listId}`, 'cyan');
    
    if (structure.created.folder) {
      logSuccess(`Created new folder: ${setupOptions.folderName}`);
    } else {
      logInfo(`Using existing folder: ${structure.folderId}`);
    }
    
    if (structure.created.list) {
      logSuccess(`Created new list: ${setupOptions.listName}`);
    } else {
      logInfo(`Using existing list: ${structure.listId}`);
    }

    // Step 6: Setup custom fields
    logSection('Step 6: Custom Fields Setup');
    log('Setting up custom fields...');
    
    try {
      const existingFields = await clickUpService.listsApi.getCustomFields(structure.listId);
      log(`Found ${existingFields.length} existing custom fields`);
      
      const desiredFields = [
        { name: 'Priority Score', type: 'numbers' },
        { name: 'Estimated Hours', type: 'numbers' },
        { name: 'Actual Hours', type: 'numbers' },
        { name: 'Phase', type: 'dropdown' },
        { name: 'Complexity', type: 'dropdown' },
      ];
      
      const fieldsToCreate = desiredFields.filter(
        desired => !existingFields.some(existing => existing.name === desired.name)
      );
      
      if (fieldsToCreate.length > 0) {
        log(`Creating ${fieldsToCreate.length} new custom fields...`);
        
        for (const field of fieldsToCreate) {
          try {
            const createdField = await clickUpService.listsApi.createCustomField(
              structure.listId,
              field
            );
            logSuccess(`Created custom field: ${createdField.name}`);
          } catch (error) {
            logWarning(`Failed to create field: ${field.name}`);
          }
        }
      } else {
        logSuccess('All desired custom fields already exist');
      }
    } catch (error) {
      logWarning('Failed to setup custom fields (non-critical)');
    }

    // Step 7: Create sample tasks (optional)
    logSection('Step 7: Sample Tasks');
    
    const createSampleTasks = process.env.CLICKUP_CREATE_SAMPLE_TASKS === 'true';
    
    if (createSampleTasks) {
      log('Creating sample tasks...');
      
      const sampleTasks = [
        {
          name: 'Setup Project Structure',
          description: 'Initialize project folders and configuration',
          priority: 1, // High
          status: 'complete',
        },
        {
          name: 'Design Database Schema',
          description: 'Create database schema and relationships',
          priority: 2, // High
          status: 'in progress',
        },
        {
          name: 'Implement Authentication',
          description: 'Add user authentication and authorization',
          priority: 2, // High
          status: 'todo',
        },
        {
          name: 'Create API Endpoints',
          description: 'Implement REST API endpoints',
          priority: 3, // Normal
          status: 'todo',
        },
        {
          name: 'Write Unit Tests',
          description: 'Create comprehensive unit tests',
          priority: 4, // Low
          status: 'todo',
        },
      ];
      
      try {
        const result = await clickUpService.tasks.bulkCreateTasks(structure.listId, sampleTasks, {
          continueOnError: true,
          skipValidation: false,
        });
        
        logSuccess(`Created ${result.summary.successful} sample tasks`);
        if (result.summary.failed > 0) {
          logWarning(`${result.summary.failed} tasks failed to create`);
        }
      } catch (error) {
        logWarning('Failed to create sample tasks (non-critical)');
      }
    } else {
      logInfo('Skipping sample tasks creation');
      logInfo('Set CLICKUP_CREATE_SAMPLE_TASKS=true to create sample tasks');
    }

    // Step 8: Save configuration
    logSection('Step 8: Configuration Summary');
    
    logSuccess('ClickUp setup completed successfully!');
    log('\nConfiguration:', 'cyan');
    log(`  - Workspace ID: ${envConfig.CLICKUP_WORKSPACE_ID}`);
    log(`  - Folder ID: ${structure.folderId}`);
    log(`  - List ID: ${structure.listId}`);
    log(`  - Custom Fields: 5`);
    
    if (createSampleTasks) {
      log(`  - Sample Tasks: 5`);
    }

    // Step 9: Next steps
    logSection('Next Steps');
    logInfo('Your ClickUp integration is now ready!');
    
    log('\nAvailable commands:', 'blue');
    log('1. Test connection: npm run clickup:test');
    log('2. Create task: npm run clickup:create-task');
    log('3. Update task: npm run clickup:update-task');
    log('4. View dashboard: Visit /clickup in your browser');
    
    log('\nEnvironment variables (add to .env):', 'yellow');
    log(`CLICKUP_FOLDER_ID=${structure.folderId}`);
    log(`CLICKUP_LIST_ID=${structure.listId}`);
    
    log('\n' + '='.repeat(60));
    log('🎉 ClickUp setup completed successfully!', 'green');
    log('=' .repeat(60));

  } catch (error) {
    logSection('Setup Failed');
    
    if (error instanceof Error) {
      logError(error.message);
      
      // Provide helpful suggestions
      if (error.message.includes('API key') || error.message.includes('workspace')) {
        logInfo('\nSuggestions:');
        log('1. Run connection test first: npm run clickup:test');
        log('2. Check your environment variables in .env file');
        log('3. Ensure you have proper permissions in ClickUp');
      }
    } else {
      logError('Unknown error occurred');
    }
    
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupClickUp();
}

export default setupClickUp;
