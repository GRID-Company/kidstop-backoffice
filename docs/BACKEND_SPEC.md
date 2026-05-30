# Backend Specification — Kidstop Singles Platform

Especificación del schema GraphQL (schema-first) para el backend NestJS.
Este documento define entidades, queries, mutations, reglas de negocio e integraciones que el backend debe implementar.

> **Referencia frontend:** Los tipos aquí definidos deben ser consistentes con los domain types en `src/features/*/domain/types.ts`.
> **Enfoque:** Schema-first — el backend define el `.graphql` y el frontend genera tipos con `graphql-codegen`.

## Tabla de Contenidos

- [Convenciones Generales](#convenciones-generales)
- [Enums y Tipos Compartidos](#enums-y-tipos-compartidos)
- [Módulo 1: Autenticación y Seguridad](#módulo-1-autenticación-y-seguridad)
- [Módulo 2: Usuarios y Roles](#módulo-2-usuarios-y-roles)
- [Módulo 3: Catálogo de Cartas](#módulo-3-catálogo-de-cartas)
- [Módulo 4: Compras (Buylist/Negociación)](#módulo-4-compras-buylistnegociación)
- [Módulo 5: Inventario y Movimientos](#módulo-5-inventario-y-movimientos)
- [Módulo 6: Ventas](#módulo-6-ventas-pedidos-desde-carpeta-digital)
- [Módulo 7: Clientes](#módulo-7-clientes)
- [Módulo 8: Most Wanted](#módulo-8-most-wanted-configuración)
- [Módulo 9: Configuración Global](#módulo-9-configuración-global)

---

## Convenciones Generales

### Paginación

Todas las queries de listado usan esta estructura estándar:

```graphql
input SortType {
  column: String!
  order: String!  # ASC | DESC
}

input DateRange {
  from: String
  to: String
}
```

Patrón de argumentos para queries paginadas:

```graphql
input Find{Entity}sArgs {
  filters: Find{Entity}sFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}
```

Patrón de respuesta paginada:

```graphql
type Paginated{Entity}s {
  count: Float
  data: [{Entity}]
}
```

### Identificadores

- Usar `guid: String!` como identificador principal (consistente con schema existente)
- Usar `ID` scalar solo en inputs de relaciones

### Auditoría

Todas las entidades incluyen:

```graphql
interface Auditable {
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}
```

### Respuestas Genéricas

```graphql
type GenericOutput {
  message: String!
}
```

### Scalars

```graphql
scalar Timestamp
scalar Upload
```

---

## Enums y Tipos Compartidos

```graphql
enum TCGType {
  POKEMON
  MAGIC
}

enum CardCondition {
  NEAR_MINT
  LIGHTLY_PLAYED
  MODERATELY_PLAYED
  HEAVILY_PLAYED
  DAMAGED
}

enum UserRole {
  SUPERUSER
  ADMIN
  RECEPTION
  BUYER
}
```

---

## Módulo 1: Autenticación y Seguridad

### Entidades

```graphql
type User {
  guid: String!
  name: String
  emailAddress: String!
  role: UserRole!
  activated: Boolean!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type LoginOutput {
  access_token: String
  credentials_expired_token: String
  user: User
}

type ChangePasswordOutput {
  success: Boolean!
}

type RequestPasswordChangeOutput {
  success: Boolean!
}

type IsValidTokenOutput {
  isValid: Boolean!
}
```

### Inputs

```graphql
input LoginUserInput {
  emailAddress: String!
  password: String!
}

input RequestPasswordChangeInput {
  emailAddress: String!
}

input ChangePasswordInput {
  otp_guid: String!
  new_password: String!
}

input UserFinishSignupInput {
  otp_guid: String!
  password: String!
}
```

### Queries

```graphql
type Query {
  isValidToken: IsValidTokenOutput!
  userProfile: User!
}
```

### Mutations

```graphql
type Mutation {
  login(loginUserInput: LoginUserInput!): LoginOutput!
  requestPasswordChange(requestPasswordChangeInput: RequestPasswordChangeInput!): RequestPasswordChangeOutput!
  changePassword(changePasswordInput: ChangePasswordInput!): ChangePasswordOutput!
  userFinishSignUp(userFinishSignupInput: UserFinishSignupInput!): ChangePasswordOutput!
}
```

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| JWT Expiration | Token expira según configuración del servidor (recomendado: 8h) |
| OTP Expiration | Token de recuperación expira en 30 minutos |
| Password Policy | Mínimo 8 caracteres, al menos 1 mayúscula, 1 número |
| Credentials Expired | Si `credentials_expired_token` viene en login, redirigir a cambio de contraseña |
| Finish Signup | Usuarios nuevos creados por Admin reciben email para definir su password |

### Integraciones

| Integración | Trigger | Descripción |
|-------------|---------|-------------|
| Email | `requestPasswordChange` | Enviar email con link de recuperación de contraseña |
| Email | `createUser` (Módulo 2) | Enviar email de bienvenida con link de signup |

---

## Módulo 2: Usuarios y Roles

### Entidades

```graphql
type UserDetail {
  guid: String!
  name: String
  emailAddress: String!
  role: UserRole!
  activated: Boolean!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedUsers {
  count: Float
  data: [User]
}
```

### Inputs

```graphql
input CreateUserInput {
  name: String!
  emailAddress: String!
  role: String!
  password: String
}

input UpdateUserInput {
  guid: ID
  name: String
  emailAddress: String
  role: String
}

input UpdateUserProfileInput {
  name: String
  emailAddress: String
  oldPassword: String
}

input FindUsersArgs {
  filters: FindUsersFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindUsersFilter {
  activated: Boolean
  role: String
}
```

### Queries

```graphql
type Query {
  users(findUsersArgs: FindUsersArgs!): PaginatedUsers!
  user(guid: String!): UserDetail!
  userProfile: User!
}
```

### Mutations

```graphql
type Mutation {
  createUser(createUserInput: CreateUserInput!): User!
  updateUser(updateUserInput: UpdateUserInput!): GenericOutput!
  deactiveUser(guid: String!): GenericOutput!
  updateUserProfile(updateUserProfileInput: UpdateUserProfileInput!): GenericOutput!
  createSuperUser(createUserInput: CreateUserInput!): User!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Autenticación / acceso al backoffice | ✅ | ✅ | ✅ |
| Crear usuarios | ✅ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ❌ |
| Activar/desactivar usuarios | ✅ | ❌ | ❌ |
| Editar perfil propio | ✅ | ✅ | ✅ |

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Solo ADMIN crea usuarios | Guard: role === ADMIN o SUPERUSER |
| Solo ADMIN desactiva | Guard: role === ADMIN o SUPERUSER |
| No auto-desactivar | Un usuario no puede desactivarse a sí mismo |
| Email único | Validar unicidad de emailAddress |
| Roles válidos | Solo ADMIN, RECEPTION, BUYER (no SUPERUSER desde UI) |
| Search | Busca por `name` y `emailAddress` |
| Filtros | `activated` (boolean), `role` (string) |
| Sort default | `createdDate DESC` |

---

## Módulo 3: Catálogo de Cartas

### Entidades

```graphql
type Card {
  guid: String!
  name: String!
  setName: String!
  setCode: String!
  number: String!
  rarity: String!
  imageUrl: String!
  tcgType: TCGType!
  variants: [CardVariant!]!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type CardVariant {
  guid: String!
  card: Card!
  condition: CardCondition!
  stock: Int!
  buyPrice: Float!
  sellPrice: Float!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedCards {
  count: Float
  data: [Card]
}
```

### Inputs

```graphql
input FindCardsArgs {
  filters: FindCardsFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindCardsFilter {
  tcgType: TCGType
  setCode: String
  rarity: String
  condition: CardCondition
}

input UpdateCardPriceInput {
  variantGuid: String!
  sellPrice: Float!
}

input SyncFromProviderInput {
  tcgType: TCGType!
}
```

### Queries

```graphql
type Query {
  cards(findCardsArgs: FindCardsArgs!): PaginatedCards!
  card(guid: String!): Card!
}
```

### Mutations

```graphql
type Mutation {
  updateCardPrice(updateCardPriceInput: UpdateCardPriceInput!): CardVariant!
  syncFromProvider(syncFromProviderInput: SyncFromProviderInput!): GenericOutput!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Ver/listar/buscar cartas | ✅ | ✅ | ✅ |
| Editar carta/variante | ✅ | ✅ | ✅ |
| Ajustar precio público | ✅ | ✅ | ✅ |
| Sincronizar proveedor | ✅ | ✅ | ✅ |

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Filtro TCG obligatorio | Todas las queries deben filtrar por `tcgType` del contexto seleccionado |
| No mezclar TCGs | Validar que no se mezclen datos entre Pokémon y Magic |
| Search | Busca por `name`, `setName`, `setCode`, `number` |
| Rarities por TCG | Pokémon: Common, Uncommon, Rare Holo, Rare Holo V, Ultra Rare, Double Rare, Special Art Rare, Secret Rare. Magic: Common, Uncommon, Rare, Mythic Rare |
| Precio mínimo | `sellPrice` >= 0 |
| Sync provider | POKEMON → Price Charting API. MAGIC → Card Kingdom API |
| Fallback catálogo | Si proveedor externo falla, usar catálogo interno existente |
| Stock en variante | El campo `stock` en `CardVariant` es calculado desde inventario (read-only aquí) |

### Integraciones

| Proveedor | TCG | Propósito |
|-----------|-----|-----------|
| Price Charting | POKEMON | Poblar/actualizar catálogo + precios de referencia |
| Card Kingdom | MAGIC | Poblar/actualizar catálogo + precios de referencia |

### Relaciones

```
Card 1 ──→ N CardVariant (por condición)
CardVariant 1 ──→ N InventoryItem (stock calculado)
```

---

## Módulo 4: Compras (Buylist/Negociación)

### Enums

```graphql
enum PurchaseStatus {
  DRAFT
  QUOTED
  WAITING_PRICE
  FINALIZED
  REJECTED
}

enum PaymentMethod {
  CASH
  TRANSFER
  STORE_CREDIT
}
```

### Entidades

```graphql
type Seller {
  guid: String!
  name: String!
  phone: String!
  email: String
  notes: String
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PurchaseItem {
  guid: String!
  card: Card!
  cardName: String!
  cardImageUrl: String!
  setName: String!
  setCode: String!
  tcgType: TCGType!
  condition: CardCondition!
  quantity: Int!
  unitBuyPrice: Float!
  unitSellPrice: Float!
}

type PaymentDetail {
  method: PaymentMethod!
  amount: Float!
}

type Purchase {
  guid: String!
  code: String!
  status: PurchaseStatus!
  seller: Seller!
  items: [PurchaseItem!]!
  payments: [PaymentDetail!]!
  tcgType: TCGType!
  buyer: User!
  notes: String
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedPurchases {
  count: Float
  data: [Purchase]
}

type PaginatedSellers {
  count: Float
  data: [Seller]
}

type CardSearchMetrics {
  referencePrice: Float!
  currentStock: Int!
  lastSaleDate: String
  daysInInventory: Int!
  wishlistCount: Int!
}

type CardSearchResult {
  guid: String!
  name: String!
  setName: String!
  setCode: String!
  number: String!
  rarity: String!
  imageUrl: String!
  tcgType: TCGType!
  metrics: CardSearchMetrics!
}

type PaginatedCardSearchResults {
  count: Float
  data: [CardSearchResult]
}

type BuyerBudget {
  buyerGuid: String!
  buyerName: String!
  budgetLimit: Float!
  budgetUsed: Float!
  budgetRemaining: Float!
}
```

### Inputs

```graphql
input FindPurchasesArgs {
  filters: FindPurchasesFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindPurchasesFilter {
  tcgType: TCGType
  status: PurchaseStatus
  sellerGuid: String
  buyerGuid: String
}

input FindSellersArgs {
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input SearchCardsWithMetricsArgs {
  tcgType: TCGType!
  search: String!
  limit: Int!
  skip: Int!
}

input CreateSellerInput {
  name: String!
  phone: String!
  email: String
  notes: String
}

input PurchaseItemInput {
  cardGuid: String!
  condition: CardCondition!
  quantity: Int!
  unitBuyPrice: Float!
  unitSellPrice: Float!
}

input PaymentDetailInput {
  method: PaymentMethod!
  amount: Float!
}

input CreatePurchaseInput {
  sellerGuid: String!
  tcgType: TCGType!
  items: [PurchaseItemInput!]!
  notes: String
}

input UpdatePurchaseInput {
  purchaseGuid: String!
  sellerGuid: String
  items: [PurchaseItemInput!]
  notes: String
}

input SendQuoteInput {
  purchaseGuid: String!
}

input FinalizePurchaseInput {
  purchaseGuid: String!
  payments: [PaymentDetailInput!]!
}

input PriceAdjustmentItemInput {
  itemGuid: String!
  sellPrice: Float!
}

input AdjustPurchasePricesInput {
  purchaseGuid: String!
  items: [PriceAdjustmentItemInput!]!
}
```

### Queries

```graphql
type Query {
  purchases(findPurchasesArgs: FindPurchasesArgs!): PaginatedPurchases!
  purchase(guid: String!): Purchase!
  searchCardsWithMetrics(args: SearchCardsWithMetricsArgs!): PaginatedCardSearchResults!
  sellers(findSellersArgs: FindSellersArgs!): PaginatedSellers!
  buyerBudget(buyerGuid: String!): BuyerBudget!
}
```

### Mutations

```graphql
type Mutation {
  createSeller(createSellerInput: CreateSellerInput!): Seller!
  createPurchase(createPurchaseInput: CreatePurchaseInput!): Purchase!
  updatePurchase(updatePurchaseInput: UpdatePurchaseInput!): Purchase!
  sendQuote(sendQuoteInput: SendQuoteInput!): Purchase!
  acceptQuote(purchaseGuid: String!): Purchase!
  rejectQuote(purchaseGuid: String!): Purchase!
  adjustPurchasePrices(adjustPurchasePricesInput: AdjustPurchasePricesInput!): Purchase!
  finalizePurchase(finalizePurchaseInput: FinalizePurchaseInput!): Purchase!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Crear/editar Draft | ✅ | ✅ | ✅ |
| Enviar cotización WhatsApp | ✅ | ✅ | ✅ |
| Aceptar/rechazar cotización | ✅ | ✅ | ✅ |
| Pasar a "Esperando precio" | ✅ | ✅ | ✅ |
| Finalizar (sumar a stock) | ✅ | ✅ | ✅ |

### Transiciones de Estado

```
DRAFT → QUOTED            (sendQuote: envía WhatsApp)
QUOTED → WAITING_PRICE    (acceptQuote)
QUOTED → REJECTED         (rejectQuote)
WAITING_PRICE → FINALIZED (finalizePurchase: suma stock + registra pago)
```

> **Estados terminales:** FINALIZED, REJECTED (no permiten más transiciones)

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Solo editar en DRAFT | `updatePurchase` solo funciona si status === DRAFT |
| Validar transición | Cada mutation valida que el status actual permita la transición |
| Código auto-generado | `code` se genera automáticamente: `CMP-{YYYY}-{NNN}` |
| Presupuesto: advertencia | Al crear/editar, calcular si excede presupuesto del buyer → retornar warning, NO bloquear |
| Límite inventario: advertencia | Al agregar item, validar stock actual vs límite (default: 20) → retornar warning, NO bloquear |
| Suma a stock al finalizar | `finalizePurchase` → crear `InventoryMovement` tipo `PURCHASE_ENTRY` por cada item |
| Pagos deben cuadrar | Suma de `payments[].amount` debe ser igual a total de la compra |
| Total calculado | `total = Σ(item.quantity × item.unitBuyPrice)` |
| Filtro TCG | Todas las queries filtran por `tcgType` |
| Search | Busca por `code`, `seller.name` |

### Integraciones

| Integración | Trigger | Descripción |
|-------------|---------|-------------|
| WhatsApp | `sendQuote` | Genera mensaje con items + total + link, abre WhatsApp al vendedor |
| Inventario | `finalizePurchase` | Crea movimientos de entrada por cada item |
| Catálogo | `adjustPurchasePrices` | Actualiza `sellPrice` en CardVariant del catálogo |

### Relaciones

```
Purchase N ──→ 1 Seller
Purchase N ──→ 1 User (buyer)
Purchase 1 ──→ N PurchaseItem
PurchaseItem N ──→ 1 Card
Purchase 1 ──→ N PaymentDetail
```

---

## Módulo 5: Inventario y Movimientos

### Enums

```graphql
enum MovementType {
  PURCHASE_ENTRY
  SALE_EXIT
  MANUAL_ADJUSTMENT
}

enum StockStatus {
  AVAILABLE
  AWAITING_PICKUP
  UNAVAILABLE
}
```

### Entidades

```graphql
type InventoryItem {
  guid: String!
  card: Card!
  cardName: String!
  setName: String!
  setCode: String!
  number: String!
  rarity: String!
  imageUrl: String!
  tcgType: TCGType!
  condition: CardCondition!
  stock: Int!
  stockStatus: StockStatus!
  buyPrice: Float!
  sellPrice: Float!
  lastSoldAt: String
  avgDaysInInventory: Float
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type InventoryMovement {
  guid: String!
  inventoryItem: InventoryItem!
  cardName: String!
  cardImageUrl: String!
  setName: String!
  setCode: String!
  cardNumber: String!
  tcgType: TCGType!
  type: MovementType!
  quantity: Int!
  reason: String!
  user: User!
  reference: String
  createdDate: Timestamp!
}

type PaginatedInventoryItems {
  count: Float
  data: [InventoryItem]
}

type PaginatedInventoryMovements {
  count: Float
  data: [InventoryMovement]
}

type InventoryMetrics {
  totalItems: Int!
  totalStock: Int!
  totalValue: Float!
  lowStockCount: Int!
}
```

### Inputs

```graphql
input FindInventoryItemsArgs {
  filters: FindInventoryItemsFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindInventoryItemsFilter {
  tcgType: TCGType
  condition: CardCondition
  stockStatus: StockStatus
  rarity: String
}

input FindInventoryMovementsArgs {
  filters: FindInventoryMovementsFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindInventoryMovementsFilter {
  tcgType: TCGType
  type: MovementType
  dateRange: DateRange
}

input AdjustInventoryInput {
  inventoryItemGuid: String!
  quantity: Int!
  reason: String!
}
```

### Queries

```graphql
type Query {
  inventoryItems(findInventoryItemsArgs: FindInventoryItemsArgs!): PaginatedInventoryItems!
  inventoryMovements(findInventoryMovementsArgs: FindInventoryMovementsArgs!): PaginatedInventoryMovements!
  inventoryMetrics(tcgType: TCGType!): InventoryMetrics!
}
```

### Mutations

```graphql
type Mutation {
  adjustInventory(adjustInventoryInput: AdjustInventoryInput!): InventoryItem!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Ver stock y movimientos | ✅ | ✅ | ✅ |
| Ajustes manuales (+/-) | ✅ | ❌ | ❌ |

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Ajuste solo Admin | Guard: role === ADMIN o SUPERUSER |
| Movimiento automático: compra | `finalizePurchase` → crea movimiento `PURCHASE_ENTRY` (no se llama directamente) |
| Movimiento automático: venta | `completeSale` → crea movimiento `SALE_EXIT` (no se llama directamente) |
| Ajuste manual registra motivo | `reason` es obligatorio en ajustes manuales |
| Stock nunca negativo | Validar que stock resultante >= 0 |
| StockStatus calculado | `AVAILABLE` si stock > 0 y no hay pedido pendiente. `AWAITING_PICKUP` si hay pedido en estado READY_FOR_PICKUP. `UNAVAILABLE` si stock === 0 |
| Métricas calculadas | `lastSoldAt`: fecha del último movimiento SALE_EXIT. `avgDaysInInventory`: promedio de días entre PURCHASE_ENTRY y SALE_EXIT |
| Filtro TCG | Todas las queries filtran por `tcgType` |
| Search | Busca por `cardName`, `setName`, `setCode`, `cardNumber` |
| Trazabilidad | Cada movimiento registra: usuario, fecha, tipo, cantidad, razón, referencia (guid de compra/venta) |

### Relaciones

```
InventoryItem N ──→ 1 Card
InventoryItem 1 ──→ N InventoryMovement
InventoryMovement N ──→ 1 User (quien ejecutó)
InventoryMovement ──→ Purchase o Sale (reference)
```

---

## Módulo 6: Ventas (Pedidos desde Carpeta Digital)

### Enums

```graphql
enum SaleStatus {
  NEW
  IN_PROGRESS
  READY_FOR_PICKUP
  COMPLETED
  CANCELLED
}

enum FulfillmentStatus {
  PENDING
  FOUND
  PARTIAL
  NOT_AVAILABLE
}
```

### Entidades

```graphql
type SaleItem {
  guid: String!
  card: Card!
  cardName: String!
  cardImageUrl: String!
  setName: String!
  setCode: String!
  tcgType: TCGType!
  condition: CardCondition!
  quantity: Int!
  foundQuantity: Int!
  unitPrice: Float!
  fulfillmentStatus: FulfillmentStatus!
}

type Sale {
  guid: String!
  code: String!
  status: SaleStatus!
  items: [SaleItem!]!
  customer: Customer!
  customerName: String!
  customerEmail: String!
  tcgType: TCGType!
  notes: String
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedSales {
  count: Float
  data: [Sale]
}
```

### Inputs

```graphql
input FindSalesArgs {
  filters: FindSalesFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindSalesFilter {
  tcgType: TCGType
  status: SaleStatus
  customerGuid: String
}

input UpdateSaleStatusInput {
  saleGuid: String!
  status: SaleStatus!
}

input UpdateSaleItemFulfillmentInput {
  saleItemGuid: String!
  foundQuantity: Int!
  fulfillmentStatus: FulfillmentStatus!
}

input CompleteSaleInput {
  saleGuid: String!
  items: [UpdateSaleItemFulfillmentInput!]!
}
```

### Queries

```graphql
type Query {
  sales(findSalesArgs: FindSalesArgs!): PaginatedSales!
  sale(guid: String!): Sale!
}
```

### Mutations

```graphql
type Mutation {
  updateSaleStatus(updateSaleStatusInput: UpdateSaleStatusInput!): Sale!
  completeSale(completeSaleInput: CompleteSaleInput!): Sale!
  cancelSale(saleGuid: String!): Sale!
  sendReadyForPickupEmail(saleGuid: String!): GenericOutput!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Ver pedidos | ✅ | ✅ | ❌ |
| Cambiar estatus | ✅ | ✅ | ❌ |
| Generar PDF picking list | ✅ | ✅ | ❌ |
| Completar venta | ✅ | ✅ | ❌ |

### Transiciones de Estado

```
NEW → IN_PROGRESS               (iniciar surtido)
IN_PROGRESS → READY_FOR_PICKUP  (marcar listo → enviar email)
READY_FOR_PICKUP → COMPLETED    (completeSale → descuenta stock)
Cualquier estado (excepto COMPLETED) → CANCELLED
```

> **Estados terminales:** COMPLETED, CANCELLED

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Buyer no ve ventas | Guard: role !== BUYER |
| Ventas desde Carpeta Digital | Las ventas se crean desde la Carpeta Digital, no desde el backoffice (no hay `createSale` mutation) |
| Código auto-generado | `code` se genera automáticamente: `VTA-{YYYY}-{NNN}` |
| Validar transición | Cada mutation valida que el status actual permita la transición |
| Descuenta stock al completar | `completeSale` → crea movimiento `SALE_EXIT` por cada item con `foundQuantity > 0` |
| FulfillmentStatus | Se actualiza durante surtido: PENDING → FOUND/PARTIAL/NOT_AVAILABLE |
| Email al marcar listo | Al pasar a `READY_FOR_PICKUP` → enviar email al cliente |
| PDF picking list | Endpoint REST o query que genera PDF con: código, cliente, TCG, items (carta, variante, condición, cantidad) |
| Search | Busca por `code`, `customerName`, `customerEmail` |
| Filtro TCG | Todas las queries filtran por `tcgType` |

### Integraciones

| Integración | Trigger | Descripción |
|-------------|---------|-------------|
| Email | `READY_FOR_PICKUP` | Enviar email "tu pedido está listo para recolección" |
| Inventario | `completeSale` | Crear movimientos `SALE_EXIT` |
| PDF | Query/endpoint | Generar picking list PDF |

### Relaciones

```
Sale N ──→ 1 Customer
Sale 1 ──→ N SaleItem
SaleItem N ──→ 1 Card
Sale → InventoryMovement (al completar)
```

---

## Módulo 7: Clientes

### Enums

```graphql
enum CustomerType {
  REGULAR
  VIP
}

enum CustomerStatus {
  ACTIVE
  BLOCKED
}
```

### Entidades

```graphql
type Customer {
  guid: String!
  name: String!
  email: String!
  phone: String
  type: CustomerType!
  status: CustomerStatus!
  notes: String
  totalOrders: Int!
  lastOrderDate: String
  uncompletedOrders: Int!
  blockedAt: String
  createdDate: Timestamp!
  updatedDate: Timestamp!
}

type CustomerOrder {
  guid: String!
  code: String!
  status: String!
  totalItems: Int!
  totalAmount: Float!
  createdDate: Timestamp!
  completedAt: String
}

type CustomerOrdersSummary {
  totalOrders: Int!
  completedOrders: Int!
  cancelledOrders: Int!
  orders: [CustomerOrder!]!
}

type PaginatedCustomers {
  count: Float
  data: [Customer]
}
```

### Inputs

```graphql
input FindCustomersArgs {
  filters: FindCustomersFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindCustomersFilter {
  type: CustomerType
  status: CustomerStatus
}

input UpdateCustomerInput {
  customerGuid: String!
  name: String
  email: String
  phone: String
  notes: String
}

input BlockCustomerInput {
  customerGuid: String!
  reason: String!
}

input SetVipInput {
  customerGuid: String!
  isVip: Boolean!
}
```

### Queries

```graphql
type Query {
  customers(findCustomersArgs: FindCustomersArgs!): PaginatedCustomers!
  customer(guid: String!): Customer!
  customerOrders(customerGuid: String!): CustomerOrdersSummary!
}
```

### Mutations

```graphql
type Mutation {
  updateCustomer(updateCustomerInput: UpdateCustomerInput!): Customer!
  blockCustomer(blockCustomerInput: BlockCustomerInput!): Customer!
  unblockCustomer(customerGuid: String!): Customer!
  setCustomerVip(setVipInput: SetVipInput!): Customer!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Ver/listar/buscar | ✅ | ✅ | ❌ |
| Bloquear/desbloquear | ✅ | ✅ | ❌ |
| Cambiar tipo (Cliente ↔ VIP) | ✅ | ❌ | ❌ |

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Buyer no ve clientes | Guard: role !== BUYER |
| Solo Admin cambia VIP | Guard: role === ADMIN o SUPERUSER para `setCustomerVip` |
| Bloqueo automático | Si `uncompletedOrders >= threshold` (configurable en Settings) → bloquear automáticamente |
| Bloqueo manual | `blockCustomer` requiere `reason` |
| Desbloqueo resetea contador | `unblockCustomer` → resetea `uncompletedOrders` a 0 |
| Registro desde Carpeta Digital | Los clientes se crean desde la Carpeta Digital (no hay `createCustomer` en backoffice) |
| Cuenta unificada | Un cliente tiene una sola cuenta para Pokémon y Magic |
| Search | Busca por `name`, `email`, `phone` |
| Sort default | `name ASC` |
| `totalOrders` calculado | Conteo de pedidos del cliente |
| `lastOrderDate` calculado | Fecha del pedido más reciente |

### Relaciones

```
Customer 1 ──→ N Sale (pedidos)
Customer ──→ Settings (threshold de bloqueo)
```

---

## Módulo 8: Most Wanted (Configuración)

### Enums

```graphql
enum MostWantedPriority {
  HIGH
  MEDIUM
  LOW
}
```

### Entidades

```graphql
type MostWantedCard {
  guid: String!
  card: Card!
  tcgType: TCGType!
  priority: MostWantedPriority!
  notes: String!
  isActive: Boolean!
  order: Int!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedMostWantedCards {
  count: Float
  data: [MostWantedCard]
}
```

### Inputs

```graphql
input FindMostWantedArgs {
  filters: FindMostWantedFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindMostWantedFilter {
  tcgType: TCGType
  priority: MostWantedPriority
  isActive: Boolean
}

input AddMostWantedCardInput {
  cardGuid: String!
  tcgType: TCGType!
  priority: MostWantedPriority!
  notes: String
}

input UpdateMostWantedCardInput {
  mostWantedGuid: String!
  priority: MostWantedPriority
  notes: String
  isActive: Boolean
}

input ReorderMostWantedInput {
  items: [MostWantedOrderItemInput!]!
}

input MostWantedOrderItemInput {
  mostWantedGuid: String!
  order: Int!
}
```

### Queries

```graphql
type Query {
  mostWantedCards(findMostWantedArgs: FindMostWantedArgs!): PaginatedMostWantedCards!
  mostWantedPublic(tcgType: TCGType!): [MostWantedCard!]!
}
```

### Mutations

```graphql
type Mutation {
  addMostWantedCard(addMostWantedCardInput: AddMostWantedCardInput!): MostWantedCard!
  updateMostWantedCard(updateMostWantedCardInput: UpdateMostWantedCardInput!): MostWantedCard!
  reorderMostWanted(reorderMostWantedInput: ReorderMostWantedInput!): GenericOutput!
  removeMostWantedCard(mostWantedGuid: String!): GenericOutput!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Configurar (agregar/quitar/ordenar/activar) | ✅ | ✅ | ✅ |

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Separación por TCG | Cada carta Most Wanted pertenece a un `tcgType` específico |
| No duplicar | No se puede agregar la misma carta dos veces al mismo TCG |
| Orden único | El campo `order` define la posición en la lista; `reorderMostWanted` actualiza en batch |
| Público sin auth | `mostWantedPublic` no requiere autenticación; solo retorna cartas con `isActive === true`, ordenadas por `order` |
| Search | Busca por nombre de carta, set |
| Default notes | Si no se envía `notes`, se guarda string vacío |

### Relaciones

```
MostWantedCard N ──→ 1 Card
MostWantedCard filtrado por TCGType
```

---

## Módulo 9: Configuración Global

### Entidades

```graphql
type GeofenceCoordinate {
  lat: Float!
  lng: Float!
}

type GeofenceConfig {
  enabled: Boolean!
  center: GeofenceCoordinate!
  radiusKm: Float!
  polygon: [GeofenceCoordinate!]!
}

type BudgetConfig {
  buyerGuid: String!
  buyerName: String!
  dailyLimit: Float!
  weeklyLimit: Float!
  monthlyLimit: Float!
}

type ThresholdConfig {
  uncompletedOrdersLimit: Int!
  inventoryLimitPerCard: Int!
}

type OperatingHoursSlot {
  open: String!
  close: String!
}

type OperatingHours {
  monday: OperatingHoursSlot
  tuesday: OperatingHoursSlot
  wednesday: OperatingHoursSlot
  thursday: OperatingHoursSlot
  friday: OperatingHoursSlot
  saturday: OperatingHoursSlot
  sunday: OperatingHoursSlot
}

type Settings {
  guid: String!
  geofence: GeofenceConfig!
  budgets: [BudgetConfig!]!
  thresholds: ThresholdConfig!
  operatingHours: OperatingHours!
  updatedBy: User
  updatedDate: Timestamp!
}
```

### Inputs

```graphql
input GeofenceCoordinateInput {
  lat: Float!
  lng: Float!
}

input UpdateGeofenceInput {
  enabled: Boolean!
  center: GeofenceCoordinateInput!
  radiusKm: Float!
  polygon: [GeofenceCoordinateInput!]!
}

input UpdateBudgetInput {
  buyerGuid: String!
  dailyLimit: Float!
  weeklyLimit: Float!
  monthlyLimit: Float!
}

input UpdateThresholdsInput {
  uncompletedOrdersLimit: Int!
  inventoryLimitPerCard: Int!
}

input OperatingHoursSlotInput {
  open: String!
  close: String!
}

input UpdateOperatingHoursInput {
  monday: OperatingHoursSlotInput
  tuesday: OperatingHoursSlotInput
  wednesday: OperatingHoursSlotInput
  thursday: OperatingHoursSlotInput
  friday: OperatingHoursSlotInput
  saturday: OperatingHoursSlotInput
  sunday: OperatingHoursSlotInput
}

input UpdateSettingsInput {
  geofence: UpdateGeofenceInput
  budgets: [UpdateBudgetInput!]
  thresholds: UpdateThresholdsInput
  operatingHours: UpdateOperatingHoursInput
}
```

### Queries

```graphql
type Query {
  settings: Settings!
}
```

### Mutations

```graphql
type Mutation {
  updateSettings(updateSettingsInput: UpdateSettingsInput!): Settings!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
|-----------|:-----:|:---------:|:---------:|
| Ver/editar configuración | ✅ | ❌ | ❌ |

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Solo Admin | Guard: role === ADMIN o SUPERUSER |
| Singleton | Solo existe un registro de Settings en la BD |
| Update parcial | `updateSettings` acepta campos opcionales; solo actualiza lo que se envía |
| Geofence | `center` + `radiusKm` definen el perímetro. `polygon` es alternativa para formas irregulares |
| Budgets por buyer | Un `BudgetConfig` por cada usuario con rol BUYER |
| Threshold de bloqueo | `uncompletedOrdersLimit` se usa en módulo Clientes para bloqueo automático |
| Límite inventario | `inventoryLimitPerCard` se usa en módulo Compras como advertencia |
| Horarios | `null` en un día significa cerrado. `open`/`close` en formato `HH:mm` |
| Validaciones | `radiusKm > 0`, `dailyLimit >= 0`, `weeklyLimit >= dailyLimit`, `monthlyLimit >= weeklyLimit`, `uncompletedOrdersLimit >= 1`, `inventoryLimitPerCard >= 1` |

### Dependencias con otros módulos

| Configuración | Módulo que la consume | Uso |
|---------------|----------------------|-----|
| `geofence` | Carpeta Digital | Validar ubicación de clientes no-VIP |
| `budgets` | Compras | Advertencia de presupuesto excedido |
| `thresholds.uncompletedOrdersLimit` | Clientes | Bloqueo automático |
| `thresholds.inventoryLimitPerCard` | Compras | Advertencia de límite de inventario |
| `operatingHours` | Carpeta Digital | Mostrar horarios / validar disponibilidad |
