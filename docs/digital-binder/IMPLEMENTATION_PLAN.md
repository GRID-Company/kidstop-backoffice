# Plan de Implementación: Kidstop Carpeta Digital

Plan detallado para implementar la Carpeta Digital de Kidstop Singles Platform — aplicación web orientada al cliente para navegar inventario y realizar pedidos de cartas singles.

## Contexto del Proyecto

**Proyecto:** Kidstop Singles Platform (KSP) — Carpeta Digital
**Repo:** https://github.com/GRID-Company/kidstop-digital-binder
**Figma:** https://www.figma.com/design/OVJt5MDixgpKHhfO6Bk2bq/ks-UI-MVP?node-id=6403-11874

**Stack:**
- Next.js 16 + React 19 + TypeScript 5
- Apollo Client + GraphQL Codegen
- HeroUI + Tailwind CSS 4
- Zustand (state management)
- Google Maps JavaScript API (geofencing)
- Arquitectura Feature-First (adapters/domain/ui)

**Estado inicial:** Datos con mocked data. Integración con backend se hará después.

**Diferencia clave con backoffice:** El TCG se determina por el dominio (no por selector). Dos dominios independientes sirven el mismo código con tema visual diferente.

---

## Módulos a Implementar

### 1. **Layout y Navegación**
**Objetivo:** Estructura visual de la aplicación con header, navegación y footer adaptados al TCG del dominio.

**Funcionalidades:**
- Header con logo, búsqueda, carrito, login/perfil
- Navegación principal (Catálogo, Most Wanted)
- Footer con info de tienda
- Tema visual dinámico por TCG (colores, logo, favicon)
- Responsive (móvil, tablet, desktop)
- Menú de usuario autenticado (perfil, pedidos, wishlist, logout)
- Restricciones por rol (Kiosk no ve perfil/pedidos)

**Implementación:**
```
src/shared/layouts/
├── public-layout.tsx          # Layout base (header + footer)
├── authenticated-layout.tsx   # Extiende con menú de usuario
├── header.tsx
├── footer.tsx
├── navigation.tsx
└── user-menu.tsx
```

---

### 2. **TCG por Dominio**
**Objetivo:** Detectar el TCG activo a partir del hostname y aplicar tema visual.

**Implementación:**
```
src/lib/utils/
└── get-tcg-from-domain.ts

src/lib/store/
└── tcg-context.ts (read-only, derivado del dominio)
```

**Lógica:**
- `magic.*` → MAGIC
- Todo lo demás → POKEMON
- En desarrollo: `NEXT_PUBLIC_TCG_TYPE` como override

---

### 3. **Autenticación**
**Objetivo:** Login, registro y recuperación de contraseña para clientes.

**Funcionalidades:**
- Login con email + contraseña
- Registro con nombre, email, teléfono, contraseña
- Recuperación de contraseña vía email
- Cuenta unificada entre dominios Pokémon y Magic
- Sesión via cookies (mismo mecanismo que backoffice)

**Implementación:**
```
features/auth/
├── adapters/
│   ├── api/
│   │   └── auth.mock.ts
│   └── forms/
│       ├── login.schema.ts
│       ├── register.schema.ts
│       └── forgot-password.schema.ts
├── domain/
│   ├── types.ts (CustomerRole: PUBLIC, CUSTOMER, VIP, KIOSK)
│   └── constants.ts
└── ui/
    ├── components/
    │   ├── login-form.tsx
    │   ├── register-form.tsx
    │   └── forgot-password-form.tsx
    └── views/
        ├── login.tsx
        ├── register.tsx
        └── forgot-password.tsx
```

**Rutas:**
- `/login`
- `/registro`
- `/recuperar-contrasena`

---

### 4. **Catálogo**
**Objetivo:** Navegación del inventario disponible con búsqueda, filtros y detalle de carta.

**Funcionalidades:**
- Grid de cartas con imagen, nombre, set, precio, stock
- Búsqueda por nombre
- Filtros: set/edición, rareza, rango de precio, solo en stock
- Detalle de carta con variantes y condiciones
- Selector de cantidad + botón agregar al carrito
- Botón agregar a wishlist (si autenticado y no Kiosk)
- Infinite scroll o paginación
- Loading skeletons

**Implementación:**
```
features/catalog/
├── adapters/
│   ├── api/
│   │   └── catalog.mock.ts
│   └── mappers/
│       └── card.mapper.ts
├── domain/
│   ├── types.ts (CatalogCard, CatalogFilters, CardVariant)
│   └── constants.ts (SORT_OPTIONS, FILTER_DEFAULTS)
└── ui/
    ├── components/
    │   ├── card-item.tsx
    │   ├── card-grid.tsx
    │   ├── catalog-filters.tsx
    │   ├── catalog-search.tsx
    │   ├── variant-selector.tsx
    │   ├── condition-selector.tsx
    │   ├── add-to-cart-button.tsx
    │   └── add-to-wishlist-button.tsx
    ├── hooks/
    │   ├── use-catalog.ts
    │   └── use-card-detail.ts
    └── views/
        ├── catalog.tsx
        └── card-detail.tsx
```

