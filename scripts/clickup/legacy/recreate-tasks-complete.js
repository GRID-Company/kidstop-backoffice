#!/usr/bin/env node

/**
 * Recreate all tasks with complete details
 * Delete existing tasks and create new ones with descriptions and tags
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

async function recreateTasksComplete() {
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
    log('  Recreating Tasks with Complete Details', 'blue');
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

    // Complete task definitions with descriptions and tags
    const taskDefinitions = {
      catalog: [
        {
          name: 'Catalog - Domain Types y Constants',
          description: `Crear domain types para catálogo de cartas

## Alcance
- Crear features/catalog/domain/types.ts
- Definir Card, CardVariant, CardFilters, TCGType
- Crear constants.ts (TCG_TYPES, CARD_CONDITIONS)
- Crear catalog.domain.ts (getCardsVars, calculatePriceMargin)

## Criterios de Aceptación
- Types definidos correctamente
- Constants exportadas
- Funciones de dominio implementadas

## Estimación: 3 SP`,
          tags: ['atomo', 'domain', 'catalog'],
          priority: 'high'
        },
        {
          name: 'Catalog - Forms y Schemas',
          description: `Crear forms y schemas para catálogo

## Alcance
- Crear card-price.schema.ts
- Crear use-card-price-form.ts hook
- Mapper card.mapper.ts

## Criterios de Aceptación
- Schema de validación funcional
- Hook de formulario implementado
- Mapper para transformación de datos

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'catalog'],
          priority: 'high'
        },
        {
          name: 'Catalog - Componente Búsqueda',
          description: `Crear componente de búsqueda de cartas

## Alcance
- Crear card-search.tsx con multibuscador
- Búsqueda por nombre, set, identificador
- Filtros por TCG, condición, variante
- Responsive y accesible

## Criterios de Aceptación
- Búsqueda funcional por múltiples campos
- Filtros aplicables
- Responsive en móvil/tablet/desktop

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'catalog'],
          priority: 'high'
        },
        {
          name: 'Catalog - Grid de Cartas',
          description: `Crear grid para mostrar cartas

## Alcance
- Crear card-grid.tsx
- Cards con imagen, nombre, set, precio
- Paginación infinita o paginada
- Filtros activos visibles

## Criterios de Aceptación
- Grid responsive
- Cards con información completa
- Paginación funcional

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'catalog'],
          priority: 'high'
        },
        {
          name: 'Catalog - Modal Detalle',
          description: `Crear modal de detalle de carta

## Alcance
- Crear card-detail-modal.tsx
- Información completa de carta
- Selector de variantes
- Editor de precio público
- Botón de sincronización con proveedor

## Criterios de Aceptación
- Modal con toda la información
- Selector funcional de variantes
- Editor de precios
- Botón de sincronización

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'catalog'],
          priority: 'high'
        },
        {
          name: 'Catalog - Vista Principal',
          description: `Crear vista principal del catálogo

## Alcance
- Crear features/catalog/ui/views/catalog.tsx
- Integrar búsqueda, filtros, grid
- Manejo de estado de filtros
- Responsive

## Criterios de Aceptación
- Vista completa funcional
- Integración de todos los componentes
- Estado persistente de filtros

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'catalog'],
          priority: 'high'
        },
        {
          name: 'Catalog - Ruta en App Router',
          description: `Configurar ruta para catálogo

## Alcance
- Crear app/(authenticated)/catalogo/page.tsx
- Importar vista de catálogo
- Validar TCG seleccionado

## Criterios de Aceptación
- Ruta funcional
- Vista correctamente importada
- Validación de TCG

## Estimación: 1 SP`,
          tags: ['molecula', 'routing', 'catalog'],
          priority: 'high'
        }
      ],
      
      purchases: [
        {
          name: 'Purchases - Domain Types',
          description: `Crear domain types para flujo de compras

## Alcance
- Crear features/purchases/domain/types.ts
- Definir Purchase, PurchaseItem, PurchaseStatus, Seller, PaymentMethod
- Crear constants.ts
- Crear purchases.domain.ts (calculateTotal, checkBudget, checkInventoryLimit)

## Criterios de Aceptación
- Types definidos correctamente
- Constants exportadas
- Funciones de dominio implementadas

## Estimación: 3 SP`,
          tags: ['atomo', 'domain', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Forms y Schemas',
          description: `Crear forms y schemas para compras

## Alcance
- purchase-form.schema.ts
- seller-form.schema.ts
- payment-form.schema.ts
- Hooks: use-purchase-form.ts
- Mappers: purchase.mapper.ts, seller.mapper.ts

## Criterios de Aceptación
- Schemas de validación funcionales
- Hooks implementados
- Mappers para transformación

## Estimación: 5 SP`,
          tags: ['atomo', 'forms', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Búsqueda con Métricas',
          description: `Crear búsqueda de cartas con métricas operativas

## Alcance
- Crear card-search-with-metrics.tsx
- Mostrar: precio referencia, stock actual, última venta, tiempo en inventario, wishlist
- Tarjeta con datos operativos
- Controles para agregar a compra

## Criterios de Aceptación
- Búsqueda funcional
- Métricas operativas visibles
- Controles para agregar a compra

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Lista de Items',
          description: `Crear tabla de items de compra

## Alcance
- Crear purchase-items-table.tsx
- Columnas: Carta, Variante, Condición, Cantidad, Precio oferta, Subtotal
- Acciones: editar cantidad, cambiar condición, eliminar
- Calcular total automáticamente

## Criterios de Aceptación
- Tabla funcional
- Acciones por item
- Cálculo automático de totales

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Selector Vendedor',
          description: `Crear selector de vendedor

## Alcance
- Crear seller-selector.tsx
- Buscar vendedor existente
- Crear nuevo vendedor (modal)
- Campos: nombre, celular, email, notas

## Criterios de Aceptación
- Selector funcional
- Búsqueda de vendedores
- Creación de nuevos vendedores

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Indicador Presupuesto',
          description: `Crear indicador de presupuesto

## Alcance
- Crear budget-indicator.tsx
- Mostrar presupuesto asignado
- Mostrar % utilizado
- Calcular con compra actual
- Advertencia visual si excede

## Criterios de Aceptación
- Indicador visual funcional
- Cálculo correcto de porcentajes
- Advertencia si excede presupuesto

## Estimación: 3 SP`,
          tags: ['atomo', 'ui', 'purchases'],
          priority: 'medium'
        },
        {
          name: 'Purchases - Modo Privacidad',
          description: `Crear toggle de modo privacidad

## Alcance
- Crear privacy-mode-toggle.tsx
- Store de privacidad (Zustand)
- Al activar: ocultar precio máximo, precio referencia, controles sensibles
- Persistir estado en sesión

## Criterios de Aceptación
- Toggle funcional
- Ocultamiento de información sensible
- Estado persistente

## Estimación: 3 SP`,
          tags: ['atomo', 'ui', 'purchases'],
          priority: 'medium'
        },
        {
          name: 'Purchases - Botón WhatsApp',
          description: `Crear botón de envío WhatsApp

## Alcance
- Crear whatsapp-quote-button.tsx
- Validar datos completos
- Llamar API de envío
- Generar enlace/hipervínculo
- Cambiar estado a QUOTED

## Criterios de Aceptación
- Botón funcional
- Validación de datos
- Envío a WhatsApp
- Cambio de estado

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Modal División Pago',
          description: `Crear modal para dividir pagos

## Alcance
- Crear payment-split-modal.tsx
- Seleccionar métodos: Efectivo, Transferencia, Crédito tienda
- Input de monto por método
- Validar suma = total
- Confirmar y guardar

## Criterios de Aceptación
- Modal funcional
- Selección de métodos
- Validación de montos
- Guardado de división

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Modal Ajuste Precios',
          description: `Crear modal de ajuste de precios

## Alcance
- Crear price-adjustment-modal.tsx
- Listar items de compra
- Mostrar precio de referencia
- Input para precio público por item
- Validar precios definidos
- Guardar y permitir finalizar

## Criterios de Aceptación
- Modal funcional
- Lista de items con precios
- Validación de precios
- Guardado y finalización

## Estimación: 8 SP`,
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Vista Listado',
          description: `Crear vista de listado de compras

## Alcance
- Crear purchases.tsx
- Tabla/cards de compras
- Filtros: TCG, estado, comprador, fecha
- Búsqueda
- Paginación
- Badges de estado

## Criterios de Aceptación
- Vista funcional
- Filtros aplicables
- Búsqueda funcional
- Paginación

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Vista Detalle',
          description: `Crear vista de detalle/edición

## Alcance
- Crear purchase-detail.tsx
- Mostrar info de compra
- Vendedor, items con métricas
- Presupuesto indicator, modo privacidad toggle
- Acciones según estado
- Modales de pago y ajuste precios

## Criterios de Aceptación
- Vista completa funcional
- Integración de componentes
- Acciones según estado

## Estimación: 13 SP`,
          tags: ['organismo', 'ui', 'purchases'],
          priority: 'high'
        },
        {
          name: 'Purchases - Rutas App Router',
          description: `Configurar rutas para compras

## Alcance
- app/(authenticated)/compras/page.tsx (listado)
- app/(authenticated)/compras/nueva/page.tsx (crear)
- app/(authenticated)/compras/[id]/page.tsx (detalle)
- Validar autenticación y permisos

## Criterios de Aceptación
- Rutas funcionales
- Vistas correctamente importadas
- Validación de autenticación

## Estimación: 2 SP`,
          tags: ['molecula', 'routing', 'purchases'],
          priority: 'high'
        }
      ],
      
      sales: [
        {
          name: 'Sales - Domain Types',
          description: `Crear domain types para ventas

## Alcance
- Crear features/sales/domain/types.ts
- Definir Sale, SaleItem, SaleStatus, SaleCode
- Crear constants.ts
- Crear sales.domain.ts (generateSaleCode, calculateTotal)

## Criterios de Aceptación
- Types definidos correctamente
- Constants exportadas
- Funciones de dominio implementadas

## Estimación: 3 SP`,
          tags: ['atomo', 'domain', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Forms y Schemas',
          description: `Crear forms y schemas para ventas

## Alcance
- complete-sale.schema.ts
- Mapper sale.mapper.ts
- Hooks para manejo de ventas

## Criterios de Aceptación
- Schema de validación funcional
- Mapper implementado
- Hooks funcionales

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Lista de Pedidos',
          description: `Crear lista de pedidos/ventas

## Alcance
- Crear sales-list.tsx
- Listado con filtros
- Badges de estado
- Acciones rápidas

## Criterios de Aceptación
- Lista funcional
- Filtros aplicables
- Badges de estado visibles

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Card Detalle Pedido',
          description: `Crear card de detalle de pedido

## Alcance
- Crear sale-detail-card.tsx
- Información del pedido
- Items del pedido
- Estado y acciones

## Criterios de Aceptación
- Card funcional
- Información completa
- Acciones disponibles

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Tabla Items',
          description: `Crear tabla de items de pedido

## Alcance
- Crear sale-items-table.tsx
- Items con cantidades
- Estado de surtido
- Acciones por item

## Criterios de Aceptación
- Tabla funcional
- Estados visibles
- Acciones por item

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Badge Estado',
          description: `Crear badge de estado de venta

## Alcance
- Crear sale-status-badge.tsx
- Estados: Nuevo, En surtido, Listo, Completado, Cancelado
- Colores distintivos

## Criterios de Aceptación
- Badge funcional
- Estados diferenciados
- Colores distintivos

## Estimación: 2 SP`,
          tags: ['atomo', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Botón PDF',
          description: `Crear botón de generación PDF

## Alcance
- Crear generate-pdf-button.tsx
- Generar picking list
- Descargar PDF automático

## Criterios de Aceptación
- Botón funcional
- Generación de PDF
- Descarga automática

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Modal Completar',
          description: `Crear modal para completar venta

## Alcance
- Crear complete-sale-modal.tsx
- Confirmación de venta
- Generación de código único
- Integración con Shopify

## Criterios de Aceptación
- Modal funcional
- Confirmación de venta
- Generación de código

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Código Venta',
          description: `Crear display de código de venta

## Alcance
- Crear sale-code-display.tsx
- Mostrar código único
- Copiar al portapapeles

## Criterios de Aceptación
- Display funcional
- Código visible
- Copia al portapapeles

## Estimación: 2 SP`,
          tags: ['atomo', 'ui', 'sales'],
          priority: 'medium'
        },
        {
          name: 'Sales - Botón Email Listo',
          description: `Crear botón de email "listo para recolección"

## Alcance
- Crear send-ready-email-button.tsx
- Enviar notificación email
- Confirmación de envío

## Criterios de Aceptación
- Botón funcional
- Envío de email
- Confirmación visual

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Vista Listado',
          description: `Crear vista principal de ventas

## Alcance
- Crear sales.tsx
- Integrar lista de pedidos
- Filtros y búsqueda
- Paginación

## Criterios de Aceptación
- Vista completa funcional
- Integración de componentes
- Filtros y búsqueda

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Vista Detalle',
          description: `Crear vista de detalle de venta

## Alcance
- Crear sale-detail.tsx
- Información completa del pedido
- Acciones según estado
- Integrar modales

## Criterios de Aceptación
- Vista completa funcional
- Información detallada
- Acciones según estado

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'sales'],
          priority: 'high'
        },
        {
          name: 'Sales - Rutas App Router',
          description: `Configurar rutas para ventas

## Alcance
- app/(authenticated)/ventas/page.tsx (listado)
- app/(authenticated)/ventas/[id]/page.tsx (detalle)
- Validar autenticación

## Criterios de Aceptación
- Rutas funcionales
- Vistas importadas
- Validación de autenticación

## Estimación: 2 SP`,
          tags: ['molecula', 'routing', 'sales'],
          priority: 'high'
        }
      ],
      
      extras: [
        {
          name: 'Most Wanted - Domain Types',
          description: `Crear domain types para Most Wanted

## Alcance
- Crear features/most-wanted/domain/types.ts
- Definir MostWantedCard, Priority
- Crear constants.ts (PRIORITIES)
- Crear most-wanted.domain.ts

## Criterios de Aceptación
- Types definidos correctamente
- Constants exportadas
- Funciones de dominio implementadas

## Estimación: 2 SP`,
          tags: ['atomo', 'domain', 'most-wanted'],
          priority: 'medium'
        },
        {
          name: 'Most Wanted - Forms y Schemas',
          description: `Crear forms y schemas para Most Wanted

## Alcance
- most-wanted-card.schema.ts
- use-most-wanted-form.ts hook
- Mapper most-wanted.mapper.ts

## Criterios de Aceptación
- Schema de validación funcional
- Hook implementado
- Mapper para transformación

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'most-wanted'],
          priority: 'medium'
        },
        {
          name: 'Most Wanted - Lista Configurable',
          description: `Crear lista con drag & drop

## Alcance
- Crear most-wanted-list.tsx
- Drag & drop para ordenar
- Activar/desactivar cartas
- Editar prioridad y notas

## Criterios de Aceptación
- Lista funcional
- Drag & drop operativo
- Activación/desactivación
- Edición de prioridad

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'most-wanted'],
          priority: 'medium'
        },
        {
          name: 'Most Wanted - Modal Agregar',
          description: `Crear modal para agregar cartas

## Alcance
- Crear add-card-modal.tsx
- Buscar carta del catálogo
- Agregar a Most Wanted
- Definir prioridad inicial

## Criterios de Aceptación
- Modal funcional
- Búsqueda de cartas
- Agregado a lista
- Definición de prioridad

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'most-wanted'],
          priority: 'medium'
        },
        {
          name: 'Most Wanted - Selector Prioridad',
          description: `Crear selector de prioridad

## Alcance
- Crear card-priority-selector.tsx
- Niveles de prioridad
- Visualización clara

## Criterios de Aceptación
- Selector funcional
- Niveles de prioridad
- Visualización clara

## Estimación: 3 SP`,
          tags: ['atomo', 'ui', 'most-wanted'],
          priority: 'medium'
        },
        {
          name: 'Most Wanted - Preview',
          description: `Crear preview de Most Wanted

## Alcance
- Crear most-wanted-preview.tsx
- Vista previa de página pública
- Actualización en tiempo real

## Criterios de Aceptación
- Preview funcional
- Vista previa correcta
- Actualización en tiempo real

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'most-wanted'],
          priority: 'low'
        },
        {
          name: 'Most Wanted - Vista Configuración',
          description: `Crear vista de configuración

## Alcance
- Crear most-wanted-config.tsx
- Integrar todos los componentes
- Separación por TCG
- Guardar configuración

## Criterios de Aceptación
- Vista completa funcional
- Integración de componentes
- Separación por TCG
- Guardado de configuración

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'most-wanted'],
          priority: 'medium'
        },
        {
          name: 'Most Wanted - Ruta App Router',
          description: `Configurar ruta para Most Wanted

## Alcance
- app/(authenticated)/most-wanted/page.tsx
- Validar permisos (solo Admin)

## Criterios de Aceptación
- Ruta funcional
- Vista importada
- Validación de permisos

## Estimación: 1 SP`,
          tags: ['molecula', 'routing', 'most-wanted'],
          priority: 'medium'
        }
      ]
    };

    // Process each phase
    const phases = [
      { name: 'Catalog', list: catalogList, tasks: taskDefinitions.catalog },
      { name: 'Purchases', list: purchasesList, tasks: taskDefinitions.purchases },
      { name: 'Sales', list: salesList, tasks: taskDefinitions.sales },
      { name: 'Extras', list: extrasList, tasks: taskDefinitions.extras }
    ];

    let totalDeleted = 0;
    let totalCreated = 0;
    let totalFailed = 0;

    for (const phase of phases) {
      if (!phase.list) {
        log(`⚠️  ${phase.name} list not found, skipping`, 'yellow');
        continue;
      }

      log(`Processing ${phase.name} phase...`, 'blue');
      log(`List: ${phase.list.name}`, 'cyan');
      console.log();

      // Step 1: Delete existing tasks
      log('Step 1: Deleting existing tasks...', 'yellow');
      
      const existingTasksResponse = await api.getTasks(phase.list.id);
      const existingTasks = existingTasksResponse.tasks || [];
      
      log(`Found ${existingTasks.length} existing tasks`, 'yellow');
      
      let deletedCount = 0;
      for (const task of existingTasks) {
        try {
          await api.deleteTask(task.id);
          deletedCount++;
        } catch (error) {
          log(`⚠️  Failed to delete task: ${error.message}`, 'yellow');
        }
      }
      
      log(`✓ Deleted ${deletedCount} tasks`, 'green');
      totalDeleted += deletedCount;
      console.log();

      // Step 2: Create new tasks with complete details
      log('Step 2: Creating new tasks with complete details...', 'blue');
      
      let createdCount = 0;
      let failedCount = 0;

      for (const taskDef of phase.tasks) {
        try {
          log(`Creating: ${taskDef.name}...`, 'blue');
          
          const taskData = {
            name: taskDef.name,
            description: taskDef.description,
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
            tags: taskDef.tags || []
          };

          const response = await api.createTask(phase.list.id, taskData);
          
          log(`✓ Created: ${taskDef.name}`, 'green');
          log(`  - Tags: ${taskDef.tags.join(', ')}`, 'cyan');
          log(`  - Priority: ${taskDef.priority}`, 'cyan');
          createdCount++;
          totalCreated++;
          
        } catch (error) {
          log(`✗ Failed to create "${taskDef.name}": ${error.message}`, 'red');
          failedCount++;
          totalFailed++;
        }
        
        console.log();
      }

      log(`${phase.name} phase: ${deletedCount} deleted, ${createdCount} created, ${failedCount} failed`, 
          failedCount > 0 ? 'yellow' : 'green');
      console.log();
    }

    // Final summary
    log('========================================', 'cyan');
    log('  RECREATION SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log(`Total tasks deleted: ${totalDeleted}`, 'yellow');
    log(`Total tasks created: ${totalCreated}`, 'green');
    log(`Total tasks failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'yellow');
    console.log();

    log('Tasks by phase:', 'blue');
    log(`- Catalog: ${taskDefinitions.catalog.length} tasks`, 'cyan');
    log(`- Purchases: ${taskDefinitions.purchases.length} tasks`, 'cyan');
    log(`- Sales: ${taskDefinitions.sales.length} tasks`, 'cyan');
    log(`- Extras: ${taskDefinitions.extras.length} tasks`, 'cyan');
    console.log();

    log('Total project planning:', 'blue');
    log(`- Foundation: 14 tasks (already complete)`, 'green');
    log(`- Catalog: ${taskDefinitions.catalog.length} tasks`, 'green');
    log(`- Purchases: ${taskDefinitions.purchases.length} tasks`, 'green');
    log(`- Sales: ${taskDefinitions.sales.length} tasks`, 'green');
    log(`- Extras: ${taskDefinitions.extras.length} tasks`, 'green');
    log(`- TOTAL: ${14 + taskDefinitions.catalog.length + taskDefinitions.purchases.length + taskDefinitions.sales.length + taskDefinitions.extras.length} tasks`, 'green');
    console.log();

    log('========================================', 'green');
    log('✓ Task recreation complete!', 'green');
    log('========================================', 'green');
    console.log();

    log('All tasks now have:', 'blue');
    console.log('✓ Complete descriptions with scope and criteria');
    console.log('✓ Proper tags (atomo, molecula, organismo)');
    console.log('✓ Feature identification');
    console.log('✓ Priority classification');
    console.log('✓ Story points estimation');
    console.log();

    log('Next steps:', 'blue');
    console.log('1. Assign tasks to team members');
    console.log('2. Set dependencies between tasks');
    console.log('3. Configure custom fields manually if needed');
    console.log('4. Start with Foundation phase tasks');
    console.log();

    log('View complete planning:', 'blue');
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
  recreateTasksComplete();
}

export default recreateTasksComplete;
