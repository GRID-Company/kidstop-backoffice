#!/usr/bin/env node

/**
 * Generate HTML Dashboard with Charts
 * Creates a beautiful visual dashboard with Chart.js
 */

import ClickUpAPI from './clickup-api.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

function calculateDaysBehind() {
  const projectStart = new Date('2026-01-03');
  const today = new Date();
  return Math.floor((today - projectStart) / (1000 * 60 * 60 * 24));
}

function calculateDaysToMilestone() {
  const day60Date = new Date('2026-03-04');
  const today = new Date();
  return Math.max(0, Math.ceil((day60Date - today) / (1000 * 60 * 60 * 24)));
}

async function generateHTMLDashboard() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const folderId = process.env.CLICKUP_FOLDER_ID;

  if (!apiKey || !workspaceId || !folderId) {
    console.error('Missing environment variables');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    console.log('📊 Generating HTML Dashboard...');

    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    const phases = [
      { name: 'Foundation', list: allLists.find(l => l.name === 'Foundation'), color: '#10b981' },
      { name: 'Catalog', list: allLists.find(l => l.name === 'Catalog'), color: '#3b82f6' },
      { name: 'Purchases', list: allLists.find(l => l.name === 'Purchases'), color: '#f59e0b' },
      { name: 'Sales', list: allLists.find(l => l.name === 'Sales'), color: '#ec4899' },
      { name: 'Extras', list: allLists.find(l => l.name === 'Extras'), color: '#06b6d4' }
    ];

    const projectData = {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
      phases: [],
      tags: {},
      estimatedHours: 0
    };

    for (const phase of phases) {
      if (!phase.list) continue;

      const tasksResponse = await api.getTasks(phase.list.id);
      const tasks = tasksResponse.tasks || [];
      
      const phaseData = {
        name: phase.name,
        color: phase.color,
        total: tasks.length,
        completed: 0,
        inProgress: 0,
        todo: 0,
        estimatedSP: 0
      };

      for (const task of tasks) {
        projectData.totalTasks++;
        
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

        const description = task.description?.toLowerCase() || '';
        const spMatch = description.match(/estimaci[óo]n:\s*(\d+)\s*sp/i);
        if (spMatch) {
          const sp = parseInt(spMatch[1]);
          phaseData.estimatedSP += sp;
          projectData.estimatedHours += sp;
        }

        if (task.tags && Array.isArray(task.tags)) {
          for (const tag of task.tags) {
            const tagName = typeof tag === 'string' ? tag : tag.name || tag;
            projectData.tags[tagName] = (projectData.tags[tagName] || 0) + 1;
          }
        }
      }

      projectData.phases.push(phaseData);
    }

    const daysBehind = calculateDaysBehind();
    const daysToMilestone = calculateDaysToMilestone();
    const requiredVelocity = (projectData.totalTasks / daysToMilestone).toFixed(2);
    const completionRate = projectData.totalTasks > 0 ? Math.round((projectData.completedTasks / projectData.totalTasks) * 100) : 0;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚨 Kidstop Project Emergency Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 20px;
            min-height: 100vh;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header {
            text-align: center;
            padding: 30px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            margin-bottom: 30px;
            border: 2px solid rgba(255,255,255,0.2);
        }
        .header h1 {
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .crisis-banner {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
            font-size: 1.5em;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(239,68,68,0.4);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            border: 2px solid rgba(255,255,255,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .metric-card .label {
            font-size: 0.9em;
            opacity: 0.8;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .metric-card .value {
            font-size: 3em;
            font-weight: bold;
            line-height: 1;
        }
        .metric-card .subvalue {
            font-size: 0.9em;
            opacity: 0.7;
            margin-top: 5px;
        }
        .metric-card.critical { border-color: #ef4444; background: rgba(239,68,68,0.2); }
        .metric-card.warning { border-color: #f59e0b; background: rgba(245,158,11,0.2); }
        .metric-card.success { border-color: #10b981; background: rgba(16,185,129,0.2); }
        .metric-card.info { border-color: #3b82f6; background: rgba(59,130,246,0.2); }
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        .chart-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            border: 2px solid rgba(255,255,255,0.2);
        }
        .chart-card h3 {
            margin-bottom: 20px;
            font-size: 1.3em;
        }
        .chart-container {
            position: relative;
            height: 300px;
        }
        .action-plan {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            border: 2px solid rgba(255,255,255,0.2);
            margin-bottom: 30px;
        }
        .action-plan h2 {
            margin-bottom: 20px;
            font-size: 2em;
        }
        .action-plan ul {
            list-style: none;
            padding-left: 0;
        }
        .action-plan li {
            padding: 15px;
            margin-bottom: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            border-left: 4px solid #10b981;
        }
        .footer {
            text-align: center;
            padding: 20px;
            opacity: 0.7;
            font-size: 0.9em;
        }
        .progress-bar {
            width: 100%;
            height: 30px;
            background: rgba(255,255,255,0.2);
            border-radius: 15px;
            overflow: hidden;
            margin-top: 10px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            transition: width 1s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 KIDSTOP PROJECT EMERGENCY DASHBOARD</h1>
            <div class="subtitle">Recovery Mode Activated - Real-time Project Metrics</div>
            <div class="subtitle">Last Updated: ${new Date().toLocaleString()}</div>
        </div>

        <div class="crisis-banner">
            ⚠️ CODE RED: ${daysBehind} DAYS BEHIND SCHEDULE - ${daysToMilestone} DAYS TO CRITICAL MILESTONE ⚠️
        </div>

        <div class="metrics-grid">
            <div class="metric-card critical">
                <div class="label">Days Behind</div>
                <div class="value">${daysBehind}</div>
                <div class="subvalue">Since 03/Jan/2026</div>
            </div>
            <div class="metric-card warning">
                <div class="label">Days to Day 60</div>
                <div class="value">${daysToMilestone}</div>
                <div class="subvalue">Payment Milestone</div>
            </div>
            <div class="metric-card info">
                <div class="label">Required Velocity</div>
                <div class="value">${requiredVelocity}</div>
                <div class="subvalue">tasks/day</div>
            </div>
            <div class="metric-card critical">
                <div class="label">Current Velocity</div>
                <div class="value">0.00</div>
                <div class="subvalue">tasks/day</div>
            </div>
            <div class="metric-card info">
                <div class="label">Total Tasks</div>
                <div class="value">${projectData.totalTasks}</div>
                <div class="subvalue">${projectData.estimatedHours} SP estimated</div>
            </div>
            <div class="metric-card ${completionRate > 0 ? 'success' : 'critical'}">
                <div class="label">Completion</div>
                <div class="value">${completionRate}%</div>
                <div class="subvalue">${projectData.completedTasks}/${projectData.totalTasks} tasks</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${completionRate}%">${completionRate}%</div>
                </div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <h3>📊 Phase Progress</h3>
                <div class="chart-container">
                    <canvas id="phaseChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <h3>📈 Task Status Distribution</h3>
                <div class="chart-container">
                    <canvas id="statusChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <h3>⏱️ Estimated Hours by Phase</h3>
                <div class="chart-container">
                    <canvas id="hoursChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <h3>🏷️ Top Tags Distribution</h3>
                <div class="chart-container">
                    <canvas id="tagsChart"></canvas>
                </div>
            </div>
        </div>

        <div class="action-plan">
            <h2>⚡ IMMEDIATE ACTION PLAN</h2>
            <ul>
                <li><strong>TODAY:</strong> Emergency team meeting - Review crisis dashboard - Identify immediate blockers</li>
                <li><strong>TOMORROW:</strong> Start Foundation phase (14 tasks) - Daily standup at 9 AM - First progress report to client</li>
                <li><strong>THIS WEEK:</strong> Complete minimum 10 tasks - Achieve velocity of 1.4+ tasks/day - First demo to client</li>
                <li><strong>DAY 60 TARGET:</strong> 40% completion (${Math.round(projectData.totalTasks * 0.4)} tasks) - Payment milestone achieved - Client confidence restored</li>
            </ul>
        </div>

        <div class="footer">
            Kidstop Backoffice Project (KSP-001) | GRID Software | Emergency Recovery Dashboard
        </div>
    </div>

    <script>
        const phaseData = ${JSON.stringify(projectData.phases)};
        const tags = ${JSON.stringify(projectData.tags)};

        // Phase Progress Chart
        new Chart(document.getElementById('phaseChart'), {
            type: 'bar',
            data: {
                labels: phaseData.map(p => p.name),
                datasets: [{
                    label: 'Completed',
                    data: phaseData.map(p => p.completed),
                    backgroundColor: '#10b981'
                }, {
                    label: 'In Progress',
                    data: phaseData.map(p => p.inProgress),
                    backgroundColor: '#f59e0b'
                }, {
                    label: 'To Do',
                    data: phaseData.map(p => p.todo),
                    backgroundColor: '#ef4444'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#fff' } } },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });

        // Status Distribution Chart
        new Chart(document.getElementById('statusChart'), {
            type: 'doughnut',
            data: {
                labels: ['To Do', 'In Progress', 'Completed'],
                datasets: [{
                    data: [${projectData.todoTasks}, ${projectData.inProgressTasks}, ${projectData.completedTasks}],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#fff' } } }
            }
        });

        // Hours by Phase Chart
        new Chart(document.getElementById('hoursChart'), {
            type: 'bar',
            data: {
                labels: phaseData.map(p => p.name),
                datasets: [{
                    label: 'Estimated SP',
                    data: phaseData.map(p => p.estimatedSP),
                    backgroundColor: phaseData.map(p => p.color)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#fff' } } },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });

        // Tags Chart
        const topTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 10);
        new Chart(document.getElementById('tagsChart'), {
            type: 'horizontalBar',
            data: {
                labels: topTags.map(t => t[0]),
                datasets: [{
                    label: 'Tasks',
                    data: topTags.map(t => t[1]),
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#fff' } } },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    </script>
</body>
</html>`;

    const outputPath = path.join(__dirname, '../../kidstop-emergency-dashboard.html');
    fs.writeFileSync(outputPath, html);

    console.log('✓ Dashboard generated successfully!');
    console.log(`📄 File: ${outputPath}`);
    console.log('🌐 Open the file in your browser to view the dashboard');
    console.log('');
    console.log('💡 TIP: Bookmark this file and refresh it daily to track progress');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateHTMLDashboard();
}

export default generateHTMLDashboard;
