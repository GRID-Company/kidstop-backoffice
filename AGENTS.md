# AGENTS.md

Guía completa para agentes de IA trabajando en el proyecto Kidstop Backoffice - Sistema KSP-001 de Kidstop Singles Platform.

## Project Overview

**Kidstop Backoffice** es el panel administrativo de Kidstop Singles Platform, una aplicación web construida con Next.js 16 y React 19 para gestionar la compra, venta e inventario de cartas singles de Pokémon TCG y Magic: The Gathering. Implementa una arquitectura Feature-First con separación en tres capas (Adapters, Domain, UI) y sigue principios SOLID.

**Versión actual**: `v1.2.1` (ver [RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md)). La migración mock → Apollo está **completa**: todos los features consumen el backend GraphQL real.

### Dominio de Negocio

Sistema KSP-001: **Kidstop Singles Platform** para operación de tienda TCG:

- **Sectores objetivo**: Tienda de cartas coleccionables (Pokémon TCG, Magic: The Gathering)
- **Objetivos**:
  - Gestionar compras de cartas singles con negociación y presupuesto
  - Controlar inventario por Carta + Variante + Condición
  - Procesar ventas originadas desde Carpeta Digital
  - Administrar clientes con clasificación VIP y bloqueos
  - Configurar páginas públicas "Most Wanted"
  - Validar ubicación para compras no VIP (geofencing)

**Especificaciones completas**: [KSP - Alcance y requerimientos del MVP.md](docs/KSP%20-%20Alcance%20y%20requerimientos%20del%20MVP.md)

### Tech Stack

**Core:**

- Next.js 16 (App Router)
- React 19 (Server Components)
- TypeScript 5
- Tailwind CSS 4

**UI & Forms:**

- HeroUI 2.8+ (componentes UI base)
- Framer Motion (animaciones)
- React Hook Form + Zod (formularios con validación)
- @iconify/react (iconos)
- @dnd-kit (drag & drop para Most Wanted)

**State & Data:**

- Zustand (state management global)
- Apollo Client 4 (cliente GraphQL)
- apollo-upload-client (uploads GraphQL, ej. imágenes del Card Scanner)
- GraphQL Codegen (generación automática de tipos)

**Utilities:**

- dayjs (manipulación de fechas)
- jspdf (generación de PDF para picking lists)
- react-hot-toast (notificaciones)
- react-dropzone (upload de archivos)
- @google-cloud/vision (OCR para detección de cartas en Card Scanner)

**Development:**

- ESLint (linting)
- Prettier (formateo con plugin Tailwind)
- Husky (git hooks)
- Cypress (E2E testing con Cucumber)

### Sistema de Roles

El sistema implementa **3 roles específicos** con permisos granulares:

1. **Administrador** - Acceso completo al sistema (configuración, ajustes manuales, gestión de clientes VIP)
2. **Recepción** - Usuario operativo (gestión de ventas/pedidos, sin acceso a clientes)
3. **Comprador** - Responsable de compras con presupuesto asignado

**Roles adicionales en Carpeta Digital** (repo separado):

- Público, Cliente, Cliente VIP, Cliente Tienda (Kiosk/iPad)

Ver detalles completos en [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)

---

## Repository Structure

