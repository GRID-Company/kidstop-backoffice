# GRID Frontend Template

Template base para proyectos frontend con Next.js 16, React 19, TypeScript 5 y sistema de automatización integrado.

## Stack Tecnológico

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **HeroUI** - Componentes UI
- **Zustand** - State management
- **Apollo Client** - GraphQL client
- **GraphQL Codegen** - Generación de tipos

## Arquitectura

Este proyecto sigue una arquitectura **Feature-First** con capas bien definidas:

```
src/features/
├── {feature-name}/
│   ├── adapters/     # API calls, forms, mappers
│   ├── domain/       # Types, constants, business logic
│   └── ui/           # Components, views, hooks
```

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.template .env

# Editar .env con tus valores
nano .env
```

**Variables mínimas requeridas:**
- `PROJECT_NAME` - Nombre del proyecto
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` - URL del API GraphQL

### 3. Validar Configuración

```bash
./scripts/setup/validate-env.sh
```

Este script verificará que todas las variables necesarias estén configuradas correctamente.

### 4. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Sistema de Automatización

Este template incluye un sistema completo de automatización que integra:

- ✅ **ClickUp** - Gestión de tareas
- ✅ **GitHub Actions** - CI/CD automatizado
- ✅ **AWS Amplify** - Deploy automático
- ✅ **SendGrid** - Notificaciones por email

### Configuración de Automatización

Ver guías detalladas:

- **[Environment Setup](docs/ENVIRONMENT_SETUP.md)** - Configuración de variables de entorno
- **[GitHub Secrets Setup](docs/GITHUB_SECRETS_SETUP.md)** - Configuración de secrets para CI/CD

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run start            # Servidor de producción

# Calidad de código
npm run lint             # Ejecutar linter
npm run format           # Formatear código
npm run format:check     # Verificar formato

# GraphQL
npm run codegen          # Generar tipos de GraphQL

# Validación
./scripts/setup/validate-env.sh           # Validar variables de entorno
./scripts/setup/setup-github-secrets.sh   # Configurar GitHub Secrets
```

## Features Incluidas

### 🔐 Authentication
- Login/Logout
- Cookie-based auth
- Protected routes

### 📦 Inventory
- CRUD operations
- Filtros y búsqueda
- Paginación

### 🪟 Windows
- Gestión de ventanas
- Configuración de perfiles
- Upload de imágenes

## Estructura del Proyecto

```
template-front-end/
├── .github/              # GitHub Actions workflows (próximamente)
├── docs/                 # Documentación
│   ├── ENVIRONMENT_SETUP.md
│   └── GITHUB_SECRETS_SETUP.md
├── public/               # Assets estáticos
├── scripts/              # Scripts de automatización
│   └── setup/
│       ├── validate-env.sh
│       └── setup-github-secrets.sh
├── src/
│   ├── app/             # Next.js App Router
│   ├── features/        # Features (feature-first)
│   ├── lib/             # Utilidades, API, tipos
│   └── shared/          # Componentes compartidos
├── .env.template        # Template de variables
├── .env.example         # Ejemplo con documentación
└── package.json
```

## Desarrollo

### Crear Nueva Feature

```bash
src/features/
└── my-feature/
    ├── adapters/
    │   ├── api/          # Queries y mutations GraphQL
    │   ├── forms/        # Schemas y hooks de formularios
    │   └── mappers/      # Transformación de datos
    ├── domain/
    │   ├── types.ts      # Tipos TypeScript
    │   └── constants.ts  # Constantes
    └── ui/
        ├── components/   # Componentes React
        ├── views/        # Páginas/vistas
        └── hooks/        # Custom hooks
```

### Convenciones

- **Nombres de archivos**: kebab-case (`my-component.tsx`)
- **Componentes**: PascalCase (`MyComponent`)
- **Funciones/variables**: camelCase (`myFunction`)
- **Constantes**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Tipos**: PascalCase con prefijo I (`IMyType`)

## Recursos

### Documentación

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HeroUI Documentation](https://heroui.com)

### Guías del Proyecto

- [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md)
- [GitHub Secrets Setup Guide](docs/GITHUB_SECRETS_SETUP.md)

## Troubleshooting

### Error: Variables de entorno no se cargan

```bash
# Verificar que .env existe
ls -la .env

# Validar configuración
./scripts/setup/validate-env.sh

# Reiniciar servidor
npm run dev
```

### Error: GraphQL types desactualizados

```bash
# Regenerar tipos
npm run codegen
```

### Error: Permisos en scripts

```bash
# Dar permisos de ejecución
chmod +x scripts/setup/*.sh
```

## Licencia

Privado - GRID Company
