# Carpeta Digital — Template y Plan de Estructura

Blueprint para crear el repositorio de la Carpeta Digital de Kidstop Singles Platform. Este documento define qué copiar del backoffice, qué adaptar y qué crear desde cero.

## Visión General

La Carpeta Digital es una aplicación web **orientada al cliente** que permite navegar el inventario de cartas singles y realizar pedidos. Se publica en **dos dominios independientes** (Pokémon y Magic) con autenticación compartida.

**Diferencias clave con el backoffice:**

| Aspecto | Backoffice | Carpeta Digital |
|---------|-----------|-----------------|
| Audiencia | Staff interno | Clientes finales |
| TCG | Selector en sidebar | Determinado por dominio |
| Roles | Admin, Recepción, Comprador | Público, Cliente, VIP, Kiosk |
| Layout | Sidebar + contenido admin | Navegación tipo e-commerce |
| Autenticación | Obligatoria | Opcional (público puede navegar) |

## Stack Tecnológico

### Core (compartido con backoffice)

- **Next.js 16** — Framework React con App Router
- **React 19** — Server Components
- **TypeScript 5** — Tipado estático
- **Tailwind CSS 4** — Utility-first CSS
- **HeroUI 2.8+** — Componentes UI base
- **Framer Motion** — Animaciones
- **Apollo Client** — Cliente GraphQL
- **GraphQL Codegen** — Generación automática de tipos
- **Zustand** — State management global
- **React Hook Form + Zod** — Formularios y validación
- **react-hot-toast** — Notificaciones

### Adicionales (específicos de carpeta digital)

- **Google Maps JavaScript API** — Geolocalización y geofencing para validación de ubicación
- **@react-google-maps/api** (o equivalente) — Wrapper React para Google Maps

### No necesarios (del backoffice)

- ~~jspdf~~ — Solo backoffice (picking list PDF)
- ~~@dnd-kit~~ — Solo backoffice (drag & drop Most Wanted)
- ~~apollo-upload-client~~ — Solo si se necesita upload de archivos

## Estructura del Proyecto

```
kidstop-carpeta-digital/
├── .env.example
├── .gitignore
├── .prettierrc
├── .prettierignore
├── codegen.ts
├── eslint.config.mjs
├── hero.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── docs/
│   └── ARCHITECTURE.md
├── src/
│   ├── app/
│   │   ├── (public)/                  # Rutas sin autenticación
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # Catálogo / landing
│   │   │   ├── carta/[id]/
│   │   │   │   └── page.tsx           # Detalle de carta
│   │   │   └── most-wanted/
│   │   │       └── page.tsx           # Página pública Most Wanted
│   │   ├── (authenticated)/           # Rutas protegidas (requieren login)
│   │   │   ├── layout.tsx
│   │   │   ├── carrito/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx
│   │   │   ├── pedidos/
│   │   │   │   ├── page.tsx           # Historial
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Detalle de pedido
│   │   │   └── wishlist/
│   │   │       └── page.tsx
│   │   ├── (not-authenticated)/       # Login, registro, recuperar contraseña
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── registro/
│   │   │   │   └── page.tsx
│   │   │   └── recuperar-contrasena/
│   │   │       └── page.tsx
│   │   ├── api/                       # API routes (login/logout cookies)
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── features/
│   │   ├── auth/                      # Login, registro, recuperar contraseña
│   │   │   ├── adapters/
│   │   │   │   ├── api/
│   │   │   │   ├── forms/
│   │   │   │   └── mappers/
│   │   │   ├── domain/
│   │   │   └── ui/
│   │   ├── catalog/                   # Navegación, búsqueda, detalle de carta
│   │   │   ├── adapters/
│   │   │   ├── domain/
│   │   │   └── ui/
│   │   ├── cart/                      # Carrito + checkout
│   │   │   ├── adapters/
│   │   │   ├── domain/
│   │   │   └── ui/
│   │   ├── wishlist/                  # Lista de deseos + notificación restock
│   │   │   ├── adapters/
│   │   │   ├── domain/
│   │   │   └── ui/
│   │   ├── orders/                    # Historial de pedidos
│   │   │   ├── adapters/
│   │   │   ├── domain/
│   │   │   └── ui/
│   │   └── profile/                   # Perfil de usuario
│   │       ├── adapters/
│   │       ├── domain/
│   │       └── ui/
│   ├── lib/
│   │   ├── api/                       # Apollo setup + codegen
│   │   │   ├── graphql/
│   │   │   ├── generated/
│   │   │   └── schema-types.ts
│   │   ├── auth/                      # Hooks de autenticación
│   │   ├── store/                     # Zustand stores
│   │   ├── types/                     # Tipos globales compartidos
│   │   ├── consts/                    # Constantes globales
│   │   └── utils/                     # Utilidades
│   └── shared/
│       ├── base/                      # Componentes base reutilizables
│       ├── layouts/                   # Layouts (header, footer, nav)
│       └── providers/                 # Apollo + HeroUI providers
```

