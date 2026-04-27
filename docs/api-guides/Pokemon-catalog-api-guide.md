# Pokemon Catalog API Guide

## Overview

The Pokemon Catalog API provides access to Pokemon card data, collections, and filtering capabilities. It uses GraphQL and supports both public and internal endpoints.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)

## Authentication

- **Public endpoints:** No authentication required
- **Internal endpoints:** Require Bearer token in Authorization header

## Available Endpoints

### 1. Get Collections

**Query:** `pokemonCardCollections`
**Type:** Public
**Description:** Retrieve all available Pokemon card collections

```graphql
query PokemonCardCollections {
  pokemonCardCollections {
    guid
    name
    code
  }
}
```

**Response Fields:**

- `guid`: Unique identifier for the collection
- `name`: Display name of the collection
- `code`: Short code for the collection

---

### 2. Get Rarities

**Query:** `pokemonCardRarities`
**Type:** Public
**Description:** Get list of available card rarities

```graphql
query PokemonCardRarities {
  pokemonCardRarities
}
```

**Response:** Array of rarity strings

---

### 3. Get Genres

**Query:** `pokemonCardGenres`
**Type:** Public
**Description:** Get list of available card genres

```graphql
query PokemonCardGenres {
  pokemonCardGenres
}
```

**Response:** Array of genre strings

---

### 4. Get Variants

**Query:** `pokemonCardVariants`
**Type:** Public
**Description:** Get list of available card variants

```graphql
query PokemonCardVariants {
  pokemonCardVariants
}
```

**Response:** Array of variant strings

---

### 5. Get Public Card List

**Query:** `pokemonCardPublicList`
**Type:** Public
**Description:** Get paginated list of Pokemon cards for public display

```graphql
query PokemonCardPublicList($findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs!) {
  pokemonCardPublicList(findPokemonCardsPublicArgs: $findPokemonCardsPublicArgs) {
    data {
      guid
      name
      setName
      setCode
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
  "findPokemonCardsPublicArgs": {
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
  - `setName`: Collection/set name
  - `setCode`: Collection/set code
  - `cardNumber`: Card number in set (e.g. `#025`)
  - `rarity`: Card rarity (nullable)
  - `sellPrice`: Current sell price
  - `availableStock`: Whether stock is available (boolean)
  - `imageUri`: Card image URL

---

### 6. Get Public Card List with Filters

**Query:** `pokemonCardPublicList`
**Type:** Public
**Description:** Get filtered and searched list of Pokemon cards

```graphql
query PokemonCardPublicList($findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs!) {
  pokemonCardPublicList(findPokemonCardsPublicArgs: $findPokemonCardsPublicArgs) {
    data {
      guid
      name
      setName
      setCode
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
  "findPokemonCardsPublicArgs": {
    "skip": 0,
    "limit": 10,
    "search": "charizard",
    "sort": {
      "column": "name",
      "order": "ASC"
    },
    "filters": {
      "set": "COLLECTION_GUID_HERE",
      "rarity": "Rare Holo",
      "variant": "Reverse Holo",
      "genre": "Pokemon Card",
      "sellPrice": {
        "range": {
          "from": 100,
          "to": 500
        }
      },
      "condition": "NEAR_MINT",
      "stockStatus": "AVAILABLE"
    }
  }
}
```

**Available Filters:**

All filters are optional. Combine them to narrow down results:

- `set` (string): Collection guid - Filter by specific Pokemon card collection/set. Get valid guids from `pokemonCardCollections` query
- `rarity` (string): Card rarity - Filter by rarity (e.g., "Rare Holo", "Common"). Get valid values from `pokemonCardRarities` query
- `variant` (string): Card variant - Filter by variant type (e.g., "Normal", "Reverse Holo"). Get valid values from `pokemonCardVariants` query
- `genre` (string): Card genre - Filter by genre (defaults to "Pokemon Card" if not specified). Get valid values from `pokemonCardGenres` query
- `sellPrice` (object): Price range filter with `range.from` and `range.to` (numbers in MXN)
- `condition` (enum): Card condition - "NEAR_MINT" | "LIGHTLY_PLAYED" | "MODERATELY_PLAYED" | "HEAVILY_PLAYED" | "DAMAGED"
- `stockStatus` (enum): Stock availability - "AVAILABLE" | "UNAVAILABLE"
- `search` (string): Text search in card names (not in filters object, top-level parameter)

