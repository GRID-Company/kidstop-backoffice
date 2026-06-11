# Inventory API Guide

## Overview

The Inventory API manages trading card inventory (Pokemon & Magic), stock movements, pricing, and analytics. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All inventory endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Available Endpoints

### 1. Get Inventory Items

**Query:** `inventoryItems`
**Description:** Retrieve paginated list of inventory items with basic information
**Access:** ADMIN, RECEPTION, BUYER

```graphql
query InventoryItems($findInventoryItemsArgs: FindInventoryItemsArgs!) {
  inventoryItems(findInventoryItemsArgs: $findInventoryItemsArgs) {
    data {
      guid
      tcg
      condition
      stock
      purchasePrice
      sellPrice
      lastSellDate
      avgDaysInInventory
      pokemonCard {
        guid
        titleName
        cardNumber
      }
      magicCard {
        guid
        name
      }
    }
    count
  }
}
```

**Variables:**

```json
{
  "findInventoryItemsArgs": {
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

**Response Fields:**

- `guid`: Unique inventory item identifier
- `tcg`: Trading card game type (e.g., "POKEMON")
- `condition`: Card condition (e.g., "NEAR_MINT")
- `stock`: Current stock quantity
- `purchasePrice`: Cost price
- `sellPrice`: Selling price
- `lastSellDate`: Date of last sale
- `avgDaysInInventory`: Average days item stays in inventory
- `pokemonCardSummary`: Associated Pokemon card summary (null for Magic items)
- `magicCardSummary`: Associated Magic card summary (null for Pokemon items)

---

### 2. Get Inventory Items with Filters

**Query:** `inventoryItems`
**Description:** Retrieve filtered inventory items
**Access:** ADMIN, RECEPTION, BUYER

```graphql
query InventoryItems($findInventoryItemsArgs: FindInventoryItemsArgs!) {
  inventoryItems(findInventoryItemsArgs: $findInventoryItemsArgs) {
    data {
      guid
      tcg
      condition
      stock
      purchasePrice
      sellPrice
      lastSellDate
      avgDaysInInventory
      pokemonCard {
        guid
        titleName
        cardNumber
      }
      magicCard {
        guid
        name
      }
    }
    count
  }
}
```

**Variables with Filters:**

```json
{
  "findInventoryItemsArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "tcg": "POKEMON",
      "condition": "NEAR_MINT",
      "stockStatus": "AVAILABLE"
    }
  }
}
```

**Available Filters:**

- `tcg`: **Required** — Trading card game type (POKEMON, MAGIC)
- `condition`: Card condition (NEAR_MINT, LIGHTLY_PLAYED, MODERATELY_PLAYED, HEAVILY_PLAYED, DAMAGED)
- `stockStatus`: "AVAILABLE" | "UNAVAILABLE" | "AWAITING_PICKUP"
- `pokemonFilters.rarity`: Filter by Pokemon card rarity (matches against tcgPlayer or priceCharting rarity)
- `lastSellDate`: Date range filter with `filterType: ":daterange:"` and `range: { from, to }`

---

### 3. Get Single Inventory Item

**Query:** `inventoryItem`
**Description:** Get detailed information for a specific inventory item
**Access:** ADMIN, RECEPTION, BUYER

```graphql
query InventoryItem($guid: String!) {
  inventoryItem(guid: $guid) {
    guid
    tcg
    condition
    stock
    purchasePrice
    sellPrice
    lastSellDate
    avgDaysInInventory
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
    movements {
      guid
      movementType
      quantity
      reference
      notes
      createdDate
    }
  }
}
```

**Variables:**

```json
{
  "guid": "INVENTORY_ITEM_GUID"
}
```

**Additional Response Fields:**

- `pokemonCardSummary`: Pokemon card summary with collection info (Pokemon items)
- `magicCardSummary`: Magic card summary (Magic items)
- `movements`: Array of stock movements for this item

---

### 4. Get Inventory Indicators

**Query:** `indicatorsInventoryItems`
**Description:** Get inventory analytics and key performance indicators
**Access:** ADMIN, RECEPTION, BUYER

```graphql
query IndicatorsInventoryItems($tcg: String, $forceRefresh: Boolean) {
  indicatorsInventoryItems(tcg: $tcg, forceRefresh: $forceRefresh) {
    totalStock
    lastSellDate
    avgDaysInInventory
    lastRefresh
  }
}
```

**Variables:**

```json
{
  "tcg": "POKEMON",
  "forceRefresh": false
}
```

**Response Fields:**

- `totalStock`: Total inventory across all items
- `lastSellDate`: Most recent sale date
- `avgDaysInInventory`: Average days items stay in inventory
- `lastRefresh`: Timestamp of when the cached indicators were last computed

---

### 5. Create Manual Inventory Movement

**Mutation:** `createInventoryMovement`
**Description:** Create a single-item manual stock movement (entry, exit, or absolute set). All movements via this API are manual operations.
**Access:** ADMIN, RECEPTION, BUYER

```graphql
mutation CreateInventoryMovement($createInventoryMovementInput: CreateInventoryMovementInput!) {
  createInventoryMovement(createInventoryMovementInput: $createInventoryMovementInput) {
    guid
    movementType
    quantity
    reference
    notes
    createdDate
  }
}
```

**Variables — MANUAL_ENTRY (add stock):**

```json
{
  "createInventoryMovementInput": {
    "cardGuid": "CARD_GUID",
    "tcg": "POKEMON",
    "condition": "NEAR_MINT",
    "quantity": 5,
    "bulkOperationType": "MANUAL_ENTRY",
    "purchasePrice": 9.99,
    "sellPrice": 14.99,
    "reference": "PO-001",
    "notes": "Initial stock purchase"
  }
}
```

**Variables — MANUAL_EXIT (remove stock):**

```json
{
  "createInventoryMovementInput": {
    "cardGuid": "CARD_GUID",
    "tcg": "POKEMON",
    "condition": "NEAR_MINT",
    "quantity": 2,
    "bulkOperationType": "MANUAL_EXIT",
    "reference": "ADJ-001",
    "notes": "Damaged cards removed"
  }
}
```

**Variables — MANUAL_SET (set absolute stock):**

```json
{
  "createInventoryMovementInput": {
    "cardGuid": "CARD_GUID",
    "tcg": "MAGIC",
    "condition": "LIGHTLY_PLAYED",
    "quantity": 10,
    "bulkOperationType": "MANUAL_SET"
  }
}
```

**Input Fields:**

- `cardGuid`: Required — GUID of the card (Pokemon or Magic based on `tcg`)
- `tcg`: Required — Trading card game type (POKEMON, MAGIC)
- `condition`: Required — Card condition (NEAR_MINT, LIGHTLY_PLAYED, MODERATELY_PLAYED, HEAVILY_PLAYED, DAMAGED)
- `quantity`: Required — Integer ≥ 1 for MANUAL_ENTRY/MANUAL_EXIT; ≥ 0 for MANUAL_SET
- `bulkOperationType`: Required — Operation type (see below)
- `purchasePrice`: Optional — Set/update cost price
- `sellPrice`: Optional — Set/update sell price
- `reference`: Optional — Custom reference string; auto-generated as `MANUAL-<timestamp>` if omitted
- `notes`: Optional — Description; auto-generated per operation type if omitted

**Operation Types (`bulkOperationType`):**

- `MANUAL_ENTRY`: Adds quantity to current stock, pushes a new FIFO batch. Creates inventory item if it doesn't exist.
- `MANUAL_EXIT`: Removes quantity from current stock using FIFO consumption. Requires existing item with sufficient stock.
- `MANUAL_SET`: Sets stock to the exact quantity provided, adjusting FIFO batches via delta. Creates inventory item if it doesn't exist.

**Notes:**
- All movements are recorded internally as `MANUAL_ADJUSTMENT` in the movement history.
- Wishlist restock notifications are triggered when stock transitions from 0 → >0.

---

### 7. Update Item Prices

**Mutation:** `updateInventoryItemPrices`
**Description:** Update purchase and sell prices for an inventory item (works for both Pokemon and Magic items)
**Access:** ADMIN, RECEPTION, BUYER

```graphql
mutation UpdateInventoryItemPrices($updateInventoryItemPricesInput: UpdateInventoryItemPricesInput!) {
  updateInventoryItemPrices(updateInventoryItemPricesInput: $updateInventoryItemPricesInput) {
    guid
    purchasePrice
    sellPrice
  }
}
```

**Variables:**

```json
{
  "updateInventoryItemPricesInput": {
    "inventoryItemGuid": "INVENTORY_ITEM_GUID",
    "purchasePrice": 9.99,
    "sellPrice": 14.99
  }
}
```

---

### 8. Get Inventory Movements

**Query:** `inventoryMovements`
**Description:** Retrieve paginated list of all inventory movements
**Access:** ADMIN, RECEPTION, BUYER

```graphql
query InventoryMovements($findInventoryMovementsArgs: FindInventoryMovementsArgs!) {
  inventoryMovements(findInventoryMovementsArgs: $findInventoryMovementsArgs) {
    data {
      guid
      movementType
      quantity
      reference
      notes
      createdDate
      inventoryItem {
        guid
        tcg
        condition
        stock
      }
    }
    count
  }
}
```

**Variables:**

```json
{
  "findInventoryMovementsArgs": {
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

**Available Filters:**

- `tcg`: **Required** — Trading card game type (POKEMON, MAGIC)
- `movementType`: Optional — Filter by movement type (PURCHASE_ENTRY, SALE_EXIT, MANUAL_ADJUSTMENT)
- `createdDate`: Optional — Date range filter

---

## Frontend Integration Examples

### React/TypeScript Implementation

```typescript
// Types
interface InventoryItem {
  guid: string;
  tcg: string;
  condition: string;
  stock: number;
  purchasePrice: number;
  sellPrice: number;
  lastSellDate?: string;
  avgDaysInInventory: number;
  pokemonCardSummary?: {
    guid: string;
    name: string;
    setName?: string;
    setCode?: string;
    cardNumber?: string;
    rarity?: string;
    imageUri?: string;
  };
  magicCardSummary?: {
    guid: string;
    name: string;
    edition?: string;
    collectorNumber?: string;
    rarity?: string;
    imageUri?: string;
    isFoil: boolean;
  };
}

interface InventoryIndicators {
  totalStock: number;
  lastSellDate?: string;
  avgDaysInInventory?: number;
  lastRefresh: string;
}

interface InventoryMovement {
  guid: string;
  movementType: 'PURCHASE_ENTRY' | 'SALE_EXIT' | 'MANUAL_ADJUSTMENT';
  quantity: number;
  reference: string;
  notes: string;
  createdDate: string;
}

// GraphQL Queries
const GET_INVENTORY_ITEMS = gql`
  query InventoryItems($findInventoryItemsArgs: FindInventoryItemsArgs!) {
    inventoryItems(findInventoryItemsArgs: $findInventoryItemsArgs) {
      data {
        guid
        tcg
        condition
        stock
        purchasePrice
        sellPrice
        lastSellDate
        avgDaysInInventory
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
      count
    }
  }
`;

const CREATE_MOVEMENT = gql`
  mutation CreateInventoryMovement($createInventoryMovementInput: CreateInventoryMovementInput!) {
    createInventoryMovement(createInventoryMovementInput: $createInventoryMovementInput) {
      guid
      movementType
      quantity
      reference
      notes
      createdDate
    }
  }
`;

type BulkOperationType = 'MANUAL_ENTRY' | 'MANUAL_EXIT' | 'MANUAL_SET';

// Authenticated Apollo Client Setup
const createAuthenticatedClient = (token: string) => {
  return new ApolloClient({
    uri: 'YOUR_GRAPHQL_ENDPOINT',
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Inventory Management Component
const InventoryManager: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authToken] = useAuth(); // Your auth hook

  const client = createAuthenticatedClient(authToken);

  const fetchInventoryItems = async (filters?: any) => {
    try {
      const { data } = await client.query({
        query: GET_INVENTORY_ITEMS,
        variables: {
          findInventoryItemsArgs: {
            skip: 0,
            limit: 50,
            sort: { column: "createdDate", order: "DESC" },
            ...(filters && { filters })
          }
        }
      });
      setItems(data.inventoryItems.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return (
    <div className="inventory-manager">
      <h2>Inventory Management</h2>
      {loading ? (
        <div>Loading inventory...</div>
      ) : (
        <InventoryTable items={items} onRefresh={fetchInventoryItems} />
      )}
    </div>
  );
};
```

### Stock Movement Functions

```typescript
// Manual Entry (add stock)
const addManualEntry = async (
  cardGuid: string,
  tcg: 'POKEMON' | 'MAGIC',
  condition: string,
  quantity: number,
  options?: { purchasePrice?: number; sellPrice?: number; reference?: string; notes?: string }
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_MOVEMENT,
      variables: {
        createInventoryMovementInput: {
          cardGuid,
          tcg,
          condition,
          quantity,
          bulkOperationType: 'MANUAL_ENTRY',
          ...options
        }
      }
    });

    console.log('Manual entry created:', data.createInventoryMovement);
    await fetchInventoryItems();
  } catch (error) {
    console.error('Error creating manual entry:', error);
  }
};

// Manual Exit (remove stock)
const addManualExit = async (
  cardGuid: string,
  tcg: 'POKEMON' | 'MAGIC',
  condition: string,
  quantity: number,
  options?: { reference?: string; notes?: string }
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_MOVEMENT,
      variables: {
        createInventoryMovementInput: {
          cardGuid,
          tcg,
          condition,
          quantity,
          bulkOperationType: 'MANUAL_EXIT',
          ...options
        }
      }
    });

    console.log('Manual exit created:', data.createInventoryMovement);
    await fetchInventoryItems();
  } catch (error) {
    console.error('Error creating manual exit:', error);
  }
};

// Manual Set (set absolute stock)
const setManualStock = async (
  cardGuid: string,
  tcg: 'POKEMON' | 'MAGIC',
  condition: string,
  quantity: number,
  options?: { purchasePrice?: number; sellPrice?: number; notes?: string }
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_MOVEMENT,
      variables: {
        createInventoryMovementInput: {
          cardGuid,
          tcg,
          condition,
          quantity,
          bulkOperationType: 'MANUAL_SET',
          ...options
        }
      }
    });

    console.log('Stock set:', data.createInventoryMovement);
    await fetchInventoryItems();
  } catch (error) {
    console.error('Error setting stock:', error);
  }
};

// Price Update
const updatePrices = async (
  inventoryItemGuid: string,
  purchasePrice: number,
  sellPrice: number
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PRICES,
      variables: {
        updateInventoryItemPricesInput: {
          inventoryItemGuid,
          purchasePrice,
          sellPrice
        }
      }
    });

    console.log('Prices updated:', data.updateInventoryItemPrices);
    await fetchInventoryItems();
  } catch (error) {
    console.error('Error updating prices:', error);
  }
};
```

### Inventory Dashboard Component

```typescript
const InventoryDashboard: React.FC = () => {
  const [indicators, setIndicators] = useState<any>(null);

  const fetchIndicators = async () => {
    try {
      const { data } = await client.query({
        query: GET_INDICATORS,
        variables: {
          tcg: "POKEMON",
          forceRefresh: false
        }
      });
      setIndicators(data.indicatorsInventoryItems);
    } catch (error) {
      console.error('Error fetching indicators:', error);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, []);

  return (
    <div className="dashboard">
      <h2>Inventory Dashboard</h2>
      {indicators && (
        <div className="metrics">
          <div className="metric">
            <h3>Total Stock</h3>
            <p>{indicators.totalStock}</p>
          </div>
          <div className="metric">
            <h3>Last Sale</h3>
            <p>{new Date(indicators.lastSellDate).toLocaleDateString()}</p>
          </div>
          <div className="metric">
            <h3>Avg Days in Inventory</h3>
            <p>{indicators.avgDaysInInventory}</p>
          </div>
          <div className="metric">
            <h3>Last Refresh</h3>
            <p>{new Date(indicators.lastRefresh).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

### Form Components

```typescript
// Manual Movement Form
const ManualMovementForm: React.FC<{ onSubmit: Function }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    cardGuid: '',
    tcg: 'POKEMON',
    condition: 'NEAR_MINT',
    quantity: 1,
    bulkOperationType: 'MANUAL_ENTRY' as BulkOperationType,
    purchasePrice: '',
    sellPrice: '',
    reference: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ cardGuid: '', tcg: 'POKEMON', condition: 'NEAR_MINT', quantity: 1, bulkOperationType: 'MANUAL_ENTRY', purchasePrice: '', sellPrice: '', reference: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="manual-movement-form">
      <h3>Manual Inventory Movement</h3>
      <input
        type="text"
        placeholder="Card GUID"
        value={formData.cardGuid}
        onChange={(e) => setFormData({...formData, cardGuid: e.target.value})}
        required
      />
      <select
        value={formData.tcg}
        onChange={(e) => setFormData({...formData, tcg: e.target.value})}
      >
        <option value="POKEMON">Pokemon</option>
        <option value="MAGIC">Magic</option>
      </select>
      <select
        value={formData.condition}
        onChange={(e) => setFormData({...formData, condition: e.target.value})}
      >
        <option value="NEAR_MINT">Near Mint</option>
        <option value="LIGHTLY_PLAYED">Lightly Played</option>
        <option value="MODERATELY_PLAYED">Moderately Played</option>
        <option value="HEAVILY_PLAYED">Heavily Played</option>
        <option value="DAMAGED">Damaged</option>
      </select>
      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
        min="0"
        required
      />
      <select
        value={formData.bulkOperationType}
        onChange={(e) => setFormData({...formData, bulkOperationType: e.target.value as BulkOperationType})}
      >
        <option value="MANUAL_ENTRY">Manual Entry (add stock)</option>
        <option value="MANUAL_EXIT">Manual Exit (remove stock)</option>
        <option value="MANUAL_SET">Manual Set (set absolute stock)</option>
      </select>
      <input
        type="number"
        placeholder="Purchase Price (optional)"
        value={formData.purchasePrice}
        onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
        step="0.01"
      />
      <input
        type="number"
        placeholder="Sell Price (optional)"
        value={formData.sellPrice}
        onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
        step="0.01"
      />
      <input
        type="text"
        placeholder="Reference (optional)"
        value={formData.reference}
        onChange={(e) => setFormData({...formData, reference: e.target.value})}
      />
      <textarea
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
      />
      <button type="submit">Submit Movement</button>
    </form>
  );
};
```

## Error Handling & Best Practices

### Authentication Error Handling

```typescript
const handleAuthError = (error: any) => {
  if (error.networkError?.statusCode === 401) {
    // Token expired or invalid
    logout();
    redirectToLogin();
  }
};
```

### Optimistic Updates

```typescript
const optimisticSale = async (itemGuid: string, quantity: number) => {
  // Update UI immediately
  setItems(prev => prev.map(item =>
    item.guid === itemGuid
      ? { ...item, stock: item.stock - quantity }
      : item
  ));

  try {
    await recordSale(itemGuid, quantity);
  } catch (error) {
    // Revert on error
    setItems(prev => prev.map(item =>
      item.guid === itemGuid
        ? { ...item, stock: item.stock + quantity }
        : item
    ));
    handleError(error);
  }
};
```

## Key Features for Frontend Implementation

1. **Real-time Stock Updates:** Implement WebSocket connections for live inventory updates
2. **Bulk Operations:** Allow bulk price updates and stock movements
3. **Analytics Dashboard:** Create charts for inventory turnover and profitability
4. **Low Stock Alerts:** Implement notifications for items below threshold
5. **Movement History:** Show detailed movement history for each item
6. **Export Functionality:** Allow CSV/Excel export of inventory data
7. **Barcode Integration:** Support barcode scanning for quick item lookup
8. **Profit Calculations:** Show profit margins and total profit per item