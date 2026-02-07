#!/usr/bin/env node

/**
 * Create additional lists for Kidstop Backoffice project
 * Creates the structured lists according to the implementation plan
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

async function createAdditionalLists() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const folderId = process.env.CLICKUP_FOLDER_ID;

  if (!apiKey || !workspaceId || !folderId) {
    log('✗ Missing environment variables', 'red');
    log('Required: CLICKUP_API_KEY, CLICKUP_WORKSPACE_ID, CLICKUP_FOLDER_ID', 'yellow');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    log('========================================', 'blue');
    log('  Creating Additional Lists for Kidstop', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get current lists to avoid duplicates
    log('Checking existing lists...', 'blue');
    const listsResponse = await api.getLists(folderId);
    const existingLists = listsResponse.lists || [];
    const existingListNames = existingLists.map(list => list.name);
    
    log(`Found ${existingLists.length} existing list(s)`, 'green');
    existingLists.forEach(list => {
      console.log(`  - ${list.name} (ID: ${list.id})`);
    });
    console.log();

    // Define the lists to create
    const listsToCreate = [
      { name: 'Setup', description: 'Configuration and project setup' },
      { name: 'Foundation', description: 'Base components and architecture (Phase 1)' },
      { name: 'Catalog', description: 'Cards catalog and inventory (Phase 2)' },
      { name: 'Purchases', description: 'Buylist and negotiation flow (Phase 3)' },
      { name: 'Sales', description: 'Sales and customer management (Phase 4)' },
      { name: 'Extras', description: 'Additional features (Phase 5)' },
    ];

    log('Creating new lists...', 'blue');
    console.log();

    const createdLists = [];
    const skippedLists = [];

    for (const listConfig of listsToCreate) {
      if (existingListNames.includes(listConfig.name)) {
        log(`⚠️  List "${listConfig.name}" already exists, skipping`, 'yellow');
        skippedLists.push(listConfig.name);
        continue;
      }

      try {
        log(`Creating list: ${listConfig.name}...`, 'blue');
        
        const listResponse = await api.createList(
          folderId, 
          listConfig.name, 
          listConfig.description
        );

        const newList = listResponse.list;
        createdLists.push({
          name: newList.name,
          id: newList.id,
          description: listConfig.description,
        });

        log(`✓ Created: ${newList.name} (ID: ${newList.id})`, 'green');
        console.log(`  Description: ${listConfig.description}`);
        console.log();

      } catch (error) {
        log(`✗ Failed to create "${listConfig.name}": ${error.message}`, 'red');
      }
    }

    // Summary
    log('========================================', 'cyan');
    log('  SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    if (createdLists.length > 0) {
      log(`✓ Created ${createdLists.length} new list(s)`, 'green');
      createdLists.forEach(list => {
        console.log(`  - ${list.name} (ID: ${list.id})`);
      });
      console.log();
    }

    if (skippedLists.length > 0) {
      log(`⚠️  Skipped ${skippedLists.length} existing list(s)`, 'yellow');
      skippedLists.forEach(name => {
        console.log(`  - ${name}`);
      });
      console.log();
    }

    log('Total lists in folder:', 'blue');
    const finalListsResponse = await api.getLists(folderId);
    const finalLists = finalListsResponse.lists || [];
    log(`${finalLists.length} lists`, 'green');
    
    finalLists.forEach((list, index) => {
      const isNew = createdLists.some(cl => cl.id === list.id);
      const marker = isNew ? '🆕' : '  ';
      console.log(`${marker} ${list.name} (ID: ${list.id})`);
    });
    console.log();

    log('========================================', 'green');
    log('✓ Additional lists setup complete!', 'green');
    log('========================================', 'green');
    console.log();

    log('Next steps:', 'blue');
    console.log('1. Create tasks in the appropriate lists');
    console.log('2. Move existing tasks if needed');
    console.log('3. Set up custom fields for new lists');
    console.log();

    log('Folder URL:', 'blue');
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
  createAdditionalLists();
}

export default createAdditionalLists;
