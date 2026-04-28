# Bulk Load Inventory API Guide

## Overview

The Bulk Load Inventory API allows administrators to efficiently create or update multiple inventory items in a single operation with three operation types: manual entry (add stock), manual exit (remove stock), or manual set (set absolute stock). This is ideal for importing inventory data from external sources or performing bulk updates.

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
| `bulkOperationType` | `BulkOperationType!` | Yes | Type of operation: `MANUAL_ENTRY`, `MANUAL_EXIT`, or `MANUAL_SET` |
| `items` | `[BulkLoadInventoryItemInput!]!` | Yes | Array of inventory items to process (minimum 1) |

**Bulk Operation Types:**
- `MANUAL_ENTRY` - Add quantity to existing stock (or create new item)
- `MANUAL_EXIT` - Remove quantity from existing stock (requires sufficient stock)
- `MANUAL_SET` - Set stock to absolute value (create new or update existing)

### BulkLoadInventoryItemInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cardGuid` | `UUID!` | Yes | GUID of the Pokemon or Magic card |
| `tcg` | `TCGType!` | Yes | Card game type: `POKEMON` or `MAGIC` |
| `condition` | `CardCondition!` | Yes | Card condition (see conditions below) |
| `quantity` | `Int!` | Yes | Quantity value (meaning depends on operation type) |
| `purchasePrice` | `Float` | No | Purchase price per unit |
| `sellPrice` | `Float` | No | Selling price per unit |

**Quantity Meaning by Operation Type:**
- `MANUAL_ENTRY`: Amount to add to current stock (must be > 0)
- `MANUAL_EXIT`: Amount to remove from current stock (must be > 0, cannot exceed current stock)
- `MANUAL_SET`: Absolute stock value to set (must be ≥ 0)

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

Behavior depends on operation type:
- **MANUAL_ENTRY & MANUAL_SET:** Creates new item if it doesn't exist
- **MANUAL_EXIT:** Requires existing item (throws error if not found)

### Operation Type Behaviors

#### MANUAL_ENTRY (Add Stock)
- Adds the specified quantity to current stock
- Creates new inventory item if it doesn't exist (starting with quantity)
- Creates new FIFO batch with the added quantity
- Always creates a movement record
- **Validation:** quantity must be > 0

#### MANUAL_EXIT (Remove Stock)
- Removes the specified quantity from current stock
- Requires existing inventory item (error if not found)
- Requires sufficient stock (error if quantity > current stock)
- Consumes oldest FIFO batches first
- Updates lastSellDate to current timestamp
- Always creates a movement record
- **Validation:** quantity must be > 0 and ≤ current stock

#### MANUAL_SET (Set Absolute Stock)
- Sets stock to the exact quantity specified
- Creates new inventory item if it doesn't exist
- Calculates delta and adjusts FIFO batches accordingly:
  - Delta > 0: adds new batch with the difference
  - Delta < 0: consumes batches for the difference
  - Delta = 0: no batch changes
- Always creates a movement record (even if delta = 0)
- **Validation:** quantity must be ≥ 0

### FIFO Batch Tracking
- **Stock Increases:** New FIFO batches are created with the current timestamp
- **Stock Decreases:** Oldest batches are consumed first (FIFO)
- **Batch Management:** Fully consumed batches are automatically removed

### Inventory Movements
All operations create `MANUAL_ADJUSTMENT` type movements with:
- **Movement Type:** Always `MANUAL_ADJUSTMENT`
- **Quantity:** Amount added/removed (absolute value for MANUAL_SET delta)
- **Reference:** `BULK-YYYYMMDD-HHmm` (e.g., `BULK-20260427-1751`)
- **Notes:** Operation-specific Spanish text:
  - MANUAL_ENTRY: "Ingreso manual desde carga masiva"
  - MANUAL_EXIT: "Salida manual desde carga masiva"
  - MANUAL_SET: "Seteo manual desde carga masiva"

### Error Handling
- **Partial Success:** Processing continues even if individual items fail
- **Error Reporting:** Failed items are reported in the `errors` array
- **Validation:** Each item is validated independently
- **Card Validation:** Cards must exist in the catalog before inventory can be created

### Restock Notifications
If stock increases from 0 to a positive value, wishlist restock notifications are automatically triggered.

## Example Usage

### Example 1: Create New Inventory Items (MANUAL_SET)

