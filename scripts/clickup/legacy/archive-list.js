#!/usr/bin/env node

/**
 * Archive a list in ClickUp
 * Archives the specified list to hide it from active view
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

async function archiveList() {
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
    log('  Archiving Iguanas Ranas List', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get lists in folder
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    // Find Iguanas Ranas list
    const iguanasList = allLists.find(list => list.name.includes('Iguanas Ranas'));
    
    if (!iguanasList) {
      log('✗ Iguanas Ranas list not found', 'red');
      process.exit(1);
    }

    log(`Found list: ${iguanasList.name}`, 'cyan');
    log(`Tasks: ${iguanasList.task_count || 0}`, 'yellow');
    console.log();

    // Archive the list
    log('Archiving list...', 'blue');
    
    const archiveData = {
      archived: true
    };

    const response = await api.updateList(iguanasList.id, archiveData);
    
    log(`✓ Archived: ${iguanasList.name}`, 'green');
    console.log();

    log('========================================', 'cyan');
    log('  ARCHIVE COMPLETE', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log('The list has been archived and will no longer appear in active view.', 'blue');
    console.log();

    log('View folder:', 'blue');
    console.log(`https://app.clickup.com/${workspaceId}/v/f/${folderId}`);

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
  archiveList();
}

export default archiveList;
