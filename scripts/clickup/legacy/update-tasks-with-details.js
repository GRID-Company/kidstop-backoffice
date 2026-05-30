#!/usr/bin/env node

/**
 * Update existing tasks with descriptions and tags
 * Adds detailed descriptions and tags to all created tasks
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

async function updateTasksWithDetails() {
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
    log('  Updating Tasks with Details', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get lists in folder
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    // Find specific lists (skip Foundation and Setup)
    const catalogList = allLists.find(list => list.name === 'Catalog');
    const purchasesList = allLists.find(list => list.name === 'Purchases');
    const salesList = allLists.find(list => list.name === 'Sales');
    const extrasList = allLists.find(list => list.name === 'Extras');

    // Detailed task definitions
    const taskDetails = {
      catalog: [
        {
          name: 'Catalog - Domain Types y Constants',
          description: `Crear domain types para catálogo de cartas

## Alcance
- Crear features/catalog/domain/types.ts
- Definir Card, CardVariant, CardFilters, TCGType
- Crear constants.ts (TCG_TYPES, CARD_CONDITIONS)
- Crear catalog.domain.ts (getCardsVars, calculatePriceMargin)

## Estimación: 3 SP`,
          tags: ['atomo', 'domain', 'catalog']
        },
        {
          name: 'Catalog - Forms y Schemas',
          description: `Crear forms y schemas para catálogo

## Alcance
- Crear card-price.schema.ts
- Crear use-card-price-form.ts hook
- Mapper card.mapper.ts

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'catalog']
        },
        {
          name: 'Catalog - Componente Búsqueda',
          description: `Crear componente de búsqueda de cartas

## Alcance
- Crear card-search.tsx con multibuscador
- Búsqueda por nombre, set, identificador
- Filtros por TCG, condición, variante
- Responsive y accesible

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'catalog']
        },
        {
          name: 'Catalog - Grid de Cartas',
          description: `Crear grid para mostrar cartas

## Alcance
- Crear card-grid.tsx
- Cards con imagen, nombre, set, precio
- Paginación infinita o paginada
- Filtros activos visibles

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'catalog']
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

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'catalog']
        },
        {
          name: 'Catalog - Vista Principal',
          description: `Crear vista principal del catálogo

## Alcance
- Crear features/catalog/ui/views/catalog.tsx
- Integrar búsqueda, filtros, grid
- Manejo de estado de filtros
- Responsive

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'catalog']
        },
        {
          name: 'Catalog - Ruta en App Router',
          description: `Configurar ruta para catálogo

## Alcance
- Crear app/(authenticated)/catalogo/page.tsx
- Importar vista de catálogo
- Validar TCG seleccionado

## Estimación: 1 SP`,
          tags: ['molecula', 'routing', 'catalog']
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

## Estimación: 3 SP`,
          tags: ['atomo', 'domain', 'purchases']
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

## Estimación: 5 SP`,
          tags: ['atomo', 'forms', 'purchases']
        },
        {
          name: 'Purchases - Búsqueda con Métricas',
          description: `Crear búsqueda de cartas con métricas operativas

## Alcance
- Crear card-search-with-metrics.tsx
- Mostrar: precio referencia, stock actual, última venta, tiempo en inventario, wishlist
- Tarjeta con datos operativos
- Controles para agregar a compra

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'purchases']
        },
        {
          name: 'Purchases - Lista de Items',
          description: `Crear tabla de items de compra

## Alcance
- Crear purchase-items-table.tsx
- Columnas: Carta, Variante, Condición, Cantidad, Precio oferta, Subtotal
- Acciones: editar cantidad, cambiar condición, eliminar
- Calcular total automáticamente

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases']
        },
        {
          name: 'Purchases - Selector Vendedor',
          description: `Crear selector de vendedor

## Alcance
- Crear seller-selector.tsx
- Buscar vendedor existente
- Crear nuevo vendedor (modal)
- Campos: nombre, celular, email, notas

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases']
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

## Estimación: 3 SP`,
          tags: ['atomo', 'ui', 'purchases']
        },
        {
          name: 'Purchases - Modo Privacidad',
          description: `Crear toggle de modo privacidad

## Alcance
- Crear privacy-mode-toggle.tsx
- Store de privacidad (Zustand)
- Al activar: ocultar precio máximo, precio referencia, controles sensibles
- Persistir estado en sesión

## Estimación: 3 SP`,
          tags: ['atomo', 'ui', 'purchases']
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

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases']
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

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'purchases']
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

## Estimación: 8 SP`,
          tags: ['molecula', 'ui', 'purchases']
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

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'purchases']
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

## Estimación: 13 SP`,
          tags: ['organismo', 'ui', 'purchases']
        },
        {
          name: 'Purchases - Rutas App Router',
          description: `Configurar rutas para compras

## Alcance
- app/(authenticated)/compras/page.tsx (listado)
- app/(authenticated)/compras/nueva/page.tsx (crear)
- app/(authenticated)/compras/[id]/page.tsx (detalle)
- Validar autenticación y permisos

## Estimación: 2 SP`,
          tags: ['molecula', 'routing', 'purchases']
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

## Estimación: 3 SP`,
          tags: ['atomo', 'domain', 'sales']
        },
        {
          name: 'Sales - Forms y Schemas',
          description: `Crear forms y schemas para ventas

## Alcance
- complete-sale.schema.ts
- Mapper sale.mapper.ts
- Hooks para manejo de ventas

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'sales']
        },
        {
          name: 'Sales - Lista de Pedidos',
          description: `Crear lista de pedidos/ventas

## Alcance
- Crear sales-list.tsx
- Listado con filtros
- Badges de estado
- Acciones rápidas

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales']
        },
        {
          name: 'Sales - Card Detalle Pedido',
          description: `Crear card de detalle de pedido

## Alcance
- Crear sale-detail-card.tsx
- Información del pedido
- Items del pedido
- Estado y acciones

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales']
        },
        {
          name: 'Sales - Tabla Items',
          description: `Crear tabla de items de pedido

## Alcance
- Crear sale-items-table.tsx
- Items con cantidades
- Estado de surtido
- Acciones por item

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales']
        },
        {
          name: 'Sales - Badge Estado',
          description: `Crear badge de estado de venta

## Alcance
- Crear sale-status-badge.tsx
- Estados: Nuevo, En surtido, Listo, Completado, Cancelado
- Colores distintivos

## Estimación: 2 SP`,
          tags: ['atomo', 'ui', 'sales']
        },
        {
          name: 'Sales - Botón PDF',
          description: `Crear botón de generación PDF

## Alcance
- Crear generate-pdf-button.tsx
- Generar picking list
- Descargar PDF automático

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales']
        },
        {
          name: 'Sales - Modal Completar',
          description: `Crear modal para completar venta

## Alcance
- Crear complete-sale-modal.tsx
- Confirmación de venta
- Generación de código único
- Integración con Shopify

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales']
        },
        {
          name: 'Sales - Código Venta',
          description: `Crear display de código de venta

## Alcance
- Crear sale-code-display.tsx
- Mostrar código único
- Copiar al portapapeles

## Estimación: 2 SP`,
          tags: ['atomo', 'ui', 'sales']
        },
        {
          name: 'Sales - Botón Email Listo',
          description: `Crear botón de email "listo para recolección"

## Alcance
- Crear send-ready-email-button.tsx
- Enviar notificación email
- Confirmación de envío

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales']
        },
        {
          name: 'Sales - Vista Listado',
          description: `Crear vista principal de ventas

## Alcance
- Crear sales.tsx
- Integrar lista de pedidos
- Filtros y búsqueda
- Paginación

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'sales']
        },
        {
          name: 'Sales - Vista Detalle',
          description: `Crear vista de detalle de venta

## Alcance
- Crear sale-detail.tsx
- Información completa del pedido
- Acciones según estado
- Integrar modales

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'sales']
        },
        {
          name: 'Sales - Rutas App Router',
          description: `Configurar rutas para ventas

## Alcance
- app/(authenticated)/ventas/page.tsx (listado)
- app/(authenticated)/ventas/[id]/page.tsx (detalle)
- Validar autenticación

## Estimación: 2 SP`,
          tags: ['molecula', 'routing', 'sales']
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

## Estimación: 2 SP`,
          tags: ['atomo', 'domain', 'most-wanted']
        },
        {
          name: 'Most Wanted - Forms y Schemas',
          description: `Crear forms y schemas para Most Wanted

## Alcance
- most-wanted-card.schema.ts
- use-most-wanted-form.ts hook
- Mapper most-wanted.mapper.ts

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'most-wanted']
        },
        {
          name: 'Most Wanted - Lista Configurable',
          description: `Crear lista con drag & drop

## Alcance
- Crear most-wanted-list.tsx
- Drag & drop para ordenar
- Activar/desactivar cartas
- Editar prioridad y notas

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'most-wanted']
        },
        {
          name: 'Most Wanted - Modal Agregar',
          description: `Crear modal para agregar cartas

## Alcance
- Crear add-card-modal.tsx
- Buscar carta del catálogo
- Agregar a Most Wanted
- Definir prioridad inicial

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'most-wanted']
        },
        {
          name: 'Most Wanted - Selector Prioridad',
          description: `Crear selector de prioridad

## Alcance
- Crear card-priority-selector.tsx
- Niveles de prioridad
- Visualización clara

## Estimación: 3 SP`,
          tags: ['atomo', 'ui', 'most-wanted']
        },
        {
          name: 'Most Wanted - Preview',
          description: `Crear preview de Most Wanted

## Alcance
- Crear most-wanted-preview.tsx
- Vista previa de página pública
- Actualización en tiempo real

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'most-wanted']
        },
        {
          name: 'Most Wanted - Vista Configuración',
          description: `Crear vista de configuración

## Alcance
- Crear most-wanted-config.tsx
- Integrar todos los componentes
- Separación por TCG
- Guardar configuración

## Estimación: 8 SP`,
          tags: ['organismo', 'ui', 'most-wanted']
        },
        {
          name: 'Most Wanted - Ruta App Router',
          description: `Configurar ruta para Most Wanted

## Alcance
- app/(authenticated)/most-wanted/page.tsx
- Validar permisos (solo Admin)

## Estimación: 1 SP`,
          tags: ['molecula', 'routing', 'most-wanted']
        }
      ]
    };

    // Update tasks for each phase
    const phases = [
      { name: 'Catalog', list: catalogList, tasks: taskDetails.catalog },
      { name: 'Purchases', list: purchasesList, tasks: taskDetails.purchases },
      { name: 'Sales', list: salesList, tasks: taskDetails.sales },
      { name: 'Extras', list: extrasList, tasks: taskDetails.extras }
    ];

    let totalUpdated = 0;
    let totalFailed = 0;

    for (const phase of phases) {
      if (!phase.list) {
        log(`⚠️  ${phase.name} list not found, skipping`, 'yellow');
        continue;
      }

      log(`Updating tasks for ${phase.name} phase...`, 'blue');
      log(`List: ${phase.list.name}`, 'cyan');
      console.log();

      // Get existing tasks
      const tasksResponse = await api.getTasks(phase.list.id);
      const existingTasks = tasksResponse.tasks || [];
      
      log(`Found ${existingTasks.length} existing tasks`, 'green');
      console.log();

      let phaseUpdated = 0;
      let phaseFailed = 0;

      for (const task of existingTasks) {
        // Find matching task details
        const taskDetail = phase.tasks.find(t => t.name === task.name);
        
        if (!taskDetail) {
          log(`⚠️  No details found for: ${task.name}`, 'yellow');
          continue;
        }

        try {
          log(`Updating: ${task.name}...`, 'blue');
          
          const updateData = {
            description: taskDetail.description,
            tags: taskDetail.tags
          };

          const response = await api.updateTask(task.id, updateData);
          const updatedTask = response.task;
          
          log(`✓ Updated: ${updatedTask.name}`, 'green');
          log(`  - Description added`, 'cyan');
          log(`  - Tags: ${taskDetail.tags.join(', ')}`, 'cyan');
          phaseUpdated++;
          totalUpdated++;
          
        } catch (error) {
          log(`✗ Failed to update "${task.name}": ${error.message}`, 'red');
          phaseFailed++;
          totalFailed++;
        }
        
        console.log();
      }

      log(`${phase.name} phase: ${phaseUpdated} updated, ${phaseFailed} failed`, phaseFailed > 0 ? 'yellow' : 'green');
      console.log();
    }

    // Summary
    log('========================================', 'cyan');
    log('  UPDATE SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log(`Total tasks updated: ${totalUpdated}`, 'green');
    log(`Total tasks failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'yellow');
    console.log();

    log('Updated phases:', 'blue');
    log(`- Catalog: ${taskDetails.catalog.length} tasks`, 'cyan');
    log(`- Purchases: ${taskDetails.purchases.length} tasks`, 'cyan');
    log(`- Sales: ${taskDetails.sales.length} tasks`, 'cyan');
    log(`- Extras: ${taskDetails.extras.length} tasks`, 'cyan');
    console.log();

    log('========================================', 'green');
    log('✓ Task details update complete!', 'green');
    log('========================================', 'green');
    console.log();

    log('All tasks now have:', 'blue');
    console.log('- Detailed descriptions with scope and estimation');
    console.log('- Proper tags for organization (atomo, molecula, organismo, etc.)');
    console.log('- Layer classification (domain, ui, forms, routing)');
    console.log('- Feature identification');
    console.log();

    log('View updated tasks:', 'blue');
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
  updateTasksWithDetails();
}

export default updateTasksWithDetails;