```
kidstop-backoffice/
├── docs/                          # Documentación del proyecto
│   ├── ARCHITECTURE.md            # ⭐ Arquitectura y patrones
│   ├── PROJECT_CONTEXT.md         # ⭐ Contexto completo del proyecto
│   ├── BACKEND_SPEC.md            # Especificación GraphQL del backend
│   ├── MOCK_TO_APOLLO_MIGRATION.md # ⭐ Guía de migración mock → Apollo
│   ├── ENVIRONMENT_SETUP.md       # Variables de entorno
│   ├── KSP - Alcance y requerimientos del MVP.md # ⭐ Especificaciones completas
│   ├── CARPETA_DIGITAL_TEMPLATE.md # Template para repo Carpeta Digital
│   ├── IMPLEMENTATION_PLAN.md     # Plan de implementación
│   ├── CLICKUP_WORKFLOW.md        # Workflow de ClickUp
│   ├── RELEASE_PROCESS.md         # Proceso de releases dev → main con tags
│   ├── Requirements/              # Requerimientos por módulo (CardScanner, ...)
│   ├── digital-binder/            # Copias de docs del repo Carpeta Digital
│   └── api-guides/                # Documentación de APIs GraphQL
│       ├── Pokemon-catalog-api-guide.md
│       ├── Magic-Catalog-API-Guide.md
│       ├── Purchase_API-guide.md
│       ├── Sales-api-guide.md
│       ├── inventory.md
│       ├── users-api-guide.md
│       ├── Seller-API-Guide.md
│       ├── buyer-budget-api-guide.md
│       ├── global-config-api-guide.md
│       ├── bulk-load-inventory.md
│       └── csv-export-api-guide.md
├── cypress/                       # Tests E2E con Cucumber
├── public/                        # Assets estáticos
├── scripts/                       # Scripts (ngrok-share.sh, write-server-env.mjs)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (authenticated)/       # Rutas protegidas (requieren auth)
│   │   │   ├── catalogo/
│   │   │   ├── compras/
│   │   │   ├── ventas/
│   │   │   ├── inventario-cartas/
│   │   │   ├── clientes/
│   │   │   ├── usuarios/
│   │   │   ├── most-wanted/
│   │   │   └── configuracion/
│   │   ├── (not-authenticated)/   # Rutas públicas
│   │   │   ├── login/
│   │   │   ├── registro/
│   │   │   ├── recuperar-contrasena/
│   │   │   └── cambiar-contrasena/
│   │   ├── escaneo-cartas/        # POC congelado del Card Scanner (layout propio)
│   │   └── api/                   # API routes (login, logout, image-proxy, ocr)
│   ├── assets/                    # Imágenes y recursos
│   ├── features/                  # Features del negocio (ver sección Modules)
│   │   ├── login/
│   │   ├── users/
│   │   ├── catalog/
│   │   ├── purchases/
│   │   ├── inventory-cards/
│   │   ├── sales/
│   │   ├── customers/
│   │   ├── most-wanted/
│   │   ├── settings/
│   │   └── card-scanner/
│   ├── lib/                       # Core compartido
│   │   ├── api/                   # Apollo Client + GraphQL codegen
│   │   │   ├── graphql/           # ⭐ Archivos .gql centralizados
│   │   │   ├── generated/         # Tipos auto-generados por codegen
│   │   │   └── schema-types.ts    # Tipos del schema GraphQL
│   │   ├── auth/                  # Hooks de autenticación
│   │   ├── consts/                # Constantes globales
│   │   ├── hooks/                 # Hooks globales
│   │   ├── store/                 # Zustand stores (auth, selected-tcg, privacy-mode, card-scanner)
│   │   ├── types/                 # Tipos globales
│   │   └── utils/                 # Utilidades compartidas
│   ├── shared/                    # Componentes compartidos
│   │   ├── base/                  # Componentes base (buttons, form-controls, skeletons,
│   │   │                          #   tcg-selectors, export-button, heorui-overrides)
│   │   ├── blocks/                # Bloques compuestos (entities-page, data-table,
│   │   │                          #   card-search, bulk-card-search, files, navigation, ...)
│   │   ├── layouts/               # authenticated.tsx, not-authenticated.tsx
│   │   └── providers/             # Providers (Apollo, HeroUI)
│   └── proxy.ts                   # Middleware de auth y routing
├── .env.template                  # Template de variables de entorno
├── codegen.ts                     # Configuración GraphQL Codegen
├── hero.ts                        # Configuración tema HeroUI
├── cypress.config.ts              # Configuración Cypress
├── commitlint.config.cjs          # Conventional commits (husky)
├── server.mjs                     # Servidor HTTPS de desarrollo (dev:https)
├── package.json
└── AGENTS.md                      # Este archivo
```

---

## Key Commands

### Development

```bash
npm run dev              # Servidor de desarrollo (http://localhost:3000)
npm run dev:https        # Servidor HTTPS (server.mjs; para testing de geolocalización)
npm run dev:ngrok        # Exponer servidor local vía túnel ngrok (requiere servidor corriendo)
npm run prod             # Segunda instancia de desarrollo en puerto 3120
npm run build            # Build de producción (prebuild ejecuta write-server-env.mjs)
npm run start            # Servidor de producción
```

### Code Quality

```bash
npm run lint             # Ejecutar linter
npm run format           # Formatear código
npm run format:check     # Verificar formato
npm run validate         # Lint + format check + type check
```

### GraphQL

```bash
npm run codegen          # Generar tipos desde .gql (incluye prettier + eslint --fix en generados)
```

Requiere `NEXT_PUBLIC_GRAPHQL_ENDPOINT` apuntando a un backend accesible en `.env`.

### Testing

```bash
npm run cypress:open           # Abrir Cypress UI
npm run cypress:run            # Ejecutar tests E2E
npm run cypress:run:chrome     # Ejecutar en Chrome
npm run cypress:run:firefox    # Ejecutar en Firefox
npm run test:e2e               # Alias para cypress:run
npm run test:e2e:headed        # Ejecutar con UI visible
```

### Sharing & Remote Access

**ngrok** permite exponer el servidor local a internet para testing remoto, demos o pruebas con dispositivos externos.

#### Setup Inicial (Solo una vez)

ngrok requiere autenticación gratuita:

