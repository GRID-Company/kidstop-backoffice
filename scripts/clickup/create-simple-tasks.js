#!/usr/bin/env node

/**
 * Create simple tasks without custom fields
 * Creates basic tasks for all phases to avoid priority issues
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
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function createSimpleTasks() {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
  const folderId = process.env.CLICKUP_FOLDER_ID;

  if (!apiKey || !workspaceId || !folderId) {
    log('✗ Missing environment variables', 'red');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  try {
    log('========================================', 'blue');
    log('  Creating Simple Tasks', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get lists in folder
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    // Find specific lists
    const catalogList = allLists.find(list => list.name === 'Catalog');
    const purchasesList = allLists.find(list => list.name === 'Purchases');
    const salesList = allLists.find(list => list.name === 'Sales');
    const extrasList = allLists.find(list => list.name === 'Extras');

    // Simple task definitions
    const simpleTasks = {
      catalog: [
        'Catalog - Domain Types y Constants',
        'Catalog - Forms y Schemas',
        'Catalog - Componente Búsqueda',
        'Catalog - Grid de Cartas',
        'Catalog - Modal Detalle',
        'Catalog - Vista Principal',
        'Catalog - Ruta en App Router'
      ],
      
      purchases: [
        'Purchases - Domain Types',
        'Purchases - Forms y Schemas',
        'Purchases - Búsqueda con Métricas',
        'Purchases - Lista de Items',
        'Purchases - Selector Vendedor',
        'Purchases - Indicador Presupuesto',
        'Purchases - Modo Privacidad',
        'Purchases - Botón WhatsApp',
        'Purchases - Modal División Pago',
        'Purchases - Modal Ajuste Precios',
        'Purchases - Vista Listado',
        'Purchases - Vista Detalle',
        'Purchases - Rutas App Router'
      ],
      
      sales: [
        'Sales - Domain Types',
        'Sales - Forms y Schemas',
        'Sales - Lista de Pedidos',
        'Sales - Card Detalle Pedido',
        'Sales - Tabla Items',
        'Sales - Badge Estado',
        'Sales - Botón PDF',
        'Sales - Modal Completar',
        'Sales - Código Venta',
        'Sales - Botón Email Listo',
        'Sales - Vista Listado',
        'Sales - Vista Detalle',
        'Sales - Rutas App Router'
      ],
      
      extras: [
        'Most Wanted - Domain Types',
        'Most Wanted - Forms y Schemas',
        'Most Wanted - Lista Configurable',
        'Most Wanted - Modal Agregar',
        'Most Wanted - Selector Prioridad',
        'Most Wanted - Preview',
        'Most Wanted - Vista Configuración',
        'Most Wanted - Ruta App Router'
      ]
    };

    // Create tasks for each phase
    const phases = [
      { name: 'Catalog', list: catalogList, tasks: simpleTasks.catalog },
      { name: 'Purchases', list: purchasesList, tasks: simpleTasks.purchases },
      { name: 'Sales', list: salesList, tasks: simpleTasks.sales },
      { name: 'Extras', list: extrasList, tasks: simpleTasks.extras }
    ];

    let totalCreated = 0;
    let totalFailed = 0;

    for (const phase of phases) {
      if (!phase.list) {
        log(`⚠️  ${phase.name} list not found, skipping`, 'yellow');
        continue;
      }

      log(`Creating tasks for ${phase.name} phase...`, 'blue');
      log(`List: ${phase.list.name}`, 'cyan');
      console.log();

      let phaseCreated = 0;
      let phaseFailed = 0;

      for (const taskName of phase.tasks) {
        try {
          log(`Creating: ${taskName}...`, 'blue');
          
          const taskData = {
            name: taskName,
            description: `Task for ${phase.name} phase`,
            assignees: [],
            status: 'todo',
            due_date: null,
            due_date_time: false,
            time_estimate: null,
            start_date: null,
            start_date_time: false,
            notify_all: false,
            parent: null,
            links_to: null,
            custom_task_id: null,
            tags: []
          };

          const response = await api.createTask(phase.list.id, taskData);
          const createdTask = response.task;
          
          log(`✓ Created: ${createdTask.name}`, 'green');
          phaseCreated++;
          totalCreated++;
          
        } catch (error) {
          log(`✗ Failed to create "${taskName}": ${error.message}`, 'red');
          phaseFailed++;
          totalFailed++;
        }
      }

      console.log();
      log(`${phase.name} phase: ${phaseCreated} created, ${phaseFailed} failed`, phaseFailed > 0 ? 'yellow' : 'green');
      console.log();
    }

    // Summary
    log('========================================', 'cyan');
    log('  SIMPLE TASKS SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log(`Total tasks created: ${totalCreated}`, 'green');
    log(`Total tasks failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'yellow');
    console.log();

    log('Tasks by phase:', 'blue');
    log(`- Foundation: 14 tasks (already created)`, 'cyan');
    log(`- Catalog: ${simpleTasks.catalog.length} tasks`, 'cyan');
    log(`- Purchases: ${simpleTasks.purchases.length} tasks`, 'cyan');
    log(`- Sales: ${simpleTasks.sales.length} tasks`, 'cyan');
    log(`- Extras: ${simpleTasks.extras.length} tasks`, 'cyan');
    log(`- Total: ${14 + simpleTasks.catalog.length + simpleTasks.purchases.length + simpleTasks.sales.length + simpleTasks.extras.length} tasks`, 'green');
    console.log();

    log('========================================', 'green');
    log('✓ Simple tasks creation complete!', 'green');
    log('========================================', 'green');
    console.log();

    log('Next steps:', 'blue');
    console.log('1. Add custom fields manually if needed');
    console.log('2. Assign tasks to team members');
    console.log('3. Set dependencies between tasks');
    console.log('4. Start with Foundation phase tasks');
    console.log();

    log('View all lists:', 'blue');
    console.log(`https://app.clickup.com/${workspaceId}/v/f/${folderId}`);

  } catch (error) {
    log('========================================', 'red');
    log('  ERROR', 'red');
    log('========================================', 'red');
    console.log();
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createSimpleTasks();
}

export default createSimpleTasks;
