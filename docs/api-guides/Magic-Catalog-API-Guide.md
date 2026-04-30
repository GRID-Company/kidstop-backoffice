# Magic Catalog API Guide

## Overview

The Magic Catalog API provides access to Magic: The Gathering card data, collections/editions, and filtering capabilities. It uses GraphQL and supports both public and internal endpoints.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)

## Authentication

- **Public endpoints:** No authentication required
- **Internal endpoints:** Require Bearer token in Authorization header

## Available Endpoints

### 1. Get Collections

**Query:** `magicCardCollections`
**Type:** Public
**Description:** Retrieve all available Magic card collections/editions

```graphql
query MagicCardCollections {
  magicCardCollections {
    guid
    name
    editionIconUri
  }
}
```

**Response Fields:**

- `guid`: Unique identifier for the collection/edition
- `name`: Display name of the edition
- `editionIconUri`: URL for the edition icon image (nullable)

---

### 2. Get Rarities

**Query:** `magicCardRarities`
**Type:** Public
**Description:** Get list of available card rarities (cached 1 hour)

```graphql
query MagicCardRarities {
  magicCardRarities
}
```

**Response:** Array of rarity strings

---

### 3. Get Public Card List

**Query:** `magicCardPublicList`
**Type:** Public
**Description:** Get paginated list of Magic cards for public display

```graphql
query MagicCardPublicList($findMagicCardsPublicArgs: FindMagicCardsPublicArgs!) {
  magicCardPublicList(findMagicCardsPublicArgs: $findMagicCardsPublicArgs) {
    data {
      guid
      name
      edition
      collectorNumber
      isFoil
      sellPrice
      availableStock
      imageUri
    }
    count
  }
}
```

**Variables:**

```json
{
  "findMagicCardsPublicArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "name",
      "order": "ASC"
    }
  }
}
```

**Response Fields:**

- `data`: Array of card objects
- `count`: Total number of cards matching criteria
- Card fields:
  - `guid`: Unique card identifier
  - `name`: Card name
  - `edition`: Edition/set name
  - `collectorNumber`: Collector number in set
  - `rarity`: Card rarity (nullable)
  - `isFoil`: Whether the card is foil
  - `sellPrice`: Current sell price
  - `availableStock`: Whether stock is available (boolean)
  - `imageUri`: Card image URL

---

### 4. Get Public Card List with Filters

**Query:** `magicCardPublicList`
**Type:** Public
**Description:** Get filtered and searched list of Magic cards

```graphql
query MagicCardPublicList($findMagicCardsPublicArgs: FindMagicCardsPublicArgs!) {
  magicCardPublicList(findMagicCardsPublicArgs: $findMagicCardsPublicArgs) {
    data {
      guid
      name
      edition
      collectorNumber
      isFoil
      sellPrice
      availableStock
      imageUri
    }
    count
  }
}
```

**Variables with Filters:**

```json
{
  "findMagicCardsPublicArgs": {
    "skip": 0,
    "limit": 10,
    "search": "lightning bolt",
    "sort": {
      "column": "name",
      "order": "ASC"
    },
    "filters": {
      "stockStatus": "AVAILABLE",
      "condition": "NEAR_MINT",
      "isFoil": true
    }
  }
}
```

**Available Filters:**

- `edition`: Edition/Collection GUID
- `rarity`: Card rarity string
- `isFoil`: Boolean filter for foil cards
- `sellPrice`: Numeric range filter with `min` and `max`
- `condition`: Card condition enum
  - `NEAR_MINT`
  - `LIGHTLY_PLAYED`
  - `MODERATELY_PLAYED`
  - `HEAVILY_PLAYED`
  - `DAMAGED`
- `stockStatus`: Stock availability enum
  - `AVAILABLE`
  - `UNAVAILABLE`
  - `AWAITING_PICKUP`
- `search`: Text search in card names

**Price Range Filter Example:**

```json
{
  "findMagicCardsPublicArgs": {
    "skip": 0,
    "limit": 10,
    "filters": {
      "sellPrice": {
        "min": 100,
        "max": 500
      }
    }
  }
}
```

---

### 5. Custom Sorting Options

**Description:** The `magicCardPublicList` query supports custom sorting through the `sort` parameter. You can sort by multiple columns in ascending or descending order.

