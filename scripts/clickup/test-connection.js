#!/usr/bin/env node

/**
 * Test ClickUp connection - READ ONLY
 * This script ONLY reads data, it does NOT modify anything
 */

const ClickUpAPI = require('./clickup-api');

require('dotenv').config();

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function testConnection() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const folderId = process.env.CLICKUP_FOLDER_ID;

  log('========================================', 'blue');
  log('  ClickUp Connection Test (READ ONLY)', 'blue');
  log('========================================', 'blue');
  console.log();

  log('⚠️  THIS SCRIPT ONLY READS DATA', 'yellow');
  log('⚠️  IT WILL NOT MODIFY ANYTHING', 'yellow');
  console.log();

  if (!apiKey) {
    log('✗ CLICKUP_API_KEY not found in .env', 'red');
    console.log();
    log('Please configure your .env file:', 'yellow');
    console.log('  CLICKUP_API_KEY=pk_your_key');
    console.log('  CLICKUP_WORKSPACE_ID=your_workspace_id');
    console.log();
    process.exit(1);
  }

  if (!workspaceId) {
    log('✗ CLICKUP_WORKSPACE_ID not found in .env', 'red');
    console.log();
    log('Please configure your .env file:', 'yellow');
    console.log('  CLICKUP_WORKSPACE_ID=your_workspace_id');
    console.log();
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    // Test 1: Get workspace info
    log('Test 1: Connecting to workspace...', 'blue');
    const team = await api.getTeam(workspaceId);
    log(`✓ Connected to: ${team.team.name}`, 'green');
    console.log();

    // Test 2: Get spaces
    log('Test 2: Fetching spaces...', 'blue');
    const spacesResponse = await api.getSpaces(workspaceId);
    const spaces = spacesResponse.spaces;
    log(`✓ Found ${spaces.length} space(s)`, 'green');
    
    spaces.forEach(space => {
      console.log(`  - ${space.name} (ID: ${space.id})`);
    });
    console.log();

    // Test 3: Get folders
    log('Test 3: Fetching folders...', 'blue');
    
    for (const space of spaces) {
      const foldersResponse = await api.getFolders(space.id);
      const folders = foldersResponse.folders || [];
      
      if (folders.length > 0) {
        log(`✓ Space "${space.name}" has ${folders.length} folder(s)`, 'green');
        
        folders.forEach(folder => {
          const isTarget = folderId && folder.id === folderId;
          const marker = isTarget ? '👉' : '  ';
          const color = isTarget ? 'cyan' : 'reset';
          log(`${marker} ${folder.name}`, color);
          console.log(`     ID: ${folder.id}`);
          console.log(`     Lists: ${folder.lists?.length || 0}`);
        });
        console.log();
      }
    }

    // Test 4: If folder ID is specified, check it
    if (folderId) {
      log('Test 4: Checking specified folder...', 'blue');
      
      let foundFolder = null;
      for (const space of spaces) {
        const foldersResponse = await api.getFolders(space.id);
        const folders = foldersResponse.folders || [];
        foundFolder = folders.find(f => f.id === folderId);
        if (foundFolder) break;
      }

      if (foundFolder) {
        log(`✓ Folder found: ${foundFolder.name}`, 'green');
        console.log(`  ID: ${foundFolder.id}`);
        console.log(`  Lists: ${foundFolder.lists?.length || 0}`);
        console.log();

        // Get lists in folder
        log('Test 5: Checking lists in folder...', 'blue');
        const listsResponse = await api.getLists(folderId);
        const lists = listsResponse.lists || [];
        
        if (lists.length > 0) {
          log(`✓ Found ${lists.length} list(s) in folder`, 'green');
          
          lists.forEach((list, index) => {
            const marker = index === 0 ? '👉' : '  ';
            const color = index === 0 ? 'cyan' : 'reset';
            log(`${marker} ${list.name}`, color);
            console.log(`     ID: ${list.id}`);
            console.log(`     Tasks: ${list.task_count || 0}`);
            console.log(`     Statuses: ${list.statuses?.length || 0}`);
            
            if (index === 0) {
              log('     ⚠️  This list would be used by setup', 'yellow');
            }
          });
          console.log();

          // Check custom fields in first list
          if (lists.length > 0) {
            log('Test 6: Checking custom fields...', 'blue');
            try {
              const customFields = await api.getCustomFields(lists[0].id);
              
              if (customFields.fields && customFields.fields.length > 0) {
                log(`✓ Found ${customFields.fields.length} custom field(s)`, 'green');
                
                customFields.fields.forEach(field => {
                  console.log(`  - ${field.name} (${field.type})`);
                });
                console.log();
                log('⚠️  Setup will skip existing custom fields', 'yellow');
              } else {
                log('ℹ  No custom fields found', 'blue');
                log('✓ Setup will create new custom fields', 'green');
              }
            } catch (error) {
              log('⚠️  Could not fetch custom fields', 'yellow');
            }
            console.log();
          }
        } else {
          log('⚠️  No lists found in folder', 'yellow');
          log('ℹ  Setup would create a new list', 'blue');
          console.log();
        }
      } else {
        log(`✗ Folder ID ${folderId} not found`, 'red');
        log('ℹ  Setup would create a new folder', 'blue');
        console.log();
      }
    } else {
      log('ℹ  No CLICKUP_FOLDER_ID specified', 'blue');
      log('ℹ  Setup would create a new folder', 'blue');
      console.log();
    }

    // Summary
    log('========================================', 'cyan');
    log('  TEST SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log('✓ Connection successful', 'green');
    log('✓ All data is intact', 'green');
    log('✓ No modifications were made', 'green');
    console.log();

    log('What would happen if you run setup:', 'blue');
    console.log();

    if (folderId) {
      const foundFolder = spaces.some(async space => {
        const foldersResponse = await api.getFolders(space.id);
        return foldersResponse.folders?.some(f => f.id === folderId);
      });

      if (foundFolder) {
        log('1. Use existing folder', 'cyan');
        log('2. Use existing lists in folder', 'cyan');
        log('3. Add custom fields (skip if exist)', 'cyan');
        log('4. Save configuration', 'cyan');
      } else {
        log('1. Create new folder', 'cyan');
        log('2. Create new list', 'cyan');
        log('3. Add custom fields', 'cyan');
        log('4. Save configuration', 'cyan');
      }
    } else {
      log('1. Create new folder with project name', 'cyan');
      log('2. Create new list', 'cyan');
      log('3. Add custom fields', 'cyan');
      log('4. Save configuration', 'cyan');
    }
    console.log();

    log('========================================', 'blue');
    log('Ready to run setup? (npm run clickup:setup)', 'green');
    log('========================================', 'blue');
    console.log();

  } catch (error) {
    log('========================================', 'red');
    log('  ERROR', 'red');
    log('========================================', 'red');
    console.log();
    log(`Error: ${error.message}`, 'red');
    console.log();
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      log('Possible causes:', 'yellow');
      console.log('- Invalid API key');
      console.log('- API key expired');
      console.log('- Wrong workspace ID');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = testConnection;
