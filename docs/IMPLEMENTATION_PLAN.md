# Plan de Implementación: Módulos del Backoffice Kidstop Singles Platform

Plan detallado para implementar todos los módulos del backoffice de Kidstop siguiendo la arquitectura Feature-First existente del proyecto.

## Contexto del Proyecto

**Proyecto:** Kidstop Singles Platform (KSP) - Backoffice para gestión de cartas singles de Pokémon TCG y Magic: The Gathering.

**Stack Actual:**
- Next.js 16 + React 19 + TypeScript 5
- Apollo Client + GraphQL Codegen
- HeroUI + Tailwind CSS 4
- Zustand (state management)
- Arquitectura Feature-First (adapters/domain/ui)

**Estructura Existente:**
```
src/features/
├── inventory/    # Ejemplo de referencia
├── login/        # Autenticación básica
└── windows/      # Ventanas (ejemplo)
```

## Módulos del Backoffice a Implementar

### 1. **Autenticación y Seguridad** ✅ (Parcialmente implementado)
**Estado:** Ya existe `features/login/` con autenticación básica y store de auth.

**Pendiente:**
- Recuperación de contraseña vía email
- Cambio de contraseña desde perfil
- Validación de políticas de contraseña
- Expiración de sesión configurable

**Implementación:**
```
features/auth/
├── adapters/
│   ├── api/
│   │   ├── auth.gql (login, logout, forgot-password, reset-password)
│   │   └── use-auth-mutations.ts
│   └── forms/
│       ├── forgot-password.schema.ts
│       ├── reset-password.schema.ts
│       └── change-password.schema.ts
├── domain/
│   ├── types.ts
│   └── constants.ts
└── ui/
    ├── components/
    │   ├── forgot-password-form.tsx
    │   ├── reset-password-form.tsx
    │   └── change-password-form.tsx
    └── views/
        ├── forgot-password.tsx
        └── reset-password.tsx
```

---

### 2. **Usuarios y Roles**
**Objetivo:** Gestión de usuarios internos del backoffice con roles (Admin/Recepción/Comprador).

**Funcionalidades:**
- CRUD de usuarios
- Asignación de roles
- Activar/Desactivar usuarios
- Listado con búsqueda y filtros

**Implementación:**
```
features/users/
├── adapters/
│   ├── api/
│   │   ├── users.gql (queries: getUsers, getUser; mutations: createUser, updateUser, toggleUserStatus)
│   │   └── use-users-queries.ts
│   ├── forms/
│   │   ├── user-form.schema.ts (nombre, email, rol, estado)
│   │   └── use-user-form.ts
│   └── mappers/
│       └── user.mapper.ts
├── domain/
│   ├── types.ts (UserRole, UserStatus, UserFilters)
│   ├── constants.ts (ROLES, USER_STATUS)
│   └── users.domain.ts (getUsersVars, validateUserRole)
└── ui/
    ├── components/
    │   ├── user-card.tsx
    │   ├── user-form-modal.tsx
    │   ├── user-filters.tsx
    │   └── user-role-badge.tsx
    └── views/
        └── users.tsx (listado con tabla/cards)
```

**Rutas:**
- `/usuarios` - Listado de usuarios

---

### 3. **Selector de Contexto TCG**
**Objetivo:** Dropdown global para seleccionar Pokémon/Magic que filtre todo el backoffice.

**Implementación:**
```
lib/store/
└── tcg-context.ts (Zustand store: selectedTCG, setTCG)

shared/layouts/
└── authenticated-layout.tsx
    └── TCGSelector component (dropdown en navbar)
```

**Integración:**
- Todos los módulos deben filtrar por `selectedTCG`
- Persistir en localStorage
- Validar que no se mezclen datos entre TCGs

---

### 4. **Catálogo de Cartas**
**Objetivo:** Búsqueda, consulta y gestión de cartas singles con respaldo interno y precios públicos.