**Available Sort Columns:**

| Column | Description | Data Type | Example Use Case |
|--------|-------------|-----------|------------------|
| `name` | Card name (alphabetical) | string | Sort cards A-Z or Z-A |
| `sellPrice` | Minimum sell price across all conditions | number | Find cheapest/most expensive cards |
| `releaseDate` | Edition release date | date | Sort by newest/oldest releases |
| `collectorNumber` | Collector number in set | string | Sort by set order |
| `edition` | Edition/set name | string | Group by edition alphabetically |

**Sort Order Values:**
- `ASC` - Ascending order (A-Z, 0-9, oldest-newest, false-true)
- `DESC` - Descending order (Z-A, 9-0, newest-oldest, true-false)

**Important Notes:**
- **Stock Priority Sorting:** The API uses a priority system that ensures optimal card discovery:
  1. **Stock Availability** - Cards with stock always appear before cards without stock
  2. **User Sort** - Your specified sort column and order
  3. **Default Tiebreaker** - Release date (newest first) when no sort is specified
  4. **Search Rank** - Applied last if searching

- **Search Behavior:** When a `search` query is active, results are sorted by relevance (search rank) after stock priority and user sort

- **Example:** If you sort by `name ASC`, you'll get:
  - Cards with stock → sorted A-Z
  - Cards without stock → sorted A-Z

---

#### Sort by Price (Low to High)

```graphql
query MagicCardsByPriceLowToHigh {
  magicCardPublicList(
    findMagicCardsPublicArgs: {
      skip: 0
      limit: 20
      sort: {
        column: "sellPrice"
        order: "ASC"
      }
    }
  ) {
    data {
      guid
      name
      edition
      collectorNumber
      isFoil
      sellPrice
      availableStock
      imageUri
    }
    count
  }
}
```

---

#### Sort by Price (High to Low)

```graphql
query MagicCardsByPriceHighToLow {
  magicCardPublicList(
    findMagicCardsPublicArgs: {
      skip: 0
      limit: 20
      sort: {
        column: "sellPrice"
        order: "DESC"
      }
    }
  ) {
    data {
      guid
      name
      edition
      sellPrice
      availableStock
      imageUri
    }
    count
  }
}
```

---

#### Sort by Name (Alphabetical)

```graphql
query MagicCardsByName {
  magicCardPublicList(
    findMagicCardsPublicArgs: {
      skip: 0
      limit: 20
      sort: {
        column: "name"
        order: "ASC"
      }
    }
  ) {
    data {
      guid
      name
      edition
      sellPrice
      imageUri
    }
    count
  }
}
```

---

#### Combining Sorting with Filters

```graphql
query MagicCardsFilteredAndSorted {
  magicCardPublicList(
    findMagicCardsPublicArgs: {
      skip: 0
      limit: 20
      sort: {
        column: "sellPrice"
        order: "ASC"
      }
      filters: {
        stockStatus: "AVAILABLE"
        condition: "NEAR_MINT"
        isFoil: true
        sellPrice: {
          range: {
            from: 50
            to: 500
          }
        }
      }
    }
  ) {
    data {
      guid
      name
      edition
      isFoil
      sellPrice
      availableStock
      imageUri
    }
    count
  }
}
```

---

#### Frontend Integration: Sort Dropdown

```typescript
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

type SortOption = {
  label: string;
  column: string;
  order: 'ASC' | 'DESC';
};

const sortOptions: SortOption[] = [
  { label: 'Name (A-Z)', column: 'name', order: 'ASC' },
  { label: 'Name (Z-A)', column: 'name', order: 'DESC' },
  { label: 'Price (Low to High)', column: 'sellPrice', order: 'ASC' },
  { label: 'Price (High to Low)', column: 'sellPrice', order: 'DESC' },
  { label: 'Newest Releases', column: 'releaseDate', order: 'DESC' },
  { label: 'Oldest Releases', column: 'releaseDate', order: 'ASC' },
  { label: 'Collector Number', column: 'collectorNumber', order: 'ASC' },
  { label: 'Edition (A-Z)', column: 'edition', order: 'ASC' },
];

const GET_MAGIC_CARDS = gql`
  query MagicCardPublicList($findMagicCardsPublicArgs: FindMagicCardsPublicArgs!) {
    magicCardPublicList(findMagicCardsPublicArgs: $findMagicCardsPublicArgs) {
      data {
        guid
        name
        edition
        collectorNumber
        isFoil
        sellPrice
        availableStock
        totalStock
        imageUri
      }
      count
    }
  }