## Archivos a Copiar del Backoffice

### Copiar tal cual

| Archivo origen (backoffice) | Destino (carpeta digital) |
|-----------------------------|---------------------------|
| `tsconfig.json` | `tsconfig.json` |
| `hero.ts` | `hero.ts` |
| `postcss.config.mjs` | `postcss.config.mjs` |
| `eslint.config.mjs` | `eslint.config.mjs` |
| `.prettierrc` | `.prettierrc` |
| `.prettierignore` | `.prettierignore` |
| `.gitignore` | `.gitignore` |
| `codegen.ts` | `codegen.ts` |
| `src/lib/utils/format-currency.ts` | `src/lib/utils/format-currency.ts` |
| `src/lib/utils/format-date.ts` | `src/lib/utils/format-date.ts` |
| `src/lib/utils/create-storage.util.ts` | `src/lib/utils/create-storage.util.ts` |
| `src/lib/utils/use-responsive-client.ts` | `src/lib/utils/use-responsive-client.ts` |
| `src/lib/types/tcg.types.ts` | `src/lib/types/tcg.types.ts` |
| `src/lib/types/card.types.ts` | `src/lib/types/card.types.ts` |
| `src/lib/types/inventory.types.ts` | `src/lib/types/inventory.types.ts` |
| `src/lib/consts/tcg-options.ts` | `src/lib/consts/tcg-options.ts` |
| `src/lib/consts/tcg-themes.ts` | `src/lib/consts/tcg-themes.ts` |
| `src/lib/consts/error-messages.ts` | `src/lib/consts/error-messages.ts` |
| `src/lib/store/auth.ts` | `src/lib/store/auth.ts` |
| `src/lib/auth/use-auth-cookie.ts` | `src/lib/auth/use-auth-cookie.ts` |
| `src/lib/auth/use-process-logout.ts` | `src/lib/auth/use-process-logout.ts` |
| `src/shared/providers/apollo-provider.tsx` | `src/shared/providers/apollo-provider.tsx` |

### Copiar y adaptar

| Archivo | Cambios necesarios |
|---------|-------------------|
| `package.json` | Renombrar a `kidstop-carpeta-digital`, eliminar deps no necesarias (jspdf, dnd-kit), agregar Google Maps |
| `next.config.ts` | Mantener `remotePatterns` de imágenes, cambiar redirect `/` → catálogo |
| `src/lib/auth/user-roles.ts` | Cambiar roles: `PUBLIC`, `CUSTOMER`, `VIP`, `KIOSK` |
| `src/lib/auth/use-process-login.ts` | Cambiar redirect post-login (→ catálogo en vez de `/usuarios`) |
| `src/proxy.ts` | Rutas públicas: catálogo, most-wanted. Protegidas: carrito, checkout, perfil, pedidos, wishlist. Restricciones Kiosk |
| `src/shared/providers/providers.tsx` | Recibir TCG del dominio en vez de `role` del backoffice |
| `src/app/globals.css` | Adaptar temas para UI de cliente |
| `src/app/layout.tsx` | Adaptar metadata y providers |
| `src/lib/api/graphql/login.gql` | Adaptar si el login de cliente usa mutation diferente |

