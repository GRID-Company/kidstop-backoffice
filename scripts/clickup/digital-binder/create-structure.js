#!/usr/bin/env node

/**
 * Create ClickUp structure for Kidstop Digital Binder
 *
 * Usage:
 *   node scripts/clickup/digital-binder/create-structure.js --dry-run
 *   node scripts/clickup/digital-binder/create-structure.js --list "Setup Inicial"
 *   node scripts/clickup/digital-binder/create-structure.js --all
 */

import ClickUpAPI from '../clickup-api.js';
import { FOLDER_ID, LISTS } from './tasks-data.js';
import dotenv from 'dotenv';

dotenv.config();

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { dryRun: false, all: false, listName: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') parsed.dryRun = true;
    if (args[i] === '--all') parsed.all = true;
    if (args[i] === '--list' && args[i + 1]) {
      parsed.listName = args[i + 1];
      i++;
    }
  }

  return parsed;
}

async function getOrCreateList(api, folderId, listName, existingLists, dryRun) {
  const existing = existingLists.find((l) => l.name === listName);
  if (existing) {
    log(`  ⏭  Lista ya existe: "${listName}" (ID: ${existing.id})`, 'yellow');
    return existing.id;
  }

  if (dryRun) {
    log(`  🔍 [DRY RUN] Crearía lista: "${listName}"`, 'dim');
    return 'dry-run-id';
  }

  const response = await api.createList(folderId, listName);
  const listId = response.id;
  log(`  ✅ Lista creada: "${listName}" (ID: ${listId})`, 'green');
  await sleep(300);
  return listId;
}

async function createTaskInList(api, listId, task, dryRun) {
  if (dryRun) {
    log(`    🔍 [DRY RUN] Crearía tarea: "${task.name}"`, 'dim');
    return;
  }

  const taskData = {
    name: task.name,
    description: task.description || '',
    tags: task.tags || [],
    status: 'todo',
  };

  const response = await api.createTask(listId, taskData);
  log(`    ✅ Tarea: "${response.name}"`, 'green');
  await sleep(300);
}

async function processList(api, listConfig, existingLists, dryRun) {
  log(`\n📋 Lista: "${listConfig.name}" (${listConfig.folder})`, 'blue');
  log(`   ${listConfig.tasks.length} tareas`, 'cyan');

  const listId = await getOrCreateList(
    api,
    FOLDER_ID,
    listConfig.name,
    existingLists,
    dryRun
  );

  let created = 0;
  let failed = 0;

  for (const task of listConfig.tasks) {
    try {
      await createTaskInList(api, listId, task, dryRun);
      created++;
    } catch (error) {
      log(`    ❌ Error en "${task.name}": ${error.message}`, 'red');
      failed++;
    }
  }

  return { created, failed, total: listConfig.tasks.length };
}

async function main() {
  const args = parseArgs();

  if (!args.dryRun && !args.all && !args.listName) {
    log('Uso:', 'blue');
    log('  --dry-run              Ver qué se crearía sin ejecutar');
    log('  --list "Nombre"        Crear una sola lista con sus tareas');
    log('  --all                  Crear todas las listas y tareas');
    log('');
    log('Listas disponibles:', 'cyan');
    LISTS.forEach((l, i) => {
      log(`  ${i + 1}. "${l.name}" (${l.folder}) - ${l.tasks.length} tareas`);
    });
    log(`\nTotal: ${LISTS.length} listas, ${LISTS.reduce((sum, l) => sum + l.tasks.length, 0)} tareas`);
    process.exit(0);
  }

  const apiKey = process.env.CLICKUP_API_KEY;
  if (!apiKey) {
    log('❌ CLICKUP_API_KEY no configurado en .env', 'red');
    process.exit(1);
  }

  const api = new ClickUpAPI(apiKey);

  log('═══════════════════════════════════════════', 'blue');
  log('  Kidstop Carpeta Digital - ClickUp Setup', 'blue');
  log('═══════════════════════════════════════════', 'blue');
  log(`Folder ID: ${FOLDER_ID}`, 'cyan');
  if (args.dryRun) log('🔍 MODO DRY RUN - No se creará nada', 'yellow');

  let listsToProcess;

  if (args.listName) {
    const found = LISTS.filter((l) => l.name === args.listName);
    if (found.length === 0) {
      log(`❌ Lista "${args.listName}" no encontrada`, 'red');
      log('Listas disponibles:', 'yellow');
      LISTS.forEach((l) => log(`  - "${l.name}"`));
      process.exit(1);
    }
    listsToProcess = found;
  } else {
    listsToProcess = LISTS;
  }

  log(`\nListas a procesar: ${listsToProcess.length}`, 'cyan');
  log(`Tareas a crear: ${listsToProcess.reduce((sum, l) => sum + l.tasks.length, 0)}`, 'cyan');

  let existingLists = [];
  if (!args.dryRun) {
    log('\nObteniendo listas existentes...', 'blue');
    try {
      const response = await api.getLists(FOLDER_ID);
      existingLists = response.lists || [];
      log(`Encontradas ${existingLists.length} lista(s) existente(s)`, 'cyan');
      existingLists.forEach((l) => log(`  - "${l.name}" (${l.id})`, 'dim'));
    } catch (error) {
      log(`❌ Error obteniendo listas: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  let totalCreated = 0;
  let totalFailed = 0;

  for (const listConfig of listsToProcess) {
    try {
      const result = await processList(api, listConfig, existingLists, args.dryRun);
      totalCreated += result.created;
      totalFailed += result.failed;
    } catch (error) {
      log(`❌ Error procesando lista "${listConfig.name}": ${error.message}`, 'red');
      totalFailed += listConfig.tasks.length;
    }
  }

  log('\n═══════════════════════════════════════════', 'blue');
  log('  RESUMEN', 'blue');
  log('═══════════════════════════════════════════', 'blue');

  if (args.dryRun) {
    log(`🔍 DRY RUN completado`, 'yellow');
    log(`   Listas: ${listsToProcess.length}`, 'cyan');
    log(`   Tareas: ${listsToProcess.reduce((sum, l) => sum + l.tasks.length, 0)}`, 'cyan');
  } else {
    log(`✅ Tareas creadas: ${totalCreated}`, 'green');
    if (totalFailed > 0) {
      log(`❌ Tareas fallidas: ${totalFailed}`, 'red');
    }
  }

  log(`\n🔗 https://app.clickup.com/8591008/v/o/f/${FOLDER_ID}`, 'cyan');
}

main().catch((error) => {
  log(`❌ Error fatal: ${error.message}`, 'red');
  process.exit(1);
});
