# Sales API Guide

## Overview

The Sales API manages card sales to customers through two main workflows: **backoffice operations** (ADMIN/RECEPTION managing sales) and **carpeta digital** (CLIENT/CLIENT_KIOSK self-service shopping cart). Sales follow a strict status machine (NEW → IN_PROGRESS → READY → COMPLETED) and integrate with inventory management through FIFO batch consumption. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All sales endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Key Concepts

### Status Machine

```
NEW → IN_PROGRESS     (ADMIN/RECEPTION — sale is being prepared)
IN_PROGRESS → READY   (ADMIN/RECEPTION — sale ready for pickup, triggers email)
READY → COMPLETED     (ADMIN/RECEPTION — customer picked up, creates SALE_EXIT movements)
Any non-terminal → CANCELLED (ADMIN/RECEPTION — with cancel reason)
```

**Terminal statuses:** COMPLETED, CANCELLED

### Roles & Permissions

#### Backoffice (ADMIN / RECEPTION)
- View all sales (paginated list and detail)
- Update sale status
- Cancel sales with reason

#### Carpeta Digital (CLIENT / CLIENT_KIOSK)
- View own cart and sales
- Add/update/remove cart items
- Checkout (create sale from cart)
- CLIENT_KIOSK must provide name+email when creating sales

### Sale Code Format

Format: `KSS-YYYY-XXXXX` (e.g., KSS-2025-00001)
- Incremental per year
- Auto-generated on sale creation

### Cancel Reasons

- `CLIENT_UNREACHABLE` — Customer cannot be reached (may trigger auto-blocking after threshold)
- `NO_STOCK` — Insufficient inventory
- `OTHER` — Other reason

### Card Conditions

- `NEAR_MINT`
- `LIGHTLY_PLAYED`
- `MODERATELY_PLAYED`
- `HEAVILY_PLAYED`
- `DAMAGED`

---

## Available Endpoints

### Backoffice Endpoints (ADMIN / RECEPTION)

#### 1. Get Sales (Paginated List)

**Query:** `sales`
**Description:** Retrieve paginated list of all sales with filters and search
**Access:** ADMIN, RECEPTION

```graphql
query Sales($findSalesArgs: FindSalesArgs!) {
  sales(findSalesArgs: $findSalesArgs) {
    data {
      guid
      saleCode
      status
      tcg
      total
      notes
      cancelReason
      emailNotificationSent
      customer {
        guid
        name
        email
        phone
      }
      kioskCustomerName
      kioskCustomerEmail
      items {
        guid
        tcg
        condition
        quantity
        price
        pokemonCardSummary {
          guid
          name
          setName
          setCode
          cardNumber
          rarity
          imageUri
        }
        magicCardSummary {
          guid
          name
          edition
          collectorNumber
          rarity
          imageUri
          isFoil
        }
      }
      statusTimestamps
      createdDate
      updatedDate
    }
    count
  }
}
```

**Variables:**

```json
{
  "findSalesArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "tcg": "POKEMON"
    }
  }
}
```

**Variables with Filters:**

```json
{
  "findSalesArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "tcg": "POKEMON",
      "status": "READY",
      "customer": "CUSTOMER_USER_GUID",
      "createdDate": {
        "filterType": ":daterange:",
        "range": {
          "from": "2025-01-01",
          "to": "2025-01-31"
        }
      }
    }
  }
}
```

**Available Filters:**

- `tcg`: **Required** — Trading card game type (POKEMON, MAGIC)
- `status`: Sale status (NEW, IN_PROGRESS, READY, COMPLETED, CANCELLED)
- `customer`: Customer user GUID
- `createdDate`: Date range filter with `filterType: ":daterange:"` and `range: { from, to }`

**Available Sort Columns:** `createdDate`, `total`, `status`, `customerName`, `saleCode`

**Search:** Searches across sale code, customer name, customer email, kiosk customer name/email, and item card names

---

#### 2. Get Single Sale

**Query:** `sale`
**Description:** Get detailed information for a specific sale
**Access:** ADMIN, RECEPTION

