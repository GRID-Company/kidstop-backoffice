# Purchases API Guide

# Purchases API Guide

## Overview

The Purchases API manages the business's card acquisition workflow — buying cards from clients. Purchases follow a strict status machine (DRAFT → QUOTED → WAITING\_PRICE → FINALIZED) and support both registered and anonymous clients. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All purchase endpoints require a Bearer token in the Authorization header:

```css
Authorization: Bearer {{auth_token}}
```

## Key Concepts

### Status Machine

```scss
DRAFT → QUOTED          (ADMIN/BUYER only, auto-assigns buyer from token)
DRAFT → REJECTED        (ADMIN/BUYER only)
QUOTED → WAITING_PRICE  (ADMIN/BUYER — client accepted quotation)
QUOTED → REJECTED       (ADMIN/BUYER — client rejected quotation)
WAITING_PRICE → FINALIZED  (ADMIN/BUYER — all items need sellPrice, payments must match total)
```

### Roles & Permissions

*   **ADMIN / BUYER / RECEPTION:** Can create purchases (always DRAFT)
*   **ADMIN / BUYER:** Can change status, set sell prices, finalize
*   **RECEPTION:** Can edit items on DRAFT purchases only, cannot change status

### Payment Methods

*   `CASH`
*   `TRANSFER`
*   `STORE_CREDIT`

### Card Conditions

*   `NEAR_MINT`
*   `LIGHTLY_PLAYED`
*   `MODERATELY_PLAYED`
*   `HEAVILY_PLAYED`
*   `DAMAGED`
* * *

## Available Endpoints

### 1\. Get Purchases (Paginated List)

**Query:** `purchases`
**Description:** Retrieve paginated list of purchases with filters and search
**Access:** ADMIN, BUYER, RECEPTION

```plain
query Purchases($findPurchasesArgs: FindPurchasesArgs!) {
  purchases(findPurchasesArgs: $findPurchasesArgs) {
    data {
      guid
      reference
      status
      tcg
      total
      notes
      anonymousClientName
      anonymousClientEmail
      anonymousClientPhone
      buyer {
        guid
        name
      }
      client {
        guid
        name
      }
      items {
        guid
        condition
        offerPrice
        referencePrice
        sellPrice
        quantity
        tcg
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
      payments {
        amount
        method
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
  "findPurchasesArgs": {
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
  "findPurchasesArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "status": "DRAFT",
      "tcg": "POKEMON",
      "buyer": "BUYER_USER_GUID"
    }
  }
}
```

**Available Filters:**

*   `status`: Purchase status (DRAFT, QUOTED, WAITING\_PRICE, FINALIZED, REJECTED)
*   `tcg`: **Required** — Trading card game type (POKEMON, MAGIC)
*   `buyer`: Buyer user GUID
*   `createdDate`: Date range filter with `filterType: ":daterange:"` and `range: { from, to }`

**Available Sort Columns:** `createdDate`, `total`, `status`, `clientName`, `buyerName`, `itemCount`, `purchaseReference`

**Search:** Searches across purchase reference, client name, client email, and item card names
* * *

### 2\. Get Single Purchase

**Query:** `purchase`
**Description:** Get detailed information for a specific purchase
**Access:** ADMIN, BUYER, RECEPTION

```plain
query Purchase($guid: String!) {
  purchase(guid: $guid) {
    guid
    reference
    status
    tcg
    total
    notes
    anonymousClientName
    anonymousClientEmail
    anonymousClientPhone
    buyer {
      guid
      name
    }
    client {
      guid
      name
    }
    items {
      guid
      condition
      offerPrice
      referencePrice
      sellPrice
      quantity
      tcg
      pokemonCard {
        guid
        titleName
      }
      magicCard {
        guid
        name
      }
    }
    payments {
      amount
      method
    }
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
  "guid": "PURCHASE_GUID"
}
```

* * *

### 3\. Create Purchase

**Mutation:** `createPurchase`
**Description:** Create a new purchase (always starts as DRAFT, buyer is null)
**Access:** ADMIN, BUYER, RECEPTION

```plain
mutation CreatePurchase($createPurchaseInput: CreatePurchaseInput!) {
  createPurchase(createPurchaseInput: $createPurchaseInput) {
    guid
    reference
    status
    tcg
    total
    notes
    items {
      guid
      condition
      offerPrice
      referencePrice
      quantity
      pokemonCard {
        guid
        titleName
      }
      magicCard {
        guid
        name
      }
    }
    payments {
      amount
      method
    }
    createdDate
  }
}
```

