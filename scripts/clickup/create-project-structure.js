#!/usr/bin/env node

/**
 * Create ClickUp project structure
 * Creates list and custom fields for project management
 */

const ClickUpAPI = require('./clickup-api');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function createProjectStructure() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const projectName = process.env.PROJECT_NAME || 'Frontend Project';

  if (!apiKey) {
    log('Error: CLICKUP_API_KEY is required', 'red');
    process.exit(1);
  }

  if (!workspaceId) {
    log('Error: CLICKUP_WORKSPACE_ID is required', 'red');
    process.exit(1);
  }

  log('========================================', 'blue');
  log('  ClickUp Project Structure Setup', 'blue');
  log('========================================', 'blue');
  console.log();

  const api = new ClickUpAPI(apiKey);

  try {
    // Get team/workspace info
    log('Getting workspace information...', 'blue');
    const team = await api.getTeam(workspaceId);
    log(`✓ Connected to workspace: ${team.team.name}`, 'green');
    console.log();

    // Get spaces
    log('Getting spaces...', 'blue');
    const spacesResponse = await api.getSpaces(workspaceId);
    const spaces = spacesResponse.spaces;

    if (spaces.length === 0) {
      log('Error: No spaces found in workspace', 'red');
      process.exit(1);
    }

    // Use first space or create new one
    let space = spaces[0];
    log(`✓ Using space: ${space.name}`, 'green');
    console.log();

    // Get folders in space
    log('Looking for project folder...', 'blue');
    const foldersResponse = await api.getFolders(space.id);
    const folders = foldersResponse.folders || [];
    
    // Look for existing folder with project name
    let folder = folders.find(f => f.name === projectName);
    let folderId;
    
    if (folder) {
      folderId = folder.id;
      log(`✓ Found existing folder: ${projectName}`, 'green');
    } else {
      // Check if CLICKUP_FOLDER_ID is provided in env
      const envFolderId = process.env.CLICKUP_FOLDER_ID;
      
      if (envFolderId) {
        folderId = envFolderId;
        log(`✓ Using folder ID from environment: ${folderId}`, 'green');
      } else {
        // Create new folder
        log('Creating new folder...', 'blue');
        const newFolder = await api.createFolder(space.id, projectName);
        folderId = newFolder.id;
        log(`✓ Created folder: ${projectName}`, 'green');
      }
    }
    
    // Get lists in folder
    log('Getting lists in folder...', 'blue');
    const listsResponse = await api.getLists(folderId);
    const lists = listsResponse.lists || [];
    
    let listId;
    
    if (lists.length > 0) {
      // Use first list in folder (usually the main list)
      listId = lists[0].id;
      log(`✓ Using existing list: ${lists[0].name}`, 'green');
      log(`  Found ${lists.length} list(s) in folder`, 'blue');
    } else {
      // Create new list if folder is empty
      log('Creating list in folder...', 'blue');
      const list = await api.createList(
        folderId,
        'Tasks',
        'Automated project management for frontend development'
      );
      listId = list.id;
      log(`✓ Created list: Tasks`, 'green');
    }

    console.log();

    // Create custom fields
    log('Creating custom fields...', 'blue');

    const customFields = [
      {
        name: 'Feature',
        type: 'drop_down',
        type_config: {
          options: [
            { name: 'auth', color: '#FF6900' },
            { name: 'inventory', color: '#FCB900' },
            { name: 'windows', color: '#7BDCB5' },
            { name: 'shared', color: '#00D084' },
            { name: 'other', color: '#8ED1FC' },
          ],
        },
      },
      {
        name: 'Layer',
        type: 'drop_down',
        type_config: {
          options: [
            { name: 'adapters', color: '#0693E3' },
            { name: 'domain', color: '#ABB8C3' },
            { name: 'ui', color: '#EB144C' },
            { name: 'config', color: '#F78DA7' },
          ],
        },
      },
      {
        name: 'Priority',
        type: 'drop_down',
        type_config: {
          options: [
            { name: 'high', color: '#EB144C' },
            { name: 'medium', color: '#FCB900' },
            { name: 'low', color: '#00D084' },
          ],
        },
      },
      {
        name: 'Estimated Time',
        type: 'short_text',
        type_config: {},
      },
      {
        name: 'Module',
        type: 'short_text',
        type_config: {},
      },
      {
        name: 'Branch',
        type: 'short_text',
        type_config: {},
      },
    ];

    const createdFields = [];

    for (const field of customFields) {
      try {
        const created = await api.createCustomField(listId, field);
        createdFields.push({
          name: field.name,
          id: created.id,
        });
        log(`✓ Created custom field: ${field.name}`, 'green');
      } catch (error) {
        if (error.message.includes('already exists')) {
          log(`⚠ Custom field already exists: ${field.name}`, 'yellow');
        } else {
          log(`✗ Failed to create custom field ${field.name}: ${error.message}`, 'red');
        }
      }
    }

    console.log();

    // Save configuration
    log('Saving configuration...', 'blue');
    
    const config = {
      clickup: {
        workspace_id: workspaceId,
        space_id: space.id,
        list_id: listId,
        custom_fields: createdFields,
        created_at: new Date().toISOString(),
      },
    };

    // Update template-config.json
    const configPath = path.join(process.cwd(), 'template-config.json');
    let templateConfig = {};
    
    if (fs.existsSync(configPath)) {
      templateConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    templateConfig.automation = templateConfig.automation || {};
    templateConfig.automation.clickup = {
      ...templateConfig.automation.clickup,
      ...config.clickup,
      enabled: true,
    };

    fs.writeFileSync(configPath, JSON.stringify(templateConfig, null, 2));
    log(`✓ Updated template-config.json`, 'green');

    // Update .env
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      if (!envContent.includes('CLICKUP_LIST_ID=')) {
        envContent += `\nCLICKUP_LIST_ID=${listId}\n`;
      } else {
        envContent = envContent.replace(
          /CLICKUP_LIST_ID=.*/,
          `CLICKUP_LIST_ID=${listId}`
        );
      }

      if (!envContent.includes('CLICKUP_ENABLED=')) {
        envContent += `CLICKUP_ENABLED=true\n`;
      } else {
        envContent = envContent.replace(
          /CLICKUP_ENABLED=.*/,
          `CLICKUP_ENABLED=true`
        );
      }

      fs.writeFileSync(envPath, envContent);
      log(`✓ Updated .env`, 'green');
    }

    console.log();
    log('========================================', 'blue');
    log('  Setup Complete!', 'green');
    log('========================================', 'blue');
    console.log();

    log('Configuration:', 'blue');
    console.log(`  Workspace: ${team.team.name}`);
    console.log(`  Space: ${space.name}`);
    console.log(`  List: ${projectName}`);
    console.log(`  List ID: ${listId}`);
    console.log();

    log('Custom Fields Created:', 'blue');
    createdFields.forEach(field => {
      console.log(`  - ${field.name} (${field.id})`);
    });
    console.log();

    log('Next steps:', 'blue');
    console.log('1. Create tasks: node scripts/clickup/create-task.js');
    console.log('2. Update tasks: node scripts/clickup/update-task.js');
    console.log('3. View dashboard: node scripts/clickup/update-dashboard.js');
    console.log();

    log('View your list in ClickUp:', 'blue');
    console.log(`https://app.clickup.com/${workspaceId}/v/li/${listId}`);
    console.log();

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createProjectStructure();
}

module.exports = createProjectStructure;