`;

const MagicCardListWithSort: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, loading, error } = useQuery(GET_MAGIC_CARDS, {
    variables: {
      findMagicCardsPublicArgs: {
        skip: page * pageSize,
        limit: pageSize,
        sort: {
          column: selectedSort.column,
          order: selectedSort.order,
        },
      },
    },
  });

  if (loading) return <div>Loading cards...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const cards = data?.magicCardPublicList?.data || [];
  const totalCount = data?.magicCardPublicList?.count || 0;

  return (
    <div>
      <div className="controls">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={sortOptions.indexOf(selectedSort)}
          onChange={(e) => {
            setSelectedSort(sortOptions[parseInt(e.target.value)]);
            setPage(0); // Reset to first page when sorting changes
          }}
        >
          {sortOptions.map((option, index) => (
            <option key={index} value={index}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="result-count">
          Showing {cards.length} of {totalCount} cards
        </span>
      </div>

      <div className="card-grid">
        {cards.map((card: any) => (
          <div key={card.guid} className="card-item">
            <img src={card.imageUri} alt={card.name} />
            <h3>{card.name}</h3>
            <p>{card.edition} - #{card.collectorNumber}</p>
            {card.isFoil && <span className="foil-badge">Foil</span>}
            <p className="price">${card.sellPrice?.toFixed(2) || 'N/A'}</p>
            <p className="stock">
              {card.availableStock ? `${card.totalStock} in stock` : 'Out of stock'}
            </p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1} of {Math.ceil(totalCount / pageSize)}</span>
        <button
          disabled={(page + 1) * pageSize >= totalCount}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MagicCardListWithSort;
```

---

#### Advanced: Combined Filters and Sorting