**Variables (with registered client):**

```json
{
  "createPurchaseInput": {
    "tcg": "POKEMON",
    "clientGuid": "CLIENT_USER_GUID",
    "notes": "Purchase from registered client",
    "items": [
      {
        "pokemonCardGuid": "CARD_GUID",
        "condition": "NEAR_MINT",
        "offerPrice": 10.00,
        "referencePrice": 15.00,
        "quantity": 1
      }
    ],
    "payments": [
      {
        "method": "CASH",
        "amount": 10.00
      }
    ]
  }
}
```

**Variables (with anonymous client):**

```json
{
  "createPurchaseInput": {
    "tcg": "POKEMON",
    "anonymousClientName": "John Doe",
    "anonymousClientPhone": "5551234567",
    "anonymousClientEmail": "john@example.com",
    "notes": "Walk-in client",
    "items": [
      {
        "pokemonCardGuid": "CARD_GUID",
        "condition": "NEAR_MINT",
        "offerPrice": 10.00,
        "quantity": 1
      }
    ]
  }
}
```

**Input Fields:**

*   `tcg`: Required — POKEMON or MAGIC
*   `clientGuid`: Optional — GUID of a registered CLIENT or CLIENT\_KIOSK user
*   `anonymousClientName`: Optional — required if clientGuid is null
*   `anonymousClientEmail`: Optional
*   `anonymousClientPhone`: Optional
*   `notes`: Optional
*   `payments`: Optional array of `{ method, amount }`
*   `items`: Required array with:
    *   `pokemonCardGuid` or `magicCardGuid`: Card identifier (based on tcg)
    *   `condition`: Card condition enum
    *   `offerPrice`: Price offered to client per unit
    *   `referencePrice`: Optional market/reference price
    *   `quantity`: Number of units (> 0)

**Rules:**

*   Must provide either `clientGuid` or `anonymousClientName`
*   `total` is auto-computed from items (sum of offerPrice × quantity)
*   Purchase is always created as DRAFT
* * *

### 4\. Update Purchase

**Mutation:** `updatePurchase`
**Description:** Update purchase details (client info, notes, payments). Cannot modify items through this endpoint.
**Access:** ADMIN, BUYER, RECEPTION (RECEPTION only on DRAFT)

```plain
mutation UpdatePurchase($updatePurchaseInput: UpdatePurchaseInput!) {
  updatePurchase(updatePurchaseInput: $updatePurchaseInput) {
    guid
    reference
    status
    tcg
    total
    notes
    anonymousClientName
    anonymousClientEmail
    anonymousClientPhone
    client {
      guid
      name
    }
    payments {
      amount
      method
    }
    updatedDate
  }
}
```

**Variables:**

```json
{
  "updatePurchaseInput": {
    "purchaseGuid": "PURCHASE_GUID",
    "notes": "Updated notes",
    "payments": [
      {
        "method": "CASH",
        "amount": 10.00
      },
      {
        "method": "STORE_CREDIT",
        "amount": 5.00
      }
    ]
  }
}
```

**Rules:**

*   Client/notes: editable on DRAFT or QUOTED only
*   Payments: editable at any stage except FINALIZED or REJECTED
*   Setting `clientGuid` clears anonymous fields and vice versa
* * *

### 5\. Update Purchase Items

**Mutation:** `updatePurchaseItems`
**Description:** Add, update, or remove items from a purchase. Only allowed on DRAFT purchases.
**Access:** ADMIN, BUYER, RECEPTION

```plain
mutation UpdatePurchaseItems($updatePurchaseItemsInput: UpdatePurchaseItemsInput!) {
  updatePurchaseItems(updatePurchaseItemsInput: $updatePurchaseItemsInput) {
    guid
    reference
    status
    total
    items {
      guid
      condition
      offerPrice
      referencePrice
      quantity
      pokemonCard {
        guid
        titleName
      }
      magicCard {
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
  "updatePurchaseItemsInput": {
    "purchaseGuid": "PURCHASE_GUID",
    "addItems": [
      {
        "pokemonCardGuid": "CARD_GUID",
        "condition": "NEAR_MINT",
        "offerPrice": 5.00,
        "referencePrice": 8.00,
        "quantity": 2
      }
    ],
    "updateItems": [
      {
        "itemGuid": "EXISTING_ITEM_GUID",
        "offerPrice": 12.00,
        "quantity": 3
      }
    ],
    "removeItemGuids": ["ITEM_GUID_TO_REMOVE"]
  }
}
```