**Rutas:**
- `/` — Catálogo (landing)
- `/carta/[id]` — Detalle de carta

---

### 5. **Carrito y Checkout**
**Objetivo:** Carrito de compras con validación de stock, geofencing y modo Kiosk.

**Funcionalidades:**
- Agregar/quitar cartas, ajustar cantidad
- Resumen con total
- Validación de stock al confirmar
- Modal de faltantes (quitar, agregar a wishlist, continuar)
- Geofencing para no-VIP (Google Maps)
- Formulario Kiosk (nombre + correo)
- Confirmación de pedido

**Implementación:**
```
src/lib/store/
└── cart.ts (Zustand: items, addItem, removeItem, updateQuantity, clearCart)

features/cart/
├── adapters/
│   ├── api/
│   │   └── cart.mock.ts
│   └── forms/
│       └── kiosk-checkout.schema.ts
├── domain/
│   ├── types.ts (CartItem, CheckoutResult)
│   └── constants.ts
└── ui/
    ├── components/
    │   ├── cart-item.tsx
    │   ├── cart-summary.tsx
    │   ├── stock-validation-modal.tsx
    │   ├── geofence-check.tsx
    │   ├── kiosk-checkout-form.tsx
    │   └── order-confirmation.tsx
    ├── hooks/
    │   ├── use-cart.ts
    │   ├── use-checkout.ts
    │   └── use-geofence.ts
    └── views/
        ├── cart.tsx
        └── checkout.tsx
```

**Rutas:**
- `/carrito`
- `/checkout`

---

### 6. **Wishlist**
**Objetivo:** Lista de deseos con indicador de stock y notificación de restock.

**Funcionalidades:**
- Grid de cartas en wishlist
- Indicador de stock (disponible/agotado)
- Agregar al carrito si hay stock
- Quitar de wishlist
- No disponible para Kiosk ni Público

**Implementación:**
```
features/wishlist/
├── adapters/
│   └── api/
│       └── wishlist.mock.ts
├── domain/
│   └── types.ts (WishlistItem)
└── ui/
    ├── components/
    │   ├── wishlist-item.tsx
    │   └── wishlist-grid.tsx
    ├── hooks/
    │   └── use-wishlist.ts
    └── views/
        └── wishlist.tsx
```

**Rutas:**
- `/wishlist`

---

### 7. **Historial de Pedidos**
**Objetivo:** Historial de pedidos del cliente filtrado por TCG del dominio.

**Funcionalidades:**
- Lista de pedidos con código, fecha, total, estado
- Detalle de pedido con items y timeline de estados
- Filtrado por TCG del dominio
- No disponible para Kiosk

**Implementación:**
```
features/orders/
├── adapters/
│   └── api/
│       └── orders.mock.ts
├── domain/
│   ├── types.ts (Order, OrderItem, OrderStatus)
│   └── constants.ts (ORDER_STATUSES)
└── ui/
    ├── components/
    │   ├── order-card.tsx
    │   ├── order-status-badge.tsx
    │   ├── order-items-list.tsx
    │   └── order-timeline.tsx
    ├── hooks/
    │   ├── use-orders.ts
    │   └── use-order-detail.ts
    └── views/
        ├── orders.tsx
        └── order-detail.tsx
```

**Rutas:**
- `/pedidos`
- `/pedidos/[id]`

---

### 8. **Perfil de Usuario**
**Objetivo:** Ver y editar datos del usuario autenticado.

**Funcionalidades:**
- Mostrar nombre, email, teléfono, tipo (Cliente/VIP)
- Edición inline de datos
- Cambio de contraseña
- No disponible para Kiosk

**Implementación:**
```
features/profile/
├── adapters/
│   ├── api/
│   │   └── profile.mock.ts
│   └── forms/
│       ├── profile.schema.ts
│       └── change-password.schema.ts
├── domain/
│   └── types.ts
└── ui/
    ├── components/
    │   ├── profile-info.tsx
    │   ├── profile-edit-form.tsx
    │   └── change-password-form.tsx
    ├── hooks/
    │   └── use-profile.ts
    └── views/
        └── profile.tsx
```

**Rutas:**
- `/perfil`

---

### 9. **Most Wanted (Página Pública)**
**Objetivo:** Página pública sin autenticación que muestra las cartas más buscadas, optimizada para pantalla/TV.

**Funcionalidades:**
- Grid de cartas most wanted
- Nombre, imagen, notas
- Modo display (fullscreen, sin header/footer)
- Auto-refresh periódico
- Sin autenticación

**Implementación:**
```
features/most-wanted/
├── adapters/
│   └── api/
│       └── most-wanted.mock.ts
├── domain/
│   └── types.ts (MostWantedCard)
└── ui/
    ├── components/
    │   ├── most-wanted-card.tsx
    │   └── most-wanted-grid.tsx
    ├── hooks/
    │   └── use-most-wanted.ts
    └── views/
        └── most-wanted.tsx
```

**Rutas:**
- `/most-wanted`