---

### 7. Getting Valid Filter Values

Before using filters, you can query the API to get valid values for each filter type:

**Collection GUIDs (for `set` filter):**
```graphql
query PokemonCardCollections {
  pokemonCardCollections {
    guid
    name
    code
  }
}
```

**Rarities (for `rarity` filter):**
```graphql
query PokemonCardRarities {
  pokemonCardRarities
}
```

**Variants (for `variant` filter):**
```graphql
query PokemonCardVariants {
  pokemonCardVariants
}
```

**Genres (for `genre` filter):**
```graphql
query PokemonCardGenres {
  pokemonCardGenres
}
```

**Example Workflow:**
1. Fetch collections to populate a collection dropdown
2. User selects a collection, use its `guid` as the `set` filter value
3. Optionally combine with other filters (rarity, price range, etc.)

---

### 8. Custom Sorting Options

**Description:** The `pokemonCardPublicList` query supports custom sorting through the `sort` parameter. You can sort by multiple columns in ascending or descending order.

**Available Sort Columns:**

| Column | Description | Data Type | Example Use Case |
|--------|-------------|-----------|------------------|
| `name` | Card name (alphabetical) | string | Sort cards A-Z or Z-A |
| `sellPrice` | Minimum sell price across all conditions | number | Find cheapest/most expensive cards |
| `releaseDate` | Collection release date | date | Sort by newest/oldest releases |
| `cardNumber` | Card number in set | string | Sort by set order |
| `setName` | Collection/set name | string | Group by collection alphabetically |
| `setCode` | Collection/set code | string | Sort by set code |

**Sort Order Values:**
- `ASC` - Ascending order (A-Z, 0-9, oldest-newest, false-true)
- `DESC` - Descending order (Z-A, 9-0, newest-oldest, true-false)

**Important Notes:**
- **Priority-Based Sorting:** The API uses a multi-level priority system that ensures optimal card discovery:
  1. **Stock Availability** - Cards with stock always appear before cards without stock
  2. **Collection Priority** - Normal collections appear before foreign language collections (Chinese, Japanese, Korean)
  3. **Genre Priority** - "Pokemon Card" and "Pokemon Cards" genres appear before other genres
  4. **User Sort** - Your specified sort column and order
  5. **Default Tiebreaker** - Release date (newest first) when no sort is specified

- **Search Behavior:** When a `search` query is active, results are sorted by relevance (search rank) after the priority filters, then by your specified sort criteria

- **Example:** If you sort by `name ASC`, you'll get:
  - Cards with stock from normal collections (Pokemon Card genre) → sorted A-Z
  - Cards with stock from normal collections (other genres) → sorted A-Z
  - Cards with stock from foreign collections → sorted A-Z
  - Cards without stock from normal collections → sorted A-Z
  - Cards without stock from foreign collections → sorted A-Z

---

#### Sort by Price (Low to High)

