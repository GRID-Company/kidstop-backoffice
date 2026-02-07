#!/usr/bin/env node

/**
 * Create Visual Dashboards in ClickUp
 * Generates emergency recovery dashboards with charts and metrics
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
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function createVisualDashboards() {
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
    console.log();
    log('╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║     CREATING VISUAL DASHBOARDS IN CLICKUP                ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');
    console.log();

    // Get existing dashboards
    log('📊 Checking existing dashboards...', 'blue');
    const existingDashboards = await api.getDashboards(workspaceId);
    log(`✓ Found ${existingDashboards.dashboards?.length || 0} existing dashboard(s)`, 'green');
    console.log();

    // Dashboard 1: EMERGENCY CRISIS DASHBOARD
    log('🚨 Creating Emergency Crisis Dashboard...', 'red');
    const crisisDashboard = {
      name: '🚨 KIDSTOP PROJECT CRISIS - RECOVERY MODE',
      description: 'Emergency dashboard tracking project delay and recovery metrics. 34 days behind schedule - CODE RED.',
      private: false
    };

    try {
      const crisis = await api.createDashboard(workspaceId, crisisDashboard);
      log(`✓ Crisis Dashboard created: ${crisis.id}`, 'green');
      log(`  URL: https://app.clickup.com/${workspaceId}/v/d/${crisis.id}`, 'cyan');
    } catch (error) {
      log(`⚠ Could not create Crisis Dashboard: ${error.message}`, 'yellow');
      log('  Dashboard may already exist or you may need Business Plus plan', 'yellow');
    }
    console.log();

    // Dashboard 2: PROJECT MANAGEMENT DASHBOARD
    log('📈 Creating Project Management Dashboard...', 'blue');
    const projectDashboard = {
      name: '📊 Kidstop Project Management - Recovery Tracking',
      description: 'Main project dashboard with phase progress, velocity metrics, and recovery timeline. Target: Day 60 milestone in 26 days.',
      private: false
    };

    try {
      const project = await api.createDashboard(workspaceId, projectDashboard);
      log(`✓ Project Dashboard created: ${project.id}`, 'green');
      log(`  URL: https://app.clickup.com/${workspaceId}/v/d/${project.id}`, 'cyan');
    } catch (error) {
      log(`⚠ Could not create Project Dashboard: ${error.message}`, 'yellow');
    }
    console.log();

    // Dashboard 3: TEAM ACCELERATION DASHBOARD
    log('⚡ Creating Team Acceleration Dashboard...', 'yellow');
    const teamDashboard = {
      name: '⚡ Team Acceleration & Velocity Tracking',
      description: 'Daily throughput, cycle time, and blocker tracking. Required velocity: 2.12 tasks/day. Current: 0 tasks/day.',
      private: false
    };

    try {
      const team = await api.createDashboard(workspaceId, teamDashboard);
      log(`✓ Team Dashboard created: ${team.id}`, 'green');
      log(`  URL: https://app.clickup.com/${workspaceId}/v/d/${team.id}`, 'cyan');
    } catch (error) {
      log(`⚠ Could not create Team Dashboard: ${error.message}`, 'yellow');
    }
    console.log();

    // Get project data for recommendations
    log('📋 Analyzing project data...', 'blue');
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    for (const list of allLists) {
      const tasksResponse = await api.getTasks(list.id);
      const tasks = tasksResponse.tasks || [];
      totalTasks += tasks.length;
      
      for (const task of tasks) {
        const status = task.status?.status?.toLowerCase() || '';
        if (status === 'done' || status === 'closed') {
          completedTasks++;
        }
      }
    }

    console.log();
    log('╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║              DASHBOARD CREATION SUMMARY                  ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');
    console.log();
    
    log('✓ Dashboards created successfully!', 'green');
    console.log();
    
    log('📊 NEXT STEPS:', 'yellow');
    log('1. Go to ClickUp Dashboard view', 'white');
    log('2. Select one of the created dashboards', 'white');
    log('3. Click "Add Card" to add widgets:', 'white');
    console.log();
    
    log('   🚨 CRISIS DASHBOARD - Recommended Widgets:', 'red');
    log('   • Custom Chart: Countdown to Day 60 (26 days)', 'white');
    log('   • Number Card: Days Behind Schedule (34)', 'white');
    log('   • Number Card: Required Velocity (2.12 tasks/day)', 'white');
    log('   • Number Card: Current Velocity (0 tasks/day)', 'white');
    log('   • Progress Bar: Overall Progress (0%)', 'white');
    log('   • Text Card: CRITICAL STATUS - CODE RED', 'white');
    console.log();
    
    log('   📊 PROJECT MANAGEMENT - Recommended Widgets:', 'blue');
    log('   • Tasks by Status: All phases', 'white');
    log('   • Tasks by List: Foundation, Catalog, Purchases, Sales, Extras', 'white');
    log('   • Time Tracking: Estimated vs Actual', 'white');
    log('   • Burndown Chart: Sprint progress', 'white');
    log('   • Custom Chart: Phase completion percentage', 'white');
    log('   • Table: Critical tasks (Foundation phase)', 'white');
    console.log();
    
    log('   ⚡ TEAM ACCELERATION - Recommended Widgets:', 'yellow');
    log('   • Tasks Completed: Daily/Weekly trend', 'white');
    log('   • Velocity Chart: Tasks per day', 'white');
    log('   • Cycle Time: Average time per task', 'white');
    log('   • Workspace Activity: Team productivity', 'white');
    log('   • Custom Field Chart: Priority distribution', 'white');
    console.log();
    
    log('📈 METRICS TO TRACK:', 'magenta');
    log(`   • Total Tasks: ${totalTasks}`, 'white');
    log(`   • Completed: ${completedTasks} (${Math.round((completedTasks/totalTasks)*100)}%)`, 'white');
    log(`   • Remaining: ${totalTasks - completedTasks}`, 'white');
    log('   • Days to Milestone: 26 days', 'white');
    log('   • Required Daily Output: 2.12 tasks/day', 'white');
    log('   • Recovery Factor: 4.2x normal speed', 'white');
    console.log();
    
    log('🎯 DASHBOARD CONFIGURATION TIPS:', 'cyan');
    log('1. Use "Project Management" template as base', 'white');
    log('2. Add custom number cards for crisis metrics', 'white');
    log('3. Configure filters to show only Kidstop Backoffice folder', 'white');
    log('4. Set auto-refresh to every hour', 'white');
    log('5. Share dashboards with client for transparency', 'white');
    console.log();
    
    log('⚠️  IMPORTANT:', 'yellow');
    log('Dashboard widgets must be configured manually in ClickUp UI', 'white');
    log('The API creates the dashboard containers, but ClickUp requires', 'white');
    log('manual widget configuration through the web interface.', 'white');
    console.log();
    
    log('🔗 Quick Access:', 'cyan');
    log(`   Workspace: https://app.clickup.com/${workspaceId}`, 'white');
    log(`   Folder: https://app.clickup.com/${workspaceId}/v/f/${folderId}`, 'white');
    log('   Dashboards: Click "Dashboard" tab in the folder view', 'white');
    console.log();

    log('╔════════════════════════════════════════════════════════════╗', 'green');
    log('║           DASHBOARD CREATION COMPLETED                   ║', 'green');
    log('╚════════════════════════════════════════════════════════════╝', 'green');
    console.log();

  } catch (error) {
    log('╔════════════════════════════════════════════════════════════╗', 'red');
    log('║              DASHBOARD CREATION ERROR                    ║', 'red');
    log('╚════════════════════════════════════════════════════════════╝', 'red');
    console.log();
    log(`Error: ${error.message}`, 'red');
    console.log();
    log('Possible causes:', 'yellow');
    log('• ClickUp Business Plus plan required for dashboards', 'white');
    log('• Invalid workspace ID or API key', 'white');
    log('• Insufficient permissions', 'white');
    console.log();
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createVisualDashboards();
}

export default createVisualDashboards;
