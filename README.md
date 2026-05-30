# Kidstop Backoffice

Panel administrativo de **Kidstop Singles Platform** para operar compras, inventario y ventas de cartas singles de Pokémon TCG y Magic: The Gathering.

## Stack Tecnológico

- **Next.js 16** — Framework React con App Router
- **React 19** — Server Components
- **TypeScript 5** — Tipado estático
- **Tailwind CSS 4** — Utility-first CSS
- **HeroUI 2.8+** — Componentes UI
- **Zustand** — State management
- **Apollo Client 4** — Cliente GraphQL
- **GraphQL Codegen** — Generación automática de tipos

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **Login** | Autenticación, sesión via cookies, recuperación de contraseña |
| **Usuarios** | CRUD de staff (Admin, Recepción, Comprador) |
| **Catálogo** | Búsqueda de cartas con contexto TCG, catálogo interno, precios públicos |
| **Compras** | Buylist con negociación, presupuesto, cotización WhatsApp, modo privacidad |
| **Inventario** | Stock por Carta + Variante + Condición, movimientos, métricas |
| **Ventas** | Pedidos desde Carpeta Digital, picking list PDF, código Shopify |
| **Clientes** | Clasificación VIP, bloqueos, validación de ubicación |
| **Most Wanted** | Configuración de páginas públicas por TCG con drag & drop |
| **Configuración** | Geofence, umbrales, presupuestos, límites de inventario |

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.template .env
```

**Variables mínimas requeridas:**
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` — URL del API GraphQL
- `NEXT_PUBLIC_API_URL` — URL del API para Apollo Client

### 3. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts Disponibles

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
npm run codegen          # Generar tipos desde el schema del backend
```

## Arquitectura

Arquitectura **Feature-First** con tres capas por módulo:

```
src/features/{feature}/
├── adapters/          # API (queries/mutations), forms (Zod), mappers
├── domain/            # Tipos, constantes, lógica de negocio
└── ui/                # Componentes, vistas, hooks
```

### Estructura del Proyecto

```
kidstop-backoffice/
├── docs/                       # Documentación del proyecto
├── scripts/                    # Scripts de automatización
├── src/
│   ├── app/
│   │   ├── (authenticated)/    # Rutas protegidas (todos los módulos)
│   │   ├── (not-authenticated)/ # Login
│   │   └── api/                # API routes (cookies de sesión)
│   ├── features/               # Módulos del negocio
│   │   ├── login/
│   │   ├── users/
│   │   ├── catalog/
│   │   ├── purchases/
│   │   ├── inventory-cards/
│   │   ├── sales/
│   │   ├── customers/
│   │   ├── most-wanted/
│   │   └── settings/
│   ├── lib/                    # Core compartido
│   │   ├── api/                # Apollo Client + codegen
│   │   ├── auth/               # Hooks de autenticación
│   │   ├── store/              # Zustand (auth, TCG context, privacy mode)
│   │   ├── types/              # Tipos globales (TCG, card, inventory)
│   │   ├── consts/             # Constantes (rutas, temas, opciones TCG)
│   │   └── utils/              # Utilidades (formato, PDF, paginación)
│   └── shared/                 # Componentes compartidos
│       ├── base/               # Componentes base
│       ├── blocks/             # EntitiesPage, DataTable
│       ├── layouts/            # Sidebar, authenticated layout
│       └── providers/          # Apollo, HeroUI
├── codegen.ts                  # Configuración de GraphQL Codegen
├── hero.ts                     # Plugin HeroUI para Tailwind
└── package.json
```

## Estado Actual

Los módulos de Kidstop operan con **datos mock** mientras se desarrolla el backend. El feature `windows` (del template base) sirve como referencia del flujo completo con Apollo.

Ver [docs/MOCK_TO_APOLLO_MIGRATION.md](docs/MOCK_TO_APOLLO_MIGRATION.md) para la guía de migración.

## Convenciones

- **Archivos**: kebab-case (`my-component.tsx`)
- **Componentes**: PascalCase (`MyComponent`)
- **Funciones/variables**: camelCase (`myFunction`)
- **Constantes**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Tipos**: PascalCase con prefijo I (`IMyType`)

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura, patrones, capas y convenciones |
| [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) | Contexto del proyecto, glosario, roles y módulos |
| [BACKEND_SPEC.md](docs/BACKEND_SPEC.md) | Especificación GraphQL del backend (NestJS) |
| [MOCK_TO_APOLLO_MIGRATION.md](docs/MOCK_TO_APOLLO_MIGRATION.md) | Guía de migración mock → Apollo |
| [CARPETA_DIGITAL_TEMPLATE.md](docs/CARPETA_DIGITAL_TEMPLATE.md) | Template para el repo de la Carpeta Digital |
| [KSP - Alcance y requerimientos del MVP.md](docs/KSP%20-%20Alcance%20y%20requerimientos%20del%20MVP.md) | Documento de alcance completo del MVP |
| [ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) | Configuración de variables de entorno |

## Troubleshooting

### GraphQL types desactualizados

```bash
npm run codegen
```

### Variables de entorno no se cargan

```bash
ls -la .env
./scripts/setup/validate-env.sh
npm run dev
```

## Licencia

Privado — GRID Company / Kidstop
