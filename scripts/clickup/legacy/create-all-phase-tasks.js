#!/usr/bin/env node

/**
 * Create complete planning for all phases
 * Creates tasks for Catalog, Purchases, Sales, and Extras phases
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

async function createAllPhaseTasks() {
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
    log('  Creating Complete Planning', 'blue');
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

    // Define tasks for each phase
    const phaseTasks = {
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
          tags: ['atomo', 'domain', 'catalog'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Catalog',
            'Layer': 'Domain',
            'Priority': 'High',
            'Estimated Time': '3 SP'
          }
        },
        {
          name: 'Catalog - Forms y Schemas',
          description: `Crear forms y schemas para catálogo

## Alcance
- Crear card-price.schema.ts
- Crear use-card-price-form.ts hook
- Mapper card.mapper.ts

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'catalog'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Catalog',
            'Layer': 'Adapters',
            'Priority': 'High',
            'Estimated Time': '3 SP'
          }
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
          tags: ['molecula', 'ui', 'catalog'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Catalog',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['molecula', 'ui', 'catalog'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Catalog',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['organismo', 'ui', 'catalog'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Catalog',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '8 SP'
          }
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
          tags: ['organismo', 'ui', 'catalog'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Catalog',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '8 SP'
          }
        },
        {
          name: 'Catalog - Ruta en App Router',
          description: `Configurar ruta para catálogo

## Alcance
- Crear app/(authenticated)/catalogo/page.tsx
- Importar vista de catálogo
- Validar TCG seleccionado

## Estimación: 1 SP`,
          tags: ['molecula', 'routing', 'catalog'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Catalog',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '1 SP'
          }
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
          tags: ['atomo', 'domain', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'Domain',
            'Priority': 'High',
            'Estimated Time': '3 SP'
          }
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
          tags: ['atomo', 'forms', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'Adapters',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['organismo', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '8 SP'
          }
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
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['atomo', 'ui', 'purchases'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '3 SP'
          }
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
          tags: ['atomo', 'ui', 'purchases'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '3 SP'
          }
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
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['molecula', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '8 SP'
          }
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
          tags: ['organismo', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '8 SP'
          }
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
          tags: ['organismo', 'ui', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '13 SP'
          }
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
          tags: ['molecula', 'routing', 'purchases'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Purchases',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '2 SP'
          }
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
          tags: ['atomo', 'domain', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'Domain',
            'Priority': 'High',
            'Estimated Time': '3 SP'
          }
        },
        {
          name: 'Sales - Forms y Schemas',
          description: `Crear forms y schemas para ventas

## Alcance
- complete-sale.schema.ts
- Mapper sale.mapper.ts
- Hooks para manejo de ventas

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'Adapters',
            'Priority': 'High',
            'Estimated Time': '3 SP'
          }
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
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
        },
        {
          name: 'Sales - Badge Estado',
          description: `Crear badge de estado de venta

## Alcance
- Crear sale-status-badge.tsx
- Estados: Nuevo, En surtido, Listo, Completado, Cancelado
- Colores distintivos

## Estimación: 2 SP`,
          tags: ['atomo', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '2 SP'
          }
        },
        {
          name: 'Sales - Botón PDF',
          description: `Crear botón de generación PDF

## Alcance
- Crear generate-pdf-button.tsx
- Generar picking list
- Descargar PDF automático

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
        },
        {
          name: 'Sales - Código Venta',
          description: `Crear display de código de venta

## Alcance
- Crear sale-code-display.tsx
- Mostrar código único
- Copiar al portapapeles

## Estimación: 2 SP`,
          tags: ['atomo', 'ui', 'sales'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '2 SP'
          }
        },
        {
          name: 'Sales - Botón Email Listo',
          description: `Crear botón de email "listo para recolección"

## Alcance
- Crear send-ready-email-button.tsx
- Enviar notificación email
- Confirmación de envío

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '5 SP'
          }
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
          tags: ['organismo', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '8 SP'
          }
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
          tags: ['organismo', 'ui', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '8 SP'
          }
        },
        {
          name: 'Sales - Rutas App Router',
          description: `Configurar rutas para ventas

## Alcance
- app/(authenticated)/ventas/page.tsx (listado)
- app/(authenticated)/ventas/[id]/page.tsx (detalle)
- Validar autenticación

## Estimación: 2 SP`,
          tags: ['molecula', 'routing', 'sales'],
          priority: 'high',
          custom_fields: {
            'Feature': 'Sales',
            'Layer': 'UI',
            'Priority': 'High',
            'Estimated Time': '2 SP'
          }
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
          tags: ['atomo', 'domain', 'most-wanted'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'Domain',
            'Priority': 'Medium',
            'Estimated Time': '2 SP'
          }
        },
        {
          name: 'Most Wanted - Forms y Schemas',
          description: `Crear forms y schemas para Most Wanted

## Alcance
- most-wanted-card.schema.ts
- use-most-wanted-form.ts hook
- Mapper most-wanted.mapper.ts

## Estimación: 3 SP`,
          tags: ['atomo', 'forms', 'most-wanted'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'Adapters',
            'Priority': 'Medium',
            'Estimated Time': '3 SP'
          }
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
          tags: ['organismo', 'ui', 'most-wanted'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '8 SP'
          }
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
          tags: ['molecula', 'ui', 'most-wanted'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '5 SP'
          }
        },
        {
          name: 'Most Wanted - Selector Prioridad',
          description: `Crear selector de prioridad

## Alcance
- Crear card-priority-selector.tsx
- Niveles de prioridad
- Visualización clara

## Estimación: 3 SP`,
          tags: ['atomo', 'ui', 'most-wanted'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '3 SP'
          }
        },
        {
          name: 'Most Wanted - Preview',
          description: `Crear preview de Most Wanted

## Alcance
- Crear most-wanted-preview.tsx
- Vista previa de página pública
- Actualización en tiempo real

## Estimación: 5 SP`,
          tags: ['molecula', 'ui', 'most-wanted'],
          priority: 'low',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'UI',
            'Priority': 'Low',
            'Estimated Time': '5 SP'
          }
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
          tags: ['organismo', 'ui', 'most-wanted'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '8 SP'
          }
        },
        {
          name: 'Most Wanted - Ruta App Router',
          description: `Configurar ruta para Most Wanted

## Alcance
- app/(authenticated)/most-wanted/page.tsx
- Validar permisos (solo Admin)

## Estimación: 1 SP`,
          tags: ['molecula', 'routing', 'most-wanted'],
          priority: 'medium',
          custom_fields: {
            'Feature': 'Most Wanted',
            'Layer': 'UI',
            'Priority': 'Medium',
            'Estimated Time': '1 SP'
          }
        }
      ]
    };

    // Create tasks for each phase
    const phases = [
      { name: 'Catalog', list: catalogList, tasks: phaseTasks.catalog },
      { name: 'Purchases', list: purchasesList, tasks: phaseTasks.purchases },
      { name: 'Sales', list: salesList, tasks: phaseTasks.sales },
      { name: 'Extras', list: extrasList, tasks: phaseTasks.extras }
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

      for (const task of phase.tasks) {
        try {
          log(`Creating: ${task.name}...`, 'blue');
          
          const taskData = {
            name: task.name,
            description: task.description,
            assignees: [],
            status: 'todo',
            due_date: null,
            due_date_time: false,
            time_estimate: null,
            start_date: null,
            start_date_time: false,
            notify_all: true,
            parent: null,
            links_to: null,
            custom_task_id: null,
            custom_fields: {
            'Feature': task.custom_fields['Feature'],
            'Layer': task.custom_fields['Layer'],
            'Estimated Time': task.custom_fields['Estimated Time']
          },
            tags: task.tags || []
          };

          const response = await api.createTask(phase.list.id, taskData);
          const createdTask = response.task;
          
          log(`✓ Created: ${createdTask.name}`, 'green');
          phaseCreated++;
          totalCreated++;
          
        } catch (error) {
          log(`✗ Failed to create "${task.name}": ${error.message}`, 'red');
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
    log('  COMPLETE PLANNING SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log(`Total tasks created: ${totalCreated}`, 'green');
    log(`Total tasks failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'yellow');
    console.log();

    log('Tasks by phase:', 'blue');
    log(`- Catalog: ${phaseTasks.catalog.length} tasks`, 'cyan');
    log(`- Purchases: ${phaseTasks.purchases.length} tasks`, 'cyan');
    log(`- Sales: ${phaseTasks.sales.length} tasks`, 'cyan');
    log(`- Extras: ${phaseTasks.extras.length} tasks`, 'cyan');
    console.log();

    log('Total planning:', 'blue');
    log(`- Foundation: 14 tasks (already created)`, 'cyan');
    log(`- Catalog: ${phaseTasks.catalog.length} tasks`, 'cyan');
    log(`- Purchases: ${phaseTasks.purchases.length} tasks`, 'cyan');
    log(`- Sales: ${phaseTasks.sales.length} tasks`, 'cyan');
    log(`- Extras: ${phaseTasks.extras.length} tasks`, 'cyan');
    log(`- Total: ${14 + phaseTasks.catalog.length + phaseTasks.purchases.length + phaseTasks.sales.length + phaseTasks.extras.length} tasks`, 'green');
    console.log();

    log('========================================', 'green');
    log('✓ Complete planning setup finished!', 'green');
    log('========================================', 'green');
    console.log();

    log('Next steps:', 'blue');
    console.log('1. Assign tasks to team members');
    console.log('2. Set dependencies between tasks');
    console.log('3. Start with Foundation phase tasks');
    console.log('4. Move to next phases when ready');
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
  createAllPhaseTasks();
}

export default createAllPhaseTasks;
