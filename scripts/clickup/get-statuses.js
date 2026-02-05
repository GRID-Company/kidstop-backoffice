#!/usr/bin/env node

/**
 * Get available statuses from ClickUp list
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

async function getStatuses() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_LIST_ID;

  if (!apiKey || !listId) {
    log('Error: CLICKUP_API_KEY and CLICKUP_LIST_ID are required', 'red');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    log('Fetching statuses from list...', 'blue');
    const statuses = await api.getStatuses(listId);

    log(`✓ Found ${statuses.length} status(es)`, 'green');
    console.log();

    statuses.forEach((status, index) => {
      console.log(`${index + 1}. ${status.status}`);
      console.log(`   Type: ${status.type}`);
      console.log(`   Color: ${status.color}`);
      console.log();
    });

    log('Use these status names when creating tasks:', 'cyan');
    statuses.forEach(status => {
      console.log(`  --status "${status.status}"`);
    });
    console.log();

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  getStatuses();
}

module.exports = getStatuses;