**Funcionalidades:**
- Listado de cartas filtrado por TCG
- Búsqueda por nombre, set, identificador
- Detalle de carta con variantes
- Edición de precio de venta al público
- Sincronización con proveedores externos (Price Charting/Card Kingdom)

**Implementación:**
```
features/catalog/
├── adapters/
│   ├── api/
│   │   ├── catalog.gql (getCards, getCard, updateCardPrice, syncFromProvider)
│   │   └── use-catalog-queries.ts
│   ├── forms/
│   │   ├── card-price.schema.ts
│   │   └── use-card-price-form.ts
│   └── mappers/
│       └── card.mapper.ts
├── domain/
│   ├── types.ts (Card, CardVariant, CardFilters, TCGType)
│   ├── constants.ts (TCG_TYPES, CARD_CONDITIONS)
│   └── catalog.domain.ts (getCardsVars, calculatePriceMargin)
└── ui/
    ├── components/
    │   ├── card-search.tsx (con multibuscador)
    │   ├── card-grid.tsx
    │   ├── card-detail-modal.tsx
    │   ├── card-variant-selector.tsx
    │   ├── card-price-editor.tsx
    │   └── sync-provider-button.tsx
    └── views/
        └── catalog.tsx
```

**Rutas:**
- `/catalogo` - Listado de cartas

---

### 5. **Compras (Buylist/Negociación)**
**Objetivo:** Gestión completa del flujo de compra de cartas singles con estados, cotización WhatsApp y control de presupuesto.

**Estados:** Draft → Cotizado → Esperando precio → Finalizado / Rechazado

**Funcionalidades:**
- Búsqueda de cartas con métricas (última venta, tiempo en inventario, wishlist)
- Lista de compra con condición por carta
- Registro de vendedor
- Control de presupuesto por comprador (advertencia)
- Límite de inventario por carta (advertencia)
- Envío de cotización por WhatsApp con hipervínculo
- Modo privacidad (ocultar datos sensibles)
- Registro de pago (efectivo/transferencia/crédito tienda)
- Ajuste de precio público antes de finalizar

**Implementación:**
```
features/purchases/
├── adapters/
│   ├── api/
│   │   ├── purchases.gql (getPurchases, createPurchase, updatePurchase, sendQuote, finalizePurchase)
│   │   ├── sellers.gql (getSellers, createSeller)
│   │   └── use-purchases-mutations.ts
│   ├── forms/
│   │   ├── purchase-form.schema.ts
│   │   ├── seller-form.schema.ts
│   │   ├── payment-form.schema.ts
│   │   └── use-purchase-form.ts
│   └── mappers/
│       ├── purchase.mapper.ts
│       └── seller.mapper.ts
├── domain/
│   ├── types.ts (Purchase, PurchaseItem, PurchaseStatus, Seller, PaymentMethod)
│   ├── constants.ts (PURCHASE_STATUSES, PAYMENT_METHODS, CARD_CONDITIONS)
│   └── purchases.domain.ts (calculateTotal, checkBudget, checkInventoryLimit)
└── ui/
    ├── components/
    │   ├── purchase-list.tsx
    │   ├── purchase-form.tsx
    │   ├── card-search-with-metrics.tsx (tarjeta con métricas operativas)
    │   ├── purchase-items-table.tsx
    │   ├── seller-selector.tsx
    │   ├── budget-indicator.tsx
    │   ├── privacy-mode-toggle.tsx
    │   ├── whatsapp-quote-button.tsx
    │   ├── payment-split-modal.tsx
    │   ├── price-adjustment-modal.tsx
    │   └── purchase-status-badge.tsx
    └── views/
        ├── purchases.tsx (listado)
        └── purchase-detail.tsx (detalle/edición)
```

**Rutas:**
- `/compras` - Listado de compras
- `/compras/nueva` - Nueva compra
- `/compras/[id]` - Detalle de compra

---

### 6. **Inventario y Movimientos**
**Objetivo:** Control de stock de cartas singles con trazabilidad de movimientos.

