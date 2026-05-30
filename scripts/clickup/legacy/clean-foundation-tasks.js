#!/usr/bin/env node

/**
 * Clean Foundation tasks - Remove backend tasks, keep only frontend
 * Deletes backend tasks from Foundation list
 */

import ClickUpAPI from './clickup-api.js';
import dotenv from 'dotenv';

dotenv.config();

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function cleanFoundationTasks() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const folderId = process.env.CLICKUP_FOLDER_ID;

  if (!apiKey || !workspaceId || !folderId) {
    log('✗ Missing environment variables', 'red');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    log('========================================', 'blue');
    log('  Cleaning Foundation Tasks', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get lists in folder
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    // Find Foundation list
    const foundationList = allLists.find(list => list.name === 'Foundation');
    
    if (!foundationList) {
      log('✗ Foundation list not found', 'red');
      process.exit(1);
    }

    log(`Using list: ${foundationList.name}`, 'cyan');
    console.log();

    // Get all tasks in Foundation list
    log('Getting tasks in Foundation list...', 'blue');
    const tasksResponse = await api.getTasks(foundationList.id);
    const allTasks = tasksResponse.tasks || [];
    
    log(`Found ${allTasks.length} task(s)`, 'green');
    console.log();

    // Filter backend tasks (those with "Backend" in name or description)
    const backendTasks = allTasks.filter(task => {
      const name = task.name.toLowerCase();
      const description = task.description?.toLowerCase() || '';
      return name.includes('backend') || description.includes('backend');
    });

    const frontendTasks = allTasks.filter(task => {
      const name = task.name.toLowerCase();
      const description = task.description?.toLowerCase() || '';
      return !name.includes('backend') && !description.includes('backend');
    });

    log(`Backend tasks to delete: ${backendTasks.length}`, 'red');
    log(`Frontend tasks to keep: ${frontendTasks.length}`, 'green');
    console.log();

    if (backendTasks.length > 0) {
      log('Backend tasks to delete:', 'yellow');
      backendTasks.forEach(task => {
        console.log(`  - ${task.name} (ID: ${task.id})`);
      });
      console.log();

      // Delete backend tasks
      log('Deleting backend tasks...', 'blue');
      
      let deletedCount = 0;
      let failedCount = 0;

      for (const task of backendTasks) {
        try {
          await api.deleteTask(task.id);
          log(`✓ Deleted: ${task.name}`, 'green');
          deletedCount++;
        } catch (error) {
          log(`✗ Failed to delete "${task.name}": ${error.message}`, 'red');
          failedCount++;
        }
      }

      console.log();
      log(`Deleted: ${deletedCount}`, 'green');
      log(`Failed: ${failedCount}`, failedCount > 0 ? 'red' : 'yellow');
      console.log();
    }

    if (frontendTasks.length > 0) {
      log('Frontend tasks to keep:', 'cyan');
      frontendTasks.forEach(task => {
        console.log(`  ✓ ${task.name} (ID: ${task.id})`);
      });
      console.log();
    }

    // Summary
    log('========================================', 'cyan');
    log('  CLEANING SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log(`Original tasks: ${allTasks.length}`, 'blue');
    log(`Backend tasks deleted: ${backendTasks.length}`, 'red');
    log(`Frontend tasks kept: ${frontendTasks.length}`, 'green');
    log(`Remaining tasks: ${frontendTasks.length}`, 'cyan');
    console.log();

    log('Frontend tasks remaining:', 'blue');
    frontendTasks.forEach(task => {
      console.log(`  - ${task.name}`);
    });
    console.log();

    log('========================================', 'green');
    log('✓ Foundation list cleaned for frontend only!', 'green');
    log('========================================', 'green');
    console.log();

    log('View Foundation list:', 'blue');
    console.log(`https://app.clickup.com/${workspaceId}/v/li/${foundationList.id}`);

  } catch (error) {
    log('========================================', 'red');
    log('  ERROR', 'red');
    log('========================================', 'red');
    console.log();
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanFoundationTasks();
}

export default cleanFoundationTasks;
