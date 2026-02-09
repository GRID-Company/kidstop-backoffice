# ClickUp Workflow Guide

Guía para trabajar con la integración de ClickUp siguiendo el flujo de GRID.

## Flujo de Trabajo GRID

### Estructura en ClickUp

```
DEV GRID (Workspace)
└── Producción (Space)
    └── Folders (Proyectos)
        ├── Template - Frontend
        ├── Kidstop v1.0.0
        ├── Iguanas Ranas 1.0.0
        └── otros proyectos...
```

Cada folder contiene **listas con estados personalizados**:
- ✅ DONE
- 🔴 BLOCKED / ON HOLD
- 🔄 IN PROGRESS
- 📋 TODO
- 📚 BACKLOG

## Configuración Inicial

### Opción 1: Usar Folder Existente (Recomendado)

Si ya tienes un folder creado en ClickUp (ej: "Template - Frontend"):

#### 1. Obtener el Folder ID

```bash
# Listar todos los folders en tu workspace
npm run clickup:get-folder
```

Esto mostrará algo como:

```
📁 Space: Producción

  📂 Template - Frontend
     ID: 90123456789
     Lists: 5

  📂 Kidstop v1.0.0
     ID: 90123456790
     Lists: 4
```

#### 2. Configurar en .env

```bash
# Agregar el folder ID a tu .env
CLICKUP_FOLDER_ID=90123456789
```

#### 3. Ejecutar Setup

```bash
npm run clickup:setup
```

El script:
- ✅ Detectará el folder existente
- ✅ Usará las listas que ya tienes
- ✅ Agregará custom fields a la primera lista
- ✅ Guardará la configuración

### Opción 2: Crear Folder Nuevo

Si quieres que el script cree un folder nuevo:

#### 1. NO especificar CLICKUP_FOLDER_ID

Dejar vacío o comentar en `.env`:

```bash
# CLICKUP_FOLDER_ID=
```

#### 2. Ejecutar Setup

```bash
npm run clickup:setup
```

El script:
- ✅ Creará un folder con el nombre del proyecto
- ✅ Creará una lista "Tasks" dentro del folder
- ✅ Agregará custom fields

### Opción 3: Copiar Folder Existente (Manual)

Si prefieres copiar un folder existente en ClickUp:

#### 1. Copiar Folder en ClickUp

1. Ir a ClickUp → Space "Producción"
2. Click derecho en folder existente (ej: "Template - Frontend")
3. Seleccionar "Duplicate"
4. Renombrar el folder duplicado

#### 2. Obtener el Folder ID del nuevo folder

```bash
npm run clickup:get-folder
```

#### 3. Configurar y ejecutar setup

```bash
# En .env
CLICKUP_FOLDER_ID=<nuevo_folder_id>

# Ejecutar
npm run clickup:setup
```

## Custom Fields

El setup agrega estos custom fields a tu lista:

### Feature
Tipo: Dropdown
- auth
- inventory
- windows
- shared
- other

### Layer
Tipo: Dropdown
- adapters
- domain
- ui
- config

### Priority
Tipo: Dropdown
- high
- medium
- low

### Estimated Time
Tipo: Text
Ejemplo: "2h", "1d", "3h"

### Module
Tipo: Text
Nombre del módulo específico

### Branch
Tipo: Text
Nombre del branch de Git

## Uso Diario

### Crear Tarea

```bash
npm run clickup:create-task -- \
  --title "Implementar login form" \
  --feature "auth" \
  --layer "ui" \
  --priority "high" \
  --time "3h" \
  --description "Crear formulario de login con validación"
```

### Actualizar Tarea

```bash
npm run clickup:update-task -- \
  --task TASK_ID \
  --status "in progress" \
  --branch "feature/login-form" \
  --comment "Iniciando implementación"
```

### Ver Dashboard

```bash
npm run clickup:sync
```

Muestra:
- 📊 Resumen de tareas (total, done, in progress, todo)
- 🎯 Distribución por prioridad
- 🎨 Distribución por feature
- 📦 Distribución por layer
- ⚡ Velocidad del equipo
- 📝 Estadísticas de Git

## Integración con GitHub Actions

Una vez configurado ClickUp, los workflows de GitHub pueden:

1. **Crear branch automáticamente** desde issue
2. **Actualizar status** cuando se abre/cierra PR
3. **Agregar comentarios** con links a commits
4. **Sincronizar dashboard** en cada release

Ver: `docs/GITHUB_ACTIONS.md` (Parte 3)

## Troubleshooting

### Error: "Folder not found"

```bash
# Verificar que el folder ID es correcto
npm run clickup:get-folder

# Actualizar en .env
CLICKUP_FOLDER_ID=<correct_id>
```

### Error: "Custom field already exists"

Esto es normal si ejecutas el setup múltiples veces. Los custom fields ya existen y se omiten.

### No aparecen los custom fields

1. Ir a ClickUp → Tu lista
2. Click en "..." → "Customize"
3. Verificar que los custom fields estén visibles

### Quiero usar otra lista del folder

Por defecto se usa la primera lista. Para cambiar:

```bash
# Obtener el list ID manualmente desde ClickUp
# URL: https://app.clickup.com/<workspace>/<space>/<folder>/li/<LIST_ID>

# Actualizar en .env
CLICKUP_LIST_ID=<list_id>
```

## Mejores Prácticas

### 1. Mantener Folder Organizado

- Un folder por proyecto
- Listas con estados claros
- Custom fields consistentes

### 2. Usar Convenciones

```bash
# Tareas
[Feature] Descripción breve
Ejemplo: [auth] Implementar login form

# Branches
feature/<issue-number>-<description>
Ejemplo: feature/123-login-form
```

### 3. Sincronizar Regularmente

```bash
# Al final del día
npm run clickup:sync

# Revisar progreso
# Ajustar estimaciones
```

### 4. Documentar en Tareas

- Agregar descripción detallada
- Incluir criterios de aceptación
- Linkear a documentación relevante

## Comandos Rápidos

```bash
# Setup inicial
npm run clickup:setup

# Obtener folder ID
npm run clickup:get-folder

# Crear tarea
npm run clickup:create-task -- --title "Task" --feature "auth"

# Actualizar tarea
npm run clickup:update-task -- --task ID --status "done"

# Ver dashboard
npm run clickup:sync
```

## Recursos

- [ClickUp API Documentation](https://clickup.com/api)
- [Environment Setup Guide](ENVIRONMENT_SETUP.md)
- [GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md)
