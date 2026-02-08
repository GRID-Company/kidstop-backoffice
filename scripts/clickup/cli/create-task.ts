#!/usr/bin/env node

/**
 * ClickUp Create Task Script - Modern CLI
 * Creates tasks using the new architecture
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

interface TaskOptions {
  name: string;
  description?: string;
  status?: string;
  priority?: number;
  assignees?: string[];
  dueDate?: number;
  listId?: string;
}

function parseArguments(): TaskOptions {
  const args = process.argv.slice(2);
  const options: TaskOptions = {
    name: '',
  };

  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    let value = args[i + 1];

    // Handle flags that don't need values
    if (flag === '--help' || flag === '-h') {
      showHelp();
      process.exit(0);
    }

    // Get value for flags that need it
    if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
      value = args[i + 1];
      i++; // Skip the value in next iteration
    } else {
      value = '';
    }

    switch (flag) {
      case '--name':
      case '-n':
        options.name = value;
        break;
      case '--description':
      case '-d':
        options.description = value;
        break;
      case '--status':
      case '-s':
        options.status = value;
        break;
      case '--priority':
      case '-p':
        options.priority = value ? parseInt(value) : undefined;
        break;
      case '--assignees':
      case '-a':
        options.assignees = value ? value.split(',') : [];
        break;
      case '--due-date':
        options.dueDate = value ? parseInt(value) : undefined;
        break;
      case '--list-id':
      case '-l':
        options.listId = value;
        break;
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
ClickUp Task Creator - Modern CLI

Usage: npm run clickup:create-task -- [options]

Options:
  -n, --name <name>           Task name (required)
  -d, --description <desc>    Task description
  -s, --status <status>       Task status (default: todo)
  -p, --priority <1-4>        Task priority (1=Urgent, 2=High, 3=Normal, 4=Low)
  -a, --assignees <emails>    Comma-separated assignee emails
  --due-date <timestamp>      Due date timestamp
  -l, --list-id <id>          List ID (optional, uses configured list)
  -h, --help                  Show this help

Examples:
  npm run clickup:create-task -- --name "New Feature" --description "Implement user authentication"
  npm run clickup:create-task -- -n "Bug Fix" -s "in progress" -p 1
  npm run clickup:create-task -- -n "Documentation" -a "user@example.com,dev@example.com"

Note: Use '--' before the options to ensure proper argument parsing by npm

Priority Levels:
  1 = Urgent (Red)
  2 = High (Orange)  
  3 = Normal (Blue)
  4 = Low (Green)
`);
}

async function createTask(): Promise<void> {
  logSection('ClickUp Task Creator - Modern CLI');
  
  try {
    // Parse arguments
    const options = parseArguments();
    
    if (!options.name) {
      logError('Task name is required');
      logInfo('Use --help for usage information');
      process.exit(1);
    }

    logInfo('Creating task with the following options:');
    log(`  Name: ${options.name}`, 'cyan');
    if (options.description) log(`  Description: ${options.description}`, 'cyan');
    if (options.status) log(`  Status: ${options.status}`, 'cyan');
    if (options.priority) log(`  Priority: ${options.priority}`, 'cyan');
    if (options.assignees?.length) log(`  Assignees: ${options.assignees.join(', ')}`, 'cyan');
    if (options.dueDate) log(`  Due Date: ${new Date(options.dueDate).toLocaleString()}`, 'cyan');

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

    // Step 3: Determine list ID
    logSection('Step 3: List Selection');
    
    let listId = options.listId;
    
    if (!listId) {
      // Try to get from environment
      listId = process.env.CLICKUP_LIST_ID;
      
      if (listId) {
        logInfo(`Using list from environment: ${listId}`);
      } else {
        // Get workspace structure and use first available list
        logInfo('No list ID specified, finding first available list...');
        
        const workspaceInfo = await clickUpService.getWorkspaceInfo();
        
        if (envConfig.CLICKUP_FOLDER_ID) {
          const lists = await clickUpService.listsApi.getLists(envConfig.CLICKUP_FOLDER_ID);
          if (lists.length > 0) {
            listId = lists[0].id;
            logInfo(`Using first list from folder: ${lists[0].name}`);
          }
        } else {
          // Try folderless lists
          if (workspaceInfo.spaces.length > 0) {
            const lists = await clickUpService.listsApi.getFolderlessLists(workspaceInfo.spaces[0].id);
            if (lists.length > 0) {
              listId = lists[0].id;
              logInfo(`Using first folderless list: ${lists[0].name}`);
            }
          }
        }
        
        if (!listId) {
          logError('No list found. Please run setup first: npm run clickup:setup');
          process.exit(1);
        }
      }
    }

    // Step 4: Create task
    logSection('Step 4: Task Creation');
    log('Creating task...');
    
    const taskData = {
      name: options.name,
      description: options.description,
      status: options.status || 'todo',
      priority: options.priority,
      assignees: options.assignees || [],
      due_date: options.dueDate,
    };

    const task = await clickUpService.tasks.createTaskWithValidation(listId, taskData, {
      skipValidation: false,
      autoAssign: false,
    });

    logSuccess('Task created successfully!');
    log('\nTask Details:', 'cyan');
    log(`  ID: ${task.id}`);
    log(`  Name: ${task.name}`);
    log(`  Status: ${task.status}`);
    log(`  List ID: ${listId}`);
    if (task.priority) log(`  Priority: ${task.priority}`);
    if (task.assignees?.length) log(`  Assignees: ${task.assignees.join(', ')}`);

    // Step 5: Show next actions
    logSection('Next Actions');
    log('Available commands:', 'blue');
    log(`1. Update task: npm run clickup:update-task ${task.id}`);
    log(`2. View dashboard: Visit /clickup in your browser`);
    log(`3. Create another task: npm run clickup:create-task --name "Another task"`);

    log('\n' + '='.repeat(50));
    log('🎉 Task created successfully!', 'green');
    log('=' .repeat(50));

  } catch (error) {
    logSection('Task Creation Failed');
    
    if (error instanceof Error) {
      logError(error.message);
      
      // Provide helpful suggestions
      if (error.message.includes('validation')) {
        logInfo('\nSuggestions:');
        log('1. Check task name (required, max 255 characters)');
        log('2. Verify priority is between 1-4');
        log('3. Ensure due date is a valid timestamp');
      } else if (error.message.includes('API') || error.message.includes('connection')) {
        logInfo('\nSuggestions:');
        log('1. Test connection: npm run clickup:test');
        log('2. Check API key and permissions');
        log('3. Verify list ID exists');
      }
    } else {
      logError('Unknown error occurred');
    }
    
    process.exit(1);
  }
}

// Run the task creation if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTask();
}

export default createTask;