```graphql
query Sale($guid: String!) {
  sale(guid: $guid) {
    guid
    saleCode
    status
    tcg
    total
    notes
    cancelReason
    emailNotificationSent
    customer {
      guid
      name
      email
      phone
    }
    kioskCustomerName
    kioskCustomerEmail
    items {
      guid
      tcg
      condition
      quantity
      price
      pokemonCardSummary {
        guid
        name
        setName
        setCode
        cardNumber
        rarity
        imageUri
      }
      magicCardSummary {
        guid
        name
        edition
        collectorNumber
        rarity
        imageUri
        isFoil
      }
    }
    statusTimestamps
    createdBy {
      guid
      name
    }
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "guid": "SALE_GUID"
}
```

---

#### 3. Update Sale Status

**Mutation:** `updateSaleStatus`
**Description:** Transition a sale to a new status following the status machine
**Access:** ADMIN, RECEPTION

```graphql
mutation UpdateSaleStatus($updateSaleStatusInput: UpdateSaleStatusInput!) {
  updateSaleStatus(updateSaleStatusInput: $updateSaleStatusInput) {
    guid
    saleCode
    status
    statusTimestamps
    emailNotificationSent
    updatedDate
  }
}
```

**Variables:**

```json
{
  "updateSaleStatusInput": {
    "saleGuid": "SALE_GUID",
    "newStatus": "IN_PROGRESS"
  }
}
```

**Valid Transitions:**

- `NEW` → `IN_PROGRESS`
- `IN_PROGRESS` → `READY` (triggers email notification if customer email exists)
- `READY` → `COMPLETED` (creates SALE_EXIT inventory movements, consumes stock via FIFO)
- Any non-terminal → `CANCELLED` (use `cancelSale` mutation instead for proper cancel reason tracking)

**Business Rules:**

- **READY transition:** Sends email notification to customer if email is available (registered customer or kiosk email provided)
- **COMPLETED transition:** 
  - Creates SALE_EXIT inventory movements for all items
  - Consumes stock using FIFO batch logic
  - Fails if insufficient stock is available
- **Status timestamps:** Each transition records a timestamp in `statusTimestamps` JSONB field

---

#### 4. Cancel Sale

**Mutation:** `cancelSale`
**Description:** Cancel a sale with a specific reason
**Access:** ADMIN, RECEPTION

```graphql
mutation CancelSale($cancelSaleInput: CancelSaleInput!) {
  cancelSale(cancelSaleInput: $cancelSaleInput) {
    guid
    saleCode
    status
    cancelReason
    updatedDate
  }
}
```

**Variables:**

```json
{
  "cancelSaleInput": {
    "saleGuid": "SALE_GUID",
    "cancelReason": "NO_STOCK"
  }
}
```

**Cancel Reasons:**

- `CLIENT_UNREACHABLE` — Triggers customer auto-blocking after threshold (configured in global config)
- `NO_STOCK` — Insufficient inventory to complete sale
- `OTHER` — Other cancellation reason

**Business Rules:**

- Only non-terminal sales can be cancelled (not COMPLETED or already CANCELLED)
- `CLIENT_UNREACHABLE` cancellations count towards customer blocking threshold
- Cancellation records timestamp in `statusTimestamps`

---

### Carpeta Digital Endpoints (CLIENT / CLIENT_KIOSK)

#### 5. Get My Cart

**Query:** `myCart`
**Description:** Get current user's cart for a specific TCG
**Access:** CLIENT, CLIENT_KIOSK

```graphql
query MyCart($tcg: String!) {
  myCart(tcg: $tcg) {
    guid
    tcg
    customer {
      guid
      name
    }
    items {
      guid
      tcg
      condition
      quantity
      pokemonCardSummary {
        guid
        name
        setName
        setCode
        cardNumber
        rarity
        imageUri
      }
      magicCardSummary {
        guid
        name
        edition
        collectorNumber
        rarity
        imageUri
        isFoil
      }
    }
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "tcg": "POKEMON"
}
```

**Notes:**

