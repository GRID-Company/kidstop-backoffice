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

---

### 5. Create Purchase Movement

**Mutation:** `createInventoryMovement`
**Description:** Add stock to inventory (purchase entry)
**Access:** ADMIN only

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

**Variables:**

```json
{
  "createInventoryMovementInput": {
    "pokemonCardGuid": "CARD_GUID",
    "condition": "NEAR_MINT",
    "quantity": 5,
    "movementType": "PURCHASE_ENTRY",
    "reference": "PO-001",
    "notes": "Initial stock purchase"
  }
}
```

**Input Fields:**

- `pokemonCardGuid`: Required — GUID of the Pokemon card
- `condition`: Required — Card condition (NEAR_MINT, LIGHTLY_PLAYED, MODERATELY_PLAYED, HEAVILY_PLAYED, DAMAGED)
- `quantity`: Required — Number of items (positive integer, min 1)
- `movementType`: Required — "PURCHASE_ENTRY"
- `reference`: Optional — Purchase order or reference number
- `notes`: Required — Description of the movement

**Movement Types:**

- `PURCHASE_ENTRY`: Increases stock (adds items to inventory)
- `SALE_EXIT`: Decreases stock (removes items from inventory, validates sufficient stock)
- `MANUAL_ADJUSTMENT`: Sets stock to the specified quantity (manual override)

> **Note:** The `createInventoryMovement` mutation currently only supports `pokemonCardGuid`. Magic card inventory items are created automatically via the Purchases module finalization flow.

---

### 6. Create Sale Movement

**Mutation:** `createInventoryMovement`
**Description:** Remove stock from inventory (sale exit)
**Access:** ADMIN only

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

**Variables:**

```json
{
  "createInventoryMovementInput": {
    "pokemonCardGuid": "CARD_GUID",
    "condition": "NEAR_MINT",
    "quantity": 1,
    "movementType": "SALE_EXIT",
    "reference": "SALE-001",
    "notes": "Sold 1 unit"
  }
}
```

**Input Fields:**

- `movementType`: "SALE_EXIT"
- `quantity`: Number of items sold (positive number, must not exceed current stock)
- `notes`: Required — Description of the movement
- Other fields same as purchase

---

### 7. Update Item Prices

**Mutation:** `updatePokemonCardPrices`
**Description:** Update purchase and sell prices for an inventory item (works for both Pokemon and Magic items despite the legacy mutation name)
**Access:** ADMIN, RECEPTION, BUYER

```graphql
mutation UpdatePokemonCardPrices($updateInventoryItemPricesInput: UpdateInventoryItemPricesInput!) {
  updatePokemonCardPrices(updateInventoryItemPricesInput: $updateInventoryItemPricesInput) {
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
    }
  }
}
```

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
// Purchase Entry
const addPurchase = async (
  cardGuid: string,
  condition: string,
  quantity: number,
  reference: string,
  notes?: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_MOVEMENT,
      variables: {
        createInventoryMovementInput: {
          pokemonCardGuid: cardGuid,
          condition,
          quantity,
          movementType: 'PURCHASE_ENTRY',
          reference,
          notes
        }
      }
    });

    console.log('Purchase added:', data.createInventoryMovement);
    // Refresh inventory list
    await fetchInventoryItems();
  } catch (error) {
    console.error('Error adding purchase:', error);
  }
};

// Sale Exit
const recordSale = async (
  cardGuid: string,
  condition: string,
  quantity: number,
  reference: string,
  notes?: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_MOVEMENT,
      variables: {
        createInventoryMovementInput: {
          pokemonCardGuid: cardGuid,
          condition,
          quantity,
          movementType: 'SALE_EXIT',
          reference,
          notes
        }
      }
    });

    console.log('Sale recorded:', data.createInventoryMovement);
    await fetchInventoryItems();
  } catch (error) {
    console.error('Error recording sale:', error);
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

    console.log('Prices updated:', data.updatePokemonCardPrices);
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
        </div>
      )}
    </div>
  );
};
```

### Form Components

```typescript
// Purchase Form
const PurchaseForm: React.FC<{ onSubmit: Function }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    cardGuid: '',
    condition: 'NEAR_MINT',
    quantity: 1,
    reference: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ cardGuid: '', condition: 'NEAR_MINT', quantity: 1, reference: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="purchase-form">
      <h3>Add Purchase</h3>
      <input
        type="text"
        placeholder="Card GUID"
        value={formData.cardGuid}
        onChange={(e) => setFormData({...formData, cardGuid: e.target.value})}
        required
      />
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
        min="1"
        required
      />
      <input
        type="text"
        placeholder="Reference (PO number)"
        value={formData.reference}
        onChange={(e) => setFormData({...formData, reference: e.target.value})}
        required
      />
      <textarea
        placeholder="Notes (required)"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
      />
      <button type="submit">Add Purchase</button>
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