**Input Fields:**

*   `purchaseGuid`: Required
*   `addItems`: Optional — new items to add (same fields as create)
*   `updateItems`: Optional — existing items to modify (itemGuid required, other fields optional)
*   `removeItemGuids`: Optional — GUIDs of items to remove

**Rules:**

*   Only allowed when purchase status is DRAFT
*   Purchase `total` is recalculated after changes
* * *

### 6\. Update Purchase Status

**Mutation:** `updatePurchaseStatus`
**Description:** Transition a purchase to a new status following the status machine
**Access:** ADMIN, BUYER only

```plain
mutation UpdatePurchaseStatus($updatePurchaseStatusInput: UpdatePurchaseStatusInput!) {
  updatePurchaseStatus(updatePurchaseStatusInput: $updatePurchaseStatusInput) {
    guid
    reference
    status
    updatedDate
  }
}
```

**Variables:**

```json
{
  "updatePurchaseStatusInput": {
    "purchaseGuid": "PURCHASE_GUID",
    "newStatus": "QUOTED"
  }
}
```

**Valid Transitions:**

*   `DRAFT` → `QUOTED` (auto-assigns current user as buyer)
*   `DRAFT` → `REJECTED`
*   `QUOTED` → `WAITING_PRICE`
*   `QUOTED` → `REJECTED`
*   `WAITING_PRICE` → `FINALIZED` (delegates to finalizePurchase logic)
* * *

### 7\. Set Purchase Item Sell Price

**Mutation:** `setPurchaseItemSellPrice`
**Description:** Set the public sell price (and optionally reference price) for a purchase item
**Access:** ADMIN, BUYER

```plain
mutation SetPurchaseItemSellPrice($setPurchaseItemSellPriceInput: SetPurchaseItemSellPriceInput!) {
  setPurchaseItemSellPrice(setPurchaseItemSellPriceInput: $setPurchaseItemSellPriceInput) {
    guid
    offerPrice
    referencePrice
    sellPrice
    condition
    quantity
  }
}
```

**Variables:**

```json
{
  "setPurchaseItemSellPriceInput": {
    "purchaseItemGuid": "PURCHASE_ITEM_GUID",
    "sellPrice": 19.99,
    "referencePrice": 15.00
  }
}
```

**Rules:**

*   Only allowed when purchase status is `WAITING_PRICE`
*   `sellPrice` is required
*   `referencePrice` is optional (updates alongside sellPrice if provided)
* * *

### 8\. Finalize Purchase

**Mutation:** `finalizePurchase`
**Description:** Finalize a purchase (WAITING\_PRICE → FINALIZED), creating inventory entries and stock movements
**Access:** ADMIN, BUYER

```plain
mutation FinalizePurchase($purchaseGuid: String!) {
  finalizePurchase(purchaseGuid: $purchaseGuid) {
    guid
    reference
    status
    total
    items {
      guid
      condition
      offerPrice
      sellPrice
      quantity
    }
    payments {
      amount
      method
    }
    updatedDate
  }
}
```

**Variables:**

```json
{
  "purchaseGuid": "PURCHASE_GUID"
}
```

**Finalization Rules:**

*   Purchase must be in `WAITING_PRICE` status
*   All items must have `sellPrice` set (non-null)
*   If payments are provided, sum must equal the purchase total
*   For each item:
    *   Finds or creates matching InventoryItem (card + tcg + condition)
    *   Increments stock by item quantity
    *   Updates InventoryItem `purchasePrice` and `sellPrice`
    *   Creates InventoryMovement (PURCHASE\_ENTRY)
* * *

## Typical Workflow

1. **Create** a purchase as DRAFT with items and client info
2. **Edit items** if needed (only while DRAFT)
3. **Transition** DRAFT → QUOTED (assigns buyer)
4. **Client accepts** → transition QUOTED → WAITING\_PRICE
5. **Set sell prices** on each item during WAITING\_PRICE
6. **Finalize** → stock is added to inventory, movements are recorded
7. Alternatively, **reject** at DRAFT or QUOTED stage
* * *

## Error Handling & Notes

*   **Invalid status transitions** return an error describing the allowed transitions
*   **Missing sell prices** on finalization return a validation error
*   **Payment mismatch** (sum ≠ total) on finalization return a validation error
*   **Budget exceeded** and **inventory limit exceeded** are warnings only — they do not block operations