- Each customer has one cart per TCG
- Cart is auto-created on first item addition
- Returns empty items array if cart doesn't exist yet

---

#### 6. Add Cart Item

**Mutation:** `addCartItem`
**Description:** Add a card to the cart (or increment quantity if already exists with same condition)
**Access:** CLIENT, CLIENT_KIOSK

```graphql
mutation AddCartItem($addCartItemInput: AddCartItemInput!) {
  addCartItem(addCartItemInput: $addCartItemInput) {
    guid
    tcg
    items {
      guid
      tcg
      condition
      quantity
      pokemonCardSummary {
        guid
        name
        setName
        cardNumber
      }
      magicCardSummary {
        guid
        name
        edition
        collectorNumber
      }
    }
  }
}
```

**Variables (Pokemon):**

```json
{
  "addCartItemInput": {
    "tcg": "POKEMON",
    "pokemonCardGuid": "POKEMON_CARD_GUID",
    "condition": "NEAR_MINT",
    "quantity": 2
  }
}
```

**Variables (Magic):**

```json
{
  "addCartItemInput": {
    "tcg": "MAGIC",
    "magicCardGuid": "MAGIC_CARD_GUID",
    "condition": "LIGHTLY_PLAYED",
    "quantity": 1
  }
}
```

**Input Fields:**

- `tcg`: Required — POKEMON or MAGIC
- `pokemonCardGuid` or `magicCardGuid`: Card identifier (based on tcg)
- `condition`: Card condition enum
- `quantity`: Number of units to add (≥ 1)

**Business Rules:**

- If same card+condition already in cart, quantity is incremented
- Otherwise, new cart item is created
- Cart is auto-created if it doesn't exist

---

#### 7. Update Cart Item

**Mutation:** `updateCartItem`
**Description:** Update quantity of an existing cart item
**Access:** CLIENT, CLIENT_KIOSK

```graphql
mutation UpdateCartItem($updateCartItemInput: UpdateCartItemInput!) {
  updateCartItem(updateCartItemInput: $updateCartItemInput) {
    guid
    tcg
    items {
      guid
      condition
      quantity
      pokemonCardSummary {
        guid
        name
      }
    }
  }
}
```

**Variables:**

```json
{
  "updateCartItemInput": {
    "cartItemGuid": "CART_ITEM_GUID",
    "quantity": 5
  }
}
```

**Rules:**

- Quantity must be ≥ 1
- Cart item must belong to current user's cart

---

#### 8. Remove Cart Item

**Mutation:** `removeCartItem`
**Description:** Remove a specific item from the cart
**Access:** CLIENT, CLIENT_KIOSK

```graphql
mutation RemoveCartItem($cartItemGuid: String!) {
  removeCartItem(cartItemGuid: $cartItemGuid) {
    guid
    tcg
    items {
      guid
      condition
      quantity
    }
  }
}
```

**Variables:**

```json
{
  "cartItemGuid": "CART_ITEM_GUID"
}
```

---

#### 9. Clear Cart

**Mutation:** `clearCart`
**Description:** Remove all items from cart for a specific TCG
**Access:** CLIENT, CLIENT_KIOSK

```graphql
mutation ClearCart($tcg: String!) {
  clearCart(tcg: $tcg) {
    guid
    tcg
    items {
      guid
    }
  }
}
```

**Variables:**

```json
{
  "tcg": "POKEMON"
}
```

---

#### 10. Create Sale from Cart (Checkout)

**Mutation:** `createSaleFromCart`
**Description:** Checkout — convert cart items into a new sale (status: NEW)
**Access:** CLIENT, CLIENT_KIOSK

```graphql
mutation CreateSaleFromCart($createSaleFromCartInput: CreateSaleFromCartInput!) {
  createSaleFromCart(createSaleFromCartInput: $createSaleFromCartInput) {
    guid
    saleCode
    status
    tcg
    total
    customer {
      guid
      name
      email
    }
    kioskCustomerName
    kioskCustomerEmail
    items {
      guid
      tcg
      condition
      quantity
      price
      pokemonCardSummary {
        guid
        name
        setName
        cardNumber
        imageUri
      }
      magicCardSummary {
        guid
        name
        edition
        collectorNumber
        imageUri
      }
    }
    createdDate
  }
}
```