```graphql
query PokemonCardsByPriceLowToHigh {
  pokemonCardPublicList(
    findPokemonCardsPublicArgs: {
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
      setName
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
query PokemonCardsByPriceHighToLow {
  pokemonCardPublicList(
    findPokemonCardsPublicArgs: {
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
      setName
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
query PokemonCardsByName {
  pokemonCardPublicList(
    findPokemonCardsPublicArgs: {
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
      setName
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
query PokemonCardsFilteredAndSorted {
  pokemonCardPublicList(
    findPokemonCardsPublicArgs: {
      skip: 0
      limit: 20
      sort: {
        column: "sellPrice"
        order: "ASC"
      }
      filters: {
        stockStatus: "AVAILABLE"
        condition: "NEAR_MINT"
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
      setName
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
  { label: 'Card Number', column: 'cardNumber', order: 'ASC' },
  { label: 'Set Name (A-Z)', column: 'setName', order: 'ASC' },
  { label: 'Set Code', column: 'setCode', order: 'ASC' },
];

const GET_POKEMON_CARDS = gql`
  query PokemonCardPublicList($findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs!) {
    pokemonCardPublicList(findPokemonCardsPublicArgs: $findPokemonCardsPublicArgs) {
      data {
        guid
        name
        setName
        setCode
        sellPrice
        availableStock
        totalStock
        imageUri
      }
      count
    }
  }
