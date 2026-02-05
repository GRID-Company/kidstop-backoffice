#!/usr/bin/env node

/**
 * Create task in ClickUp
 * Usage: node scripts/clickup/create-task.js --title "Task name" --feature "auth" --priority "high"
 */

const ClickUpAPI = require('./clickup-api');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    parsed[key] = value;
  }

  return parsed;
}

async function createTask() {
  const args = parseArgs();

  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_LIST_ID;

  if (!apiKey) {
    log('Error: CLICKUP_API_KEY is required', 'red');
    process.exit(1);
  }

  if (!listId) {
    log('Error: CLICKUP_LIST_ID is required. Run setup first.', 'red');
    process.exit(1);
  }

  if (!args.title) {
    log('Error: --title is required', 'red');
    console.log();
    console.log('Usage:');
    console.log('  node scripts/clickup/create-task.js --title "Task name" [options]');
    console.log();
    console.log('Options:');
    console.log('  --title        Task title (required)');
    console.log('  --description  Task description');
    console.log('  --feature      Feature name (auth, inventory, windows, shared, other)');
    console.log('  --layer        Layer name (adapters, domain, ui, config)');
    console.log('  --priority     Priority (high, medium, low)');
    console.log('  --status       Status (to do, in progress, done)');
    console.log('  --time         Estimated time (e.g., "2h", "1d")');
    console.log('  --module       Module name');
    console.log();
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    log('Creating task in ClickUp...', 'blue');

    // Load custom field IDs from config
    const configPath = path.join(process.cwd(), 'template-config.json');
    let customFieldIds = {};

    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.automation?.clickup?.custom_fields) {
        config.automation.clickup.custom_fields.forEach(field => {
          customFieldIds[field.name.toLowerCase()] = field.id;
        });
      }
    }

    // Prepare custom fields
    const customFields = [];

    if (args.feature && customFieldIds.feature) {
      customFields.push({
        id: customFieldIds.feature,
        value: args.feature,
      });
    }

    if (args.layer && customFieldIds.layer) {
      customFields.push({
        id: customFieldIds.layer,
        value: args.layer,
      });
    }

    if (args.priority && customFieldIds.priority) {
      customFields.push({
        id: customFieldIds.priority,
        value: args.priority,
      });
    }

    if (args.time && customFieldIds['estimated time']) {
      customFields.push({
        id: customFieldIds['estimated time'],
        value: args.time,
      });
    }

    if (args.module && customFieldIds.module) {
      customFields.push({
        id: customFieldIds.module,
        value: args.module,
      });
    }

    // Create task
    const taskData = {
      name: args.title,
      description: args.description || '',
      status: args.status || 'to do',
      customFields,
    };

    const task = await api.createTask(listId, taskData);

    log('✓ Task created successfully!', 'green');
    console.log();
    console.log('Task Details:');
    console.log(`  ID: ${task.id}`);
    console.log(`  Name: ${task.name}`);
    console.log(`  Status: ${task.status.status}`);
    console.log(`  URL: ${task.url}`);
    console.log();

    if (args.feature) console.log(`  Feature: ${args.feature}`);
    if (args.layer) console.log(`  Layer: ${args.layer}`);
    if (args.priority) console.log(`  Priority: ${args.priority}`);
    if (args.time) console.log(`  Estimated Time: ${args.time}`);
    if (args.module) console.log(`  Module: ${args.module}`);
    console.log();

    log('View task in ClickUp:', 'blue');
    console.log(task.url);
    console.log();

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  createTask();
}

module.exports = createTask;