**Variables (Registered Client):**

```json
{
  "createSaleFromCartInput": {
    "tcg": "POKEMON"
  }
}
```

**Variables (Kiosk Client):**

```json
{
  "createSaleFromCartInput": {
    "tcg": "POKEMON",
    "kioskCustomerName": "Juan Pérez",
    "kioskCustomerEmail": "juan.perez@example.com"
  }
}
```

**Input Fields:**

- `tcg`: Required — POKEMON or MAGIC
- `kioskCustomerName`: Optional — Required for CLIENT_KIOSK role (kiosk sales)
- `kioskCustomerEmail`: Optional — For CLIENT_KIOSK, enables email notifications

**Business Rules:**

- Cart must have at least one item
- Stock validation: All items must have sufficient inventory
- Price resolution: Prices are fetched from current InventoryItem sellPrice
- Sale total is auto-calculated (sum of item price × quantity)
- Sale is created with status NEW
- Cart is cleared after successful checkout
- CLIENT_KIOSK users MUST provide `kioskCustomerName` and optionally `kioskCustomerEmail`

**Checkout Process:**

1. Validates cart has items
2. Checks stock availability for each item (card + tcg + condition)
3. Resolves current sell prices from InventoryItem
4. Creates Sale with NEW status
5. Creates SaleItem records with resolved prices
6. Clears cart
7. Returns created Sale

---

#### 11. Get My Sales

**Query:** `mySales`
**Description:** Get paginated list of current user's sales
**Access:** CLIENT

```graphql
query MySales($findMySalesArgs: FindMySalesArgs!) {
  mySales(findMySalesArgs: $findMySalesArgs) {
    data {
      guid
      saleCode
      status
      tcg
      total
      items {
        guid
        condition
        quantity
        price
        pokemonCardSummary {
          guid
          name
          setName
          cardNumber
          imageUri
        }
        magicCardSummary {
          guid
          name
          edition
          collectorNumber
          imageUri
        }
      }
      createdDate
      updatedDate
    }
    count
  }
}
```

**Variables:**

```json
{
  "findMySalesArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "tcg": "POKEMON"
    }
  }
}
```

**Variables with Status Filter:**

```json
{
  "findMySalesArgs": {
    "skip": 0,
    "limit": 10,
    "filters": {
      "tcg": "POKEMON",
      "status": "READY"
    }
  }
}
```

**Available Filters:**

- `tcg`: **Required** — POKEMON or MAGIC
- `status`: Optional — NEW, IN_PROGRESS, READY, COMPLETED, CANCELLED

**Available Sort Columns:** `createdDate`, `total`, `status`

---

#### 12. Get My Sale

**Query:** `mySale`
**Description:** Get detailed information for a specific sale owned by current user
**Access:** CLIENT

```graphql
query MySale($saleGuid: String!) {
  mySale(saleGuid: $saleGuid) {
    guid
    saleCode
    status
    tcg
    total
    items {
      guid
      tcg
      condition
      quantity
      price
      pokemonCardSummary {
        guid
        name
        setName
        setCode
        cardNumber
        rarity
        imageUri
      }
      magicCardSummary {
        guid
        name
        edition
        collectorNumber
        rarity
        imageUri
        isFoil
      }
    }
    statusTimestamps
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "saleGuid": "SALE_GUID"
}
```

**Rules:**

- Sale must belong to current authenticated user
- Returns 404 if sale doesn't exist or belongs to another user

---

## Typical Workflows

### Carpeta Digital Workflow (Customer Self-Service)

1. **Browse catalog** → Find cards to purchase
2. **Add to cart** → Use `addCartItem` for each desired card+condition
3. **Review cart** → Use `myCart` to see all items
4. **Update quantities** → Use `updateCartItem` or `removeCartItem` as needed
5. **Checkout** → Use `createSaleFromCart` (CLIENT_KIOSK provides name+email)
6. **Track status** → Use `mySales` or `mySale` to monitor order status
7. **Get notified** → Receive email when status changes to READY
8. **Pick up** → Visit store when sale is READY

