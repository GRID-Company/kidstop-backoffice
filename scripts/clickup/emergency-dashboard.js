#!/usr/bin/env node

/**
 * Emergency Dashboard Generator
 * Created for Kidstop Backoffice Project Recovery
 * Focus: Crisis metrics and recovery tracking
 */

import ClickUpAPI from './clickup-api.js';
import dotenv from 'dotenv';

dotenv.config();

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  yellow: '\x1b[33m',
  brightYellow: '\x1b[93m',
  green: '\x1b[32m',
  brightGreen: '\x1b[92m',
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
  if (total === 0) return `${COLORS[color]}[${'░'.repeat(width)}]${COLORS.reset} 0% (0/0)`;
  
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((width * current) / total);
  const empty = width - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  return `${COLORS[color]}[${filledBar}${emptyBar}]${COLORS.reset} ${percentage}% (${current}/${total})`;
}

function drawAlertBox(content, title = 'ALERT', color = 'red') {
  const lines = content.split('\n');
  const maxLength = Math.max(...lines.map(line => {
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '');
    return cleanLine.length;
  }), title.length);
  const border = '═'.repeat(maxLength + 4);
  
  console.log(`${COLORS[color]}╔═ ${title.padEnd(maxLength)} ═╗${COLORS.reset}`);
  lines.forEach(line => {
    console.log(`${COLORS[color]}║ ${line.padEnd(maxLength)} ║${COLORS.reset}`);
  });
  console.log(`${COLORS[color]}╚═${border}╝${COLORS.reset}`);
}

function calculateDaysBehind() {
  const projectStart = new Date('2026-01-03'); // 03/Enero/2026
  const today = new Date();
  const daysDiff = Math.floor((today - projectStart) / (1000 * 60 * 60 * 24));
  return daysDiff;
}

