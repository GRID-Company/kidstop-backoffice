# Kidstop Carpeta Digital

Aplicación web orientada al cliente para navegar el inventario de cartas singles y realizar pedidos de **Pokémon TCG** y **Magic: The Gathering**. Se publica en dos dominios independientes con autenticación compartida.

## Stack Tecnológico

- **Next.js 16** — Framework React con App Router
- **React 19** — Server Components
- **TypeScript 5** — Tipado estático
- **Tailwind CSS 4** — Utility-first CSS
- **HeroUI 2.8+** — Componentes UI
- **Zustand** — State management
- **Apollo Client 4** — Cliente GraphQL
- **GraphQL Codegen** — Generación automática de tipos
- **Google Maps JavaScript API** — Geofencing

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **Auth** | Login, registro, recuperar contraseña (cuenta unificada Pokémon/Magic) |
| **Catálogo** | Grid de cartas, búsqueda, filtros, detalle con variantes y condiciones |
| **Carrito** | Agregar/quitar cartas, ajustar cantidad, resumen |
| **Checkout** | Validación de stock, geofencing, modo Kiosk, confirmación de pedido |
| **Wishlist** | Lista de deseos con indicador de stock y notificación de restock |
| **Pedidos** | Historial de pedidos filtrado por TCG del dominio |
| **Perfil** | Ver/editar datos, cambio de contraseña |
| **Most Wanted** | Página pública de cartas más buscadas (optimizada para TV) |

## Roles

| Capacidad | Público | Cliente | VIP | Kiosk |
|-----------|---------|---------|-----|-------|
| Navegar catálogo | ✅ | ✅ | ✅ | ✅ |
| Wishlist | ❌ | ✅ | ✅ | ❌ |
| Crear pedido | ❌ | ✅ (en tienda) | ✅ (remoto) | ✅ (en tienda) |
| Perfil | ❌ | ✅ | ✅ | ❌ |
| Historial de pedidos | ❌ | ✅ | ✅ | ❌ |

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

**Variables mínimas requeridas:**
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` — URL del API GraphQL
- `NEXT_PUBLIC_TCG_TYPE` — TCG para desarrollo local (`POKEMON` o `MAGIC`)

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
kidstop-digital-binder/
├── docs/                       # Documentación
├── src/
│   ├── app/
│   │   ├── (public)/           # Catálogo, Most Wanted (sin auth)
│   │   ├── (authenticated)/    # Carrito, checkout, perfil, pedidos, wishlist
│   │   ├── (not-authenticated)/ # Login, registro, recuperar contraseña
│   │   └── api/                # API routes (cookies de sesión)
│   ├── features/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── orders/
│   │   ├── profile/
│   │   └── most-wanted/
│   ├── lib/
│   │   ├── api/                # Apollo Client + codegen
│   │   ├── auth/               # Hooks de autenticación
│   │   ├── store/              # Zustand (auth, tcg-context, cart)
│   │   ├── types/              # Tipos globales (TCG, card, inventory)
│   │   ├── consts/             # Constantes (temas, opciones TCG)
│   │   └── utils/              # Utilidades (formato, geofence)
│   └── shared/
│       ├── base/               # Componentes base
│       ├── layouts/            # Header, footer, navegación
│       └── providers/          # Apollo, HeroUI
├── codegen.ts
├── hero.ts
└── package.json
```

## TCG por Dominio

A diferencia del backoffice (selector en sidebar), la carpeta digital determina el TCG por el **dominio/hostname**:

- `magic.*` → Magic: The Gathering (tema oscuro/naranja)
- Todo lo demás → Pokémon TCG (tema rojo)
- Desarrollo local: `NEXT_PUBLIC_TCG_TYPE=POKEMON`

## Estado Actual

Los módulos operan con **datos mock**. La integración con el backend se hará siguiendo la guía de migración del backoffice.

## Diseño

- **Figma:** https://www.figma.com/design/OVJt5MDixgpKHhfO6Bk2bq/ks-UI-MVP?node-id=6403-11874

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura, patrones, capas y convenciones |
| [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | Plan de implementación por fases |
| [CLICKUP_STRUCTURE.md](docs/CLICKUP_STRUCTURE.md) | Estructura de tareas en ClickUp |

## Convenciones

- **Archivos**: kebab-case (`my-component.tsx`)
- **Componentes**: PascalCase (`MyComponent`)
- **Funciones/variables**: camelCase (`myFunction`)
- **Constantes**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Tipos**: PascalCase con prefijo I (`IMyType`)
- **Commits**: en inglés, conventional commits (`feat:`, `fix:`, `refactor:`)

## Licencia

Privado — GRID Company / Kidstop