### No copiar

| Archivo/Carpeta | Razón |
|-----------------|-------|
| `src/features/windows/` | Feature del template base, no relacionado |
| `src/features/purchases/` | Solo backoffice |
| `src/features/sales/` | Solo backoffice (gestión interna de pedidos) |
| `src/features/users/` | Solo backoffice (gestión de staff) |
| `src/features/most-wanted/` (config) | Solo backoffice (la página pública se crea nueva) |
| `src/features/settings/` | Solo backoffice |
| `src/features/clickup/` | Herramienta interna |
| `src/lib/store/selected-tcg.ts` | TCG se determina por dominio |
| `src/lib/store/privacy-mode.ts` | Solo backoffice |
| `src/lib/utils/pdf-*.ts` | Solo backoffice |
| `src/lib/utils/use-paginated-datatable.ts` | Patrón de admin |
| `src/lib/consts/navigation-routes.ts` | Rutas completamente diferentes |
| `src/shared/blocks/entities-page/` | Patrón de admin |
| `src/shared/blocks/data-table/` | Patrón de admin |
| `src/shared/layouts/` | Layout de admin (sidebar) |
| `scripts/clickup/` | Herramienta interna |
| `scripts/amplify/` | Evaluar si se usa el mismo deploy |

### Crear desde cero

| Archivo/Carpeta | Descripción |
|-----------------|-------------|
| `src/app/` (completo) | Estructura de rutas de cliente |
| `src/shared/layouts/` | Header, footer, navegación de cliente |
| `src/features/auth/` | Login, registro, recuperar contraseña (UI de cliente) |
| `src/features/catalog/` | Navegación, búsqueda, filtros, detalle de carta |
| `src/features/cart/` | Carrito, checkout, validación de stock, geofencing |
| `src/features/wishlist/` | Lista de deseos |
| `src/features/orders/` | Historial de pedidos del cliente |
| `src/features/profile/` | Perfil de usuario |
| `src/lib/store/cart.ts` | Store del carrito (Zustand) |
| `src/lib/consts/navigation-routes.ts` | Rutas de la carpeta digital |

## Features y Responsabilidades

### auth

Autenticación de clientes en la carpeta digital.

- **Login** — Email + contraseña (cuenta unificada Pokémon/Magic)
- **Registro** — Crear cuenta nueva
- **Recuperar contraseña** — Flujo de reset vía email
- **Logout** — Cerrar sesión

### catalog

Navegación del inventario disponible filtrado por TCG del dominio.

- **Listado** — Grid de cartas con stock disponible
- **Búsqueda** — Por nombre, set/edición
- **Filtros** — Set, variante, rareza, rango de precio
- **Detalle de carta** — Info completa, variantes, precio, stock, botón agregar al carrito

### cart

Carrito de compras y proceso de checkout.

- **Carrito** — Agregar/quitar cartas, ajustar cantidad
- **Validación de stock** — Al confirmar, verificar disponibilidad
- **Faltantes** — Opción de agregar a wishlist + continuar sin out-of-stock
- **Checkout** — Confirmar pedido
- **Geofencing** — Validación de ubicación para no-VIP (Google Maps API)
- **Checkout Kiosk** — Formulario breve (nombre + correo) para cuenta Kiosk

### wishlist

Lista de deseos del cliente.

- **Agregar/quitar** cartas
- **Ver wishlist** del usuario
- **Notificación de restock** — Email cuando carta pasa de stock 0 → >0

### orders

Historial de pedidos del cliente.

- **Listado** — Pedidos filtrados por TCG del dominio
- **Detalle** — Items, estatus, código de venta
- **No disponible para Kiosk**

### profile

Perfil del usuario autenticado.

- **Ver/editar** datos básicos (nombre, email, teléfono)
- **Mostrar** tipo de usuario (Cliente/VIP) y estatus
- **No disponible para Kiosk**

