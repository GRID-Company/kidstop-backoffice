#!/usr/bin/env node

/**
 * Update task in ClickUp
 * Usage: node scripts/clickup/update-task.js --task TASK_ID --status "in progress"
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

async function updateTask() {
  const args = parseArgs();

  const apiKey = process.env.CLICKUP_API_KEY;

  if (!apiKey) {
    log('Error: CLICKUP_API_KEY is required', 'red');
    process.exit(1);
  }

  if (!args.task) {
    log('Error: --task is required', 'red');
    console.log();
    console.log('Usage:');
    console.log('  node scripts/clickup/update-task.js --task TASK_ID [options]');
    console.log();
    console.log('Options:');
    console.log('  --task         Task ID (required)');
    console.log('  --status       New status (to do, in progress, done)');
    console.log('  --name         New task name');
    console.log('  --description  New description');
    console.log('  --feature      Feature name');
    console.log('  --layer        Layer name');
    console.log('  --priority     Priority');
    console.log('  --branch       Branch name');
    console.log('  --comment      Add comment to task');
    console.log();
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    log('Updating task in ClickUp...', 'blue');

    const taskId = args.task;
    const updates = {};

    // Basic updates
    if (args.status) updates.status = args.status;
    if (args.name) updates.name = args.name;
    if (args.description) updates.description = args.description;

    // Update basic fields if provided
    if (Object.keys(updates).length > 0) {
      await api.updateTask(taskId, updates);
      log('✓ Task updated', 'green');
    }

    // Update custom fields
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

    if (args.feature && customFieldIds.feature) {
      await api.setCustomFieldValue(taskId, customFieldIds.feature, args.feature);
      log('✓ Updated feature', 'green');
    }

    if (args.layer && customFieldIds.layer) {
      await api.setCustomFieldValue(taskId, customFieldIds.layer, args.layer);
      log('✓ Updated layer', 'green');
    }

    if (args.priority && customFieldIds.priority) {
      await api.setCustomFieldValue(taskId, customFieldIds.priority, args.priority);
      log('✓ Updated priority', 'green');
    }

    if (args.branch && customFieldIds.branch) {
      await api.setCustomFieldValue(taskId, customFieldIds.branch, args.branch);
      log('✓ Updated branch', 'green');
    }

    // Add comment if provided
    if (args.comment) {
      await api.addComment(taskId, args.comment);
      log('✓ Comment added', 'green');
    }

    // Get updated task
    const task = await api.getTask(taskId);

    console.log();
    console.log('Updated Task:');
    console.log(`  ID: ${task.id}`);
    console.log(`  Name: ${task.name}`);
    console.log(`  Status: ${task.status.status}`);
    console.log(`  URL: ${task.url}`);
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
  updateTask();
}

module.exports = updateTask;