1. Crear cuenta en [ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. Obtener authtoken en [dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Configurar: `ngrok config add-authtoken TU_AUTHTOKEN`

Ver detalles completos en [scripts/README-NGROK.md](scripts/README-NGROK.md)

#### Uso Rápido

```bash
# Terminal 1: Levantar el servidor de desarrollo
npm run dev

# Terminal 2: Exponer vía ngrok
npm run dev:ngrok
```

O usar el script helper con instrucciones:

```bash
./scripts/ngrok-share.sh
```

#### Características

- ✅ **HTTPS automático** - Certificados SSL incluidos (requerido para cámara/geolocalización)
- ✅ **Inspector web** - Dashboard en `http://127.0.0.1:4040` para ver requests/responses
- ✅ **Replay requests** - Reenviar peticiones para debugging
- ✅ **Compatible con Card Scanner** - Funciona con `getUserMedia` API para acceso a cámara

#### Casos de Uso

1. **Testing remoto del Card Scanner** - Compartir con colegas fuera de la red local
2. **Demos a clientes** - Mostrar features sin desplegar
3. **Testing en dispositivos móviles** - Probar responsive y funcionalidades móviles
4. **Webhooks de desarrollo** - Recibir callbacks de servicios externos (Stripe, PayPal, etc.)

#### Consideraciones

- El servidor debe estar corriendo en puerto 3000 antes de ejecutar ngrok
- La URL pública cambia en cada ejecución (dominios fijos requieren cuenta de pago)
- Para features que requieren backend (GraphQL), asegúrate de que las APIs sean accesibles
- Presiona `Ctrl+C` para detener el túnel

---

## Module Architecture

Cada feature sigue una **arquitectura de tres capas**:

```
features/{feature-name}/
├── adapters/              # Capa de adaptación
│   ├── api/              # Mocks (*.mock.ts) o GraphQL (*.gql)
│   ├── forms/            # Schemas Zod + hooks useForm
│   └── mappers/          # Transformación de datos (API ↔ Domain ↔ Form)
├── domain/               # Capa de dominio
│   ├── types.ts          # Tipos TypeScript (interfaces con prefijo I)
│   ├── constants.ts      # Constantes del módulo
│   └── {feature}.domain.ts # Lógica de negocio
└── ui/                   # Capa de presentación
    ├── components/       # Componentes React del feature
    ├── views/            # Páginas/vistas principales
    └── hooks/            # Custom hooks del feature
```

### Responsabilidades por Capa

**Adapters:**

- Adaptar datos externos (API) al formato interno
- Validación de formularios (Zod schemas)
- Transformación de datos (mappers)
- Mocks para desarrollo sin backend

**Domain:**

- Lógica de negocio
- Tipos e interfaces
- Constantes del dominio
- Funciones de utilidad del dominio

**UI:**

- Componentes React
- Lógica de presentación
- Custom hooks para UI
- Gestión de estado local

---

## Existing Modules

### Features Implementadas

| Feature       | Path                        | Descripción                                                                                                                                                                                      | Estado       | Referencia                                                                   |
| ------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------- |
| Login         | `features/login/`           | Autenticación con email/contraseña, sesión via cookies, registro, recuperación y cambio de contraseña                                                                                            | 🟢 Integrado | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#1-autenticación-y-seguridad)    |
| Usuarios      | `features/users/`           | CRUD de usuarios internos (Admin, Recepción, Comprador), activar/desactivar                                                                                                                      | 🟢 Integrado | [users-api-guide.md](docs/api-guides/users-api-guide.md)                     |
| Catálogo      | `features/catalog/`         | Búsqueda de cartas con contexto TCG, búsqueda avanzada con import de listas (Moxfield, Limitless TCG), autocomplete por set-code, soporte de idiomas de carta por TCG                            | 🟢 Integrado | [Pokemon-catalog-api-guide.md](docs/api-guides/Pokemon-catalog-api-guide.md) |
| Compras       | `features/purchases/`       | Buylist con negociación, presupuesto, cotización WhatsApp, modo privacidad, resumen financiero en detalle                                                                                        | 🟢 Integrado | [Purchase_API-guide.md](docs/api-guides/Purchase_API-guide.md)               |
| Inventario    | `features/inventory-cards/` | Stock por Carta + Variante + Condición, movimientos, métricas, carga masiva CSV                                                                                                                  | 🟢 Integrado | [inventory.md](docs/api-guides/inventory.md)                                 |
| Ventas        | `features/sales/`           | Pedidos desde Carpeta Digital, picking list PDF, código Shopify                                                                                                                                  | 🟢 Integrado | [Sales-api-guide.md](docs/api-guides/Sales-api-guide.md)                     |
| Clientes      | `features/customers/`       | Clasificación VIP, bloqueos, validación de ubicación                                                                                                                                             | 🟢 Integrado | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#7-clientes)                     |
| Most Wanted   | `features/most-wanted/`     | Configuración de páginas públicas por TCG con drag & drop                                                                                                                                        | 🟢 Integrado | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#9-most-wanted-página-pública)   |
| Configuración | `features/settings/`        | Geofence, umbrales, presupuestos, límites de inventario                                                                                                                                          | 🟢 Integrado | [global-config-api-guide.md](docs/api-guides/global-config-api-guide.md)     |
| Card Scanner  | `features/card-scanner/`    | Escaneo con Google Cloud Vision + `pokemonCardScanSearch`/`magicCardScanSearch` (Gemini + catálogo, imágenes vía Upload). Producción vía FAB + Drawer global; POC congelado en `/escaneo-cartas` | 🟢 Integrado | [Pokemon-catalog-api-guide.md](docs/api-guides/Pokemon-catalog-api-guide.md) |

**Leyenda:**

- 🟢 Integrado - Feature conectado al backend via Apollo Client
- 🟡 Mock - Feature funcional con datos mock (ninguno actualmente; el mock de `card-scanner` solo actúa como fallback, ver `NEXT_PUBLIC_CARD_SCAN_USE_MOCK`)
- 🔵 POC - Proof of Concept, en evaluación

### Rutas Principales

**Rutas Protegidas** (`app/(authenticated)/`):

| Ruta                 | Descripción                      | Feature         |
| -------------------- | -------------------------------- | --------------- |
| `/catalogo`          | Búsqueda y consulta de cartas    | catalog         |
| `/compras`           | Gestión de compras (buylist)     | purchases       |
| `/ventas`            | Gestión de pedidos y ventas      | sales           |
| `/inventario-cartas` | Control de stock y movimientos   | inventory-cards |
| `/clientes`          | Gestión de clientes              | customers       |
| `/usuarios`          | Gestión de usuarios internos     | users           |
| `/most-wanted`       | Configuración páginas públicas   | most-wanted     |
| `/configuracion`     | Configuración global del sistema | settings        |

**Rutas Públicas** (`app/(not-authenticated)/`):

| Ruta                    | Descripción          | Feature |
| ----------------------- | -------------------- | ------- |
| `/login`                | Login                | login   |
| `/registro`             | Registro de usuario  | login   |
| `/recuperar-contrasena` | Recuperar contraseña | login   |
| `/cambiar-contrasena`   | Cambiar contraseña   | login   |

**Rutas Standalone** (raíz `app/`, layout propio):

| Ruta              | Descripción                    | Feature      |
| ----------------- | ------------------------------ | ------------ |
| `/escaneo-cartas` | POC congelado del Card Scanner | card-scanner |

**API Routes** (`app/api/`): `api/login`, `api/logout` (cookies de sesión), `api/image-proxy` (proxy de imágenes remotas), `api/ocr` (Google Cloud Vision para Card Scanner).

---

## Roadmap - Features Planeadas

### Integraciones Externas

**Implementadas:**

| Integración         | Descripción                                                        | Referencia                                                   |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Google Cloud Vision | OCR para detección de cartas en Card Scanner (API route `api/ocr`) | [features/card-scanner](src/features/card-scanner/README.md) |

**Pendientes:**

| Integración         | Descripción                                                     | Prioridad | Referencia                                                                    |
| ------------------- | --------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| Price Charting API  | Catálogo y precios de referencia para Pokémon TCG               | Alta      | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#1-proveedores-de-catálogoprecio) |
| Card Kingdom API    | Catálogo y precios de referencia para Magic: The Gathering      | Alta      | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#1-proveedores-de-catálogoprecio) |
| Google Maps API     | Validación de ubicación (geofencing) para clientes no VIP       | Media     | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#2-google-maps-api)               |
| Shopify Integration | Código de venta como custom item (flujo manual)                 | Media     | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#3-shopify)                       |
| WhatsApp API        | Envío de cotizaciones con hipervínculo                          | Media     | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#5-whatsapp)                      |
| Email Transaccional | Notificaciones (pedido listo, restock, recuperación contraseña) | Media     | [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md#4-email-transaccional)           |

### Carpeta Digital (Repo Separado)

La **Carpeta Digital** es una aplicación web independiente para clientes finales:

- **Objetivo**: Navegación de inventario y creación de pedidos
- **Superficies**: Dos dominios independientes (Pokémon y Magic)
- **Roles**: Público, Cliente, Cliente VIP, Cliente Tienda (Kiosk)
- **Features**: Catálogo, búsqueda, carrito, wishlist, perfil, historial, validación ubicación
- **Estado**: En producción — repo `kidstop-digital-binder` (v1.2.1); sus docs de arquitectura están copiados en `docs/digital-binder/`

Ver template original en [CARPETA_DIGITAL_TEMPLATE.md](docs/CARPETA_DIGITAL_TEMPLATE.md)

### Migración Mock → Apollo

**Estado: completada.** Todos los features consumen el backend GraphQL real. El único `*.mock.ts` restante es el fallback del Card Scanner (`NEXT_PUBLIC_CARD_SCAN_USE_MOCK`).

La guía [MOCK_TO_APOLLO_MIGRATION.md](docs/MOCK_TO_APOLLO_MIGRATION.md) se conserva como referencia histórica del patrón.

---

## Environment Configuration

### Variables de Entorno

**Ubicación:** `.env` (crear desde `.env.template`)

**Variables Requeridas:**

```bash
# Proyecto
PROJECT_NAME=kidstop-backoffice
PROJECT_ENV=development

# API
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.kidstop.com/graphql
NEXT_PUBLIC_API_URL=https://api.kidstop.com
```

**Variables Opcionales:**

```bash
# Google Cloud Vision (Card Scanner — requerido para api/ocr)
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_CLOUD_PRIVATE_KEY=
GOOGLE_CLOUD_CLIENT_EMAIL=

# Card Scanner — forzar mock de búsqueda (default: false = queries reales)
NEXT_PUBLIC_CARD_SCAN_USE_MOCK=false
```

**Variables Legacy** (permanecen en `.env.template` pero sus scripts de automatización fueron eliminados — no las consume la app):

```bash
# ClickUp Integration
CLICKUP_API_KEY=
CLICKUP_WORKSPACE_ID=
CLICKUP_FOLDER_ID=
CLICKUP_LIST_ID=
CLICKUP_ENABLED=false

# AWS Amplify
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-2
AMPLIFY_APP_ID=
AMPLIFY_DOMAIN=
AMPLIFY_ENABLED=true

# SendGrid Email
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_FROM_NAME=
DEV_EMAILS=
CLIENT_EMAILS=

# GitHub
GITHUB_TOKEN=
GITHUB_REPO_OWNER=GRID-Company
GITHUB_REPO_NAME=

# Automation Features
AUTO_CREATE_BRANCHES=true
AUTO_UPDATE_CLICKUP=true
AUTO_SEND_NOTIFICATIONS=false
AUTO_DEPLOY_ON_MERGE=true
```

### Validación de Variables

Ver [ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) para detalles completos.

---

## Detailed Documentation

| Documento                                                                                               | Descripción                                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)                                                                 | **⭐ CRÍTICO**: Arquitectura, capas, patrones y convenciones                                                        |
| [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)                                                           | **⭐ CRÍTICO**: Contexto completo del proyecto, glosario, roles y módulos                                           |
| [KSP - Alcance y requerimientos del MVP.md](docs/KSP%20-%20Alcance%20y%20requerimientos%20del%20MVP.md) | **⭐ ESPECIFICACIONES**: Documento completo de alcance y requerimientos del MVP                                     |
| [MOCK_TO_APOLLO_MIGRATION.md](docs/MOCK_TO_APOLLO_MIGRATION.md)                                         | **⭐ CRÍTICO**: Guía paso a paso para migrar de mocks a Apollo Client                                               |
| [BACKEND_SPEC.md](docs/BACKEND_SPEC.md)                                                                 | Especificación completa del backend GraphQL (NestJS)                                                                |
| [CARPETA_DIGITAL_TEMPLATE.md](docs/CARPETA_DIGITAL_TEMPLATE.md)                                         | Template para el repositorio de la Carpeta Digital                                                                  |
| [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)                                                   | Plan de implementación del proyecto                                                                                 |
| [ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)                                                       | Configuración de variables de entorno                                                                               |
| [CLICKUP_WORKFLOW.md](docs/CLICKUP_WORKFLOW.md)                                                         | Workflow de integración con ClickUp                                                                                 |
| [CLICKUP_MIGRATION_GUIDE.md](docs/CLICKUP_MIGRATION_GUIDE.md)                                           | Guía de migración de ClickUp                                                                                        |
| [CYPRESS_ARCHITECTURE.md](docs/CYPRESS_ARCHITECTURE.md)                                                 | Arquitectura de tests E2E con Cypress                                                                               |
| [PERFORMANCE_OPTIMIZATION_GUIDE.md](docs/PERFORMANCE_OPTIMIZATION_GUIDE.md)                             | Guía de optimización de performance                                                                                 |
| [LANGUAGE_SELECTOR_SPEC.md](docs/LANGUAGE_SELECTOR_SPEC.md)                                             | Especificación del selector de idioma                                                                               |
| [RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md)                                                           | Proceso de releases: PRs a `dev`, squash a `main`, tags `v*` y backup                                               |
| [PROJECT_SETUP.md](docs/PROJECT_SETUP.md)                                                               | Setup inicial del proyecto                                                                                          |
| [GITHUB_SECRETS_SETUP.md](docs/GITHUB_SECRETS_SETUP.md)                                                 | Configuración de secrets de GitHub                                                                                  |
| [BACKEND_PROPOSAL_VALIDATE_STOCK.md](docs/BACKEND_PROPOSAL_VALIDATE_STOCK.md)                           | Propuesta de validación de stock en backend                                                                         |
| [Requirements/](docs/Requirements/)                                                                     | Documentos de requerimientos por módulo (Card Scanner, ...)                                                         |
| [digital-binder/](docs/digital-binder/)                                                                 | Copias de ARCHITECTURE/IMPLEMENTATION_PLAN del repo Carpeta Digital                                                 |
| [api-guides/](docs/api-guides/)                                                                         | **11 guías de APIs GraphQL** (Pokemon, Magic, Purchase, Sales, Inventory, Users, Seller, Budget, Config, Bulk, CSV) |

---

## Key Patterns

### 1. React Hook Form + Zod Validation

**Patrón estándar para formularios:**

```typescript
// 1. Schema Zod (adapters/forms/{name}.schema.ts)
import { z } from 'zod';

export const purchaseFormSchema = z.object({
  sellerName: z.string().min(1, 'Seller name is required'),
  sellerPhone: z.string().optional(),
  cards: z.array(
    z.object({
      cardId: z.string(),
      condition: z.enum(['JUGADA', 'PRISTINE', 'MINT']),
      quantity: z.number().min(1),
      buyPrice: z.number().min(0),
    })
  ),
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;

// 2. Hook de formulario (adapters/forms/use-{name}-form.ts)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const usePurchaseForm = () => {
  return useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      sellerName: '',
      cards: [],
    },
  });
};

// 3. Uso en componente
const {
  register,
  handleSubmit,
  formState: { errors },
} = usePurchaseForm();
```

### 2. GraphQL Queries/Mutations

**Convención del repo**: los archivos `.gql` están **centralizados** en `src/lib/api/graphql/` (no dentro de cada feature). Codegen genera `Document` tipados en `src/lib/api/generated/{name}.generated.ts`.

```graphql
# src/lib/api/graphql/purchases.gql
query Purchases($args: FindPurchasesArgs!) {
  purchases(args: $args) {
    items {
      id
      sellerName
      status
      totalAmount
    }
    total
  }
}

mutation CreatePurchase($input: CreatePurchaseInput!) {
  createPurchase(input: $input) {
    id
    status
  }
}
```

```typescript
// 1. Ejecutar codegen: npm run codegen

// 2. Usar en hook (features/{feature}/ui/hooks/use-{name}.ts)
import { useMutation, useQuery } from '@apollo/client/react';
import {
  PurchasesDocument,
  type PurchasesQuery,
  CreatePurchaseDocument,
} from '@/lib/api/generated/purchases.generated';

export const usePurchases = () => {
  const { data, loading, refetch } = useQuery<PurchasesQuery>(
    PurchasesDocument,
    { variables: { args: getPurchaseVars() } }
  );

  const [createPurchase] = useMutation(CreatePurchaseDocument, {
    onCompleted: () => refetch(),
  });

  return { purchases: data?.purchases.items || [], loading, createPurchase };
};
```

**Reglas**:

- Importar hooks desde `@apollo/client/react` (no `@apollo/client`)
- Después de agregar/editar un `.gql`, ejecutar `npm run codegen`
- Los globs de `codegen.ts` cubren `src/lib/api/graphql/**` y `src/shared/blocks/**/api/**`

### 3. Mappers (Transformación de Datos)

**Patrón para transformar entre capas:**

```typescript
// adapters/mappers/{name}.mapper.ts
import type { Purchase } from '@/lib/api/schema-types';
import type { PurchaseFormData } from '../forms/purchase-form.schema';
import type { IPurchase } from '../../domain/types';

// API → Domain
export const mapPurchaseFromAPI = (purchase: Purchase): IPurchase => {
  return {
    id: purchase.id,
    sellerName: purchase.sellerName,
    status: purchase.status,
    totalAmount: purchase.totalAmount,
    cards: purchase.cards.map((card) => ({
      id: card.id,
      cardName: card.cardName,
      condition: card.condition,
      quantity: card.quantity,
    })),
  };
};

// Domain → Form
export const mapPurchaseToForm = (purchase: IPurchase): PurchaseFormData => {
  return {
    sellerName: purchase.sellerName,
    cards: purchase.cards,
  };
};

// Form → API
export const mapFormToPurchaseInput = (
  form: PurchaseFormData
): CreatePurchaseInput => {
  return {
    sellerName: form.sellerName,
    cards: form.cards.map((card) => ({
      cardId: card.cardId,
      condition: card.condition,
      quantity: card.quantity,
      buyPrice: card.buyPrice,
    })),
  };
};
```

### 4. Custom Hooks Pattern

**Encapsular lógica reutilizable:**

```typescript
// features/{feature}/ui/hooks/use-{name}.ts
export const usePurchases = () => {
  const [filters, setFilters] = useState<PurchaseFilters>({});
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useGetPurchasesQuery({
    variables: getVars(page, filters),
  });

  const handleFilterChange = (newFilters: PurchaseFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return {
    purchases: data?.purchases.items || [],
    total: data?.purchases.total || 0,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilters: handleFilterChange,
    refetch,
  };
};
```

### 5. Compound Components Pattern

**Usado en componentes complejos como `EntitiesPage`:**

```typescript
// shared/blocks/entities-page/index.tsx
export const EntitiesPage = ({ children }: PropsWithChildren) => {
  return <Root>{children}</Root>;
};

EntitiesPage.Title = Title;
EntitiesPage.CardContainer = CardContainer;
EntitiesPage.Actions = Actions;

// Uso
<EntitiesPage>
  <EntitiesPage.Title>Compras</EntitiesPage.Title>
  <EntitiesPage.Actions>
    <Button>Nueva Compra</Button>
  </EntitiesPage.Actions>
  <EntitiesPage.CardContainer>
    {purchases.map(purchase => (
      <PurchaseCard key={purchase.id} purchase={purchase} />
    ))}
  </EntitiesPage.CardContainer>
</EntitiesPage>
```

### 6. Mock Strategy (Solo fallback del Card Scanner)

El único mock vigente es `features/card-scanner/adapters/backend/card-search.mock.ts`, que se usa cuando `NEXT_PUBLIC_CARD_SCAN_USE_MOCK=true` o cuando el schema no expone las queries de escaneo. **No crear mocks nuevos** — el resto de features consume GraphQL real.

**Patrón (referencia):**

```typescript
// features/{feature}/adapters/api/{name}.mock.ts
import type { IPurchase } from '../../domain/types';

export const mockPurchases: IPurchase[] = [
  {
    id: '1',
    sellerName: 'John Doe',
    status: 'DRAFT',
    totalAmount: 150.0,
    cards: [
      {
        id: '1',
        cardName: 'Charizard VMAX',
        condition: 'MINT',
        quantity: 1,
      },
    ],
  },
];

export const getPurchasesMock = async (): Promise<IPurchase[]> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockPurchases;
};
```

---

## State Management

### 1. Local State (useState)

Para estado de componente:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState('');
```

### 2. Global State (Zustand)

Cuatro stores globales (`auth`, `selected-tcg` y `privacy-mode` persisten en localStorage):

#### auth.ts — Sesión del usuario

```typescript
// lib/store/auth.ts
interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: IUser, token: string) => void;
  clearSession: () => void;
}