```graphql
mutation {
  bulkLoadInventory(input: {
    bulkOperationType: MANUAL_SET
    items: [
      {
        cardGuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        tcg: POKEMON
        condition: NEAR_MINT
        quantity: 25
        purchasePrice: 4.50
        sellPrice: 10.99
      },
      {
        cardGuid: "f9e8d7c6-b5a4-3210-9876-543210fedcba"
        tcg: MAGIC
        condition: LIGHTLY_PLAYED
        quantity: 15
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

### Example 2: Add Stock to Existing Items (MANUAL_ENTRY)

```graphql
mutation {
  bulkLoadInventory(input: {
    bulkOperationType: MANUAL_ENTRY
    items: [
      {
        cardGuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        tcg: POKEMON
        condition: NEAR_MINT
        quantity: 10
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

**Note:** This adds 10 units to the existing stock. If current stock is 25, new stock will be 35.

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

### Example 3: Remove Stock (MANUAL_EXIT)

```graphql
mutation {
  bulkLoadInventory(input: {
    bulkOperationType: MANUAL_EXIT
    items: [
      {
        cardGuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        tcg: POKEMON
        condition: NEAR_MINT
        quantity: 5
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

**Note:** This removes 5 units from existing stock. Requires item to exist and have at least 5 units in stock.

### Example 4: Set Absolute Stock (MANUAL_SET)

```graphql
mutation {
  bulkLoadInventory(input: {
    bulkOperationType: MANUAL_SET
    items: [
      {
        cardGuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        tcg: POKEMON
        condition: NEAR_MINT
        quantity: 50
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

**Note:** This sets stock to exactly 50 units, regardless of current stock.

### Example 5: Mixed Operations with Errors

```graphql
mutation {
  bulkLoadInventory(input: {
    bulkOperationType: MANUAL_ENTRY
    items: [
      {
        cardGuid: "valid-card-guid-1"
        tcg: POKEMON
        condition: NEAR_MINT
        quantity: 10
      },
      {
        cardGuid: "invalid-card-guid"
        tcg: MAGIC
        condition: DAMAGED
        quantity: 5
      },
      {
        cardGuid: "valid-card-guid-2"
        tcg: POKEMON
        condition: HEAVILY_PLAYED
        quantity: 3
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
Sync inventory with external systems using `MANUAL_SET` to set absolute stock values.

### 3. Receiving Shipments
Use `MANUAL_ENTRY` to add newly received inventory to existing stock.

### 4. Physical Inventory Counts
Use `MANUAL_SET` to update all items to match actual counted stock.

### 5. Bulk Adjustments
Use `MANUAL_EXIT` to remove damaged or lost inventory.

## Error Messages

Common error scenarios:

| Error | Cause | Solution |
|-------|-------|----------|
| "Card not found" | Card GUID doesn't exist in catalog | Ensure card is synced to catalog first |
| "Invalid TCG type" | TCG doesn't match card type | Verify card belongs to specified TCG |
| "Invalid condition" | Condition enum value is wrong | Use valid CardCondition enum value |
| "Quantity must be greater than 0" | Zero or negative quantity for ENTRY/EXIT | Provide positive quantity value |
| "Quantity must be >= 0" | Negative quantity for SET | Provide non-negative quantity value |
| "Cannot perform MANUAL_EXIT on..." | Item doesn't exist for EXIT operation | Use MANUAL_ENTRY or MANUAL_SET to create item first |
| "Cannot remove X units. Only Y in stock" | Insufficient stock for EXIT operation | Reduce quantity or check current stock |

## Best Practices

1. **Choose Correct Operation Type:**
   - Use `MANUAL_ENTRY` when adding new stock (shipments, returns)
   - Use `MANUAL_EXIT` when removing stock (damage, loss, theft)
   - Use `MANUAL_SET` for physical counts or external system sync
2. **Batch Size:** Process items in batches of 100-500 for optimal performance
3. **Error Handling:** Always check the `errors` array even if `success` is true
4. **Price Updates:** Only include prices when you want to update them
5. **Card Validation:** Ensure cards exist in catalog before bulk loading
6. **Stock Verification:** 
   - For MANUAL_ENTRY/EXIT: verify you're using delta values (amount to add/remove)
   - For MANUAL_SET: verify you're using absolute values (final stock)
7. **Monitoring:** Review `createdCount` and `updatedCount` to verify expected results
8. **Movement Tracking:** All operations create movements with timestamp-based references (BULK-YYYYMMDD-HHmm)

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