`;

const PokemonCardListWithSort: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, loading, error } = useQuery(GET_POKEMON_CARDS, {
    variables: {
      findPokemonCardsPublicArgs: {
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

  const cards = data?.pokemonCardPublicList?.data || [];
  const totalCount = data?.pokemonCardPublicList?.count || 0;

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
            <p>{card.setName} - {card.setCode}</p>
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

export default PokemonCardListWithSort;
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
  priceFrom: string;
  priceTo: string;
}

const PokemonCardListAdvanced: React.FC = () => {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    rarity: '',
    condition: '',
    stockStatus: '',
    priceFrom: '',
    priceTo: '',
  });

  const buildFilters = () => {
    const filterObj: any = {};
    
    if (filters.rarity) filterObj.rarity = filters.rarity;
    if (filters.condition) filterObj.condition = filters.condition;
    if (filters.stockStatus) filterObj.stockStatus = filters.stockStatus;
    
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

  const { data, loading } = useQuery(GET_POKEMON_CARDS, {
    variables: {
      findPokemonCardsPublicArgs: {
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
          <option value="cardNumber">Card Number</option>
          <option value="setName">Set Name</option>
          <option value="setCode">Set Code</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>

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
          {data?.pokemonCardPublicList?.data.map((card: any) => (
            <div key={card.guid} className="card-item">
              <img src={card.imageUri} alt={card.name} />
              <h3>{card.name}</h3>
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

### 9. Get Public Card Detail

**Query:** `pokemonCardPublicDetail`
**Type:** Public
**Description:** Get detailed information for a specific card

```graphql
query PokemonCardPublicDetail($guid: String!) {
  pokemonCardPublicDetail(guid: $guid) {
    guid
    name
    variant
    setGuid
    setName
    setCode
    cardNumber
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
  - `variant`: Card variant
  - `setGuid`: UUID of the card's collection/set (nullable)
  - `cardNumber`: Number in set
  - `rarity`: Card rarity
  - `inventoryCards`: Array of inventory items with different conditions

---

### 10. Get Internal Card List (Admin)

**Query:** `pokemonCardInternalList`
**Type:** Internal (Requires Authentication)
**Description:** Get detailed card list with internal pricing information

**Headers Required:**

```
Authorization: Bearer {{auth_token}}
```

```graphql
query PokemonCardInternalList($findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs!) {
  pokemonCardInternalList(findPokemonCardsPublicArgs: $findPokemonCardsPublicArgs) {
    data {
      guid
      name
      setName
      setCode
      sellPrice
      availableStock
      imageUri
      inventoryCards {
        condition
        stock
        purchasePrice
        sellPrice
      }
      totalStock
    }
    count
  }
}
```

**Additional Response Fields (Internal):**

- `purchasePrice`: Cost price of inventory items
- `totalStock`: Total stock across all conditions

---

### 11. Get Top 5 Best-Selling Pokemon Cards

**Query:** `pokemonTopSoldCards`
**Type:** Public
**Description:** Returns the 5 all-time best-selling Pokemon cards ranked by total quantity sold across all completed sales, grouped by card (all conditions combined).

```graphql
query PokemonTopSoldCards {
  pokemonTopSoldCards {
    guid
    name
    setName
    setCode
    cardNumber
    rarity
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
- `setName`: Collection/set name (nullable)
- `setCode`: Collection/set code (nullable)
- `cardNumber`: Card number in set (e.g. `#025`) (nullable)
- `rarity`: Card rarity (nullable)
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

### 12. Get Card with Metrics (Internal)

**Query:** `pokemonCardWithMetrics`
**Type:** Internal (Requires Authentication)
**Description:** Get inventory metrics and real-time pricing data for a specific Pokemon card
**Roles:** ADMIN, BUYER, RECEPTION

**Headers Required:**

```
Authorization: Bearer {{auth_token}}
```

```graphql
query PokemonCardWithMetrics($guid: String!) {
  pokemonCardWithMetrics(guid: $guid) {
    variantsMetrics {
      condition
      stock
      lastSellDate
      avgDaysInInventory
      wishlistCount
    }
    ungradedPrice
    gradedPriceSeven
    gradedPriceEightOrAbove
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
- `ungradedPrice`: Market price for ungraded card in MXN (nullable)
- `gradedPriceSeven`: Market price for PSA 7 graded card in MXN (nullable)
- `gradedPriceEightOrAbove`: Market price for PSA 8+ graded card in MXN (nullable)

**Currency Conversion:**

All prices are returned in **MXN (Mexican Pesos)** and are converted from USD using a real-time exchange rate with the following fallback mechanism:

1. **Tier 1 - Redis Cache:** Exchange rate cached for 12 hours
2. **Tier 2 - CurrencyAPI.com:** Live fetch if cache expired
3. **Tier 3 - Database:** Stale rate from database if API unavailable

Prices are fetched from PriceCharting API in USD (converted from cents) and then multiplied by the USD to MXN exchange rate.

**Possible Errors:**

- **404 Not Found:** Card with specified GUID does not exist
- **500 Server Error:** Card is missing `productId` configuration
  - Error message: `"La carta no tiene un ID de producto configurado en PriceCharting. No se pueden obtener los precios."`
- **500 Server Error:** PriceCharting API returned non-success status
  - Error message: `"Error al obtener precios de PriceCharting para el producto {productId}. Estado: {status}"`
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
interface PokemonCard {
  guid: string;
  name: string;
  setName: string;
  setCode: string;
  sellPrice: number;
  availableStock: number;
  imageUri: string;
}

interface CardListResponse {
  data: PokemonCard[];
  count: number;
}

// GraphQL Client Setup (using Apollo Client)
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'YOUR_GRAPHQL_ENDPOINT',
  cache: new InMemoryCache()
});

// Query Examples
const GET_CARDS = gql`
  query PokemonCardPublicList($findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs!) {
    pokemonCardPublicList(findPokemonCardsPublicArgs: $findPokemonCardsPublicArgs) {
      data {
        guid
        name
        setName
        setCode
        sellPrice
        availableStock
        imageUri
      }
      count
    }
  }
`;

// Component Example
const CardList: React.FC = () => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await client.query({
          query: GET_CARDS,
          variables: {
            findPokemonCardsPublicArgs: {
              skip: 0,
              limit: 20,
              sort: { column: "name", order: "ASC" }
            }
          }
        });
        setCards(data.pokemonCardPublicList.data);
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
          <p>{card.setName} - {card.setCode}</p>
          <p>Price: ${card.sellPrice}</p>
          <p>Stock: {card.availableStock}</p>
        </div>
      ))}
    </div>
  );
};
```

### Search and Filter Implementation

```typescript
const SearchableCardList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [condition, setCondition] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const fetchFilteredCards = async () => {
    const filters: any = {};
    
    if (selectedCollection) filters.set = selectedCollection;
    if (selectedRarity) filters.rarity = selectedRarity;
    if (condition) filters.condition = condition;
    if (stockStatus) filters.stockStatus = stockStatus;
    if (priceFrom || priceTo) {
      filters.sellPrice = {
        range: {
          ...(priceFrom && { from: parseFloat(priceFrom) }),
          ...(priceTo && { to: parseFloat(priceTo) })
        }
      };
    }

    const variables = {
      findPokemonCardsPublicArgs: {
        skip: 0,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        sort: { column: "name", order: "ASC" },
        filters
      }
    };

    const { data } = await client.query({
      query: GET_CARDS,
      variables
    });

    return data.pokemonCardPublicList;
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
        <select value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)}>
          <option value="">All Collections</option>
          {/* Populate from pokemonCardCollections query */}
        </select>
        <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}>
          <option value="">All Rarities</option>
          {/* Populate from pokemonCardRarities query */}
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">All Conditions</option>
          <option value="NEAR_MINT">Near Mint</option>
          <option value="LIGHTLY_PLAYED">Lightly Played</option>
        </select>
        <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
          <option value="">All Stock</option>
          <option value="AVAILABLE">Available</option>
          <option value="UNAVAILABLE">Out of Stock</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={priceFrom}
          onChange={(e) => setPriceFrom(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceTo}
          onChange={(e) => setPriceTo(e.target.value)}
        />
      </div>
      {/* Card list component */}
    </div>
  );
};
```

---

### 13. Batch Search Cards

**Query:** `pokemonBatchCardSearch`
**Type:** Internal (requires authentication)
**Roles:** ADMIN, BUYER, RECEPTION
**Description:** Search multiple Pokemon cards from multiline text in Limitless format

```graphql
query PokemonBatchCardSearch($input: BatchSearchPokemonCardsInput!) {
  pokemonBatchCardSearch(input: $input) {
    results {
      originalLine
      parsedName
      parsedSet
      parsedNumber
      bestMatch {
        guid
        name
        setName
        setCode
        cardNumber
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
      relatedCards {
        guid
        name
        setName
        setCode
        cardNumber
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
    "searchText": "Pokémon: 6\n3 Mega Charizard Y ex ASC 22\n3 Dreepy TWM 128\n\nTrainer: 3\n2 Iono PAL 185\n1 Lillie's Determination MEG 169\n\nEnergy: 6\n2 Luminous Energy PAL 191\n2 Psychic Energy MEE 5\n2 Fire Energy MEE 2"
  }
}
```

**Input Format (Limitless):**

```
[cantidad] [nombre] [set] [número]
```

**Examples:**
- `3 Mega Charizard Y ex ASC 22`
- `2 Iono PAL 185`
- `2 Fire Energy MEE 2`

**Special Lines (Ignored):**
- Section headers: `Pokémon:`, `Trainer:`, `Energy:`
- Empty lines

**Response Fields:**

- `originalLine`: The original input line
- `parsedName`: Extracted card name
- `parsedSet`: Extracted set code
- `parsedNumber`: Extracted card number
- `bestMatch`: The top matching card with full inventory details
- `relatedCards`: Up to 3 additional related cards
- `error`: Error message if search failed for this line

**Use Cases:**

1. **Bulk Card Lookup:** Paste a decklist from Limitless and get all card details
2. **Inventory Check:** See available stock and conditions for multiple cards at once
3. **Price Verification:** Check purchase and sell prices across multiple cards

**TypeScript Example:**

```typescript
import { gql, useMutation } from '@apollo/client';

const BATCH_SEARCH_POKEMON = gql`
  query PokemonBatchCardSearch($input: BatchSearchPokemonCardsInput!) {
    pokemonBatchCardSearch(input: $input) {
      results {
        originalLine
        parsedName
        bestMatch {
          guid
          name
          setName
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
  const [searchCards, { data, loading }] = useLazyQuery(BATCH_SEARCH_POKEMON);

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
        placeholder="Paste your Limitless decklist here..."
        onPaste={(e) => handlePaste(e.clipboardData.getData('text'))}
      />
      {loading && <p>Searching...</p>}
      {data?.pokemonBatchCardSearch.results.map((result, idx) => (
        <div key={idx}>
          <h4>{result.parsedName}</h4>
          {result.bestMatch ? (
            <div>
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