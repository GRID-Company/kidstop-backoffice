#!/usr/bin/env node

/**
 * Create Project Dashboard
 * Generates a comprehensive dashboard with project metrics and visualizations
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
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function drawProgressBar(current, total, width = 30, color = 'green') {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((width * current) / total);
  const empty = width - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  return `${COLORS[color]}[${filledBar}${emptyBar}]${COLORS.reset} ${percentage}% (${current}/${total})`;
}

function drawBox(content, title = '', color = 'cyan') {
  const lines = content.split('\n');
  const maxLength = Math.max(...lines.map(line => line.replace(/\x1b\[[0-9;]*m/g, '').length), title.length);
  const border = '─'.repeat(maxLength + 4);
  
  console.log(`${COLORS[color]}┌─ ${title.padEnd(maxLength)} ─┐${COLORS.reset}`);
  lines.forEach(line => {
    console.log(`${COLORS[color]}│ ${line.padEnd(maxLength)} │${COLORS.reset}`);
  });
  console.log(`${COLORS[color]}└─${border}┘${COLORS.reset}`);
}

async function createDashboard() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const folderId = process.env.CLICKUP_FOLDER_ID;

  if (!apiKey || !workspaceId || !folderId) {
    log('✗ Missing environment variables', 'red');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    // Clear screen for better visualization
    console.clear();
    
    log('╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                                    KIDSTOP BACKOFFICE PROJECT DASHBOARD                                    ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝', 'cyan');
    console.log();

    // Get project data
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    // Phase definitions
    const phases = [
      { name: 'Foundation', list: allLists.find(l => l.name === 'Foundation'), color: 'green' },
      { name: 'Catalog', list: allLists.find(l => l.name === 'Catalog'), color: 'blue' },
      { name: 'Purchases', list: allLists.find(l => l.name === 'Purchases'), color: 'yellow' },
      { name: 'Sales', list: allLists.find(l => l.name === 'Sales'), color: 'magenta' },
      { name: 'Extras', list: allLists.find(l => l.name === 'Extras'), color: 'cyan' }
    ];

    // Collect all task data
    const projectData = {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
      phases: [],
      tags: {},
      priorities: { high: 0, medium: 0, low: 0 },
      estimatedHours: 0
    };

    // Process each phase
    for (const phase of phases) {
      if (!phase.list) continue;

      const tasksResponse = await api.getTasks(phase.list.id);
      const tasks = tasksResponse.tasks || [];
      
      const phaseData = {
        name: phase.name,
        total: tasks.length,
        completed: 0,
        inProgress: 0,
        todo: tasks.length, // All tasks start as TODO
        estimatedSP: 0,
        tags: {},
        priorities: { high: 0, medium: 0, low: 0 }
      };

      // Process tasks in this phase
      for (const task of tasks) {
        projectData.totalTasks++;
        
        // Count by status
        if (task.status?.status === 'done' || task.status?.status === 'Closed') {
          phaseData.completed++;
          projectData.completedTasks++;
        } else if (task.status?.status === 'in progress') {
          phaseData.inProgress++;
          projectData.inProgressTasks++;
        } else {
          phaseData.todo++;
          projectData.todoTasks++;
        }

        // Count tags
        if (task.tags) {
          for (const tag of task.tags) {
            phaseData.tags[tag] = (phaseData.tags[tag] || 0) + 1;
            projectData.tags[tag] = (projectData.tags[tag] || 0) + 1;
          }
        }

        // Count priorities (from description or tags)
        const description = task.description?.toLowerCase() || '';
        if (description.includes('priority: high') || task.tags?.includes('high')) {
          phaseData.priorities.high++;
          projectData.priorities.high++;
        } else if (description.includes('priority: medium') || task.tags?.includes('medium')) {
          phaseData.priorities.medium++;
          projectData.priorities.medium++;
        } else if (description.includes('priority: low') || task.tags?.includes('low')) {
          phaseData.priorities.low++;
          projectData.priorities.low++;
        }

        // Extract SP from description
        const spMatch = description.match(/estimaci[óo]n: (\d+) sp/i);
        if (spMatch) {
          const sp = parseInt(spMatch[1]);
          phaseData.estimatedSP += sp;
          projectData.estimatedHours += sp; // Assuming 1 SP = 1 hour for estimation
        }
      }

      projectData.phases.push(phaseData);
    }

    // PROJECT OVERVIEW SECTION
    log('📊 PROJECT OVERVIEW', 'white');
    console.log();
    
    const overviewContent = [
      `Total Tasks: ${projectData.totalTasks}`,
      `Completed: ${projectData.completedTasks}`,
      `In Progress: ${projectData.inProgressTasks}`,
      `To Do: ${projectData.todoTasks}`,
      ``,
      `Completion Rate: ${Math.round((projectData.completedTasks / projectData.totalTasks) * 100)}%`,
      `Estimated Hours: ${projectData.estimatedHours}`,
      `Active Phases: ${projectData.phases.length}/5`
    ];
    
    drawBox(overviewContent.join('\n'), 'Project Metrics', 'cyan');
    console.log();

    // PROGRESS VISUALIZATION
    log('📈 OVERALL PROGRESS', 'white');
    console.log();
    
    const overallProgress = drawProgressBar(projectData.completedTasks, projectData.totalTasks, 50, 'green');
    console.log(`Overall Completion: ${overallProgress}`);
    console.log();

    // PHASE BREAKDOWN
    log('🎯 PHASE BREAKDOWN', 'white');
    console.log();

    for (const phase of projectData.phases) {
      const phaseColor = phases.find(p => p.name === phase.name)?.color || 'white';
      const progress = phase.total > 0 ? drawProgressBar(phase.completed, phase.total, 30, phaseColor) : 'No tasks';
      
      const phaseInfo = [
        `${phase.name}: ${phase.total} tasks`,
        `Progress: ${progress}`,
        `Completed: ${phase.completed} | In Progress: ${phase.inProgress} | To Do: ${phase.todo}`,
        `Estimated: ${phase.estimatedSP} SP`,
        `Priorities: H:${phase.priorities.high} M:${phase.priorities.medium} L:${phase.priorities.low}`
      ];
      
      drawBox(phaseInfo.join('\n'), phase.name, phaseColor);
      console.log();
    }

    // TAG ANALYSIS
    log('🏷️  TAG ANALYSIS', 'white');
    console.log();

    const tagLines = Object.entries(projectData.tags)
      .sort(([,a], [,b]) => b - a)
      .map(([tag, count]) => {
        const percentage = Math.round((count / projectData.totalTasks) * 100);
        const bar = '█'.repeat(Math.round(percentage / 5));
        return `${tag.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%) ${COLORS[getTagColor(tag)]}${bar}${COLORS.reset}`;
      });

    drawBox(tagLines.join('\n'), 'Tag Distribution', 'yellow');
    console.log();

    // PRIORITY BREAKDOWN
    log('⚡ PRIORITY BREAKDOWN', 'white');
    console.log();

    const totalPriorities = projectData.priorities.high + projectData.priorities.medium + projectData.priorities.low;
    const priorityLines = [
      `High Priority   ${drawProgressBar(projectData.priorities.high, totalPriorities, 20, 'red')}   ${projectData.priorities.high} tasks`,
      `Medium Priority ${drawProgressBar(projectData.priorities.medium, totalPriorities, 20, 'yellow')} ${projectData.priorities.medium} tasks`,
      `Low Priority    ${drawProgressBar(projectData.priorities.low, totalPriorities, 20, 'green')}   ${projectData.priorities.low} tasks`
    ];

    drawBox(priorityLines.join('\n'), 'Priority Distribution', 'magenta');
    console.log();

    // WORKLOAD ESTIMATION
    log('⏱️  WORKLOAD ESTIMATION', 'white');
    console.log();

    const avgSPPerTask = projectData.totalTasks > 0 ? (projectData.estimatedHours / projectData.totalTasks).toFixed(1) : 0;
    const workloadContent = [
      `Total Estimated Hours: ${projectData.estimatedHours}`,
      `Average SP per Task: ${avgSPPerTask}`,
      ``,
      `By Priority:`,
      `  High Priority: ~${Math.round(projectData.priorities.high * 1.2)} hours`,
      `  Medium Priority: ~${projectData.priorities.medium} hours`,
      `  Low Priority: ~${Math.round(projectData.priorities.low * 0.8)} hours`,
      ``,
      `Recommended Team Size: ${Math.ceil(projectData.estimatedHours / 160)} developers (assuming 160h/month)`
    ];

    drawBox(workloadContent.join('\n'), 'Workload Analysis', 'green');
    console.log();

    // NEXT STEPS RECOMMENDATIONS
    log('🚀 NEXT STEPS', 'white');
    console.log();

    const recommendations = [];
    
    // Find next phase to work on
    const nextPhase = projectData.phases.find(phase => phase.completed < phase.total);
    if (nextPhase) {
      recommendations.push(`🎯 Focus on: ${nextPhase.name} phase (${nextPhase.todo} tasks remaining)`);
    }

    // High priority tasks
    if (projectData.priorities.high > 0) {
      recommendations.push(`⚡ Address ${projectData.priorities.high} high priority tasks first`);
    }

    // Progress recommendations
    if (projectData.completedTasks === 0) {
      recommendations.push(`🏁 Start with Foundation phase TCG Context tasks`);
    } else if (projectData.completedTasks < projectData.totalTasks * 0.25) {
      recommendations.push(`📈 Accelerate development - only ${Math.round((projectData.completedTasks / projectData.totalTasks) * 100)}% complete`);
    }

    // Tag recommendations
    const atomTasks = projectData.tags['atomo'] || 0;
    const moleculaTasks = projectData.tags['molecula'] || 0;
    const organismoTasks = projectData.tags['organismo'] || 0;
    
    if (atomTasks > 0 && moleculaTasks > 0) {
      recommendations.push(`🔗 Build ${atomTasks} atomic components before ${moleculaTasks} molecular ones`);
    }

    recommendations.push(`📊 Review dashboard weekly for progress tracking`);
    recommendations.push(`🎯 Set task dependencies in ClickUp for better workflow`);

    drawBox(recommendations.join('\n'), 'Recommendations', 'blue');
    console.log();

    // FOOTER
    log('╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗', 'cyan');
    log(`║ Last Updated: ${new Date().toLocaleString()}                                                     ║`, 'cyan');
    log(`║ Project Link: https://app.clickup.com/${workspaceId}/v/f/${folderId}                              ║`, 'cyan');
    log(`║ Total Tasks: ${projectData.totalTasks} | Completed: ${projectData.completedTasks} | Progress: ${Math.round((projectData.completedTasks / projectData.totalTasks) * 100)}%            ║`, 'cyan');
    log('╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝', 'cyan');

  } catch (error) {
    log('========================================', 'red');
    log('  DASHBOARD ERROR', 'red');
    log('========================================', 'red');
    console.log();
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getTagColor(tag) {
  const tagColors = {
    'atomo': 'green',
    'molecula': 'yellow', 
    'organismo': 'red',
    'domain': 'blue',
    'ui': 'cyan',
    'forms': 'magenta',
    'routing': 'white',
    'catalog': 'blue',
    'purchases': 'yellow',
    'sales': 'red',
    'most-wanted': 'cyan'
  };
  return tagColors[tag] || 'white';
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDashboard();
}

export default createDashboard;
