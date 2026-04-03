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
  - `sellPrice`: Current sell price
  - `availableStock`: Available quantity
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
      "stockStatus": "AVAILABLE",
      "condition": "NEAR_MINT"
    }
  }
}
```

**Available Filters:**

- `stockStatus`: "AVAILABLE" | "OUT_OF_STOCK"
- `condition`: Card condition (e.g., "NEAR_MINT")
- `search`: Text search in card names

---

### 7. Get Public Card Detail

**Query:** `pokemonCardPublicDetail`
**Type:** Public
**Description:** Get detailed information for a specific card

```graphql
query PokemonCardPublicDetail($guid: String!) {
  pokemonCardPublicDetail(guid: $guid) {
    guid
    name
    variant
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
  - `cardNumber`: Number in set
  - `rarity`: Card rarity
  - `inventoryCards`: Array of inventory items with different conditions

---

### 8. Get Internal Card List (Admin)

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

### 9. Get Card with Metrics (Internal)

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
  const [condition, setCondition] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  const fetchFilteredCards = async () => {
    const variables = {
      findPokemonCardsPublicArgs: {
        skip: 0,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        sort: { column: "name", order: "ASC" },
        filters: {
          ...(condition && { condition }),
          ...(stockStatus && { stockStatus })
        }
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
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">All Conditions</option>
          <option value="NEAR_MINT">Near Mint</option>
          <option value="LIGHTLY_PLAYED">Lightly Played</option>
        </select>
        <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
          <option value="">All Stock</option>
          <option value="AVAILABLE">Available</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>
      {/* Card list component */}
    </div>
  );
};
```

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