---

## Componentes Compartidos a Crear

### `shared/base/`
- `card-image.tsx` — Imagen de carta con Next Image + fallback
- `price-display.tsx` — Formato de precio MXN
- `stock-badge.tsx` — Indicador disponible/agotado
- `quantity-selector.tsx` — Input de cantidad con +/-
- `empty-state.tsx` — Estado vacío genérico
- `search-input.tsx` — Input de búsqueda con debounce

### `shared/layouts/`
- `public-layout.tsx` — Header + footer para rutas públicas
- `authenticated-layout.tsx` — Extiende con menú de usuario
- `fullscreen-layout.tsx` — Sin header/footer (Most Wanted display)

---

## Stores Zustand

```
src/lib/store/
├── auth.ts           # Sesión del usuario (copiado del backoffice)
├── tcg-context.ts    # TCG derivado del dominio (read-only)
└── cart.ts           # Carrito de compras (items, totales)
```

---

## Orden de Implementación

### **Fase 1: Fundamentos** (Semanas 1-2)
1. Setup del repo (template desde backoffice)
2. TCG por dominio (detección + tema visual)
3. Layout público (header, footer, navegación)
4. Autenticación (login, registro, recuperar contraseña)
5. Layout autenticado (menú de usuario)

### **Fase 2: Catálogo** (Semanas 3-4)
6. Catálogo - Grid de cartas con búsqueda
7. Catálogo - Filtros
8. Catálogo - Detalle de carta
9. Catálogo - Componentes (card-item, variant-selector, etc.)

### **Fase 3: Carrito y Checkout** (Semanas 5-6)
10. Carrito - Store + Vista
11. Checkout - Validación de stock
12. Checkout - Geofencing (Google Maps)
13. Checkout - Modo Kiosk
14. Checkout - Confirmación de pedido

### **Fase 4: Cuenta de Usuario** (Semanas 7-8)
15. Perfil de usuario
16. Historial de pedidos (listado + detalle)
17. Wishlist
18. Restricciones por rol (Kiosk, Público)

### **Fase 5: Páginas Públicas y Ajustes** (Semana 9)
19. Most Wanted (página pública)
20. Responsive completo
21. Testing integral

---

## Consideraciones Técnicas

### **TCG por Dominio**
- Detectar hostname en middleware y/o client-side
- Todas las queries deben incluir `tcgType` como variable
- Variable de entorno `NEXT_PUBLIC_TCG_TYPE` para desarrollo local
- Temas visuales en `src/lib/consts/tcg-themes.ts`

### **Mocked Data**
- Todos los features inician con datos mock en `adapters/api/*.mock.ts`
- Hooks consumen mocks directamente (mismo patrón que el backoffice)
- Migración a Apollo seguirá la guía `MOCK_TO_APOLLO_MIGRATION.md` del backoffice

### **Roles y Permisos**
- Público: solo navegar catálogo y most wanted
- Cliente: todo excepto compra remota
- VIP: todo, incluida compra remota (sin geofence)
- Kiosk: navegar + carrito + checkout con formulario breve, sin perfil/pedidos/wishlist
- Validar en middleware (`proxy.ts`) y en componentes

### **Geofencing**
- Google Maps JavaScript API
- Coordenadas de tienda configurables via env
- Haversine para cálculo de distancia
- Solo aplica a Cliente (no VIP, no Kiosk)

### **Responsive**
- Mobile-first
- Grid de catálogo: 2 cols (móvil), 3 (tablet), 4-5 (desktop)
- Filtros: drawer en móvil, sidebar en desktop
- Navegación: hamburger en móvil

### **Performance**
- Infinite scroll o paginación en catálogo
- Next Image con `remotePatterns` para imágenes de cartas
- Loading skeletons en todas las vistas
- Cache de Apollo Client (cuando se integre)

### **Diseño**
- Usar Figma como base/inspiración
- Link: https://www.figma.com/design/OVJt5MDixgpKHhfO6Bk2bq/ks-UI-MVP?node-id=6403-11874
- Cada tarea en ClickUp debe referenciar el frame de Figma correspondiente

---

## Variables de Entorno

```env
# API
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.kidstop.com/graphql
NEXT_PUBLIC_API_URL=https://api.kidstop.com/graphql

# TCG (para desarrollo local)
NEXT_PUBLIC_TCG_TYPE=POKEMON

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_STORE_LATITUDE=
NEXT_PUBLIC_STORE_LONGITUDE=
NEXT_PUBLIC_STORE_RADIUS_METERS=100

# ClickUp (workflow)
CLICKUP_API_KEY=
```

---

## Notas Finales

- **Seguir arquitectura Feature-First** del backoffice
- **Datos mock** inicialmente — migrar a Apollo cuando el backend esté listo
- **Diseño de Figma** como referencia visual para cada pantalla
- **Workflow de trabajo** igual al backoffice (`/work-on-task`)
- **Commits en inglés** según las reglas del proyecto
- **No generar comentarios** en el código
- **Validar con ARCHITECTURE.md** antes de implementar cada feature