**Funcionalidades:**
- Inventario por Carta + Variante + Condición
- Estados de stock (Disponible, Esperando recolección, No disponible)
- Registro de movimientos (Entrada por compra, Salida por venta, Ajuste manual)
- Historial de movimientos con filtros
- Stock compartido entre bar y tienda
- Métricas: última venta, tiempo promedio en inventario

**Implementación:**
```
features/inventory-cards/
├── adapters/
│   ├── api/
│   │   ├── inventory.gql (getInventory, getInventoryMovements, adjustInventory)
│   │   └── use-inventory-queries.ts
│   ├── forms/
│   │   ├── inventory-adjustment.schema.ts
│   │   └── use-adjustment-form.ts
│   └── mappers/
│       └── inventory.mapper.ts
├── domain/
│   ├── types.ts (InventoryItem, InventoryMovement, MovementType, StockStatus)
│   ├── constants.ts (MOVEMENT_TYPES, STOCK_STATUSES)
│   └── inventory.domain.ts (calculateMetrics, validateStock)
└── ui/
    ├── components/
    │   ├── inventory-grid.tsx
    │   ├── inventory-filters.tsx
    │   ├── stock-indicator.tsx
    │   ├── movement-history-table.tsx
    │   ├── adjustment-modal.tsx
    │   └── inventory-metrics.tsx
    └── views/
        ├── inventory.tsx (listado de stock)
        └── movements.tsx (historial de movimientos)
```

**Rutas:**
- `/inventario-cartas` - Stock de cartas
- `/inventario-cartas/movimientos` - Historial de movimientos

---

### 7. **Ventas (Pedidos desde Carpeta Digital)**
**Objetivo:** Gestión de pedidos originados en la Carpeta Digital para surtido en mostrador.

**Estados:** Nuevo/Recibido → En surtido → Listo para recolección → Completado / Cancelado

**Funcionalidades:**
- Listado de pedidos con filtros
- Detalle de pedido con items
- Generación de PDF (picking list)
- Código de venta único
- Notificación email "listo para recolección"
- Modal de confirmación para completar venta
- Integración con Shopify (código como custom item)

**Implementación:**
```
features/sales/
├── adapters/
│   ├── api/
│   │   ├── sales.gql (getSales, getSale, updateSaleStatus, completeSale)
│   │   └── use-sales-mutations.ts
│   ├── forms/
│   │   └── complete-sale.schema.ts
│   └── mappers/
│       └── sale.mapper.ts
├── domain/
│   ├── types.ts (Sale, SaleItem, SaleStatus, SaleCode)
│   ├── constants.ts (SALE_STATUSES)
│   └── sales.domain.ts (generateSaleCode, calculateTotal)
└── ui/
    ├── components/
    │   ├── sales-list.tsx
    │   ├── sale-detail-card.tsx
    │   ├── sale-items-table.tsx
    │   ├── sale-status-badge.tsx
    │   ├── generate-pdf-button.tsx
    │   ├── complete-sale-modal.tsx
    │   ├── sale-code-display.tsx
    │   └── send-ready-email-button.tsx
    └── views/
        ├── sales.tsx (listado)
        └── sale-detail.tsx (detalle)
```

**Rutas:**
- `/ventas` - Listado de pedidos/ventas
- `/ventas/[id]` - Detalle de venta

---

### 8. **Clientes**
**Objetivo:** Gestión de clientes con clasificación VIP, bloqueos y validación de ubicación.

**Funcionalidades:**
- Listado de clientes con búsqueda
- Clasificación: Cliente / Cliente VIP
- Bloqueo por pedidos no concretados (configurable)
- Historial de pedidos por cliente
- Gestión de datos de contacto

