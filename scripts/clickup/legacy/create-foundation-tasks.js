#!/usr/bin/env node

/**
 * Create initial tasks for Foundation phase (Phase 1)
 * Creates tasks for TCG Context, Authentication, Users, and Settings
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

async function createFoundationTasks() {
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
    log('  Creating Foundation Phase Tasks', 'blue');
    log('========================================', 'blue');
    console.log();

    // Get lists in folder
    const listsResponse = await api.getLists(folderId);
    const allLists = listsResponse.lists || [];
    
    // Find Foundation list
    const foundationList = allLists.find(list => list.name === 'Foundation');
    
    if (!foundationList) {
      log('✗ Foundation list not found', 'red');
      process.exit(1);
    }

    log(`Using list: ${foundationList.name}`, 'cyan');
    console.log();

    // Define tasks for Foundation phase
    const tasks = [
      {
        name: 'TCG Context - Store Zustand',
        description: `Crear store de Zustand para manejar contexto TCG (Pokémon/Magic)

## Alcance
- Crear lib/store/tcg-context.ts
- Definir tipos TCGType (POKEMON, MAGIC)
- Implementar selectedTCG state
- Implementar setTCG action
- Persistir en localStorage
- Agregar tests unitarios

## Criterios de Aceptación
- Store persiste selección en localStorage
- Estado se restaura al recargar
- TypeScript sin errores

## Referencias
- docs/IMPLEMENTATION_PLAN.md - Sección 3
- docs/PROJECT_CONTEXT.md - Selector de Contexto TCG

## Estimación: 2 SP`,
        tags: ['atomo', 'store', 'tcg'],
        priority: 'high',
        custom_fields: {
          'Feature': 'TCG Context',
          'Layer': 'Domain',
          'Priority': 'High',
          'Estimated Time': '2 SP'
        }
      },
      {
        name: 'TCG Context - Componente UI',
        description: `Crear componente dropdown para seleccionar TCG en navbar

## Alcance
- Crear shared/base/tcg-selector.tsx
- Integrar con store de contexto
- Diseño responsive
- Iconos Pokémon y Magic
- Feedback visual de selección
- Testing en diferentes resoluciones

## Criterios de Aceptación
- Dropdown funcional en navbar
- Cambia contexto globalmente
- Responsive móvil/tablet/desktop

## Dependencies: TCG Context - Store Zustand
## Estimación: 3 SP`,
        tags: ['atomo', 'ui', 'tcg'],
        priority: 'high',
        custom_fields: {
          'Feature': 'TCG Context',
          'Layer': 'UI',
          'Priority': 'High',
          'Estimated Time': '3 SP'
        }
      },
      {
        name: 'TCG Context - Integración Layout',
        description: `Integrar selector TCG en layout autenticado

## Alcance
- Modificar shared/layouts/authenticated-layout.tsx
- Agregar TCGSelector en navbar
- Validar posicionamiento
- Testing visual

## Dependencies: TCG Context - Componente UI
## Estimación: 2 SP`,
        tags: ['molecula', 'layout', 'tcg'],
        priority: 'high',
        custom_fields: {
          'Feature': 'TCG Context',
          'Layer': 'UI',
          'Priority': 'High',
          'Estimated Time': '2 SP'
        }
      },
      {
        name: 'Backend - TCG Type GraphQL Schema',
        description: `Agregar enum TCGType al schema GraphQL

## Alcance
- Definir enum TCGType (POKEMON, MAGIC)
- Agregar campo tcgType a entidades relevantes
- Actualizar queries para filtrar por TCG
- Ejecutar npm run codegen
- Validar tipos generados

## Criterios de Aceptación
- Enum disponible en schema
- Tipos generados correctamente
- Queries filtran por TCG

## Estimación: 2 SP`,
        tags: ['backend', 'graphql', 'tcg'],
        priority: 'high',
        custom_fields: {
          'Feature': 'TCG Context',
          'Layer': 'API',
          'Priority': 'High',
          'Estimated Time': '2 SP'
        }
      },
      {
        name: 'Auth - Recuperación de Contraseña (Backend)',
        description: `Implementar recuperación de contraseña en backend

## Alcance
- Mutation forgotPassword
- Mutation resetPassword
- Generar token temporal
- Enviar email con enlace
- Validar token y expiración
- Tests

## Estimación: 5 SP`,
        tags: ['backend', 'auth', 'email'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Authentication',
          'Layer': 'API',
          'Priority': 'High',
          'Estimated Time': '5 SP'
        }
      },
      {
        name: 'Auth - Recuperación de Contraseña (Frontend)',
        description: `Implementar recuperación de contraseña en frontend

## Alcance
- Crear forgot-password.schema.ts
- Crear reset-password.schema.ts
- Componente forgot-password-form.tsx
- Componente reset-password-form.tsx
- Vista forgot-password.tsx
- Vista reset-password.tsx
- Integrar con API
- Manejo de errores

## Dependencies: Auth - Recuperación de Contraseña (Backend)
## Estimación: 5 SP`,
        tags: ['atomo', 'auth', 'forms'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Authentication',
          'Layer': 'UI',
          'Priority': 'High',
          'Estimated Time': '5 SP'
        }
      },
      {
        name: 'Auth - Cambio de Contraseña desde Perfil',
        description: `Implementar cambio de contraseña desde perfil

## Alcance
- Mutation changePassword
- Schema de validación
- Componente change-password-form.tsx
- Integrar en página de perfil
- Validar contraseña actual
- Tests

## Estimación: 3 SP`,
        tags: ['molecula', 'auth', 'profile'],
        priority: 'medium',
        custom_fields: {
          'Feature': 'Authentication',
          'Layer': 'UI',
          'Priority': 'Medium',
          'Estimated Time': '3 SP'
        }
      },
      {
        name: 'Usuarios - GraphQL Schema y Mutations',
        description: `Definir schema y mutations para gestión de usuarios

## Alcance
- Definir tipos User, UserRole, UserStatus
- Query getUsers con filtros
- Query getUser por ID
- Mutation createUser
- Mutation updateUser
- Mutation toggleUserStatus
- Middleware de permisos (solo Admin)
- Tests

## Estimación: 8 SP`,
        tags: ['backend', 'graphql', 'users'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Users and Roles',
          'Layer': 'API',
          'Priority': 'High',
          'Estimated Time': '8 SP'
        }
      },
      {
        name: 'Usuarios - Domain y Types',
        description: `Crear domain types para gestión de usuarios

## Alcance
- Crear features/users/domain/types.ts
- Definir UserRole, UserStatus, UserFilters
- Crear constants.ts (ROLES, USER_STATUS)
- Crear users.domain.ts (getUsersVars, validateUserRole)

## Dependencies: Usuarios - GraphQL Schema y Mutations
## Estimación: 2 SP`,
        tags: ['atomo', 'domain', 'users'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Users and Roles',
          'Layer': 'Domain',
          'Priority': 'High',
          'Estimated Time': '2 SP'
        }
      },
      {
        name: 'Usuarios - Forms y Schemas',
        description: `Crear forms y schemas para gestión de usuarios

## Alcance
- Crear user-form.schema.ts (Zod)
- Campos: nombre, email, rol, estado
- Validaciones
- Crear use-user-form.ts hook
- Mapper user.mapper.ts

## Estimación: 3 SP`,
        tags: ['atomo', 'forms', 'users'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Users and Roles',
          'Layer': 'Adapters',
          'Priority': 'High',
          'Estimated Time': '3 SP'
        }
      },
      {
        name: 'Usuarios - Componentes UI',
        description: `Crear componentes UI para gestión de usuarios

## Alcance
- user-card.tsx
- user-form-modal.tsx
- user-filters.tsx
- user-role-badge.tsx
- user-status-badge.tsx

## Estimación: 5 SP`,
        tags: ['atomo', 'ui', 'users'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Users and Roles',
          'Layer': 'UI',
          'Priority': 'High',
          'Estimated Time': '5 SP'
        }
      },
      {
        name: 'Usuarios - Vista Principal',
        description: `Crear vista principal de gestión de usuarios

## Alcance
- Crear features/users/ui/views/users.tsx
- Listado con tabla/cards
- Búsqueda y filtros
- Paginación
- Integrar modal de creación/edición
- Acciones (activar/desactivar)
- Validar permisos por rol

## Dependencies: Usuarios - Componentes UI
## Estimación: 8 SP`,
        tags: ['organismo', 'ui', 'users'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Users and Roles',
          'Layer': 'UI',
          'Priority': 'High',
          'Estimated Time': '8 SP'
        }
      },
      {
        name: 'Usuarios - Ruta en App Router',
        description: `Configurar rutas para gestión de usuarios

## Alcance
- Crear app/(authenticated)/usuarios/page.tsx
- Importar vista de usuarios
- Validar autenticación
- Testing navegación

## Dependencies: Usuarios - Vista Principal
## Estimación: 1 SP`,
        tags: ['molecula', 'routing', 'users'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Users and Roles',
          'Layer': 'UI',
          'Priority': 'High',
          'Estimated Time': '1 SP'
        }
      },
      {
        name: 'Settings - GraphQL Schema Básico',
        description: `Definir schema básico para configuración global

## Alcance
- Definir tipos Settings, GeofenceConfig, BudgetConfig
- Query getSettings
- Mutation updateSettings
- Validaciones básicas
- Tests

## Estimación: 5 SP`,
        tags: ['backend', 'graphql', 'settings'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Global Settings',
          'Layer': 'API',
          'Priority': 'High',
          'Estimated Time': '5 SP'
        }
      },
      {
        name: 'Settings - Domain Types',
        description: `Crear domain types para configuración global

## Alcance
- Crear features/settings/domain/types.ts
- Definir Settings, GeofenceConfig, BudgetConfig
- Crear constants.ts
- Validaciones de configuración

## Dependencies: Settings - GraphQL Schema Básico
## Estimación: 2 SP`,
        tags: ['atomo', 'domain', 'settings'],
        priority: 'high',
        custom_fields: {
          'Feature': 'Global Settings',
          'Layer': 'Domain',
          'Priority': 'High',
          'Estimated Time': '2 SP'
        }
      },
      {
        name: 'Settings - Vista de Configuración',
        description: `Crear vista para configuración global

## Alcance
- Crear features/settings/ui/views/settings.tsx
- Secciones: Geofence, Presupuestos, Umbrales
- Formularios de configuración
- Validaciones
- Guardar cambios

## Estimación: 8 SP`,
        tags: ['organismo', 'ui', 'settings'],
        priority: 'medium',
        custom_fields: {
          'Feature': 'Global Settings',
          'Layer': 'UI',
          'Priority': 'Medium',
          'Estimated Time': '8 SP'
        }
      },
      {
        name: 'Settings - Ruta en App Router',
        description: `Configurar ruta para configuración global

## Alcance
- Crear app/(authenticated)/configuracion/page.tsx
- Importar vista de settings
- Validar permisos (solo Admin)

## Dependencies: Settings - Vista de Configuración
## Estimación: 1 SP`,
        tags: ['molecula', 'routing', 'settings'],
        priority: 'medium',
        custom_fields: {
          'Feature': 'Global Settings',
          'Layer': 'UI',
          'Priority': 'Medium',
          'Estimated Time': '1 SP'
        }
      }
    ];

    log(`Creating ${tasks.length} tasks for Foundation phase...`, 'blue');
    console.log();

    let createdCount = 0;
    let failedCount = 0;

    for (const task of tasks) {
      try {
        log(`Creating task: ${task.name}...`, 'blue');
        
        const taskData = {
          name: task.name,
          description: task.description,
          assignees: [], // Will be assigned manually
          status: 'todo',
          // priority: task.priority === 'high' ? 'high' : 'normal', // Remove for now
          due_date: null,
          due_date_time: false,
          time_estimate: null,
          start_date: null,
          start_date_time: false,
          notify_all: true,
          parent: null,
          links_to: null,
          custom_task_id: null,
          custom_fields: task.custom_fields || {},
          tags: task.tags || []
        };

        const response = await api.createTask(foundationList.id, taskData);
        const createdTask = response.task;
        
        log(`✓ Created: ${createdTask.name} (ID: ${createdTask.id})`, 'green');
        createdCount++;
        
      } catch (error) {
        log(`✗ Failed to create "${task.name}": ${error.message}`, 'red');
        failedCount++;
      }
      
      console.log();
    }

    // Summary
    log('========================================', 'cyan');
    log('  SUMMARY', 'cyan');
    log('========================================', 'cyan');
    console.log();

    log(`Tasks created: ${createdCount}`, 'green');
    log(`Tasks failed: ${failedCount}`, failedCount > 0 ? 'red' : 'yellow');
    console.log();

    log('Foundation phase tasks include:', 'blue');
    console.log('- TCG Context (4 tasks)');
    console.log('- Authentication (3 tasks)');
    console.log('- Users and Roles (7 tasks)');
    console.log('- Global Settings (4 tasks)');
    console.log();

    log('========================================', 'green');
    log('✓ Foundation phase tasks creation complete!', 'green');
    log('========================================', 'green');
    console.log();

    log('Next steps:', 'blue');
    console.log('1. Assign tasks to team members');
    console.log('2. Set dependencies between tasks');
    console.log('3. Start with TCG Context tasks');
    console.log();

    log('View Foundation list:', 'blue');
    console.log(`https://app.clickup.com/${workspaceId}/v/li/${foundationList.id}`);

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
  createFoundationTasks();
}

export default createFoundationTasks;