```typescript
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

interface FilterState {
  search: string;
  rarity: string;
  condition: string;
  stockStatus: string;
  isFoil: boolean | null;
  priceFrom: string;
  priceTo: string;
}

const MagicCardListAdvanced: React.FC = () => {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    rarity: '',
    condition: '',
    stockStatus: '',
    isFoil: null,
    priceFrom: '',
    priceTo: '',
  });

  const buildFilters = () => {
    const filterObj: any = {};
    
    if (filters.rarity) filterObj.rarity = filters.rarity;
    if (filters.condition) filterObj.condition = filters.condition;
    if (filters.stockStatus) filterObj.stockStatus = filters.stockStatus;
    if (filters.isFoil !== null) filterObj.isFoil = filters.isFoil;
    
    if (filters.priceFrom || filters.priceTo) {
      filterObj.sellPrice = {
        range: {
          ...(filters.priceFrom && { from: parseFloat(filters.priceFrom) }),
          ...(filters.priceTo && { to: parseFloat(filters.priceTo) }),
        },
      };
    }
    
    return Object.keys(filterObj).length > 0 ? filterObj : undefined;
  };

  const { data, loading } = useQuery(GET_MAGIC_CARDS, {
    variables: {
      findMagicCardsPublicArgs: {
        skip: 0,
        limit: 20,
        ...(filters.search && { search: filters.search }),
        sort: {
          column: sortColumn,
          order: sortOrder,
        },
        filters: buildFilters(),
      },
    },
  });

  return (
    <div>
      <div className="filters-and-sort">
        {/* Search */}
        <input
          type="text"
          placeholder="Search cards..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        {/* Sort Controls */}
        <select
          value={sortColumn}
          onChange={(e) => setSortColumn(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="sellPrice">Price</option>
          <option value="releaseDate">Release Date</option>
          <option value="collectorNumber">Collector Number</option>
          <option value="edition">Edition</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>

        {/* Foil Filter */}
        <label>
          <input
            type="checkbox"
            checked={filters.isFoil === true}
            onChange={(e) => setFilters({ 
              ...filters, 
              isFoil: e.target.checked ? true : null 
            })}
          />
          Foil Only
        </label>

        {/* Price Range */}
        <input
          type="number"
          placeholder="Min Price"
          value={filters.priceFrom}
          onChange={(e) => setFilters({ ...filters, priceFrom: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.priceTo}
          onChange={(e) => setFilters({ ...filters, priceTo: e.target.value })}
        />

        {/* Stock Status */}
        <select
          value={filters.stockStatus}
          onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
        >
          <option value="">All Stock</option>
          <option value="AVAILABLE">In Stock</option>
          <option value="UNAVAILABLE">Out of Stock</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card-grid">
          {data?.magicCardPublicList?.data.map((card: any) => (
            <div key={card.guid} className="card-item">
              <img src={card.imageUri} alt={card.name} />
              <h3>{card.name}</h3>
              <p>{card.edition}</p>
              {card.isFoil && <span className="foil-badge">Foil</span>}
              <p>${card.sellPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### 6. Get Public Card Detail

**Query:** `magicCardPublicDetail`
**Type:** Public
**Description:** Get detailed information for a specific card

```graphql
query MagicCardPublicDetail($guid: UUID!) {
  magicCardPublicDetail(guid: $guid) {
    guid
    name
    edition
    collectorNumber
    isFoil
    rarity
    sellPrice
    inventoryCards {
      condition
      stock
      sellPrice
    }
    imageUri
  }
}
```

**Variables:**

```json
{
  "guid": "CARD_GUID_HERE"
}
```

**Response Fields:**

- All basic card info plus:
  - `rarity`: Card rarity
  - `inventoryCards`: Array of inventory items with different conditions
    - `condition`: Card condition
    - `stock`: Available quantity
    - `sellPrice`: Sell price for this condition

---

### 7. Get Internal Card List (Admin)

**Query:** `magicCardInternalList`
**Type:** Internal (Requires Authentication)
**Roles:** ADMIN, BUYER, RECEPTION
**Description:** Get detailed card list with internal pricing and inventory information

**Headers Required:**

```
Authorization: Bearer {{auth_token}}
```

```graphql
query MagicCardInternalList($findMagicCardsPublicArgs: FindMagicCardsPublicArgs!) {
  magicCardInternalList(findMagicCardsPublicArgs: $findMagicCardsPublicArgs) {
    data {
      guid
      name
      edition
      collectorNumber
      isFoil
      sellPrice
      availableStock
      imageUri
      inventoryCards {
        guid
        condition
        stock
        purchasePrice
        sellPrice
      }
      totalStock
      cardMetrics {
        variantsMetrics {
          condition
          stock
          lastSellDate
          avgDaysInInventory
          wishlistCount
        }
        priceRetail
        priceBuy
      }
    }
    count
  }
}
```

**Variables:**

```json
{
  "findMagicCardsPublicArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "name",
      "order": "ASC"
    },
    "withCardsMetrics": true
  }
}
```

**Additional Response Fields (Internal):**

- `inventoryCards`: Array with internal inventory data
  - `guid`: Inventory item identifier
  - `purchasePrice`: Cost price of inventory items
- `totalStock`: Total stock across all conditions
- `cardMetrics` (nullable): Card metrics data (only populated when `withCardsMetrics: true`)
  - `variantsMetrics`: Array of inventory condition variants with metrics
    - `condition`: Card condition
    - `stock`: Current stock quantity
    - `lastSellDate`: Date of last sale (nullable)
    - `avgDaysInInventory`: Average days in inventory (nullable)
    - `wishlistCount`: Number of wishlists
  - `priceRetail`: CardKingdom retail price in MXN (nullable)
  - `priceBuy`: CardKingdom buy price in MXN (nullable)

**Optional Parameters:**

- `withCardsMetrics` (boolean, default: false): Include card metrics and CardKingdom prices for each card
  - ⚠️ **WARNING:** Significantly increases response time due to external API calls (CardKingdom)
  - When `true`: Each card includes full metrics data
  - When `false` or omitted: `cardMetrics` field is null (faster response)

---

### 8. Get Internal Card Detail (Admin)

**Query:** `magicCardInternalDetail`
**Type:** Internal (Requires Authentication)
**Roles:** ADMIN, BUYER, RECEPTION
**Description:** Get internal detail of a single Magic card with inventory data

**Headers Required:**

```
Authorization: Bearer {{auth_token}}
```

```graphql
query MagicCardInternalDetail($guid: UUID!) {
  magicCardInternalDetail(guid: $guid) {
    guid
    name
    edition
    collectorNumber
    isFoil
    rarity
    sellPrice
    inventoryCards {
      guid
      condition
      stock
      purchasePrice
      sellPrice
    }
    totalStock
    imageUri
  }
}
```

**Variables:**

```json
{
  "guid": "CARD_GUID_HERE"
}
```

---

### 9. Get Top 5 Best-Selling Magic Cards

**Query:** `magicTopSoldCards`
**Type:** Public
**Description:** Returns the 5 all-time best-selling Magic cards ranked by total quantity sold across all completed sales, grouped by card (all conditions combined).

```graphql
query MagicTopSoldCards {
  magicTopSoldCards {
    guid
    name
    edition
    collectorNumber
    rarity
    isFoil
    imageUri
    sellPrice
    availableStock
    totalStock
    totalSold
  }
}
```

**Response Fields:**

- `guid`: Unique card identifier
- `name`: Card name
- `edition`: Edition/set name (nullable)
- `collectorNumber`: Collector number in set (nullable)
- `rarity`: Card rarity (nullable)
- `isFoil`: Whether the card is foil
- `imageUri`: Card image URL (nullable)
- `sellPrice`: Lowest current sell price across all conditions (nullable)
- `availableStock`: Whether any stock is currently available (boolean)
- `totalStock`: Total units in stock across all conditions
- `totalSold`: Total number of completed sales this card appears in

**Notes:**

- Results are ordered by `totalSold` descending (most sold first)
- Aggregation groups by card — all conditions are collapsed into one result per card
- Only `COMPLETED` sales are counted toward `totalSold`
- No authentication required

---

### 10. Get Card with Metrics (Internal)

**Query:** `magicCardWithMetrics`
**Type:** Internal (Requires Authentication)
**Roles:** ADMIN, BUYER, RECEPTION
**Description:** Get inventory metrics and real-time pricing data for a specific Magic card

**Headers Required:**

```
Authorization: Bearer {{auth_token}}
```

```graphql
query MagicCardWithMetrics($guid: UUID!) {
  magicCardWithMetrics(guid: $guid) {
    variantsMetrics {
      condition
      stock
      lastSellDate
      avgDaysInInventory
      wishlistCount
    }
    priceRetail
    priceBuy
  }
}
```

**Variables:**

```json
{
  "guid": "CARD_GUID_HERE"
}
```

**Response Fields:**

- `variantsMetrics`: Array of inventory condition variants with metrics
  - `condition`: Card condition (NEAR_MINT, LIGHTLY_PLAYED, MODERATELY_PLAYED, HEAVILY_PLAYED, DAMAGED)
  - `stock`: Current stock quantity for this condition
  - `lastSellDate`: Date of last sale for this condition (nullable)
  - `avgDaysInInventory`: Average days items spend in inventory for this condition (nullable)
  - `wishlistCount`: Number of customers who wishlisted this card in this condition
- `priceRetail`: Market retail price in MXN (nullable)
- `priceBuy`: Market buy price in MXN (nullable)

**Currency Conversion:**

All prices are returned in **MXN (Mexican Pesos)** and are converted from USD using a real-time exchange rate with the following fallback mechanism:

1. **Tier 1 - Redis Cache:** Exchange rate cached for 12 hours
2. **Tier 2 - CurrencyAPI.com:** Live fetch if cache expired
3. **Tier 3 - Database:** Stale rate from database if API unavailable

Prices are fetched from Card Kingdom and then multiplied by the USD to MXN exchange rate.

**Possible Errors:**

- **404 Not Found:** Card with specified GUID does not exist
- **500 Server Error:** Exchange rate unavailable
  - Error message: `"Tipo de cambio no disponible. CurrencyAPI.com falló ({error}) y no existe una tasa de respaldo en la base de datos..."`

**Use Cases:**

- Inventory analysis dashboards showing stock performance by condition
- Pricing decision support with real-time market data
- Demand forecasting using wishlist counts
- Inventory turnover metrics (avgDaysInInventory)

---

## Frontend Integration Examples

### React/TypeScript Example

```typescript
// Types
interface MagicCard {
  guid: string;
  name: string;
  edition?: string;
  collectorNumber?: string;
  isFoil: boolean;
  sellPrice?: number;
  availableStock: boolean;
  imageUri?: string;
}

