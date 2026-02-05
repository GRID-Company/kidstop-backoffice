#!/usr/bin/env node

/**
 * Update ClickUp dashboard with project metrics
 * Generates report with task statistics and progress
 */

const ClickUpAPI = require('./clickup-api');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

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

function getGitStats() {
  try {
    const totalCommits = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    const recentCommits = execSync('git rev-list --count HEAD --since="1 week ago"', { encoding: 'utf8' }).trim();
    const contributors = execSync('git log --format="%an" | sort -u | wc -l', { encoding: 'utf8' }).trim();
    const lastCommit = execSync('git log -1 --format="%ar"', { encoding: 'utf8' }).trim();
    
    return {
      totalCommits: parseInt(totalCommits),
      recentCommits: parseInt(recentCommits),
      contributors: parseInt(contributors),
      lastCommit,
    };
  } catch (error) {
    return {
      totalCommits: 0,
      recentCommits: 0,
      contributors: 0,
      lastCommit: 'N/A',
    };
  }
}

function calculateVelocity(tasks) {
  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  const completedLastWeek = tasks.filter(task => {
    if (task.status.status.toLowerCase() === 'done' && task.date_closed) {
      return parseInt(task.date_closed) > oneWeekAgo;
    }
    return false;
  });

  return completedLastWeek.length;
}

async function updateDashboard() {
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

  log('========================================', 'blue');
  log('  ClickUp Dashboard Update', 'blue');
  log('========================================', 'blue');
  console.log();

  const api = new ClickUpAPI(apiKey);

  try {
    // Get all tasks
    log('Fetching tasks from ClickUp...', 'blue');
    const response = await api.getTasks(listId, {
      includeClosed: true,
      subtasks: true,
    });

    const tasks = response.tasks || [];
    log(`✓ Fetched ${tasks.length} tasks`, 'green');
    console.log();

    // Calculate metrics
    log('Calculating metrics...', 'blue');

    const statusCounts = {
      'to do': 0,
      'in progress': 0,
      'done': 0,
      'other': 0,
    };

    const featureCounts = {};
    const layerCounts = {};
    const priorityCounts = {
      high: 0,
      medium: 0,
      low: 0,
      none: 0,
    };

    tasks.forEach(task => {
      // Count by status
      const status = task.status.status.toLowerCase();
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      } else {
        statusCounts.other++;
      }

      // Count by custom fields
      if (task.custom_fields) {
        task.custom_fields.forEach(field => {
          const fieldName = field.name.toLowerCase();
          const value = field.value;

          if (fieldName === 'feature' && value) {
            featureCounts[value] = (featureCounts[value] || 0) + 1;
          }

          if (fieldName === 'layer' && value) {
            layerCounts[value] = (layerCounts[value] || 0) + 1;
          }

          if (fieldName === 'priority' && value) {
            priorityCounts[value] = (priorityCounts[value] || 0) + 1;
          }
        });
      }

      // Count priority from task priority field
      if (!task.custom_fields?.find(f => f.name.toLowerCase() === 'priority')) {
        if (task.priority) {
          const priority = task.priority.priority.toLowerCase();
          if (priorityCounts[priority] !== undefined) {
            priorityCounts[priority]++;
          }
        } else {
          priorityCounts.none++;
        }
      }
    });

    const totalTasks = tasks.length;
    const completedTasks = statusCounts.done;
    const inProgressTasks = statusCounts['in progress'];
    const todoTasks = statusCounts['to do'];
    const progressPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    // Get git stats
    const gitStats = getGitStats();

    // Calculate velocity
    const velocity = calculateVelocity(tasks);

    log('✓ Metrics calculated', 'green');
    console.log();

    // Display dashboard
    log('========================================', 'cyan');
    log('  PROJECT DASHBOARD', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log('📊 Task Overview', 'blue');
    console.log(`  Total Tasks: ${totalTasks}`);
    console.log(`  ✅ Done: ${completedTasks}`);
    console.log(`  🔄 In Progress: ${inProgressTasks}`);
    console.log(`  📋 To Do: ${todoTasks}`);
    console.log(`  📈 Progress: ${progressPercentage}%`);
    console.log();

    log('🎯 By Priority', 'blue');
    console.log(`  🔴 High: ${priorityCounts.high}`);
    console.log(`  🟡 Medium: ${priorityCounts.medium}`);
    console.log(`  🟢 Low: ${priorityCounts.low}`);
    console.log(`  ⚪ None: ${priorityCounts.none}`);
    console.log();

    if (Object.keys(featureCounts).length > 0) {
      log('🎨 By Feature', 'blue');
      Object.entries(featureCounts).forEach(([feature, count]) => {
        console.log(`  ${feature}: ${count}`);
      });
      console.log();
    }

    if (Object.keys(layerCounts).length > 0) {
      log('📦 By Layer', 'blue');
      Object.entries(layerCounts).forEach(([layer, count]) => {
        console.log(`  ${layer}: ${count}`);
      });
      console.log();
    }

    log('⚡ Velocity', 'blue');
    console.log(`  Tasks completed last week: ${velocity}`);
    console.log(`  Average per day: ${(velocity / 7).toFixed(1)}`);
    console.log();

    log('📝 Git Statistics', 'blue');
    console.log(`  Total Commits: ${gitStats.totalCommits}`);
    console.log(`  Commits (last week): ${gitStats.recentCommits}`);
    console.log(`  Contributors: ${gitStats.contributors}`);
    console.log(`  Last Commit: ${gitStats.lastCommit}`);
    console.log();

    // Generate JSON report
    const report = {
      generated_at: new Date().toISOString(),
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        in_progress: inProgressTasks,
        todo: todoTasks,
        progress_percentage: parseFloat(progressPercentage),
      },
      priority: priorityCounts,
      features: featureCounts,
      layers: layerCounts,
      velocity: {
        tasks_per_week: velocity,
        tasks_per_day: parseFloat((velocity / 7).toFixed(1)),
      },
      git: gitStats,
    };

    // Save report
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const reportPath = path.join(reportsDir, 'clickup-dashboard.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    log(`✓ Report saved to: ${reportPath}`, 'green');
    console.log();

    log('========================================', 'cyan');
    console.log();

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  updateDashboard();
}

module.exports = updateDashboard;