**Implementación:**
```
features/customers/
├── adapters/
│   ├── api/
│   │   ├── customers.gql (getCustomers, getCustomer, updateCustomer, toggleBlock, setVIP)
│   │   └── use-customers-queries.ts
│   ├── forms/
│   │   ├── customer-form.schema.ts
│   │   └── use-customer-form.ts
│   └── mappers/
│       └── customer.mapper.ts
├── domain/
│   ├── types.ts (Customer, CustomerType, CustomerStatus, CustomerFilters)
│   ├── constants.ts (CUSTOMER_TYPES, CUSTOMER_STATUSES)
│   └── customers.domain.ts (checkBlockThreshold, validateEmail)
└── ui/
    ├── components/
    │   ├── customers-list.tsx
    │   ├── customer-card.tsx
    │   ├── customer-type-badge.tsx
    │   ├── customer-status-badge.tsx
    │   ├── customer-orders-summary.tsx
    │   ├── block-customer-modal.tsx
    │   └── set-vip-modal.tsx
    └── views/
        ├── customers.tsx (listado)
        └── customer-detail.tsx (detalle)
```

**Rutas:**
- `/clientes` - Listado de clientes
- `/clientes/[id]` - Detalle de cliente

---

### 9. **Most Wanted (Configuración)**
**Objetivo:** Configurar las cartas mostradas en las páginas públicas Most Wanted por TCG.

**Funcionalidades:**
- Agregar/quitar cartas a Most Wanted
- Ordenar prioridad
- Activar/desactivar cartas
- Agregar notas por carta
- Separación por TCG

**Implementación:**
```
features/most-wanted/
├── adapters/
│   ├── api/
│   │   ├── most-wanted.gql (getMostWanted, addCard, removeCard, updateOrder, toggleActive)
│   │   └── use-most-wanted-mutations.ts
│   ├── forms/
│   │   ├── most-wanted-card.schema.ts
│   │   └── use-most-wanted-form.ts
│   └── mappers/
│       └── most-wanted.mapper.ts
├── domain/
│   ├── types.ts (MostWantedCard, Priority)
│   ├── constants.ts (PRIORITIES)
│   └── most-wanted.domain.ts
└── ui/
    ├── components/
    │   ├── most-wanted-list.tsx (drag & drop para ordenar)
    │   ├── add-card-modal.tsx
    │   ├── card-priority-selector.tsx
    │   └── most-wanted-preview.tsx
    └── views/
        └── most-wanted-config.tsx
```

**Rutas:**
- `/most-wanted` - Configuración Most Wanted

---

### 10. **Configuración Global**
**Objetivo:** Configuraciones del sistema (umbrales, geofence, horarios, etc.).

**Funcionalidades:**
- Configuración de geofence (Google Maps)
- Umbral de bloqueo por pedidos no concretados
- Presupuestos por comprador
- Límite de inventario por carta
- Horarios de operación

**Implementación:**
```
features/settings/
├── adapters/
│   ├── api/
│   │   ├── settings.gql (getSettings, updateSettings)
│   │   └── use-settings-mutations.ts
│   └── forms/
│       ├── geofence-settings.schema.ts
│       ├── budget-settings.schema.ts
│       └── threshold-settings.schema.ts
├── domain/
│   ├── types.ts (Settings, GeofenceConfig, BudgetConfig)
│   └── constants.ts
└── ui/
    ├── components/
    │   ├── geofence-map.tsx (Google Maps)
    │   ├── budget-config-form.tsx
    │   ├── threshold-config-form.tsx
    │   └── settings-section.tsx
    └── views/
        └── settings.tsx
```

**Rutas:**
- `/configuracion` - Configuración global

---

## Componentes Compartidos a Crear

### `shared/base/`
- `tcg-selector.tsx` - Selector de contexto TCG
- `status-badge.tsx` - Badge genérico de estados
- `metric-card.tsx` - Card para mostrar métricas
- `privacy-toggle.tsx` - Toggle de modo privacidad
- `whatsapp-button.tsx` - Botón de envío WhatsApp
- `pdf-generator-button.tsx` - Botón de generación PDF

### `shared/blocks/`
- `card-search-block.tsx` - Bloque de búsqueda de cartas con filtros
- `payment-split-block.tsx` - Bloque para dividir pagos
- `metrics-dashboard.tsx` - Dashboard de métricas operativas

---

## Stores Zustand Necesarios

