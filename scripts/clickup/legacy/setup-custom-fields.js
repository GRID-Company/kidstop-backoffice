#!/usr/bin/env node

/**
 * Setup custom fields for new lists
 * Copy custom fields from existing list to new lists
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

async function setupCustomFields() {
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
    log('  Setting Up Custom Fields', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get all lists in folder
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    log(`Found ${allLists.length} list(s) in folder`, 'green');
    console.log();

    // Find the source list (Iguanas Ranas 1.0.0)
    const sourceList = allLists.find(list => list.name.includes('Iguanas Ranas'));
    
    if (!sourceList) {
      log('✗ Source list not found', 'red');
      process.exit(1);
    }

    log(`Using source list: ${sourceList.name}`, 'cyan');
    console.log();

    // Get custom fields from source list
    log('Getting custom fields from source list...', 'blue');
    const sourceFields = await api.getCustomFields(sourceList.id);
    const customFields = sourceFields.fields || [];
    
    log(`Found ${customFields.length} custom field(s)`, 'green');
    customFields.forEach(field => {
      console.log(`  - ${field.name} (${field.type})`);
    });
    console.log();

    // Get new lists (exclude source list)
    const newLists = allLists.filter(list => !list.name.includes('Iguanas Ranas'));
    
    log(`Setting up custom fields for ${newLists.length} new list(s)...`, 'blue');
    console.log();

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const list of newLists) {
      log(`Processing list: ${list.name}...`, 'blue');
      
      let createdCount = 0;
      let skippedCount = 0;

      // Get existing custom fields for this list
      try {
        const existingFieldsResponse = await api.getCustomFields(list.id);
        const existingFields = existingFieldsResponse.fields || [];
        const existingFieldNames = existingFields.map(f => f.name);

        for (const field of customFields) {
          if (existingFieldNames.includes(field.name)) {
            log(`  ⚠️  Field "${field.name}" already exists, skipping`, 'yellow');
            skippedCount++;
            continue;
          }

          try {
            // Create custom field
            const fieldData = {
              name: field.name,
              type: field.type,
              type_config: field.type_config || {},
              required: field.required || false,
            };

            await api.createCustomField(list.id, fieldData);
            log(`  ✓ Created field: ${field.name}`, 'green');
            createdCount++;
            
          } catch (error) {
            log(`  ✗ Failed to create field "${field.name}": ${error.message}`, 'red');
          }
        }

      } catch (error) {
        log(`  ⚠️  Could not get existing fields for ${list.name}`, 'yellow');
        // Try to create all fields
        for (const field of customFields) {
          try {
            const fieldData = {
              name: field.name,
              type: field.type,
              type_config: field.type_config || {},
              required: field.required || false,
            };

            await api.createCustomField(list.id, fieldData);
            log(`  ✓ Created field: ${field.name}`, 'green');
            createdCount++;
            
          } catch (error) {
            log(`  ✗ Failed to create field "${field.name}": ${error.message}`, 'red');
          }
        }
      }

      log(`  Summary: ${createdCount} created, ${skippedCount} skipped`, 'cyan');
      console.log();

      totalCreated += createdCount;
      totalSkipped += skippedCount;
    }

    // Summary
    log('========================================', 'cyan');
    log('  SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log(`Total custom fields created: ${totalCreated}`, 'green');
    log(`Total custom fields skipped: ${totalSkipped}`, 'yellow');
    console.log();

    log('Lists updated:', 'blue');
    newLists.forEach(list => {
      console.log(`  - ${list.name}`);
    });
    console.log();

    log('========================================', 'green');
    log('✓ Custom fields setup complete!', 'green');
    log('========================================', 'green');

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
  setupCustomFields();
}

export default setupCustomFields;