## Roles y Permisos

| Capacidad | Público | Cliente | VIP | Kiosk |
|-----------|---------|---------|-----|-------|
| Navegar catálogo | ✅ | ✅ | ✅ | ✅ |
| Wishlist | ❌ | ✅ | ✅ | ❌ |
| Crear pedido (carrito/checkout) | ❌ | ✅ | ✅ | ✅ |
| Confirmar pedido | ❌ | ✅ (en tienda) | ✅ (remoto) | ✅ (en tienda) |
| Perfil (ver/editar) | ❌ | ✅ | ✅ | ❌ |
| Historial de pedidos | ❌ | ✅ | ✅ | ❌ |

## Consideraciones de Arquitectura

### TCG por Dominio

A diferencia del backoffice (selector en sidebar), la carpeta digital determina el TCG por el **dominio/subdominio**:

```typescript
// src/lib/utils/get-tcg-from-domain.ts
export function getTCGFromDomain(): TCGType {
  const hostname = window.location.hostname;
  if (hostname.includes('magic')) return TCG_TYPES.MAGIC;
  return TCG_TYPES.POKEMON;
}
```

Todas las queries GraphQL deben incluir el TCG como variable, derivado del dominio.

### Autenticación Compartida

Un usuario registrado en el dominio Pokémon puede iniciar sesión en Magic con las mismas credenciales. La base de usuarios es única. Los pedidos e historial se filtran por TCG del dominio actual.

### Geofencing (Google Maps)

Para clientes no-VIP, el checkout requiere validación de ubicación:

1. Solicitar permiso de ubicación al confirmar pedido
2. Obtener coordenadas del usuario
3. Validar contra el perímetro de la tienda (coordenadas + radio configurables)
4. Bloquear confirmación si está fuera del perímetro

### Modo Kiosk

Cuenta genérica que permanece con sesión activa en iPad en tienda:

- Puede navegar y crear pedidos
- No puede ver/editar perfil, historial, ni cambiar credenciales
- En checkout, muestra formulario breve para capturar nombre y correo del cliente real
- Los datos se asocian al pedido, no a la cuenta Kiosk

### Bloqueo de Clientes

El sistema valida si el cliente está bloqueado (por pedidos no concretados) antes de permitir confirmar un pedido. El umbral es configurable desde el backoffice.

## Variables de Entorno

```env
# Proyecto
PROJECT_NAME=Kidstop Carpeta Digital
PROJECT_ENV=development

# API
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.kidstop.com/graphql
NEXT_PUBLIC_API_URL=https://api.kidstop.com/graphql

# TCG del dominio (para desarrollo local)
NEXT_PUBLIC_TCG_TYPE=POKEMON

# Google Maps (geofencing)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Geofence de tienda
NEXT_PUBLIC_STORE_LATITUDE=
NEXT_PUBLIC_STORE_LONGITUDE=
NEXT_PUBLIC_STORE_RADIUS_METERS=100
```

## Dependencias del package.json

```json
{
  "dependencies": {
    "@apollo/client": "^4.0.9",
    "@graphql-typed-document-node/core": "^3.2.0",
    "@heroui/react": "^2.8.5",
    "@hookform/resolvers": "^5.2.2",
    "dayjs": "^1.11.19",
    "framer-motion": "^12.23.24",
    "graphql": "^16.12.0",
    "next": "16.1.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.66.0",
    "react-hot-toast": "^2.6.0",
    "zod": "^4.1.12",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^6.0.2",
    "@graphql-codegen/near-operation-file-preset": "^3.1.0",
    "@graphql-codegen/typed-document-node": "^6.1.2",
    "@graphql-codegen/typescript": "^5.0.4",
    "@graphql-codegen/typescript-operations": "^5.0.4",
    "@iconify/react": "^6.0.2",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "eslint-plugin-unused-imports": "^4.3.0",
    "prettier": "^3.6.2",
    "prettier-plugin-tailwindcss": "^0.7.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```
