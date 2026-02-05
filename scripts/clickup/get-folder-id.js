#!/usr/bin/env node

/**
 * Get folder ID from ClickUp
 * Helps find the folder ID for existing projects
 */

const ClickUpAPI = require('./clickup-api');

require('dotenv').config();

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function getFolderId() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

  if (!apiKey) {
    log('Error: CLICKUP_API_KEY is required', 'red');
    process.exit(1);
  }

  if (!workspaceId) {
    log('Error: CLICKUP_WORKSPACE_ID is required', 'red');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    log('========================================', 'blue');
    log('  ClickUp Folder Finder', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get spaces
    log('Fetching spaces...', 'blue');
    const spacesResponse = await api.getSpaces(workspaceId);
    const spaces = spacesResponse.spaces;

    if (spaces.length === 0) {
      log('No spaces found', 'red');
      process.exit(1);
    }

    log(`✓ Found ${spaces.length} space(s)`, 'green');
    console.log();

    // List all folders in all spaces
    for (const space of spaces) {
      log(`📁 Space: ${space.name}`, 'cyan');
      console.log();

      const foldersResponse = await api.getFolders(space.id);
      const folders = foldersResponse.folders || [];

      if (folders.length === 0) {
        log('  No folders in this space', 'blue');
        console.log();
        continue;
      }

      folders.forEach(folder => {
        console.log(`  📂 ${folder.name}`);
        console.log(`     ID: ${folder.id}`);
        console.log(`     Lists: ${folder.lists?.length || 0}`);
        console.log();
      });
    }

    log('========================================', 'blue');
    log('To use a folder, add to your .env:', 'green');
    console.log('CLICKUP_FOLDER_ID=<folder_id>');
    console.log();

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  getFolderId();
}

module.exports = getFolderId;