### Backoffice Workflow (Staff Processing)

1. **View new sales** → Use `sales` with `status: "NEW"` filter
2. **Start processing** → Use `updateSaleStatus` to change NEW → IN_PROGRESS
3. **Prepare order** → Gather cards from inventory
4. **Mark ready** → Use `updateSaleStatus` to change IN_PROGRESS → READY (triggers email)
5. **Customer arrives** → Use `updateSaleStatus` to change READY → COMPLETED (consumes inventory)
6. **Handle issues** → Use `cancelSale` with appropriate reason if needed

### Cancellation Scenarios

- **No stock:** `cancelSale` with `NO_STOCK` reason
- **Customer unreachable:** `cancelSale` with `CLIENT_UNREACHABLE` (may trigger auto-block after threshold)
- **Other reasons:** `cancelSale` with `OTHER` reason

---

## Error Handling & Notes

### Common Errors

- **Invalid status transitions:** Returns error describing allowed transitions from current status
- **Insufficient stock on checkout:** Validation error listing unavailable items
- **Insufficient stock on completion:** Prevents COMPLETED transition if inventory lacks stock
- **Empty cart checkout:** Returns error — cart must have at least one item
- **Missing kiosk customer info:** CLIENT_KIOSK must provide `kioskCustomerName` when checking out
- **Price resolution failures:** Returns error if InventoryItem not found for cart item
- **Unauthorized access:** CLIENT users can only access their own sales/cart

### Stock Management

- **Checkout validation:** Checks stock availability but does NOT reserve stock
- **Completion:** COMPLETED transition creates SALE_EXIT movements and consumes stock using FIFO batch logic
- **Batches:** Inventory is tracked in batches; oldest batches consumed first

### Email Notifications

- **READY status:** Automatically sends email if customer email exists (registered user or kiosk email)
- **Email tracking:** `emailNotificationSent` field tracks notification status
- **Template:** Uses `sale-ready-template.ts` HTML template

### Customer Blocking

- **Threshold:** Configured in global config (`saleCancellationBlockThreshold`)
- **Trigger:** CLIENT_UNREACHABLE cancellations count towards threshold
- **Auto-block:** Customer is blocked if threshold is exceeded
- **Check:** Performed during cancellation process

### Cart Behavior

- **Isolation:** Each customer has separate carts per TCG (unique constraint on customerId+tcg)
- **Persistence:** Cart items persist until explicitly removed or checked out
- **Merging:** Adding same card+condition increments existing item quantity

---

## Integration Points

### Inventory Module

- **Stock validation:** Checks InventoryItem stock before checkout
- **Price resolution:** Fetches current sellPrice from InventoryItem
- **Movement creation:** Creates SALE_EXIT movements on COMPLETED transition
- **FIFO consumption:** Consumes oldest batches first when completing sale

### Global Config Module

- **Cancellation threshold:** `saleCancellationBlockThreshold` controls auto-blocking behavior

### Email Module

- **Sale ready notification:** Triggered on READY status transition
- **Template:** `sendSaleReadyEmail` with customer info, sale code, and items

### User Module

- **Customer relation:** Sale links to User entity (nullable for kiosk sales)
- **Kiosk fields:** `kioskCustomerName` and `kioskCustomerEmail` for non-authenticated sales
- **Blocking:** CLIENT_UNREACHABLE cancellations may block customers

---

## Status Timestamps

The `statusTimestamps` field is a JSONB object tracking when each status was reached:

```json
{
  "NEW": "2025-01-15T10:00:00.000Z",
  "IN_PROGRESS": "2025-01-15T10:30:00.000Z",
  "READY": "2025-01-15T11:00:00.000Z",
  "COMPLETED": "2025-01-15T14:00:00.000Z"
}
```

This enables tracking of time spent in each status and full sale lifecycle analytics.
