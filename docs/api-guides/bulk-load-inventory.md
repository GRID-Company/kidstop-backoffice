# Bulk Load Inventory API Guide

## Overview

The Bulk Load Inventory API allows administrators to efficiently create or update multiple inventory items in a single operation. This is ideal for importing inventory data from external sources or performing bulk updates.

## Authentication & Authorization

- **Required Role:** `ADMIN`
- **Authentication:** JWT Bearer token required

## Mutation

### bulkLoadInventory

Bulk create or update inventory items with automatic detection of existing items.

**GraphQL Mutation:**
```graphql
mutation BulkLoadInventory($input: BulkLoadInventoryInput!) {
  bulkLoadInventory(input: $input) {
    success
    createdCount
    updatedCount
    errors
  }
}
```

## Input Structure

### BulkLoadInventoryInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | `[BulkLoadInventoryItemInput!]!` | Yes | Array of inventory items to process (minimum 1) |

### BulkLoadInventoryItemInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cardGuid` | `UUID!` | Yes | GUID of the Pokemon or Magic card |
| `tcg` | `TCGType!` | Yes | Card game type: `POKEMON` or `MAGIC` |
| `condition` | `CardCondition!` | Yes | Card condition (see conditions below) |
| `stock` | `Int!` | Yes | Absolute stock quantity to set (≥ 0) |
| `purchasePrice` | `Float` | No | Purchase price per unit |
| `sellPrice` | `Float` | No | Selling price per unit |

**Card Conditions:**
- `NEAR_MINT`
- `LIGHTLY_PLAYED`
- `MODERATELY_PLAYED`
- `HEAVILY_PLAYED`
- `DAMAGED`

## Output Structure

### BulkLoadInventoryResult

| Field | Type | Description |
|-------|------|-------------|
| `success` | `Boolean!` | `true` if all items processed successfully, `false` if any errors occurred |
| `createdCount` | `Int!` | Number of new inventory items created |
| `updatedCount` | `Int!` | Number of existing inventory items updated |
| `errors` | `[String!]!` | Array of error messages for failed items (empty if all succeeded) |

## Business Logic

### Auto-Detection
The mutation automatically detects whether an inventory item exists based on:
- Card ID (Pokemon or Magic)
- Card condition

If the combination exists, it updates the item. Otherwise, it creates a new one.

### Stock Updates
- **Absolute Values:** Stock is set to the exact value provided (not incremental)
- **Delta Calculation:** The system calculates the difference between new and current stock
- **Inventory Movements:** Automatic movement records are created for stock changes

### FIFO Batch Tracking
- **Stock Increases:** New FIFO batches are created with the current timestamp
- **Stock Decreases:** Oldest batches are consumed first (FIFO)
- **Batch Management:** Fully consumed batches are automatically removed

### Inventory Movements
Automatic movements are created when stock changes:
- **Delta > 0:** `PURCHASE_ENTRY` movement
- **Delta < 0:** `SALE_EXIT` movement
- **Delta = 0:** No movement created
- **Reference:** All movements use reference `"BULK_LOAD"`

### Error Handling
- **Partial Success:** Processing continues even if individual items fail
- **Error Reporting:** Failed items are reported in the `errors` array
- **Validation:** Each item is validated independently
- **Card Validation:** Cards must exist in the catalog before inventory can be created

### Restock Notifications
If stock increases from 0 to a positive value, wishlist restock notifications are automatically triggered.

## Example Usage

### Example 1: Create New Inventory Items

```graphql
mutation {
  bulkLoadInventory(input: {
    items: [
      {
        cardGuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        tcg: POKEMON
        condition: NEAR_MINT
        stock: 25
        purchasePrice: 4.50
        sellPrice: 10.99
      },
      {
        cardGuid: "f9e8d7c6-b5a4-3210-9876-543210fedcba"
        tcg: MAGIC
        condition: LIGHTLY_PLAYED
        stock: 15
        purchasePrice: 2.00
        sellPrice: 6.50
      }
    ]
  }) {
    success
    createdCount
    updatedCount
    errors
  }
}
```

**Response:**
```json
{
  "data": {
    "bulkLoadInventory": {
      "success": true,
      "createdCount": 2,
      "updatedCount": 0,
      "errors": []
    }
  }
}
```

### Example 2: Update Existing Inventory

```graphql
mutation {
  bulkLoadInventory(input: {
    items: [
      {
        cardGuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        tcg: POKEMON
        condition: NEAR_MINT
        stock: 50
        sellPrice: 12.99
      }
    ]
  }) {
    success
    createdCount
    updatedCount
    errors
  }
}
```

**Response:**
```json
{
  "data": {
    "bulkLoadInventory": {
      "success": true,
      "createdCount": 0,
      "updatedCount": 1,
      "errors": []
    }
  }
}
```

### Example 3: Mixed Operations with Errors

```graphql
mutation {
  bulkLoadInventory(input: {
    items: [
      {
        cardGuid: "valid-card-guid-1"
        tcg: POKEMON
        condition: NEAR_MINT
        stock: 10
      },
      {
        cardGuid: "invalid-card-guid"
        tcg: MAGIC
        condition: DAMAGED
        stock: 5
      },
      {
        cardGuid: "valid-card-guid-2"
        tcg: POKEMON
        condition: HEAVILY_PLAYED
        stock: 3
      }
    ]
  }) {
    success
    createdCount
    updatedCount
    errors
  }
}
```

**Response:**
```json
{
  "data": {
    "bulkLoadInventory": {
      "success": false,
      "createdCount": 2,
      "updatedCount": 0,
      "errors": [
        "Item 2 (card: invalid-card-guid, condition: DAMAGED): Card not found"
      ]
    }
  }
}
```

## Common Use Cases

### 1. Initial Inventory Import
Import inventory from a CSV/Excel file by mapping each row to a `BulkLoadInventoryItemInput`.

### 2. Stock Synchronization
Sync inventory with external systems by setting absolute stock values.

### 3. Bulk Price Updates
Update prices across multiple items without changing stock levels (set stock to current value).

### 4. Inventory Adjustments
Perform physical inventory counts and update all items to match actual stock.

## Error Messages

Common error scenarios:

| Error | Cause | Solution |
|-------|-------|----------|
| "Card not found" | Card GUID doesn't exist in catalog | Ensure card is synced to catalog first |
| "Invalid TCG type" | TCG doesn't match card type | Verify card belongs to specified TCG |
| "Invalid condition" | Condition enum value is wrong | Use valid CardCondition enum value |
| "Stock must be >= 0" | Negative stock value provided | Provide non-negative stock value |

## Best Practices

1. **Batch Size:** Process items in batches of 100-500 for optimal performance
2. **Error Handling:** Always check the `errors` array even if `success` is true
3. **Price Updates:** Only include prices when you want to update them
4. **Card Validation:** Ensure cards exist in catalog before bulk loading
5. **Stock Verification:** Double-check stock values before submitting
6. **Monitoring:** Review `createdCount` and `updatedCount` to verify expected results

## Performance Considerations

- Each item is processed independently (no transaction rollback)
- Database queries are optimized with proper indexing
- FIFO batch calculations are performed in-memory
- Wishlist notifications are triggered asynchronously
- Large batches (>1000 items) should be split into multiple requests

## Related APIs

- **Create Inventory Movement:** For individual stock adjustments with detailed notes
- **Update Inventory Item Prices:** For single-item price updates
- **Get Inventory Items:** To verify bulk load results
- **Get Inventory Movements:** To review movement history from bulk loads