interface CardListResponse {
  data: MagicCard[];
  count: number;
}

// GraphQL Client Setup (using Apollo Client)
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'YOUR_GRAPHQL_ENDPOINT',
  cache: new InMemoryCache()
});

// Query Examples
const GET_MAGIC_CARDS = gql`
  query MagicCardPublicList($findMagicCardsPublicArgs: FindMagicCardsPublicArgs!) {
    magicCardPublicList(findMagicCardsPublicArgs: $findMagicCardsPublicArgs) {
      data {
        guid
        name
        edition
        collectorNumber
        isFoil
        sellPrice
        availableStock
        imageUri
      }
      count
    }
  }
`;

// Component Example
const MagicCardList: React.FC = () => {
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await client.query({
          query: GET_MAGIC_CARDS,
          variables: {
            findMagicCardsPublicArgs: {
              skip: 0,
              limit: 20,
              sort: { column: "name", order: "ASC" }
            }
          }
        });
        setCards(data.magicCardPublicList.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card-grid">
      {cards.map(card => (
        <div key={card.guid} className="card-item">
          <img src={card.imageUri} alt={card.name} />
          <h3>{card.name}</h3>
          <p>{card.edition} - #{card.collectorNumber}</p>
          {card.isFoil && <span className="foil-badge">Foil</span>}
          <p>Price: ${card.sellPrice}</p>
          <p>In Stock: {card.availableStock ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};
```

### Search and Filter Implementation

```typescript
const SearchableMagicCardList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [condition, setCondition] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [isFoil, setIsFoil] = useState<boolean | null>(null);
  const [edition, setEdition] = useState('');

  const fetchFilteredCards = async () => {
    const variables = {
      findMagicCardsPublicArgs: {
        skip: 0,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        sort: { column: "name", order: "ASC" },
        filters: {
          ...(condition && { condition }),
          ...(stockStatus && { stockStatus }),
          ...(isFoil !== null && { isFoil }),
          ...(edition && { edition })
        }
      }
    };

    const { data } = await client.query({
      query: GET_MAGIC_CARDS,
      variables
    });

    return data.magicCardPublicList;
  };

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">All Conditions</option>
          <option value="NEAR_MINT">Near Mint</option>
          <option value="LIGHTLY_PLAYED">Lightly Played</option>
          <option value="MODERATELY_PLAYED">Moderately Played</option>
          <option value="HEAVILY_PLAYED">Heavily Played</option>
          <option value="DAMAGED">Damaged</option>
        </select>
        <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
          <option value="">All Stock</option>
          <option value="AVAILABLE">Available</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={isFoil === true}
            onChange={(e) => setIsFoil(e.target.checked ? true : null)}
          />
          Foil Only
        </label>
      </div>
      {/* Card list component */}
    </div>
  );
};
```

---

### 11. Batch Search Cards

**Query:** `magicBatchCardSearch`
**Type:** Internal (requires authentication)
**Roles:** ADMIN, BUYER, RECEPTION
**Description:** Search multiple Magic cards from multiline text in Moxfield format

```graphql
query MagicBatchCardSearch($input: BatchSearchMagicCardsInput!) {
  magicBatchCardSearch(input: $input) {
    results {
      originalLine
      parsedName
      parsedSet
      parsedNumber
      bestMatch {
        guid
        name
        edition
        collectorNumber
        isFoil
        sellPrice
        availableStock
        totalStock
        imageUri
        inventoryCards {
          guid
          condition
          stock
          purchasePrice
          sellPrice
        }
        cardMetrics {
          variantsMetrics {
            condition
            stock
            lastSellDate
            avgDaysInInventory
            wishlistCount
          }
          priceRetail
          priceBuy
        }
      }
      relatedCards {
        guid
        name
        edition
        collectorNumber
        isFoil
        sellPrice
        availableStock
        totalStock
        imageUri
        inventoryCards {
          guid
          condition
          stock
          purchasePrice
          sellPrice
        }
      }
      error
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "searchText": "1 Rin and Seri, Inseparable (SLD) 1910\n1 Ajani, the Greathearted (PLST) WAR-184\n1 Impact Tremors (FDN) 717 *F*\n1 Mirri, Weatherlight Duelist (CMM) 585 *E*",
    "withCardsMetrics": true
  }
}
```

**Input Format (Moxfield):**

```
[cantidad] [nombre] ([set]) [número] [*suffix*]
```

**Examples:**
- `1 Rin and Seri, Inseparable (SLD) 1910`
- `1 Impact Tremors (FDN) 717 *F*` (foil marker removed before search)
- `1 Mirri, Weatherlight Duelist (CMM) 585 *E*` (etched marker removed)

**Special Handling:**
- Suffix markers (`*F*`, `*E*`, etc.) are automatically removed before searching
- Empty lines are ignored
- Set codes are extracted from parentheses

**Input Parameters:**

- `searchText` (required): Multiline text in Moxfield format
- `withCardsMetrics` (optional, boolean, default: false): Include card metrics for best match
  - ⚠️ **WARNING:** Significantly increases response time due to external API calls (CardKingdom)
  - When `true`: `bestMatch.cardMetrics` includes full metrics data
  - When `false` or omitted: `cardMetrics` field is null (faster response)

**Response Fields:**

- `originalLine`: The original input line
- `parsedName`: Extracted card name
- `parsedSet`: Extracted set/edition code
- `parsedNumber`: Extracted collector number
- `bestMatch`: The top matching card with full inventory details
  - `cardMetrics` (nullable): Card metrics data (only when `withCardsMetrics: true`)
- `relatedCards`: Up to 3 additional related cards (no metrics)
- `error`: Error message if search failed for this line

**Use Cases:**

1. **Bulk Card Lookup:** Paste a decklist from Moxfield and get all card details
2. **Inventory Check:** See available stock and conditions for multiple cards at once
3. **Price Verification:** Check purchase and sell prices across multiple cards
4. **Foil Detection:** Automatically handles foil and special finish markers

**TypeScript Example:**

```typescript
import { gql, useLazyQuery } from '@apollo/client';

const BATCH_SEARCH_MAGIC = gql`
  query MagicBatchCardSearch($input: BatchSearchMagicCardsInput!) {
    magicBatchCardSearch(input: $input) {
      results {
        originalLine
        parsedName
        bestMatch {
          guid
          name
          edition
          isFoil
          totalStock
          inventoryCards {
            condition
            stock
            sellPrice
          }
        }
        error
      }
    }
  }
`;

const BatchSearchComponent = () => {
  const [searchCards, { data, loading }] = useLazyQuery(BATCH_SEARCH_MAGIC);

  const handlePaste = (decklistText: string) => {
    searchCards({
      variables: {
        input: { searchText: decklistText }
      }
    });
  };

  return (
    <div>
      <textarea 
        placeholder="Paste your Moxfield decklist here..."
        onPaste={(e) => handlePaste(e.clipboardData.getData('text'))}
      />
      {loading && <p>Searching...</p>}
      {data?.magicBatchCardSearch.results.map((result, idx) => (
        <div key={idx}>
          <h4>{result.parsedName}</h4>
          {result.bestMatch ? (
            <div>
              <p>
                {result.bestMatch.edition} 
                {result.bestMatch.isFoil && ' (Foil)'}
              </p>
              <p>Stock: {result.bestMatch.totalStock}</p>
              <ul>
                {result.bestMatch.inventoryCards.map(inv => (
                  <li key={inv.guid}>
                    {inv.condition}: {inv.stock} @ ${inv.sellPrice}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="error">{result.error}</p>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## Error Handling

```typescript
const handleGraphQLError = (error: any) => {
  if (error.networkError) {
    console.error('Network error:', error.networkError);
    // Handle network issues
  }

  if (error.graphQLErrors) {
    error.graphQLErrors.forEach((err: any) => {
      console.error('GraphQL error:', err.message);
      // Handle specific GraphQL errors
    });
  }
};
```

## Best Practices

1. **Pagination:** Always implement pagination for card lists to avoid large data transfers
2. **Caching:** Use Apollo Client cache or similar to avoid redundant requests
3. **Image Loading:** Implement lazy loading for card images
4. **Error Boundaries:** Wrap components in error boundaries for graceful error handling
5. **Loading States:** Always show loading indicators during API calls
6. **Debouncing:** Debounce search inputs to avoid excessive API calls
7. **Foil Filtering:** Consider providing a toggle for foil/non-foil cards in the UI