// Uso
const { user, token, isAuthenticated, setSession, clearSession } =
  useAuthStore();
```

#### selected-tcg.ts — Contexto de juego activo

```typescript
// lib/store/selected-tcg.ts
interface SelectedTCGState {
  selectedTCG: 'POKEMON' | 'MAGIC';
  setTCG: (tcg: 'POKEMON' | 'MAGIC') => void;
}

// Uso
const { selectedTCG, setTCG } = useSelectedTCGStore();
```

#### privacy-mode.ts — Modo privacidad en compras

```typescript
// lib/store/privacy-mode.ts
interface PrivacyModeState {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

// Uso
const { isPrivacyMode, togglePrivacyMode } = usePrivacyModeStore();
```

#### card-scanner.ts — Drawer global del scanner

```typescript
// lib/store/card-scanner.ts
// Controla el FAB + Drawer global del Card Scanner: apertura con origen
// ('fab' | 'purchase' | 'catalog'), items existentes y callback de confirmación.

// Uso
const { openScanner, closeScanner } = useCardScannerStore();
openScanner('purchase', onConfirm, existingItemIds);
```

### 3. Server State (Apollo Client)

Para datos del servidor:

```typescript
const { data, loading, error, refetch } = useQuery(GET_PURCHASES, {
  variables: { args },
  fetchPolicy: 'cache-and-network',
});

const [createPurchase, { loading: creating }] = useMutation(CREATE_PURCHASE, {
  onCompleted: (data) => {
    toast.success('Compra creada');
    refetch();
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

---

## Design System

### HeroUI 2.8+ Base

El proyecto usa **HeroUI 2.8+** como librería base de componentes UI:

```typescript
import { Button, Card, Input, Modal, Table } from '@heroui/react';
```

**Nota importante**: A diferencia de `back-system-frontend`, este proyecto **NO usa** `@grid-company/ui`. Todos los componentes se consumen directamente de HeroUI.

### Tailwind CSS 4

Configuración de tema en `hero.ts`:

```typescript
// hero.ts
import { heroui } from '@heroui/react';

export default heroui({
  themes: {
    light: {
      colors: {
        primary: '#0070f3',
        secondary: '#7928ca',
        // ...
      },
    },
  },
});
```

### Componentes Compartidos

Organizados en `src/shared/`:

**base/** - Componentes básicos reutilizables:

- `buttons/` - Variantes de botones
- `search/` - Buscadores
- `card/` - Cards genéricos
- `skeleton/` - Skeletons para loading

**blocks/** - Bloques compuestos:

- `entities-page/` - Layout estándar para páginas de entidades
- `data-table/` - Tabla de datos con paginación
- `bulk-card-search/` - Buscador masivo de cartas

**layouts/** - Layouts de aplicación:

- `sidebar/` - Sidebar con navegación
- `authenticated-layout/` - Layout para rutas protegidas

---

## API Integration

### GraphQL Setup

```typescript
// lib/api/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  }),
});
```

### Code Generation

```bash
# Generar tipos desde schema GraphQL
npm run codegen
```

Configuración en `codegen.ts`:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  documents: ['src/**/*.gql'],
  generates: {
    'src/lib/api/schema-types.ts': {
      plugins: ['typescript'],
    },
    'src/lib/api/generated/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: '../schema-types.ts',
        extension: '.generated.ts',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
    },
  },
};

export default config;
```

### Mock Strategy (Estado Actual)

La migración a Apollo está **completa** — los features consumen el backend real. El único mock activo es el fallback del Card Scanner (`NEXT_PUBLIC_CARD_SCAN_USE_MOCK`).

Ver [MOCK_TO_APOLLO_MIGRATION.md](docs/MOCK_TO_APOLLO_MIGRATION.md) como referencia del patrón.

---

## Testing Strategy

### Cypress E2E con Cucumber

```bash
# Abrir Cypress UI
npm run cypress:open

# Ejecutar tests
npm run cypress:run

# En shells heredadas de un IDE Electron (Devin/Windsurf/VS Code):
# ELECTRON_RUN_AS_NODE=1 rompe el binario de Cypress ("bad option: --no-sandbox").
# NO reinstalar Cypress — correr con:
env -u ELECTRON_RUN_AS_NODE npx cypress run
```

**Estructura de tests:**

```
cypress/
├── e2e/
│   └── features/
│       ├── login.feature
│       ├── purchases.feature
│       └── inventory.feature
├── support/
│   ├── commands.ts
│   └── step_definitions/
└── fixtures/
```

**Ejemplo de feature:**

```gherkin
# cypress/e2e/features/login.feature
Feature: Login

  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
```

Ver [CYPRESS_ARCHITECTURE.md](docs/CYPRESS_ARCHITECTURE.md) para detalles completos.

---

## Convenciones

### Naming Conventions

#### Archivos

- **Componentes**: `kebab-case.tsx` → `purchase-card.tsx`
- **Hooks**: `use-{name}.ts` → `use-purchases.ts`
- **Types**: `{name}.types.ts` → `purchase.types.ts`
- **Constants**: `{name}.constants.ts` → `purchase.constants.ts`
- **Mappers**: `{name}.mapper.ts` → `purchase.mapper.ts`
- **Schemas**: `{name}.schema.ts` → `purchase-form.schema.ts`
- **Mocks**: `{name}.mock.ts` → `purchases.mock.ts`

#### Código

- **Componentes**: `PascalCase` → `PurchaseCard`
- **Funciones**: `camelCase` → `getPurchases`
- **Variables**: `camelCase` → `purchaseList`
- **Constantes**: `UPPER_SNAKE_CASE` → `DEFAULT_PAGE_SIZE`
- **Tipos**: `PascalCase` con prefijo `I` → `IPurchase`
- **Enums**: `PascalCase` → `PurchaseStatus`

### File Organization

```typescript
// 1. Imports - externos primero, luego internos
import { useState } from 'react';
import { useQuery } from '@apollo/client';

import { PurchaseCard } from './purchase-card';
import { usePurchases } from '../hooks/use-purchases';

// 2. Types e interfaces
interface PurchasesViewProps {
  filters?: PurchaseFilters;
}

// 3. Constantes
const DEFAULT_FILTERS = {};

// 4. Componente principal
export const PurchasesView = ({ filters = DEFAULT_FILTERS }: PurchasesViewProps) => {
  // Hooks
  const { purchases, loading } = usePurchases();

  // Handlers
  const handleEdit = (id: string) => {
    // ...
  };

  // Render
  return (
    // JSX
  );
};
```

---

## Contexto TCG (Feature Único)

### Selector de Juego

El sistema opera con dos contextos de juego: **Pokémon TCG** y **Magic: The Gathering**.

```typescript
// Selector en UI
const { selectedTCG, setTCG } = useSelectedTCGStore();

<Select value={selectedTCG} onChange={(e) => setTCG(e.target.value)}>
  <option value="POKEMON">Pokémon TCG</option>
  <option value="MAGIC">Magic: The Gathering</option>
</Select>
```

**Impacto en features:**

- **Catálogo**: Filtra cartas por TCG
- **Compras**: Asocia compras al TCG activo
- **Inventario**: Separa stock por TCG
- **Ventas**: Pedidos filtrados por TCG
- **Most Wanted**: Páginas independientes por TCG

---

## Estados de Compra

Flujo de estados en el módulo de compras:

```
DRAFT → COTIZADO → ESPERANDO_PRECIO → FINALIZADO
                                    ↘ RECHAZADO
```

**Reglas clave:**

- En `ESPERANDO_PRECIO`: las cartas **NO** se suman al stock
- Al pasar a `FINALIZADO`: las cartas **SÍ** se suman al stock
- En `RECHAZADO`: no hay impacto en inventario

---

## Estados de Venta

Flujo de estados en el módulo de ventas:

```
NUEVO/RECIBIDO → EN_SURTIDO → LISTO_PARA_RECOLECCION → COMPLETADO
                                                      ↘ CANCELADO
```

**Reglas clave:**

- Todas las ventas se originan desde **Carpeta Digital**
- En `LISTO_PARA_RECOLECCION`: se envía email al cliente
- Al pasar a `COMPLETADO`: se descuenta del stock
- En `CANCELADO`: se liberan las cartas reservadas

---

## Modo Privacidad

Feature específico del módulo de compras para ocultar datos sensibles:

```typescript
const { isPrivacyMode, togglePrivacyMode } = usePrivacyModeStore();

// Ocultar precios y datos sensibles cuando isPrivacyMode === true
{
  isPrivacyMode ? '***' : purchase.totalAmount;
}
```

**Uso**: Proteger información durante negociaciones con clientes presentes.

---

## Subagents Recommendation

Este proyecto es compatible con los **subagents genéricos** definidos en `.devin/agents/README.md`.

### Subagents Recomendados

- **doc-reader**: Leer AGENTS.md, PROJECT_CONTEXT.md, API guides
- **researcher**: Explorar features existentes, buscar componentes reutilizables
- **form-builder**: Crear schemas Zod y form hooks
- **graphql-codegen**: Crear operaciones GraphQL y ejecutar codegen
- **mapper-creator**: Crear mappers para transformación de datos
- **test-runner**: Ejecutar comandos de validación (lint, format, build)
- **reviewer**: Revisar cambios antes de commit

### Flujo Recomendado para CRUD

```
1. doc-reader: "Lee PROJECT_CONTEXT.md y busca especificaciones de {entity}"
2. researcher: "Investiga cómo está implementado un CRUD similar"
3. form-builder: "Crea el schema Zod y form hook para {entity}"
4. graphql-codegen: "Crea las queries y mutations de {entity}"
5. mapper-creator: "Crea los mappers para transformar entre API, Domain y Form"
6. test-runner: "Ejecuta los comandos de validación"
7. reviewer: "Revisa todos los cambios"
```

Ver [.devin/agents/README.md](../.devin/agents/README.md) para detalles completos.

---

## Git Workflow

### Branches y Releases

- **Base branch para PRs**: `dev`
- **Releases**: squash de `dev` → `main` con tags `v*` y tag de backup (ver [RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md))
- **Commits**: en inglés, conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`) — enforceado por commitlint + husky

### Creating Commits

1. Run in parallel: `git status`, `git diff`, `git log` (to match commit style)
2. Draft a concise commit message focusing on "why" not "what". Check for sensitive info.
3. Stage files and commit with this format:

```bash
git commit -m "$(cat <<'EOF'
Commit message here.

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
EOF
)"
```

### Git Rules

- NEVER update git config
- NEVER use `-i` flags (interactive mode not supported)
- DO NOT push unless explicitly asked
- DO NOT commit if no changes exist

---

## Troubleshooting

### GraphQL types desactualizados

```bash
npm run codegen
```

### Variables de entorno no se cargan

```bash
ls -la .env
npm run dev
```

### Errores de TypeScript

```bash
npm run validate
```

### Tests E2E fallan

```bash
npm run cypress:open  # Para debug visual
```

---

## Best Practices

### 1. Keep Components Small

Máximo 200-300 líneas por componente. Si es más grande, dividir en sub-componentes.

### 2. Use TypeScript Strictly

```typescript
// ✅ BIEN
interface Props {
  name: string;
  age: number;
}

// ❌ MAL
interface Props {
  name: any;
  age: any;
}
```

### 3. Avoid Prop Drilling

Usar Zustand stores o context para estado compartido profundo.

### 4. Memoize Expensive Calculations

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 5. Always Use Mappers

Nunca exponer tipos de API directamente en UI. Siempre transformar con mappers.

### 6. Follow Layer Boundaries

- UI no debe importar de `adapters/api/`
- Domain no debe importar de `ui/`
- Adapters no deben importar de `ui/`

---

## Licencia

Privado — GRID Company / Kidstop

---

**Última actualización**: 2026-10-23  
**Versión**: 1.1.0 (proyecto v1.2.1)
