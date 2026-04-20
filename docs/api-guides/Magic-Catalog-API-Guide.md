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

### 5. Get Public Card Detail

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

### 6. Get Internal Card List (Admin)

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
    }
    count
  }
}
```

**Additional Response Fields (Internal):**

- `inventoryCards`: Array with internal inventory data
  - `guid`: Inventory item identifier
  - `purchasePrice`: Cost price of inventory items
- `totalStock`: Total stock across all conditions

---

### 7. Get Internal Card Detail (Admin)

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

### 8. Get Top 5 Best-Selling Magic Cards

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

### 9. Get Card with Metrics (Internal)

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

### 8. Batch Search Cards

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
    "searchText": "1 Rin and Seri, Inseparable (SLD) 1910\n1 Ajani, the Greathearted (PLST) WAR-184\n1 Impact Tremors (FDN) 717 *F*\n1 Mirri, Weatherlight Duelist (CMM) 585 *E*"
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

**Response Fields:**

- `originalLine`: The original input line
- `parsedName`: Extracted card name
- `parsedSet`: Extracted set/edition code
- `parsedNumber`: Extracted collector number
- `bestMatch`: The top matching card with full inventory details
- `relatedCards`: Up to 3 additional related cards
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