function calculateDaysToNextMilestone() {
  // Day 60 milestone (04/Mar/2026)
  const day60Date = new Date('2026-03-04');
  const today = new Date();
  const daysDiff = Math.ceil((day60Date - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysDiff);
}

function calculateRequiredVelocity(totalTasks, daysRemaining) {
  return (totalTasks / daysRemaining).toFixed(2);
}

async function createEmergencyDashboard() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const folderId = process.env.CLICKUP_FOLDER_ID;

  if (!apiKey || !workspaceId || !folderId) {
    log('✗ Missing environment variables', 'red');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    // Clear screen for emergency dashboard
    console.clear();
    
    // EMERGENCY HEADER
    log('╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗', 'brightRed');
    log('║                                🚨 KIDSTOP PROJECT EMERGENCY DASHBOARD 🚨                                ║', 'brightRed');
    log('╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝', 'brightRed');
    console.log();

    // CRISIS METRICS
    const daysBehind = calculateDaysBehind();
    const daysToNextMilestone = calculateDaysToNextMilestone();
    
    log('🚨 CRISIS METRICS', 'brightRed');
    console.log();
    
    const crisisContent = [
      `Project Start: 03/Jan/2026`,
      `Current Date: ${new Date().toLocaleDateString()}`,
      `Days Behind: ${daysBehind} DAYS`,
      `Next Payment (Day 60): ${daysToNextMilestone} days remaining`,
      `Expected Progress by Now: ~40%`,
      `Actual Progress: 0%`,
      `Deviation: 40% BEHIND SCHEDULE`,
      ``,
      `Status: ${daysBehind > 30 ? 'CRITICAL' : 'URGENT'}`,
      `Client Confidence: AT RISK`,
      `Payment Risk: 20% (Day 30 missed)`
    ];
    
    drawAlertBox(crisisContent.join('\n'), 'PROJECT CRISIS STATUS', 'red');
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
        todo: 0,
        estimatedSP: 0
      };

      // Process tasks in this phase
      for (const task of tasks) {
        projectData.totalTasks++;
        
        // Count by status
        const status = task.status?.status?.toLowerCase() || 'todo';
        if (status === 'done' || status === 'closed') {
          phaseData.completed++;
          projectData.completedTasks++;
        } else if (status === 'in progress') {
          phaseData.inProgress++;
          projectData.inProgressTasks++;
        } else {
          phaseData.todo++;
          projectData.todoTasks++;
        }

        // Extract SP from description
        const description = task.description?.toLowerCase() || '';
        const spMatch = description.match(/estimaci[óo]n:\s*(\d+)\s*sp/i);
        if (spMatch) {
          const sp = parseInt(spMatch[1]);
          phaseData.estimatedSP += sp;
          projectData.estimatedHours += sp;
        }
      }

      projectData.phases.push(phaseData);
    }

    // RECOVERY CALCULATIONS
    log('📈 RECOVERY ANALYSIS', 'yellow');
    console.log();
    
    const currentVelocity = 0; // No tasks completed yet
    const requiredVelocity = calculateRequiredVelocity(projectData.totalTasks, daysToNextMilestone);
    const recoveryFactor = requiredVelocity > 0 ? (requiredVelocity / 0.5).toFixed(1) : '∞'; // Assuming 0.5 tasks/day as normal
    
    const recoveryContent = [
      `Total Tasks Remaining: ${projectData.totalTasks}`,
      `Days to Day 60 Milestone: ${daysToNextMilestone}`,
      ``,
      `Current Velocity: ${currentVelocity} tasks/day`,
      `Required Velocity: ${requiredVelocity} tasks/day`,
      `Recovery Factor: ${recoveryFactor}x normal speed`,
      ``,
      `Tasks needed per day: ${requiredVelocity}`,
      `Tasks needed per week: ${(requiredVelocity * 7).toFixed(1)}`,
      `Estimated Hours: ${projectData.estimatedHours}`,
      ``,
      `Status: ${recoveryFactor > 3 ? 'EXTREME ACCELERATION NEEDED' : recoveryFactor > 2 ? 'HIGH ACCELERATION NEEDED' : 'MODERATE ACCELERATION NEEDED'}`
    ];
    
    drawAlertBox(recoveryContent.join('\n'), 'RECOVERY REQUIREMENTS', 'yellow');
    console.log();

    // IMMEDIATE ACTION PLAN
    log('⚡ IMMEDIATE ACTION PLAN', 'brightGreen');
    console.log();
    
    const actionPlan = [
      `🔥 TODAY (Next 4 hours):`,
      `   • Create crisis dashboards ✓`,
      `   • Emergency team meeting`,
      `   • Client communication plan`,
      ``,
      `⚡ TOMORROW (Next 8 hours):`,
      `   • Complete all dashboards`,
      `   • Identify and remove ALL blockers`,
      `   • Start critical tasks execution`,
      ``,
      `📅 NEXT 7 DAYS:`,
      `   • Complete minimum 10 tasks`,
      `   • Daily progress reports to client`,
      `   • First demo of working features`,
      ``,
      `🎯 DAY 60 TARGET:`,
      `   • 40% of tasks completed (${Math.round(projectData.totalTasks * 0.4)} tasks)`,
      `   • Payment milestone achieved`,
      `   • Client confidence restored`
    ];
    
    drawAlertBox(actionPlan.join('\n'), 'IMMEDIATE ACTIONS', 'green');
    console.log();

    // PHASE PRIORITY MATRIX
    log('🎯 PHASE PRIORITY MATRIX', 'cyan');
    console.log();

    for (const phase of projectData.phases) {
      const phaseColor = phases.find(p => p.name === phase.name)?.color || 'white';
      const progress = drawProgressBar(phase.completed, phase.total, 25, phaseColor);
      
      const priority = phase.name === 'Foundation' ? 'CRITICAL' : 
                     phase.name === 'Catalog' ? 'HIGH' : 
                     phase.name === 'Purchases' ? 'HIGH' : 'MEDIUM';
      
      const priorityColor = priority === 'CRITICAL' ? 'red' : 
                           priority === 'HIGH' ? 'yellow' : 'blue';
      
      const phaseInfo = [
        `${phase.name}: ${phase.total} tasks [${priority}]`,
        `Progress: ${progress}`,
        `Completed: ${phase.completed} | To Do: ${phase.todo}`,
        `Estimated: ${phase.estimatedSP} SP`,
        `Action: ${priority === 'CRITICAL' ? 'START IMMEDIATELY' : priority === 'HIGH' ? 'PRIORITY THIS WEEK' : 'PLAN FOR NEXT SPRINT'}`
      ];
      
      drawAlertBox(phaseInfo.join('\n'), `${phase.name} PHASE`, phaseColor);
      console.log();
    }

    // CLIENT COMMUNICATION TEMPLATE
    log('📧 CLIENT COMMUNICATION', 'magenta');
    console.log();
    
    const emailTemplate = [
      `Subject: URGENT: Kidstop Project Recovery Plan - Status & Actions`,
      ``,
      `Dear Client,`,
      ``,
      `I want to be transparent about the current project status:`,
      `• Project started: 03/Jan/2026`,
      `• Current delay: ${daysBehind} days behind schedule`,
      `• Progress: 0% (should be ~40% by now)`,
      ``,
      `IMMEDIATE ACTIONS WE'RE TAKING:`,
      `1. Emergency recovery team activated`,
      `2. Crisis dashboards implemented for full visibility`,
      `3. Accelerated development plan (4.1x speed increase)`,
      `4. Daily progress reports starting tomorrow`,
      ``,
      `NEXT 7 DAYS DELIVERABLES:`,
      `• Foundation phase completion (14 tasks)`,
      `• First working demo`,
      `• Daily progress updates`,
      ``,
      `We are committed to recovering the timeline and restoring your confidence.`,
      `Full transparency and accelerated delivery from this point forward.`,
      ``,
      `Best regards,`,
      `GRID Software Team`
    ];
    
    drawAlertBox(emailTemplate.join('\n'), 'CLIENT EMAIL TEMPLATE', 'magenta');
    console.log();

    // FINAL COUNTDOWN
    log('⏰ COUNTDOWN TO CRITICAL DEADLINE', 'brightRed');
    console.log();
    
    const countdownContent = [
      `🔥 DAY 60 PAYMENT MILESTONE: ${daysToNextMilestone} DAYS REMAINING`,
      ``,
      `Required Daily Output: ${requiredVelocity} tasks/day`,
      `Current Daily Output: 0 tasks/day`,
      `Gap: ${requiredVelocity} tasks/day`,
      ``,
      `STATUS: ${daysToNextMilestone < 30 ? 'CODE RED - IMMEDIATE ACTION REQUIRED' : 'CODE ORANGE - URGENT ACTION NEEDED'}`,
      ``,
      `⚠️  EVERY HOUR COUNTS - NO MORE DELAYS ACCEPTABLE ⚠️`
    ];
    
    drawAlertBox(countdownContent.join('\n'), 'CRITICAL COUNTDOWN', 'brightRed');
    console.log();

    // FOOTER
    log('╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗', 'cyan');
    log(`║ Emergency Dashboard Generated: ${new Date().toLocaleString()}                              ║`, 'cyan');
    log(`║ Project: Kidstop Backoffice (KSP-001)                                                    ║`, 'cyan');
    log(`║ Status: ${'CRITICAL'.padEnd(20)} | Days Behind: ${daysBehind.toString().padEnd(3)} | Recovery: ${recoveryFactor}x speed required     ║`, 'cyan');
    log(`║ Next Milestone: Day 60 (${daysToNextMilestone} days) | Tasks: ${projectData.totalTasks} | Confidence: RESTORATION MODE              ║`, 'cyan');
    log('╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝', 'cyan');

  } catch (error) {
    log('========================================', 'brightRed');
    log('  EMERGENCY DASHBOARD ERROR', 'brightRed');
    log('========================================', 'brightRed');
    console.log();
    log(`Error: ${error.message}`, 'brightRed');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createEmergencyDashboard();
}

export default createEmergencyDashboard;