```
lib/store/
├── tcg-context.ts (selectedTCG, setTCG)
├── privacy-mode.ts (isPrivacyMode, togglePrivacyMode)
└── budget.ts (budgets por comprador)
```

---

## Integraciones Externas

### 1. **Proveedores de Catálogo/Precios**
- Price Charting (Pokémon)
- Card Kingdom (Magic)
- Implementar en `lib/api/integrations/catalog-providers.ts`

### 2. **Google Maps API**
- Geolocalización y geofencing
- Implementar en `lib/api/integrations/google-maps.ts`

### 3. **Email Transaccional**
- Notificaciones (pedido listo, restock, recuperación contraseña)
- Implementar en `lib/api/integrations/email.ts`

### 4. **WhatsApp**
- Envío de cotizaciones con hipervínculo
- Implementar en `lib/api/integrations/whatsapp.ts`

### 5. **PDF Generation**
- Picking lists
- Implementar en `lib/utils/pdf-generator.ts`

---

## Orden de Implementación Recomendado

### **Fase 1: Fundamentos** (Semanas 1-2)
1. Selector de contexto TCG (store + UI)
2. Completar autenticación (recuperación contraseña)
3. Usuarios y roles (CRUD completo)
4. Configuración global (settings básicos)

### **Fase 2: Catálogo e Inventario** (Semanas 3-4)
5. Catálogo de cartas (búsqueda, detalle, precios)
6. Inventario y movimientos (stock, trazabilidad)
7. Integración con proveedores de catálogo

### **Fase 3: Compras** (Semanas 5-6)
8. Compras - Flujo completo (Draft → Finalizado)
9. Búsqueda con métricas operativas
10. Modo privacidad
11. Integración WhatsApp

### **Fase 4: Ventas y Clientes** (Semanas 7-8)
12. Clientes (gestión, VIP, bloqueos)
13. Ventas (pedidos, surtido, completar)
14. Integración Google Maps (geofencing)
15. Generación de PDFs
16. Emails transaccionales

### **Fase 5: Configuración y Extras** (Semana 9)
17. Most Wanted (configuración backoffice)
18. Ajustes finales de configuración
19. Testing integral

---

## Consideraciones Técnicas

### **GraphQL Schema**
- Definir todos los tipos, queries y mutations en el backend
- Ejecutar `npm run codegen` después de cada cambio en `.gql`

### **Permisos por Rol**
- Implementar middleware de permisos en cada query/mutation
- Validar en UI y en backend
- Usar matriz de permisos del documento

### **Separación por TCG**
- Todos los queries deben filtrar por `tcgType`
- Validar que no se mezclen datos entre Pokémon y Magic
- Persistir contexto seleccionado en localStorage

### **Responsive**
- Validar en móvil, tablet y desktop
- Usar breakpoints de Tailwind
- Componentes HeroUI son responsive por defecto

### **Performance**
- Implementar paginación en todos los listados
- Usar `skip` en queries cuando no hay contexto
- Lazy loading de componentes pesados
- Cache de Apollo Client

### **Testing**
- Unit tests para domain logic
- Integration tests para flujos críticos
- E2E para flujos completos (compra, venta)

---

## Archivos de Configuración a Actualizar

### `.env`
```env
# Proveedores de catálogo
PRICE_CHARTING_API_KEY=
CARD_KINGDOM_API_KEY=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

# WhatsApp
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=

# Configuración
DEFAULT_BUDGET_LIMIT=
DEFAULT_INVENTORY_LIMIT=20
UNCOMPLETED_ORDERS_THRESHOLD=3
```

### `codegen.ts`
- Agregar todos los nuevos archivos `.gql` al preset

---

## Notas Finales

- **Seguir arquitectura Feature-First** existente en el proyecto
- **Reutilizar componentes** de `shared/` cuando sea posible
- **Mantener consistencia** con el código existente (naming, estructura)
- **No generar comentarios** en el código (según guidelines)
- **Commits en inglés** según las reglas del proyecto
- **Validar con ARCHITECTURE.md** antes de implementar cada feature
