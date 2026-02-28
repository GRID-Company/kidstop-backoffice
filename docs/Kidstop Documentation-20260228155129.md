# Kidstop Documentation

Here will be gathered all information about the plan, spikes investigations and any other documentation, diagramas created during development.

# Spike tcg pokemon api

# Spike Findings

## Provider Overview

| Item | Details |
| ---| --- |
| Provider | PriceCharting ([pricecharting.com](http://pricecharting.com)) |
| Access method | CSV bulk download (catalog) + JSON API (images) |
| Auth | API token via query param `t=<token>` |
| Rate limits | No documented limit; we use 1 req/sec to be safe |
| Catalog size | ~77,700 cards across ~702 collections |
| Update cadence | Daily price updates; new sets added as they release |
| Cost | Paid API token required for CSV access |

## Data Access

### 1\. CSV Bulk Download (Card Catalog)

**Endpoint:** `GET https://www.pricecharting.com/price-guide/download-custom?t={token}&category=pokemon-cards`

Returns a full CSV dump of every Pokemon card product in their database. Single request, no pagination. File is ~15MB.

**Sample CSV row:**

```sql
id,console-name,product-name,loose-price,cib-price,new-price,graded-price,...,genre,release-date
48204,Pokemon Base Set,"Charizard [Holo] #4",85299,127500,399900,349997,...,Pokemon Card,1999-01-09
```

**CSV columns (27 total):**

| Column | Mapped To | Notes |
| ---| ---| --- |
| `id` | `productId` | PriceCharting's unique product ID |
| `console-name` | Collection name | Used as the card set/collection |
| `product-name` | `productName` | Full card name with variant and number embedded |
| `loose-price` | `loosePrice` | Price in cents (USD) |
| `cib-price` | `cibPrice` | Complete-in-box price |
| `new-price` | `newPrice` | Sealed/new price |
| `graded-price` | `gradedPrice` | Graded card price |
| `genre` | `genre` | Category filter (see genres below) |
| `release-date` | `releaseDate` | Set release date |

Remaining columns (box-only, manual-only, BGS 10, condition-17/18, GameStop prices, retail buy/sell, UPC, sales volume, TCG ID, ASIN, ePID) are stored but not actively used yet.

### 2\. JSON API (Images)

**Endpoint:** `GET https://www.pricecharting.com/console/{normalizedCollectionName}?sort=&when=none&cursor={cursor}&format=json`

Returns paginated product data including image URIs. 50 items per page. No auth token needed.

**Sample response item:**

```bash
{
  "id": "48204",
  "consoleUri": "pokemon-base-set",
  "imageUri": "https://commondatastorage.googleapis.com/.../48204.jpg",
  "productName": "Charizard Holo",
  "isCard": true,
  "price1": "$852.99",
  "priceChange": -5
}
```

Image matching: Products are matched to CSV rows by `id` (productId).

## Data Characteristics

### Genre Breakdown

| Genre | Cards | % |
| ---| ---| --- |
| Pokemon Card | 71,124 | 91.5% |
| Pokemon Cards | 5,635 | 7.2% |
| Chinese Pokemon Card | 583 | 0.7% |
| Korean Pokemon Card | 251 | 0.3% |
| Japanese Pokemon Card | 127 | 0.2% |
| Pokemon kortti | 3 | <0.1% |

### Collection Stats

| Metric | Value |
| ---| --- |
| Total collections | 702 |
| Total cards | 77,723 |
| Avg cards per collection | 111.5 |
| Min cards in a collection | 1 |
| Max cards in a collection | 2,116 (Pokemon Promo) |

**Largest collections:**

| Collection | Cards |
| ---| --- |
| Pokemon Promo | 2,116 |
| Pokemon Japanese Start Deck 100 Battle Collection | 1,532 |
| Pokemon Japanese Promo | 1,163 |
| Pokemon Japanese Terastal Festival | 1,058 |
| Pokemon Ascended Heroes | 660 |

### Card Name Parsing

PriceCharting encodes variant and card number inside `productName`:

```cpp
"A Call to Arms [Foil] #16"  →  title: "A Call to Arms", variant: "Foil", number: "16"
"Pikachu #25"                →  title: "Pikachu", variant: "Normal", number: "25"
"Charizard [Holo]"           →  title: "Charizard", variant: "Holo", number: null
```

*   **826 unique variants** found in the dataset
*   75,018 cards (96.5%) have a card number
*   2,705 cards (3.5%) have no card number

**Top variants:**

| Variant | Count | % |
| ---| ---| --- |
| Normal | 48,452 | 62.3% |
| Reverse Holo | 12,973 | 16.7% |
| 1st Edition | 6,040 | 7.8% |
| Master Ball | 804 | 1.0% |
| Holo | 793 | 1.0% |
| Mirror Holo | 766 | 1.0% |
| Reverse | 574 | 0.7% |
| Poke Ball | 568 | 0.7% |
| Foil | 561 | 0.7% |
| Jumbo | 553 | 0.7% |

### Image Coverage

| Metric | Value |
| ---| --- |
| Cards with images | 77,710 |
| Cards without images | 13 |
| Image success rate | 99.98% |

The 13 missing images are likely very new or obscure products not yet indexed.

[https://www.pricecharting.com/console/pokemon-obsidian-flames](https://www.pricecharting.com/console/pokemon-obsidian-flames)
[https://www.pricecharting.com/game/pokemon-obsidian-flames/charizard-ex-223](https://www.pricecharting.com/game/pokemon-obsidian-flames/charizard-ex-223)

[https://www.pricecharting.com/game/1673333](https://www.pricecharting.com/game/1673333)
[https://www.tcgplayer.com/product/234158?Language=English](https://www.tcgplayer.com/product/234158?Language=English)

[https://www.pricecharting.com/game/](https://www.pricecharting.com/game/)7980179

# Architecture & Findings

# Key Findings & Decisions

### 1\. Collection name = Set name

PriceCharting uses `console-name` as the set/collection identifier. This maps directly to our `PokemonCardCollection.name`. Collection names need normalization (lowercase, remove spaces/dots/colons/commas, replace spaces with hyphens) to match the image API URL slugs.

### 2\. No card-level unique ID across sets

The `id` field is globally unique per product, but there's no concept of "same card across sets." Each variant of a card in a specific set is a separate product. This simplifies our model — **one entity per product row**.

### 3\. Variant is embedded in product name

There's no separate `variant` column in the CSV. We built a parser (`PokemonCardNameParserService`) that extracts `[variant]` from brackets and `#number` from the product name. This works reliably for the current dataset.

### 4\. Prices are in cents (USD)

All price fields are integers representing US cents. We store them as `decimal(10,2)` after dividing by 100.

### 5\. Image fetching is the bottleneck

The CSV download is a single fast request (~15MB). Image fetching requires paginated requests per collection (702 collections x N pages x 1 sec delay). Full sync with images takes **~30-45 minutes** with rate limiting.

### 6\. Collections grow over time

New cards can be added to existing collections (e.g., promo sets). The sync pipeline handles this by comparing CSV card names against DB and inserting only new cards.
* * *

# Entity Mapping

## PriceCharting CSV to Internal Entities

```scss
CSV Row
  ├── console-name  →  PokemonCardCollection.name
  ├── (normalized)  →  PokemonCardCollection.normalizedName
  └── product data  →  PokemonCard
        ├── id             →  productId
        ├── product-name   →  productName (original)
        ├── (parsed)       →  titleName, variant, cardNumber
        ├── loose-price    →  loosePrice
        ├── cib-price      →  cibPrice
        ├── new-price      →  newPrice
        ├── graded-price   →  gradedPrice
        └── (from API)     →  imageUri
```

## Database Tables

**`pokemon_card_collection`**

| Column | Type | Notes |
| ---| ---| --- |
| id | int (PK) | Auto-increment |
| name | text | Original collection name |
| normalizedName | text | URL slug (unique) |
| tcgType | text | Always "pokemon" |
| totalCards | int | Count of cards |
| cardsWithImages | int | Count with images |

**`pokemon_card`**

| Column | Type | Notes |
| ---| ---| --- |
| id | int (PK) | Auto-increment |
| productId | text | PriceCharting product ID (indexed) |
| productName | text | Original full name |
| titleName | text | Parsed clean name |
| variant | text | Parsed variant (default: "Normal") |
| cardNumber | text | Parsed #number (nullable) |
| consoleName | text | Genre/category |
| genre | text | Language category |
| imageUri | text | From image API (nullable) |
| loosePrice | decimal | USD |
| cibPrice | decimal | USD |
| newPrice | decimal | USD |
| gradedPrice | decimal | USD |
| releaseDate | text | ISO date string |
| collectionId | int (FK) | → pokemon\_card\_collection.id |

* * *

# Sync Pipeline Architecture

```scss
                    ┌─────────────┐
                    │  Cron Job   │  (daily @ 3 AM)
                    │  or Manual  │  (GraphQL mutation)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Download   │  Single CSV request (~15MB)
                    │  CSV        │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Parse CSV  │  RFC 4180 compliant parser
                    │  Filter by  │  Allowed genres only
                    │  genre      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Group by   │  702 collections
                    │  collection │  Parse card names
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
      ┌───────▼──────┐ ┌──▼───────┐ ┌──▼──────────┐
      │  New          │ │ Existing │ │  Image      │
      │  Collections  │ │ + New    │ │  Retry      │
      │  Sync         │ │ Cards    │ │  Phase      │
      │  (full save)  │ │ (insert) │ │  (missing)  │
      └───────┬───────┘ └──┬───────┘ └──┬──────────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │  Metrics    │  Collections, cards, images,
                    │  & Logging  │  duration, success rate
                    └─────────────┘
```

### Sync Steps (in order):

1. Download full CSV from PriceCharting
2. Parse CSV (RFC 4180), filter by allowed genres
3. Group cards by collection, parse card names (extract variant + number)
4. Query DB for existing collections
5. Filter to new collections only
6. **Sync new collections** — fetch images (paginated), match to cards, save to DB
7. **Sync new cards in existing collections** — compare card names, fetch images, insert only new cards
8. Release collections from memory
9. **Retry missing images** — re-fetch images for any cards still without images until no progress
10. Calculate and return final metrics

### Rate Limiting Strategy

*   1 second delay between collection image fetches
*   1 second delay between pagination requests
*   No delay needed for the CSV download (single request)
* * *

# GraphQL API

### Mutations

```markdown
mutation {
  triggerPokemonSync {
    collectionsDetected
    collectionsNew
    collectionsSkipped
    totalCards
    imageSuccessCount
    imageErrorCount
    imageSuccessRate
    durationMs
  }
}
```

### Queries

```bash
query {
  cardVariants  # Returns all 826 unique variant strings
}
```

* * *

# Risks & Open Items

| Risk | Impact | Mitigation |
| ---| ---| --- |
| PriceCharting API token revoked | Sync stops entirely | Monitor sync failures, alert on error |
| Rate limiting / IP ban | Image fetch fails | Fixed 1s delays; could add exponential backoff |
| CSV format changes | Parse errors | RFC 4180 parser is robust; column mapping may break |
| Sync duration (~30-45 min) | Blocks API resources | NestJS cron runs in same process; migrate to SQS worker if needed |
| 826 variants is noisy | Hard to filter in UI | May need a curated variant list or grouping for the catalog UI |
| No incremental sync | Re-downloads full CSV each time | CSV is only ~15MB, acceptable for MVP |

* * *

# What Differs from the Original Plan

| Planned (phase-1) | Actual (spike) | Reason |
| ---| ---| --- |
| Generic CardSet, Card, CardVariant entities | Pokemon-specific PokemonCardCollection, PokemonCard | PriceCharting's data shape doesn't fit the generic model; variant is a field, not a separate entity |
| CardProviderAdapter interface | Direct PokemonPriceChartingClient | Only one provider implemented; abstraction deferred |
| Separate CardVariant table | variant field on PokemonCard | PriceCharting treats each variant as a separate product with its own ID and prices |
| SyncLog entity | In-memory SyncMetrics returned via GraphQL | Sufficient for MVP; can persist to DB later |
| REST admin endpoints | GraphQL mutation triggerPokemonSync | Consistent with existing API pattern |
| Magic provider | Not implemented | Pokemon-only for MVP |

# Spike tcg magic api

Provider: [https://www.cardkingdom.com/](https://www.cardkingdom.com/)

**Step 0. Fetch collections:**
[https://www.cardkingdom.com/catalog/magic\_the\_gathering/by\_az](https://www.cardkingdom.com/catalog/magic_the_gathering/by_az)

**Step 1. Fetch cards**

All the cards are available at:
[https://api.cardkingdom.com/api/v2/pricelist](https://api.cardkingdom.com/api/v2/pricelist)

**Step 2.** For each item in the data:

```json
{
  "id": 10000,
  "sku": "4ED-117",
  "scryfall_id": "a363bc91-8278-448e-9d5c-564e4b51eb62",
  "url": "mtg/4th-edition/abomination",
  "name": "Abomination",
  "variation": "",
  "edition": "4th Edition",
  "is_foil": "false",
  "price_retail": "0.35",
  "qty_retail": 20,
  "price_buy": "0.03",
  "qty_buying": 0,
  "condition_values": {
    "nm_price": "0.35",
    "nm_qty": 0,
    "ex_price": "0.28",
    "ex_qty": 0,
    "vg_price": "0.25",
    "vg_qty": 20,
    "g_price": "0.18",
    "g_qty": 0
  }
}
```

we will sync:
*   cardKingdomId
*   sku
*   scryfall\_id
*   detailsUrl
*   name
*   variation
*   edition
*   is\_foil

**Step. 2.1 Sync details for the current item**
url = [https://www.cardkingdom.com](https://www.cardkingdom.com) + card.detailsUrl

This will return and html and if we search for a div like this:

```cpp
<div class="col-md-4 cardDetailSub cardDetailInfo">
```

we can find inside:

```xml
<div class="col-md-4 cardDetailSub cardDetailInfo"><table class="table"><tbody><tr valign="top"><td>Edition:</td> <td><a href="/mtg/4th-edition" class="editionLink">4th Edition</a></td></tr> <tr valign="top"><td>Type:</td> <td>Creature - Horror</td></tr> <tr><td>Cast:</td> <td><img src="/media/images/web/mana_symbols/mana_3.svg" alt="3" style="width: 18px; height: 18px;"> <img src="/media/images/web/mana_symbols/mana_b.svg" alt="B" style="width: 18px; height: 18px;"> <img src="/media/images/web/mana_symbols/mana_b.svg" alt="B" style="width: 18px; height: 18px;"></td></tr> <tr><td>Rarity:</td> <td>U</td></tr> <tr><td>Collector #:</td> <td>117</td></tr> <tr><td>Pow/Tuf:</td> <td>2/6</td></tr> <tr><td colspan="2"><div class="detailProductDescription"><div class="see-more-container"><div id="card-description-content" class="description-content" style="position: relative; transition: max-height 0.3s;">
        Whenever Abomination blocks or becomes blocked by a green or white creature, destroy that creature at end of combat.
    </div> <button id="card-see-more-btn" class="see-more-btn" style="display: none;">
        See more
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" style="margin-left: 4px; margin-top: -1px; vertical-align: middle;"><g clip-path="url(#clip0_888_6799)"><path d="M8.5 1.5C10.2239 1.5 11.8772 2.18482 13.0962 3.40381C14.3152 4.62279 15 6.27609 15 8C15 9.72391 14.3152 11.3772 13.0962 12.5962C11.8772 13.8152 10.2239 14.5 8.5 14.5C6.77609 14.5 5.12279 13.8152 3.90381 12.5962C2.68482 11.3772 2 9.72391 2 8C2 6.27609 2.68482 4.62279 3.90381 3.40381C5.12279 2.18482 6.77609 1.5 8.5 1.5ZM8.5 16C10.6217 16 12.6566 15.1571 14.1569 13.6569C15.6571 12.1566 16.5 10.1217 16.5 8C16.5 5.87827 15.6571 3.84344 14.1569 2.34315C12.6566 0.842855 10.6217 0 8.5 0C6.37827 0 4.34344 0.842855 2.84315 2.34315C1.34285 3.84344 0.5 5.87827 0.5 8C0.5 10.1217 1.34285 12.1566 2.84315 13.6569C4.34344 15.1571 6.37827 16 8.5 16ZM7.75 10.75C7.75 11.1656 8.08437 11.5 8.5 11.5C8.91562 11.5 9.25 11.1656 9.25 10.75V8.75H11.25C11.6656 8.75 12 8.41562 12 8C12 7.58437 11.6656 7.25 11.25 7.25H9.25V5.25C9.25 4.83437 8.91562 4.5 8.5 4.5C8.08437 4.5 7.75 4.83437 7.75 5.25V7.25H5.75C5.33437 7.25 5 7.58437 5 8C5 8.41562 5.33437 8.75 5.75 8.75H7.75V10.75Z" fill="#2E3338"></path></g> <defs><clipPath id="clip0_888_6799"><rect width="16" height="16" fill="white" transform="translate(0.5)"></rect></clipPath></defs></svg></button></div></div></td></tr></tbody></table> <div class="cardActions"><a href="/api/wishlist/add/10000" role="button" rel="nofollow" class="btn btn-lg btn-default"><i aria-hidden="true" class="fa-solid fa-heart"></i> Add To Wishlist
                </a> <a href="/catalog/restock_notice/4th-edition/abomination" role="button" rel="nofollow" class="btn btn-lg btn-default"><span aria-hidden="true" class="glyphicon glyphicon-envelope"></span> Restock Notice</a> <a href="http://gatherer.wizards.com/Pages/Search/Default.aspx?name=Abomination" aria-label="Gatherer & Rulings (opens in new tab)" target="_blank" class="btn btn-lg btn-default"><span aria-hidden="true" class="glyphicon glyphicon-info-sign"></span>
                    Gatherer & Rulings
                    <span class="sr-only">(opens in new tab)</span></a></div></div>
```

And extract the next data:

*   Edition → e.g "4th Edition"
*   Type → e.g "Creature - Horror"
*   Cast → e.g ""
*   Rarity → e.g "U"
*   Collector # → e.g "117"
*   Power

Pow/Tuf → e.g "2/6" → Power: 2, Toughness: 6

*   Toughness

Pow/Tuf → e.g "2/6" → Power: 2, Toughness: 6

And the image which we can get it from the same html:

```cpp
<img alt="4ED: Abomination" src="https://www.cardkingdom.com/images/magic-the-gathering/4th-edition/abomination-13572.jpg" class="card-image">
```

we will same the src url as:
*   imageUri

# Backend Specification — Kidstop Singles Platform

Metele nitro papito

Especificación del schema GraphQL (schema-first) para el backend NestJS.
Este documento define entidades, queries, mutations, reglas de negocio e integraciones que el backend debe implementar.

**Referencia frontend:** Los tipos aquí definidos deben ser consistentes con los domain types en `src/features/*/domain/types.ts`.
> **Enfoque:** Schema-first — el backend define el `.graphql` y el frontend genera tipos con `graphql-codegen`.

## Tabla de Contenidos

*   [Convenciones Generales](http://#convenciones-generales)
*   [Enums y Tipos Compartidos](http://#enums-y-tipos-compartidos)
*   [Módulo 1: Autenticación y Seguridad](http://#módulo-1-autenticación-y-seguridad)
*   [Módulo 2: Usuarios y Roles](http://#módulo-2-usuarios-y-roles)
*   [Módulo 3: Catálogo de Cartas](http://#módulo-3-catálogo-de-cartas)
*   [Módulo 4: Compras (Buylist/Negociación)](http://#módulo-4-compras-buylistnegociación)
*   [Módulo 5: Inventario y Movimientos](http://#módulo-5-inventario-y-movimientos)
*   [Módulo 6: Ventas](http://#módulo-6-ventas-pedidos-desde-carpeta-digital)
*   [Módulo 7: Clientes](http://#módulo-7-clientes)
*   [Módulo 8: Most Wanted](http://#módulo-8-most-wanted-configuración)
*   [Módulo 9: Configuración Global](http://#módulo-9-configuración-global)
* * *

## Convenciones Generales

### Paginación

Todas las queries de listado usan esta estructura estándar:

```plain
input SortType {
  column: String!
  order: String!  # ASC | DESC
}

input DateRange {
  from: String
  to: String
}
```

Patrón de argumentos para queries paginadas:

```plain
input Find{Entity}sArgs {
  filters: Find{Entity}sFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}
```

Patrón de respuesta paginada:

```plain
type Paginated{Entity}s {
  count: Float
  data: [{Entity}]
}
```

### Identificadores

*   Usar `guid: String!` como identificador principal (consistente con schema existente)
*   Usar `ID` scalar solo en inputs de relaciones

### Auditoría

Todas las entidades incluyen:

```plain
interface Auditable {
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}
```

### Respuestas Genéricas

```plain
type GenericOutput {
  message: String!
}
```

### Scalars

```plain
scalar Timestamp
scalar Upload
```

* * *

## Enums y Tipos Compartidos

```plain
enum TCGType {
  POKEMON
  MAGIC
}

enum CardCondition {
  NEAR_MINT
  LIGHTLY_PLAYED
  MODERATELY_PLAYED
  HEAVILY_PLAYED
  DAMAGED
}

enum UserRole {
  SUPERUSER
  ADMIN
  RECEPTION
  BUYER
}
```

* * *

## Módulo 1: Autenticación y Seguridad

### Entidades

```plain
type User {
  guid: String!
  name: String
  emailAddress: String!
  role: UserRole!
  activated: Boolean!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type LoginOutput {
  access_token: String
  credentials_expired_token: String
  user: User
}

type ChangePasswordOutput {
  success: Boolean!
}

type RequestPasswordChangeOutput {
  success: Boolean!
}

type IsValidTokenOutput {
  isValid: Boolean!
}
```

### Inputs

```plain
input LoginUserInput {
  emailAddress: String!
  password: String!
}

input RequestPasswordChangeInput {
  emailAddress: String!
}

input ChangePasswordInput {
  otp_guid: String!
  new_password: String!
}

input UserFinishSignupInput {
  otp_guid: String!
  password: String!
}
```

### Queries

```plain
type Query {
  isValidToken: IsValidTokenOutput!
  userProfile: User!
}
```

### Mutations

```plain
type Mutation {
  login(loginUserInput: LoginUserInput!): LoginOutput!
  requestPasswordChange(requestPasswordChangeInput: RequestPasswordChangeInput!): RequestPasswordChangeOutput!
  changePassword(changePasswordInput: ChangePasswordInput!): ChangePasswordOutput!
  userFinishSignUp(userFinishSignupInput: UserFinishSignupInput!): ChangePasswordOutput!
}
```

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| JWT Expiration | Token expira según configuración del servidor (recomendado: 8h) |
| OTP Expiration | Token de recuperación expira en 30 minutos |
| Password Policy | Mínimo 8 caracteres, al menos 1 mayúscula, 1 número |
| Credentials Expired | Si `credentials_expired_token` viene en login, redirigir a cambio de contraseña |
| Finish Signup | Usuarios nuevos creados por Admin reciben email para definir su password |

### Integraciones

| Integración | Trigger | Descripción |
| ---| ---| --- |
| Email | `requestPasswordChange` | Enviar email con link de recuperación de contraseña |
| Email | `createUser` (Módulo 2) | Enviar email de bienvenida con link de signup |

* * *

## Módulo 2: Usuarios y Roles

### Entidades

```plain
type UserDetail {
  guid: String!
  name: String
  emailAddress: String!
  role: UserRole!
  activated: Boolean!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedUsers {
  count: Float
  data: [User]
}
```

### Inputs

```plain
input CreateUserInput {
  name: String!
  emailAddress: String!
  role: String!
  password: String
}

input UpdateUserInput {
  guid: ID
  name: String
  emailAddress: String
  role: String
}

input UpdateUserProfileInput {
  name: String
  emailAddress: String
  oldPassword: String
}

input FindUsersArgs {
  filters: FindUsersFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindUsersFilter {
  activated: Boolean
  role: String
}
```

### Queries

```plain
type Query {
  users(findUsersArgs: FindUsersArgs!): PaginatedUsers!
  user(guid: String!): UserDetail!
  userProfile: User!
}
```

### Mutations

```plain
type Mutation {
  createUser(createUserInput: CreateUserInput!): User!
  updateUser(updateUserInput: UpdateUserInput!): GenericOutput!
  deactiveUser(guid: String!): GenericOutput!
  updateUserProfile(updateUserProfileInput: UpdateUserProfileInput!): GenericOutput!
  createSuperUser(createUserInput: CreateUserInput!): User!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Autenticación / acceso al backoffice | ✅ | ✅ | ✅ |
| Crear usuarios | ✅ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ❌ |
| Activar/desactivar usuarios | ✅ | ❌ | ❌ |
| Editar perfil propio | ✅ | ✅ | ✅ |

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Solo ADMIN crea usuarios | Guard: role === ADMIN o SUPERUSER |
| Solo ADMIN desactiva | Guard: role === ADMIN o SUPERUSER |
| No auto-desactivar | Un usuario no puede desactivarse a sí mismo |
| Email único | Validar unicidad de emailAddress |
| Roles válidos | Solo ADMIN, RECEPTION, BUYER (no SUPERUSER desde UI) |
| Search | Busca por `name` y `emailAddress` |
| Filtros | `activated` (boolean), `role` (string) |
| Sort default | `createdDate DESC` |

* * *

## Módulo 3: Catálogo de Cartas

### Entidades

```plain
type Card {
  guid: String!
  name: String!
  setName: String!
  setCode: String!
  number: String!
  rarity: String!
  imageUrl: String!
  tcgType: TCGType!
  variants: [CardVariant!]!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type CardVariant {
  guid: String!
  card: Card!
  condition: CardCondition!
  stock: Int!
  buyPrice: Float!
  sellPrice: Float!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedCards {
  count: Float
  data: [Card]
}
```

### Inputs

```plain
input FindCardsArgs {
  filters: FindCardsFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindCardsFilter {
  tcgType: TCGType
  setCode: String
  rarity: String
  condition: CardCondition
}

input UpdateCardPriceInput {
  variantGuid: String!
  sellPrice: Float!
}

input SyncFromProviderInput {
  tcgType: TCGType!
}
```

### Queries

```plain
type Query {
  cards(findCardsArgs: FindCardsArgs!): PaginatedCards!
  card(guid: String!): Card!
}
```

### Mutations

```plain
type Mutation {
  updateCardPrice(updateCardPriceInput: UpdateCardPriceInput!): CardVariant!
  syncFromProvider(syncFromProviderInput: SyncFromProviderInput!): GenericOutput!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Ver/listar/buscar cartas | ✅ | ✅ | ✅ |
| Editar carta/variante | ✅ | ✅ | ✅ |
| Ajustar precio público | ✅ | ✅ | ✅ |
| Sincronizar proveedor | ✅ | ✅ | ✅ |

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Filtro TCG obligatorio | Todas las queries deben filtrar por `tcgType` del contexto seleccionado |
| No mezclar TCGs | Validar que no se mezclen datos entre Pokémon y Magic |
| Search | Busca por `name`, `setName`, `setCode`, `number` |
| Rarities por TCG | Pokémon: Common, Uncommon, Rare Holo, Rare Holo V, Ultra Rare, Double Rare, Special Art Rare, Secret Rare. Magic: Common, Uncommon, Rare, Mythic Rare |
| Precio mínimo | `sellPrice` >= 0 |
| Sync provider | POKEMON → Price Charting API. MAGIC → Card Kingdom API |
| Fallback catálogo | Si proveedor externo falla, usar catálogo interno existente |
| Stock en variante | El campo `stock` en `CardVariant` es calculado desde inventario (read-only aquí) |

### Integraciones

| Proveedor | TCG | Propósito |
| ---| ---| --- |
| Price Charting | POKEMON | Poblar/actualizar catálogo + precios de referencia |
| Card Kingdom | MAGIC | Poblar/actualizar catálogo + precios de referencia |

### Relaciones

```java
Card 1 ──→ N CardVariant (por condición)
CardVariant 1 ──→ N InventoryItem (stock calculado)
```

* * *

## Módulo 4: Compras (Buylist/Negociación)

### Enums

```plain
enum PurchaseStatus {
  DRAFT
  QUOTED
  WAITING_PRICE
  FINALIZED
  REJECTED
}

enum PaymentMethod {
  CASH
  TRANSFER
  STORE_CREDIT
}
```

### Entidades

```plain
type Seller {
  guid: String!
  name: String!
  phone: String!
  email: String
  notes: String
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PurchaseItem {
  guid: String!
  card: Card!
  cardName: String!
  cardImageUrl: String!
  setName: String!
  setCode: String!
  tcgType: TCGType!
  condition: CardCondition!
  quantity: Int!
  unitBuyPrice: Float!
  unitSellPrice: Float!
}

type PaymentDetail {
  method: PaymentMethod!
  amount: Float!
}

type Purchase {
  guid: String!
  code: String!
  status: PurchaseStatus!
  seller: Seller!
  items: [PurchaseItem!]!
  payments: [PaymentDetail!]!
  tcgType: TCGType!
  buyer: User!
  notes: String
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedPurchases {
  count: Float
  data: [Purchase]
}

type PaginatedSellers {
  count: Float
  data: [Seller]
}

type CardSearchMetrics {
  referencePrice: Float!
  currentStock: Int!
  lastSaleDate: String
  daysInInventory: Int!
  wishlistCount: Int!
}

type CardSearchResult {
  guid: String!
  name: String!
  setName: String!
  setCode: String!
  number: String!
  rarity: String!
  imageUrl: String!
  tcgType: TCGType!
  metrics: CardSearchMetrics!
}

type PaginatedCardSearchResults {
  count: Float
  data: [CardSearchResult]
}

type BuyerBudget {
  buyerGuid: String!
  buyerName: String!
  budgetLimit: Float!
  budgetUsed: Float!
  budgetRemaining: Float!
}
```

### Inputs

```plain
input FindPurchasesArgs {
  filters: FindPurchasesFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindPurchasesFilter {
  tcgType: TCGType
  status: PurchaseStatus
  sellerGuid: String
  buyerGuid: String
}

input FindSellersArgs {
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input SearchCardsWithMetricsArgs {
  tcgType: TCGType!
  search: String!
  limit: Int!
  skip: Int!
}

input CreateSellerInput {
  name: String!
  phone: String!
  email: String
  notes: String
}

input PurchaseItemInput {
  cardGuid: String!
  condition: CardCondition!
  quantity: Int!
  unitBuyPrice: Float!
  unitSellPrice: Float!
}

input PaymentDetailInput {
  method: PaymentMethod!
  amount: Float!
}

input CreatePurchaseInput {
  sellerGuid: String!
  tcgType: TCGType!
  items: [PurchaseItemInput!]!
  notes: String
}

input UpdatePurchaseInput {
  purchaseGuid: String!
  sellerGuid: String
  items: [PurchaseItemInput!]
  notes: String
}

input SendQuoteInput {
  purchaseGuid: String!
}

input FinalizePurchaseInput {
  purchaseGuid: String!
  payments: [PaymentDetailInput!]!
}

input PriceAdjustmentItemInput {
  itemGuid: String!
  sellPrice: Float!
}

input AdjustPurchasePricesInput {
  purchaseGuid: String!
  items: [PriceAdjustmentItemInput!]!
}
```

### Queries

```plain
type Query {
  purchases(findPurchasesArgs: FindPurchasesArgs!): PaginatedPurchases!
  purchase(guid: String!): Purchase!
  searchCardsWithMetrics(args: SearchCardsWithMetricsArgs!): PaginatedCardSearchResults!
  sellers(findSellersArgs: FindSellersArgs!): PaginatedSellers!
  buyerBudget(buyerGuid: String!): BuyerBudget!
}
```

### Mutations

```plain
type Mutation {
  createSeller(createSellerInput: CreateSellerInput!): Seller!
  createPurchase(createPurchaseInput: CreatePurchaseInput!): Purchase!
  updatePurchase(updatePurchaseInput: UpdatePurchaseInput!): Purchase!
  sendQuote(sendQuoteInput: SendQuoteInput!): Purchase!
  acceptQuote(purchaseGuid: String!): Purchase!
  rejectQuote(purchaseGuid: String!): Purchase!
  adjustPurchasePrices(adjustPurchasePricesInput: AdjustPurchasePricesInput!): Purchase!
  finalizePurchase(finalizePurchaseInput: FinalizePurchaseInput!): Purchase!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Crear/editar Draft | ✅ | ✅ | ✅ |
| Enviar cotización WhatsApp | ✅ | ✅ | ✅ |
| Aceptar/rechazar cotización | ✅ | ✅ | ✅ |
| Pasar a "Esperando precio" | ✅ | ✅ | ✅ |
| Finalizar (sumar a stock) | ✅ | ✅ | ✅ |

### Transiciones de Estado

```scss
DRAFT → QUOTED            (sendQuote: envía WhatsApp)
QUOTED → WAITING_PRICE    (acceptQuote)
QUOTED → REJECTED         (rejectQuote)
WAITING_PRICE → FINALIZED (finalizePurchase: suma stock + registra pago)
```

> **Estados terminales:** FINALIZED, REJECTED (no permiten más transiciones)

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Solo editar en DRAFT | `updatePurchase` solo funciona si status === DRAFT |
| Validar transición | Cada mutation valida que el status actual permita la transición |
| Código auto-generado | `code` se genera automáticamente: `CMP-{YYYY}-{NNN}` |
| Presupuesto: advertencia | Al crear/editar, calcular si excede presupuesto del buyer → retornar warning, NO bloquear |
| Límite inventario: advertencia | Al agregar item, validar stock actual vs límite (default: 20) → retornar warning, NO bloquear |
| Suma a stock al finalizar | `finalizePurchase` → crear `InventoryMovement` tipo `PURCHASE_ENTRY` por cada item |
| Pagos deben cuadrar | Suma de `payments[].amount` debe ser igual a total de la compra |
| Total calculado | `total = Σ(item.quantity × item.unitBuyPrice)` |
| Filtro TCG | Todas las queries filtran por `tcgType` |
| Search | Busca por `code`, `seller.name` |

### Integraciones

| Integración | Trigger | Descripción |
| ---| ---| --- |
| WhatsApp | `sendQuote` | Genera mensaje con items + total + link, abre WhatsApp al vendedor |
| Inventario | `finalizePurchase` | Crea movimientos de entrada por cada item |
| Catálogo | `adjustPurchasePrices` | Actualiza `sellPrice` en CardVariant del catálogo |

### Relaciones

```scss
Purchase N ──→ 1 Seller
Purchase N ──→ 1 User (buyer)
Purchase 1 ──→ N PurchaseItem
PurchaseItem N ──→ 1 Card
Purchase 1 ──→ N PaymentDetail
```

* * *

## Módulo 5: Inventario y Movimientos

### Enums

```plain
enum MovementType {
  PURCHASE_ENTRY
  SALE_EXIT
  MANUAL_ADJUSTMENT
}

enum StockStatus {
  AVAILABLE
  AWAITING_PICKUP
  UNAVAILABLE
}
```

### Entidades

```plain
type InventoryItem {
  guid: String!
  card: Card!
  cardName: String!
  setName: String!
  setCode: String!
  number: String!
  rarity: String!
  imageUrl: String!
  tcgType: TCGType!
  condition: CardCondition!
  stock: Int!
  stockStatus: StockStatus!
  buyPrice: Float!
  sellPrice: Float!
  lastSoldAt: String
  avgDaysInInventory: Float
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type InventoryMovement {
  guid: String!
  inventoryItem: InventoryItem!
  cardName: String!
  cardImageUrl: String!
  setName: String!
  setCode: String!
  cardNumber: String!
  tcgType: TCGType!
  type: MovementType!
  quantity: Int!
  reason: String!
  user: User!
  reference: String
  createdDate: Timestamp!
}

type PaginatedInventoryItems {
  count: Float
  data: [InventoryItem]
}

type PaginatedInventoryMovements {
  count: Float
  data: [InventoryMovement]
}

type InventoryMetrics {
  totalItems: Int!
  totalStock: Int!
  totalValue: Float!
  lowStockCount: Int!
}
```

### Inputs

```plain
input FindInventoryItemsArgs {
  filters: FindInventoryItemsFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindInventoryItemsFilter {
  tcgType: TCGType
  condition: CardCondition
  stockStatus: StockStatus
  rarity: String
}

input FindInventoryMovementsArgs {
  filters: FindInventoryMovementsFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindInventoryMovementsFilter {
  tcgType: TCGType
  type: MovementType
  dateRange: DateRange
}

input AdjustInventoryInput {
  inventoryItemGuid: String!
  quantity: Int!
  reason: String!
}
```

### Queries

```plain
type Query {
  inventoryItems(findInventoryItemsArgs: FindInventoryItemsArgs!): PaginatedInventoryItems!
  inventoryMovements(findInventoryMovementsArgs: FindInventoryMovementsArgs!): PaginatedInventoryMovements!
  inventoryMetrics(tcgType: TCGType!): InventoryMetrics!
}
```

### Mutations

```plain
type Mutation {
  adjustInventory(adjustInventoryInput: AdjustInventoryInput!): InventoryItem!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Ver stock y movimientos | ✅ | ✅ | ✅ |
| Ajustes manuales (+/-) | ✅ | ❌ | ❌ |

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Ajuste solo Admin | Guard: role === ADMIN o SUPERUSER |
| Movimiento automático: compra | `finalizePurchase` → crea movimiento `PURCHASE_ENTRY` (no se llama directamente) |
| Movimiento automático: venta | `completeSale` → crea movimiento `SALE_EXIT` (no se llama directamente) |
| Ajuste manual registra motivo | `reason` es obligatorio en ajustes manuales |
| Stock nunca negativo | Validar que stock resultante >= 0 |
| StockStatus calculado | `AVAILABLE` si stock > 0 y no hay pedido pendiente. `AWAITING_PICKUP` si hay pedido en estado READY\_FOR\_PICKUP. `UNAVAILABLE` si stock === 0 |
| Métricas calculadas | `lastSoldAt`: fecha del último movimiento SALE\_EXIT. `avgDaysInInventory`: promedio de días entre PURCHASE\_ENTRY y SALE\_EXIT |
| Filtro TCG | Todas las queries filtran por `tcgType` |
| Search | Busca por `cardName`, `setName`, `setCode`, `cardNumber` |
| Trazabilidad | Cada movimiento registra: usuario, fecha, tipo, cantidad, razón, referencia (guid de compra/venta) |

### Relaciones

```scss
InventoryItem N ──→ 1 Card
InventoryItem 1 ──→ N InventoryMovement
InventoryMovement N ──→ 1 User (quien ejecutó)
InventoryMovement ──→ Purchase o Sale (reference)
```

* * *

## Módulo 6: Ventas (Pedidos desde Carpeta Digital)

### Enums

```plain
enum SaleStatus {
  NEW
  IN_PROGRESS
  READY_FOR_PICKUP
  COMPLETED
  CANCELLED
}

enum FulfillmentStatus {
  PENDING
  FOUND
  PARTIAL
  NOT_AVAILABLE
}
```

### Entidades

```plain
type SaleItem {
  guid: String!
  card: Card!
  cardName: String!
  cardImageUrl: String!
  setName: String!
  setCode: String!
  tcgType: TCGType!
  condition: CardCondition!
  quantity: Int!
  foundQuantity: Int!
  unitPrice: Float!
  fulfillmentStatus: FulfillmentStatus!
}

type Sale {
  guid: String!
  code: String!
  status: SaleStatus!
  items: [SaleItem!]!
  customer: Customer!
  customerName: String!
  customerEmail: String!
  tcgType: TCGType!
  notes: String
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedSales {
  count: Float
  data: [Sale]
}
```

### Inputs

```plain
input FindSalesArgs {
  filters: FindSalesFilter!
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindSalesFilter {
  tcgType: TCGType
  status: SaleStatus
  customerGuid: String
}

input UpdateSaleStatusInput {
  saleGuid: String!
  status: SaleStatus!
}

input UpdateSaleItemFulfillmentInput {
  saleItemGuid: String!
  foundQuantity: Int!
  fulfillmentStatus: FulfillmentStatus!
}

input CompleteSaleInput {
  saleGuid: String!
  items: [UpdateSaleItemFulfillmentInput!]!
}
```

### Queries

```plain
type Query {
  sales(findSalesArgs: FindSalesArgs!): PaginatedSales!
  sale(guid: String!): Sale!
}
```

### Mutations

```plain
type Mutation {
  updateSaleStatus(updateSaleStatusInput: UpdateSaleStatusInput!): Sale!
  completeSale(completeSaleInput: CompleteSaleInput!): Sale!
  cancelSale(saleGuid: String!): Sale!
  sendReadyForPickupEmail(saleGuid: String!): GenericOutput!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Ver pedidos | ✅ | ✅ | ❌ |
| Cambiar estatus | ✅ | ✅ | ❌ |
| Generar PDF picking list | ✅ | ✅ | ❌ |
| Completar venta | ✅ | ✅ | ❌ |

### Transiciones de Estado

```scss
NEW → IN_PROGRESS               (iniciar surtido)
IN_PROGRESS → READY_FOR_PICKUP  (marcar listo → enviar email)
READY_FOR_PICKUP → COMPLETED    (completeSale → descuenta stock)
Cualquier estado (excepto COMPLETED) → CANCELLED
```

> **Estados terminales:** COMPLETED, CANCELLED

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Buyer no ve ventas | Guard: role !== BUYER |
| Ventas desde Carpeta Digital | Las ventas se crean desde la Carpeta Digital, no desde el backoffice (no hay `createSale` mutation) |
| Código auto-generado | `code` se genera automáticamente: `VTA-{YYYY}-{NNN}` |
| Validar transición | Cada mutation valida que el status actual permita la transición |
| Descuenta stock al completar | `completeSale` → crea movimiento `SALE_EXIT` por cada item con `foundQuantity > 0` |
| FulfillmentStatus | Se actualiza durante surtido: PENDING → FOUND/PARTIAL/NOT\_AVAILABLE |
| Email al marcar listo | Al pasar a `READY_FOR_PICKUP` → enviar email al cliente |
| PDF picking list | Endpoint REST o query que genera PDF con: código, cliente, TCG, items (carta, variante, condición, cantidad) |
| Search | Busca por `code`, `customerName`, `customerEmail` |
| Filtro TCG | Todas las queries filtran por `tcgType` |

### Integraciones

| Integración | Trigger | Descripción |
| ---| ---| --- |
| Email | `READY_FOR_PICKUP` | Enviar email "tu pedido está listo para recolección" |
| Inventario | `completeSale` | Crear movimientos `SALE_EXIT` |
| PDF | Query/endpoint | Generar picking list PDF |

### Relaciones

```scss
Sale N ──→ 1 Customer
Sale 1 ──→ N SaleItem
SaleItem N ──→ 1 Card
Sale → InventoryMovement (al completar)
```

* * *

## Módulo 7: Clientes

### Enums

```plain
enum CustomerType {
  REGULAR
  VIP
}

enum CustomerStatus {
  ACTIVE
  BLOCKED
}
```

### Entidades

```plain
type Customer {
  guid: String!
  name: String!
  email: String!
  phone: String
  type: CustomerType!
  status: CustomerStatus!
  notes: String
  totalOrders: Int!
  lastOrderDate: String
  uncompletedOrders: Int!
  blockedAt: String
  createdDate: Timestamp!
  updatedDate: Timestamp!
}

type CustomerOrder {
  guid: String!
  code: String!
  status: String!
  totalItems: Int!
  totalAmount: Float!
  createdDate: Timestamp!
  completedAt: String
}

type CustomerOrdersSummary {
  totalOrders: Int!
  completedOrders: Int!
  cancelledOrders: Int!
  orders: [CustomerOrder!]!
}

type PaginatedCustomers {
  count: Float
  data: [Customer]
}
```

### Inputs

```plain
input FindCustomersArgs {
  filters: FindCustomersFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindCustomersFilter {
  type: CustomerType
  status: CustomerStatus
}

input UpdateCustomerInput {
  customerGuid: String!
  name: String
  email: String
  phone: String
  notes: String
}

input BlockCustomerInput {
  customerGuid: String!
  reason: String!
}

input SetVipInput {
  customerGuid: String!
  isVip: Boolean!
}
```

### Queries

```plain
type Query {
  customers(findCustomersArgs: FindCustomersArgs!): PaginatedCustomers!
  customer(guid: String!): Customer!
  customerOrders(customerGuid: String!): CustomerOrdersSummary!
}
```

### Mutations

```plain
type Mutation {
  updateCustomer(updateCustomerInput: UpdateCustomerInput!): Customer!
  blockCustomer(blockCustomerInput: BlockCustomerInput!): Customer!
  unblockCustomer(customerGuid: String!): Customer!
  setCustomerVip(setVipInput: SetVipInput!): Customer!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Ver/listar/buscar | ✅ | ✅ | ❌ |
| Bloquear/desbloquear | ✅ | ✅ | ❌ |
| Cambiar tipo (Cliente ↔ VIP) | ✅ | ❌ | ❌ |

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Buyer no ve clientes | Guard: role !== BUYER |
| Solo Admin cambia VIP | Guard: role === ADMIN o SUPERUSER para `setCustomerVip` |
| Bloqueo automático | Si `uncompletedOrders >= threshold` (configurable en Settings) → bloquear automáticamente |
| Bloqueo manual | `blockCustomer` requiere `reason` |
| Desbloqueo resetea contador | `unblockCustomer` → resetea `uncompletedOrders` a 0 |
| Registro desde Carpeta Digital | Los clientes se crean desde la Carpeta Digital (no hay `createCustomer` en backoffice) |
| Cuenta unificada | Un cliente tiene una sola cuenta para Pokémon y Magic |
| Search | Busca por `name`, `email`, `phone` |
| Sort default | `name ASC` |
| `totalOrders` calculado | Conteo de pedidos del cliente |
| `lastOrderDate` calculado | Fecha del pedido más reciente |

### Relaciones

```scss
Customer 1 ──→ N Sale (pedidos)
Customer ──→ Settings (threshold de bloqueo)
```

* * *

## Módulo 8: Most Wanted (Configuración)

### Enums

```plain
enum MostWantedPriority {
  HIGH
  MEDIUM
  LOW
}
```

### Entidades

```plain
type MostWantedCard {
  guid: String!
  card: Card!
  tcgType: TCGType!
  priority: MostWantedPriority!
  notes: String!
  isActive: Boolean!
  order: Int!
  createdBy: User
  createdDate: Timestamp!
  updatedBy: User
  updatedDate: Timestamp!
}

type PaginatedMostWantedCards {
  count: Float
  data: [MostWantedCard]
}
```

### Inputs

```plain
input FindMostWantedArgs {
  filters: FindMostWantedFilter
  limit: Int!
  search: String
  skip: Int!
  sort: SortType!
}

input FindMostWantedFilter {
  tcgType: TCGType
  priority: MostWantedPriority
  isActive: Boolean
}

input AddMostWantedCardInput {
  cardGuid: String!
  tcgType: TCGType!
  priority: MostWantedPriority!
  notes: String
}

input UpdateMostWantedCardInput {
  mostWantedGuid: String!
  priority: MostWantedPriority
  notes: String
  isActive: Boolean
}

input ReorderMostWantedInput {
  items: [MostWantedOrderItemInput!]!
}

input MostWantedOrderItemInput {
  mostWantedGuid: String!
  order: Int!
}
```

### Queries

```plain
type Query {
  mostWantedCards(findMostWantedArgs: FindMostWantedArgs!): PaginatedMostWantedCards!
  mostWantedPublic(tcgType: TCGType!): [MostWantedCard!]!
}
```

### Mutations

```plain
type Mutation {
  addMostWantedCard(addMostWantedCardInput: AddMostWantedCardInput!): MostWantedCard!
  updateMostWantedCard(updateMostWantedCardInput: UpdateMostWantedCardInput!): MostWantedCard!
  reorderMostWanted(reorderMostWantedInput: ReorderMostWantedInput!): GenericOutput!
  removeMostWantedCard(mostWantedGuid: String!): GenericOutput!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Configurar (agregar/quitar/ordenar/activar) | ✅ | ✅ | ✅ |

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Separación por TCG | Cada carta Most Wanted pertenece a un `tcgType` específico |
| No duplicar | No se puede agregar la misma carta dos veces al mismo TCG |
| Orden único | El campo `order` define la posición en la lista; `reorderMostWanted` actualiza en batch |
| Público sin auth | `mostWantedPublic` no requiere autenticación; solo retorna cartas con `isActive === true`, ordenadas por `order` |
| Search | Busca por nombre de carta, set |
| Default notes | Si no se envía `notes`, se guarda string vacío |

### Relaciones

```plain
MostWantedCard N ──→ 1 Card
MostWantedCard filtrado por TCGType
```

* * *

## Módulo 9: Configuración Global

### Entidades

```plain
type GeofenceCoordinate {
  lat: Float!
  lng: Float!
}

type GeofenceConfig {
  enabled: Boolean!
  center: GeofenceCoordinate!
  radiusKm: Float!
  polygon: [GeofenceCoordinate!]!
}

type BudgetConfig {
  buyerGuid: String!
  buyerName: String!
  dailyLimit: Float!
  weeklyLimit: Float!
  monthlyLimit: Float!
}

type ThresholdConfig {
  uncompletedOrdersLimit: Int!
  inventoryLimitPerCard: Int!
}

type OperatingHoursSlot {
  open: String!
  close: String!
}

type OperatingHours {
  monday: OperatingHoursSlot
  tuesday: OperatingHoursSlot
  wednesday: OperatingHoursSlot
  thursday: OperatingHoursSlot
  friday: OperatingHoursSlot
  saturday: OperatingHoursSlot
  sunday: OperatingHoursSlot
}

type Settings {
  guid: String!
  geofence: GeofenceConfig!
  budgets: [BudgetConfig!]!
  thresholds: ThresholdConfig!
  operatingHours: OperatingHours!
  updatedBy: User
  updatedDate: Timestamp!
}
```

### Inputs

```plain
input GeofenceCoordinateInput {
  lat: Float!
  lng: Float!
}

input UpdateGeofenceInput {
  enabled: Boolean!
  center: GeofenceCoordinateInput!
  radiusKm: Float!
  polygon: [GeofenceCoordinateInput!]!
}

input UpdateBudgetInput {
  buyerGuid: String!
  dailyLimit: Float!
  weeklyLimit: Float!
  monthlyLimit: Float!
}

input UpdateThresholdsInput {
  uncompletedOrdersLimit: Int!
  inventoryLimitPerCard: Int!
}

input OperatingHoursSlotInput {
  open: String!
  close: String!
}

input UpdateOperatingHoursInput {
  monday: OperatingHoursSlotInput
  tuesday: OperatingHoursSlotInput
  wednesday: OperatingHoursSlotInput
  thursday: OperatingHoursSlotInput
  friday: OperatingHoursSlotInput
  saturday: OperatingHoursSlotInput
  sunday: OperatingHoursSlotInput
}

input UpdateSettingsInput {
  geofence: UpdateGeofenceInput
  budgets: [UpdateBudgetInput!]
  thresholds: UpdateThresholdsInput
  operatingHours: UpdateOperatingHoursInput
}
```

### Queries

```plain
type Query {
  settings: Settings!
}
```

### Mutations

```plain
type Mutation {
  updateSettings(updateSettingsInput: UpdateSettingsInput!): Settings!
}
```

### Permisos

| Operación | Admin | Recepción | Comprador |
| ---| ---| ---| --- |
| Ver/editar configuración | ✅ | ❌ | ❌ |

### Reglas de Negocio

| Regla | Descripción |
| ---| --- |
| Solo Admin | Guard: role === ADMIN o SUPERUSER |
| Singleton | Solo existe un registro de Settings en la BD |
| Update parcial | `updateSettings` acepta campos opcionales; solo actualiza lo que se envía |
| Geofence | `center` + `radiusKm` definen el perímetro. `polygon` es alternativa para formas irregulares |
| Budgets por buyer | Un `BudgetConfig` por cada usuario con rol BUYER |
| Threshold de bloqueo | `uncompletedOrdersLimit` se usa en módulo Clientes para bloqueo automático |
| Límite inventario | `inventoryLimitPerCard` se usa en módulo Compras como advertencia |
| Horarios | `null` en un día significa cerrado. `open`/`close` en formato `HH:mm` |
| Validaciones | `radiusKm > 0`, `dailyLimit >= 0`, `weeklyLimit >= dailyLimit`, `monthlyLimit >= weeklyLimit`, `uncompletedOrdersLimit >= 1`, `inventoryLimitPerCard >= 1` |

### Dependencias con otros módulos

| Configuración | Módulo que la consume | Uso |
| ---| ---| --- |
| `geofence` | Carpeta Digital | Validar ubicación de clientes no-VIP |
| `budgets` | Compras | Advertencia de presupuesto excedido |
| `thresholds.uncompletedOrdersLimit` | Clientes | Bloqueo automático |
| `thresholds.inventoryLimitPerCard` | Compras | Advertencia de límite de inventario |
| `operatingHours` | Carpeta Digital | Mostrar horarios / validar disponibilidad |

# Pokemon Catalog API Guide

# Pokemon Catalog API Guide

## Overview

The Pokemon Catalog API provides access to Pokemon card data, collections, and filtering capabilities. It uses GraphQL and supports both public and internal endpoints.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)

## Authentication

*   **Public endpoints:** No authentication required
*   **Internal endpoints:** Require Bearer token in Authorization header

## Available Endpoints

### 1\. Get Collections

**Query:** `pokemonCardCollections`
**Type:** Public
**Description:** Retrieve all available Pokemon card collections

```plain
query PokemonCardCollections {
  pokemonCardCollections {
    guid
    name
    code
  }
}
```

**Response Fields:**

*   `guid`: Unique identifier for the collection
*   `name`: Display name of the collection
*   `code`: Short code for the collection
* * *

### 2\. Get Rarities

**Query:** `pokemonCardRarities`
**Type:** Public
**Description:** Get list of available card rarities

```plain
query PokemonCardRarities {
  pokemonCardRarities
}
```

**Response:** Array of rarity strings
* * *

### 3\. Get Genres

**Query:** `pokemonCardGenres`
**Type:** Public
**Description:** Get list of available card genres

```plain
query PokemonCardGenres {
  pokemonCardGenres
}
```

**Response:** Array of genre strings
* * *

### 4\. Get Variants

**Query:** `pokemonCardVariants`
**Type:** Public
**Description:** Get list of available card variants

```plain
query PokemonCardVariants {
  pokemonCardVariants
}
```

**Response:** Array of variant strings
* * *

### 5\. Get Public Card List

**Query:** `pokemonCardPublicList`
**Type:** Public
**Description:** Get paginated list of Pokemon cards for public display

```plain
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

*   `data`: Array of card objects
*   `count`: Total number of cards matching criteria
*   Card fields:
    *   `guid`: Unique card identifier
    *   `name`: Card name
    *   `setName`: Collection/set name
    *   `setCode`: Collection/set code
    *   `sellPrice`: Current sell price
    *   `availableStock`: Available quantity
    *   `imageUri`: Card image URL
* * *

### 6\. Get Public Card List with Filters

**Query:** `pokemonCardPublicList`
**Type:** Public
**Description:** Get filtered and searched list of Pokemon cards

```plain
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

*   `stockStatus`: "AVAILABLE" | "OUT\_OF\_STOCK"
*   `condition`: Card condition (e.g., "NEAR\_MINT")
*   `search`: Text search in card names
* * *

### 7\. Get Public Card Detail

**Query:** `pokemonCardPublicDetail`
**Type:** Public
**Description:** Get detailed information for a specific card

```plain
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

*   All basic card info plus:
    *   `variant`: Card variant
    *   `cardNumber`: Number in set
    *   `rarity`: Card rarity
    *   `inventoryCards`: Array of inventory items with different conditions
* * *

### 8\. Get Internal Card List (Admin)

**Query:** `pokemonCardInternalList`
**Type:** Internal (Requires Authentication)
**Description:** Get detailed card list with internal pricing information

**Headers Required:**

```css
Authorization: Bearer {{auth_token}}
```

```plain
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

*   `purchasePrice`: Cost price of inventory items
*   `totalStock`: Total stock across all conditions
* * *

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

# Inventory API Guide

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

### 1\. Get Inventory Items

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
    }
  }
}
```

**Response Fields:**

*   `guid`: Unique inventory item identifier
*   `tcg`: Trading card game type (e.g., "POKEMON")
*   `condition`: Card condition (e.g., "NEAR\_MINT")
*   `stock`: Current stock quantity
*   `purchasePrice`: Cost price
*   `sellPrice`: Selling price
*   `lastSellDate`: Date of last sale
*   `avgDaysInInventory`: Average days item stays in inventory
*   `pokemonCard`: Associated Pokemon card information (null for Magic items)
*   `magicCard`: Associated Magic card information (null for Pokemon items)
* * *

### 2\. Get Inventory Items with Filters

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

*   `tcg`: Trading card game type (POKEMON, MAGIC)
*   `condition`: Card condition (NEAR\_MINT, LIGHTLY\_PLAYED, MODERATELY\_PLAYED, HEAVILY\_PLAYED, DAMAGED)
*   `stockStatus`: "AVAILABLE" | "UNAVAILABLE" | "AWAITING\_PICKUP"
*   `pokemonFilters.rarity`: Filter by Pokemon card rarity (matches against tcgPlayer or priceCharting rarity)
*   `lastSellDate`: Date range filter with `filterType: ":daterange:"` and `range: { from, to }`
* * *

### 3\. Get Single Inventory Item

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
    pokemonCard {
      guid
      titleName
      cardNumber
      collection {
        name
        setCode
      }
    }
    magicCard {
      guid
      name
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

*   `pokemonCard.collection`: Collection/set information (Pokemon items)
*   `magicCard`: Magic card information (Magic items)
*   `movements`: Array of stock movements for this item
* * *

### 4\. Get Inventory Indicators

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

*   `totalStock`: Total inventory across all items
*   `lastSellDate`: Most recent sale date
*   `avgDaysInInventory`: Average days items stay in inventory
* * *

### 5\. Create Purchase Movement

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

*   `pokemonCardGuid`: Required — GUID of the Pokemon card
*   `condition`: Required — Card condition (NEAR\_MINT, LIGHTLY\_PLAYED, MODERATELY\_PLAYED, HEAVILY\_PLAYED, DAMAGED)
*   `quantity`: Required — Number of items (positive integer, min 1)
*   `movementType`: Required — "PURCHASE\_ENTRY"
*   `reference`: Optional — Purchase order or reference number
*   `notes`: Required — Description of the movement

**Movement Types:**

*   `PURCHASE_ENTRY`: Increases stock (adds items to inventory)
*   `SALE_EXIT`: Decreases stock (removes items from inventory, validates sufficient stock)
*   `MANUAL_ADJUSTMENT`: Sets stock to the specified quantity (manual override)

> **Note:** The `createInventoryMovement` mutation currently only supports `pokemonCardGuid`. Magic card inventory items are created automatically via the Purchases module finalization flow.
* * *

### 6\. Create Sale Movement

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

*   `movementType`: "SALE\_EXIT"
*   `quantity`: Number of items sold (positive number, must not exceed current stock)
*   `notes`: Required — Description of the movement
*   Other fields same as purchase
* * *

### 7\. Update Item Prices

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

* * *

### 8\. Get Inventory Movements

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

* * *

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
  pokemonCard?: {
    guid: string;
    titleName: string;
    cardNumber: string;
  };
  magicCard?: {
    guid: string;
    name: string;
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

# Purchases API Guide

# Purchases API Guide

## Overview

The Purchases API manages the business's card acquisition workflow — buying cards from clients. Purchases follow a strict status machine (DRAFT → QUOTED → WAITING\_PRICE → FINALIZED) and support both registered and anonymous clients. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All purchase endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Key Concepts

### Status Machine

```
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

```graphql
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
*   `tcg`: Trading card game type (POKEMON, MAGIC)
*   `buyer`: Buyer user GUID
*   `createdDate`: Date range filter with `filterType: ":daterange:"` and `range: { from, to }`

**Available Sort Columns:** `createdDate`, `total`, `status`, `clientName`, `buyerName`, `itemCount`, `purchaseReference`

**Search:** Searches across purchase reference, client name, client email, and item card names
* * *

### 2\. Get Single Purchase

**Query:** `purchase`
**Description:** Get detailed information for a specific purchase
**Access:** ADMIN, BUYER, RECEPTION

```graphql
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

```graphql
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

```graphql
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

```graphql
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

```graphql
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

```graphql
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

```graphql
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
*   **Payment mismatch** (sum ≠ total) on finalization returns a validation error
*   **Budget exceeded** and **inventory limit exceeded** are warnings only — they do not block operations

# Buyer Budget API Guide

# Buyer Budget API Guide

## Overview

The Buyer Budget API manages monthly spending limits for buyers (users with BUYER role) per TCG. Budgets reset every month and are tracked against finalized, quoted, and in-progress purchases. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All buyer budget endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Key Concepts

### Budget Model

*   Each buyer has one budget per TCG (unique constraint: buyerId + tcg)
*   `assignedAmount`: The monthly budget limit set by ADMIN
*   `usedAmount`: Computed at query time — sum of `total` from the buyer's purchases with status IN (QUOTED, WAITING\_PRICE, FINALIZED) for that TCG in the current calendar month
*   `utilization`: Computed as `usedAmount / assignedAmount` (percentage)
*   Budget resets automatically every calendar month
*   ADMIN users have unlimited budget (no budget tracking) — ADMIN users don't have BuyerBudget records since budgets are only created for users with the BUYER role
* * *

## Available Endpoints

### 1\. Get All Buyer Budgets

**Query:** `buyerBudgets`
**Description:** Retrieve all buyer budgets with computed usage. Optionally filter by TCG.
**Access:** ADMIN only

```graphql
query BuyerBudgets($tcg: String) {
  buyerBudgets(tcg: $tcg) {
    guid
    tcg
    assignedAmount
    usedAmount
    utilization
    buyer {
      guid
      name
      emailAddress
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

**Variables (all TCGs):**

```json
{
  "tcg": null
}
```

**Response Fields:**

*   `guid`: Unique budget identifier
*   `tcg`: Trading card game type (POKEMON or MAGIC)
*   `assignedAmount`: Monthly budget limit
*   `usedAmount`: Amount used in the current calendar month
*   `utilization`: Usage percentage (usedAmount / assignedAmount)
*   `buyer`: The buyer user info (guid, name, emailAddress)
* * *

### 2\. Get Single Buyer Budget

**Query:** `buyerBudget`
**Description:** Get a specific buyer's budget with computed usage for a given TCG
**Access:** ADMIN, BUYER (BUYER can only see own budget)

```graphql
query BuyerBudget($buyerGuid: String!, $tcg: String!) {
  buyerBudget(buyerGuid: $buyerGuid, tcg: $tcg) {
    guid
    tcg
    assignedAmount
    usedAmount
    utilization
    buyer {
      guid
      name
      emailAddress
    }
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "buyerGuid": "BUYER_USER_GUID",
  "tcg": "POKEMON"
}
```

**Response Fields:**

*   Same as list endpoint, scoped to a single buyer + TCG combination
* * *

### 3\. Create or Update Buyer Budget

**Mutation:** `updateBuyerBudget`
**Description:** Set or update the monthly budget for a buyer. Creates the budget if it doesn't exist (upsert).
**Access:** ADMIN only

```graphql
mutation UpdateBuyerBudget($updateBuyerBudgetInput: UpdateBuyerBudgetInput!) {
  updateBuyerBudget(updateBuyerBudgetInput: $updateBuyerBudgetInput) {
    guid
    tcg
    assignedAmount
    usedAmount
    utilization
    buyer {
      guid
      name
      emailAddress
    }
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "updateBuyerBudgetInput": {
    "buyerGuid": "BUYER_USER_GUID",
    "tcg": "POKEMON",
    "assignedAmount": 5000.00
  }
}
```

**Input Fields:**

*   `buyerGuid`: Required — GUID of a user with BUYER role
*   `tcg`: Required — POKEMON or MAGIC
*   `assignedAmount`: Required — monthly budget limit (decimal)

**Rules:**

*   If no budget exists for this buyer + tcg, one is created
*   If a budget already exists, only `assignedAmount` is updated
*   The buyer must have the BUYER role
* * *

## Usage in Purchase Workflow

Buyer budgets integrate with the purchase flow through warning flags:

1. When a purchase is created or its status transitions to QUOTED, the system checks if the buyer's `usedAmount + purchase total` exceeds `assignedAmount`
2. If exceeded, a `budgetExceeded` warning is raised — **this does not block the operation**
3. The frontend can use the `buyerBudget` query to display remaining budget to the buyer in real time

### Budget Calculation Example

```
Assigned amount:    $5,000.00
Current month purchases (QUOTED + WAITING_PRICE + FINALIZED):
  - Purchase A:     $1,200.00
  - Purchase B:       $800.00
Used amount:        $2,000.00
Utilization:            40.0%
Remaining:          $3,000.00
```

* * *

## Error Handling & Notes

*   **Buyer not found:** Returns error if the buyerGuid doesn't match an existing BUYER user
*   **BUYER access restriction:** A BUYER can only query their own budget via `buyerBudget`, not other buyers'
*   **Budget warnings are non-blocking:** Exceeding the budget raises a warning but does not prevent purchase creation or status transitions

# Users API Guide

# Users API Guide

## Overview

The Users API manages user accounts, profiles, roles, activation status, and client status. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All user endpoints require a Bearer token in the Authorization header:

```css
Authorization: Bearer {{auth_token}}
```

## Roles & Permissions

| Role | Description |
| ---| --- |
| `SUPERUSER` | Full system access, bypasses all role checks |
| `ADMIN` | User management, configuration, full CRUD |
| `RECEPTION` | Front-desk operations |
| `BUYER` | Purchase operations |
| `CLIENT` | Registered customer |
| `CLIENT_KIOSK` | In-store kiosk customer |

## Available Endpoints

### 1\. Get Users (Paginated)

**Query:** `users`
**Description:** Retrieve paginated list of users with basic information
**Roles:** `ADMIN`

```plain
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      activated
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "activated": true
    }
  }
}
```

**Response Fields:**

*   `guid`: Unique user identifier
*   `emailAddress`: User email
*   `name`: Full name
*   `phone`: Phone number
*   `role`: User role (SUPERUSER, ADMIN, RECEPTION, BUYER, CLIENT, CLIENT\_KIOSK)
*   `clientStatus`: Client status (STANDARD, VIP, BLOCKED) — only applicable to CLIENT role
*   `activated`: Whether the user account is active
*   `count`: Total number of matching records
* * *

### 2\. Get Users with Single Role Filter

**Query:** `users`
**Description:** Filter users by a single role
**Roles:** `ADMIN`

```plain
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      activated
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "role": "ADMIN",
      "activated": true
    }
  }
}
```

**Available Role Values:** `SUPERUSER`, `ADMIN`, `RECEPTION`, `BUYER`, `CLIENT`, `CLIENT_KIOSK`
* * *

### 3\. Get Users with Multiple Role Filter

**Query:** `users`
**Description:** Filter users by multiple roles simultaneously
**Roles:** `ADMIN`

```plain
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      activated
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "roles": {
        "filterType": ":multiple_values:",
        "values": ["ADMIN", "MANAGER", "EMPLOYEE"]
      },
      "activated": true
    }
  }
}
```

* * *

### 4\. Get Users with Search

**Query:** `users`
**Description:** Search users by name or email with optional role filters
**Roles:** `ADMIN`

```plain
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      activated
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "name",
      "order": "ASC"
    },
    "search": "john",
    "filters": {
      "roles": {
        "filterType": ":multiple_values:",
        "values": ["ADMIN", "EMPLOYEE"]
      },
      "activated": true
    }
  }
}
```

**Search Field:** Matches against user `name` and `emailAddress`
* * *

### 5\. Get Users by Client Status

**Query:** `users`
**Description:** Filter CLIENT users by their client status (STANDARD, VIP, BLOCKED)
**Roles:** `ADMIN`

```plain
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      activated
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "role": "CLIENT",
      "clientStatus": "BLOCKED",
      "activated": true
    }
  }
}
```

**Available Client Status Values:** `STANDARD`, `VIP`, `BLOCKED`
* * *

### 6\. Get Single User

**Query:** `user`
**Description:** Get detailed information for a specific user by GUID
**Roles:** `ADMIN`

```plain
query User($guid: String!) {
  user(guid: $guid) {
    guid
    emailAddress
    name
    phone
    role
    clientStatus
    activated
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "guid": "user-guid-here"
}
```

**Additional Response Fields:**

*   `createdDate`: Account creation timestamp
*   `updatedDate`: Last update timestamp
* * *

### 7\. Get User Profile (Self-Service)

**Query:** `userProfile`
**Description:** Get the authenticated user's own profile. Available to all authenticated users (no role restriction).
**Roles:** Any authenticated user

```plain
query UserProfile {
  userProfile {
    guid
    emailAddress
    name
    phone
    role
    clientStatus
    activated
  }
}
```

**Variables:** None required — uses the token to identify the user
* * *

### 8\. Create Super User

**Mutation:** `createSuperUser`
**Description:** One-time mutation to create the first superuser. No authentication required (bootstrapping endpoint).
**Roles:** No auth required (one-time use)

```plain
mutation CreateSuperUser($createUserInput: CreateUserInput!) {
  createSuperUser(createUserInput: $createUserInput) {
    guid
    emailAddress
    name
    phone
    role
    activated
  }
}
```

**Variables:**

```json
{
  "createUserInput": {
    "emailAddress": "contacto@topdev.mx",
    "name": "Superusuario",
    "password": "your-secure-password",
    "role": "SUPERUSER"
  }
}
```

**Input Fields:**

*   `emailAddress`: User email (must be unique)
*   `name`: Full name
*   `password`: Account password
*   `role`: Must be `SUPERUSER`
* * *

### 9\. Create User

**Mutation:** `createUser`
**Description:** Create a new user account
**Roles:** `ADMIN`

```plain
mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    guid
    emailAddress
    name
    phone
    role
    activated
  }
}
```

**Variables:**

```json
{
  "createUserInput": {
    "emailAddress": "newuser@example.com",
    "name": "New User",
    "role": "ADMIN",
    "phone": "1234567890"
  }
}
```

**Input Fields:**

*   `emailAddress`: User email (must be unique)
*   `name`: Full name
*   `role`: One of ADMIN, RECEPTION, BUYER, CLIENT, CLIENT\_KIOSK
*   `phone`: Phone number (optional)
* * *

### 10\. Update User

**Mutation:** `updateUser`
**Description:** Update an existing user's information (admin manages other users)
**Roles:** `ADMIN`

```plain
mutation UpdateUser($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    message
  }
}
```

**Variables:**

```json
{
  "updateUserInput": {
    "guid": "user-guid-here",
    "name": "Updated Name",
    "emailAddress": "updated@example.com",
    "phone": "9876543210",
    "role": "ADMIN"
  }
}
```

**Input Fields:**

*   `guid`: (required) Target user GUID
*   `name`: Updated name
*   `emailAddress`: Updated email
*   `phone`: Updated phone
*   `role`: Updated role
* * *

### 11\. Update User Profile (Self-Service)

**Mutation:** `updateUserProfile`
**Description:** Allows any authenticated user to update their own profile information
**Roles:** Any authenticated user

```plain
mutation UpdateUserProfile($updateUserProfileInput: UpdateUserProfileInput!) {
  updateUserProfile(updateUserProfileInput: $updateUserProfileInput) {
    message
  }
}
```

**Variables:**

```json
{
  "updateUserProfileInput": {
    "name": "Updated Name",
    "emailAddress": "myemail@example.com",
    "phone": "9876543210"
  }
}
```

**Input Fields:**

*   `name`: Updated name
*   `emailAddress`: Updated email
*   `phone`: Updated phone

> Note: Users cannot change their own role via this endpoint.
* * *

### 12\. Deactivate User

**Mutation:** `deactivateUser`
**Description:** Deactivate a user account (soft delete). Deactivated users cannot log in.
**Roles:** `ADMIN`

```plain
mutation DeactivateUser($guid: String!) {
  deactivateUser(guid: $guid) {
    message
  }
}
```

**Variables:**

```json
{
  "guid": "user-guid-here"
}
```

* * *

### 13\. Activate User

**Mutation:** `activateUser`
**Description:** Reactivate a previously deactivated user account
**Roles:** `ADMIN`

```plain
mutation ActivateUser($guid: String!) {
  activateUser(guid: $guid) {
    message
  }
}
```

**Variables:**

```json
{
  "guid": "user-guid-here"
}
```

* * *

### 14\. Set Client Status

**Mutation:** `setClientStatus`
**Description:** Set the client status for a CLIENT user (STANDARD, VIP, or BLOCKED)
**Roles:** `ADMIN`

```plain
mutation SetClientStatus($setClientStatusInput: SetClientStatusInput!) {
  setClientStatus(setClientStatusInput: $setClientStatusInput) {
    message
  }
}
```

**Variables:**

```json
{
  "setClientStatusInput": {
    "guid": "REPLACE_WITH_USER_GUID",
    "clientStatus": "VIP"
  }
}
```

**Input Fields:**

*   `guid`: (required) Target user GUID
*   `clientStatus`: One of `STANDARD`, `VIP`, `BLOCKED`

**Business Rules:**

*   Only applicable to users with `CLIENT` role
*   `BLOCKED` clients cannot place new sales orders
*   Clients can be auto-blocked by the system when they exceed the `saleCancellationBlockThreshold` configured in Global Config
* * *

## Available Filters Summary

| Filter | Type | Description |
| ---| ---| --- |
| `activated` | `Boolean` | Filter by account active status |
| `role` | `String` | Filter by single role |
| `roles` | `MultipleValues` | Filter by multiple roles using `filterType: ":multiple_values:"` |
| `clientStatus` | `String` | Filter by client status (STANDARD, VIP, BLOCKED) |
| `search` | `String` | Free-text search on name and email |

## Frontend Integration Examples

### React/TypeScript Implementation

```typescript
// Types
interface User {
  guid: string;
  emailAddress: string;
  name: string;
  phone?: string;
  role: 'SUPERUSER' | 'ADMIN' | 'RECEPTION' | 'BUYER' | 'CLIENT' | 'CLIENT_KIOSK';
  clientStatus?: 'STANDARD' | 'VIP' | 'BLOCKED';
  activated: boolean;
  createdDate?: string;
  updatedDate?: string;
}

interface PaginatedUsers {
  data: User[];
  count: number;
}

// GraphQL Queries
const GET_USERS = gql`
  query Users($findUsersArgs: FindUsersArgs!) {
    users(findUsersArgs: $findUsersArgs) {
      data {
        guid
        emailAddress
        name
        phone
        role
        clientStatus
        activated
      }
      count
    }
  }
`;

const GET_USER_PROFILE = gql`
  query UserProfile {
    userProfile {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      activated
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      guid
      emailAddress
      name
      phone
      role
      activated
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      message
    }
  }
`;

const DEACTIVATE_USER = gql`
  mutation DeactivateUser($guid: String!) {
    deactivateUser(guid: $guid) {
      message
    }
  }
`;

const SET_CLIENT_STATUS = gql`
  mutation SetClientStatus($setClientStatusInput: SetClientStatusInput!) {
    setClientStatus(setClientStatusInput: $setClientStatusInput) {
      message
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

// User Management Component
const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [authToken] = useAuth();

  const client = createAuthenticatedClient(authToken);

  const fetchUsers = async (filters?: any) => {
    try {
      const { data } = await client.query({
        query: GET_USERS,
        variables: {
          findUsersArgs: {
            skip: 0,
            limit: 50,
            sort: { column: "createdDate", order: "DESC" },
            ...(filters && { filters })
          }
        }
      });
      setUsers(data.users.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ activated: true });
  }, []);

  return (
    <div className="user-manager">
      <h2>User Management</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <UserTable users={users} onRefresh={fetchUsers} />
      )}
    </div>
  );
};
```

### User CRUD Functions

```typescript
// Create User
const createUser = async (
  emailAddress: string,
  name: string,
  role: string,
  phone?: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        createUserInput: { emailAddress, name, role, phone }
      }
    });
    console.log('User created:', data.createUser);
    await fetchUsers();
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Update User
const updateUser = async (
  guid: string,
  updates: Partial<{ name: string; emailAddress: string; phone: string; role: string }>
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_USER,
      variables: {
        updateUserInput: { guid, ...updates }
      }
    });
    console.log('User updated:', data.updateUser.message);
    await fetchUsers();
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// Deactivate User
const deactivateUser = async (guid: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DEACTIVATE_USER,
      variables: { guid }
    });
    console.log('User deactivated:', data.deactivateUser.message);
    await fetchUsers();
  } catch (error) {
    console.error('Error deactivating user:', error);
  }
};

// Set Client Status
const setClientStatus = async (guid: string, clientStatus: 'STANDARD' | 'VIP' | 'BLOCKED') => {
  try {
    const { data } = await client.mutate({
      mutation: SET_CLIENT_STATUS,
      variables: {
        setClientStatusInput: { guid, clientStatus }
      }
    });
    console.log('Client status updated:', data.setClientStatus.message);
    await fetchUsers();
  } catch (error) {
    console.error('Error setting client status:', error);
  }
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

### Role-Based UI Rendering

```typescript
const RoleBasedActions: React.FC<{ currentUserRole: string }> = ({ currentUserRole }) => {
  const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'SUPERUSER';

  return (
    <div>
      {isAdmin && (
        <>
          <button onClick={() => openCreateUserModal()}>Create User</button>
          <button onClick={() => openManageUsersPanel()}>Manage Users</button>
        </>
      )}
      <button onClick={() => openProfileEditor()}>Edit My Profile</button>
    </div>
  );
};
```

## Key Features for Frontend Implementation

1. **User List with Filters:** Implement filterable user table with role, status, and search filters
2. **Role-Based Access Control:** Show/hide UI elements based on the authenticated user's role
3. **Self-Service Profile:** Allow users to edit their own profile without admin access
4. **Client Management:** Manage client statuses (VIP, BLOCKED) with confirmation dialogs
5. **Activation Toggle:** Deactivate/reactivate users with undo capability
6. **Search:** Full-text search across user names and emails
7. **Pagination:** Server-side pagination with skip/limit for large user lists
8. **Audit Trail:** Display createdDate and updatedDate for user records

# Global Config API Guide

# Global Config API Guide

## Overview

The Global Config API manages platform-wide configuration settings such as inventory limits, purchase percentages, and sale cancellation thresholds. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All global config endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Configuration Fields

| Field | Type | Description |
| ---| ---| --- |
| `inventoryLimit` | `Number` | Maximum inventory stock limit per item |
| `purchasePercentage` | `Float` | Default purchase price percentage (0–1 range, e.g. 0.5 = 50%) |
| `saleCancellationBlockThreshold` | `Number` | Number of cancellations before a client is automatically blocked |

## Available Endpoints

### 1\. Get Global Config

**Query:** `globalConfig`
**Description:** Retrieve the current global configuration. If no config exists yet, one is automatically created with default (empty) values.
**Roles:** Any authenticated user

```graphql
query GlobalConfig {
  globalConfig {
    guid
    config {
      inventoryLimit
      purchasePercentage
      saleCancellationBlockThreshold
    }
    createdDate
    updatedDate
  }
}
```

**Variables:** None required

**Response Fields:**

*   `guid`: Unique config record identifier
*   `config.inventoryLimit`: Maximum inventory stock limit
*   `config.purchasePercentage`: Default purchase price percentage
*   `config.saleCancellationBlockThreshold`: Cancellation count before auto-blocking a client
*   `createdDate`: Record creation timestamp
*   `updatedDate`: Last update timestamp
* * *

### 2\. Update Global Config

**Mutation:** `updateGlobalConfig`
**Description:** Update one or more global configuration values. Only the fields you provide will be updated; omitted fields remain unchanged.
**Roles:** `ADMIN`

```graphql
mutation UpdateGlobalConfig($updateGlobalConfigInput: UpdateGlobalConfigInput!) {
  updateGlobalConfig(updateGlobalConfigInput: $updateGlobalConfigInput) {
    message
  }
}
```

**Variables:**

```json
{
  "updateGlobalConfigInput": {
    "inventoryLimit": 100,
    "purchasePercentage": 0.5,
    "saleCancellationBlockThreshold": 3
  }
}
```

**Input Fields:**

*   `inventoryLimit`: (optional) New inventory limit value
*   `purchasePercentage`: (optional) New purchase percentage (0–1 range)
*   `saleCancellationBlockThreshold`: (optional) New cancellation threshold before auto-block

**Business Rules:**

*   All fields are optional — only provided fields are updated
*   The config is a singleton record (one per platform)
*   If no config exists when updating, one is created first
*   `purchasePercentage` is used by the Purchases module to calculate default purchase prices
*   `saleCancellationBlockThreshold` is used by the Sales module to auto-block clients who exceed the cancellation limit
* * *

## Frontend Integration Examples

### React/TypeScript Implementation

```typescript
// Types
interface GlobalConfigData {
  inventoryLimit: number;
  purchasePercentage: number;
  saleCancellationBlockThreshold: number;
}

interface GlobalConfig {
  guid: string;
  config: GlobalConfigData;
  createdDate: string;
  updatedDate: string;
}

// GraphQL Queries
const GET_GLOBAL_CONFIG = gql`
  query GlobalConfig {
    globalConfig {
      guid
      config {
        inventoryLimit
        purchasePercentage
        saleCancellationBlockThreshold
      }
      createdDate
      updatedDate
    }
  }
`;

const UPDATE_GLOBAL_CONFIG = gql`
  mutation UpdateGlobalConfig($updateGlobalConfigInput: UpdateGlobalConfigInput!) {
    updateGlobalConfig(updateGlobalConfigInput: $updateGlobalConfigInput) {
      message
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

// Global Config Component
const GlobalConfigManager: React.FC = () => {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken] = useAuth();

  const client = createAuthenticatedClient(authToken);

  const fetchConfig = async () => {
    try {
      const { data } = await client.query({
        query: GET_GLOBAL_CONFIG
      });
      setConfig(data.globalConfig);
    } catch (error) {
      console.error('Error fetching global config:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="config-manager">
      <h2>Platform Configuration</h2>
      {loading ? (
        <div>Loading configuration...</div>
      ) : config ? (
        <ConfigForm config={config} onSave={fetchConfig} />
      ) : (
        <div>No configuration found</div>
      )}
    </div>
  );
};
```

### Config Update Functions

```typescript
// Update Global Config
const updateGlobalConfig = async (
  updates: Partial<GlobalConfigData>
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_GLOBAL_CONFIG,
      variables: {
        updateGlobalConfigInput: updates
      }
    });
    console.log('Config updated:', data.updateGlobalConfig.message);
    await fetchConfig();
  } catch (error) {
    console.error('Error updating config:', error);
  }
};

// Update individual fields
const updateInventoryLimit = (limit: number) =>
  updateGlobalConfig({ inventoryLimit: limit });

const updatePurchasePercentage = (percentage: number) =>
  updateGlobalConfig({ purchasePercentage: percentage });

const updateCancellationThreshold = (threshold: number) =>
  updateGlobalConfig({ saleCancellationBlockThreshold: threshold });
```

### Config Settings Form

```typescript
const ConfigForm: React.FC<{ config: GlobalConfig; onSave: () => void }> = ({ config, onSave }) => {
  const [formData, setFormData] = useState({
    inventoryLimit: config.config.inventoryLimit || 0,
    purchasePercentage: config.config.purchasePercentage || 0,
    saleCancellationBlockThreshold: config.config.saleCancellationBlockThreshold || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGlobalConfig(formData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="config-form">
      <h3>Platform Settings</h3>
      <div>
        <label>Inventory Limit</label>
        <input
          type="number"
          value={formData.inventoryLimit}
          onChange={(e) => setFormData({...formData, inventoryLimit: parseInt(e.target.value)})}
          min="0"
        />
      </div>
      <div>
        <label>Purchase Percentage</label>
        <input
          type="number"
          step="0.01"
          value={formData.purchasePercentage}
          onChange={(e) => setFormData({...formData, purchasePercentage: parseFloat(e.target.value)})}
          min="0"
          max="1"
        />
      </div>
      <div>
        <label>Cancellation Block Threshold</label>
        <input
          type="number"
          value={formData.saleCancellationBlockThreshold}
          onChange={(e) => setFormData({...formData, saleCancellationBlockThreshold: parseInt(e.target.value)})}
          min="0"
        />
      </div>
      <button type="submit">Save Configuration</button>
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

### Permission Check

```typescript
const canEditConfig = (userRole: string): boolean => {
  return userRole === 'ADMIN' || userRole === 'SUPERUSER';
};
```

## Key Features for Frontend Implementation

1. **Read-Only for Non-Admins:** All authenticated users can view the config, but only ADMIN/SUPERUSER can edit
2. **Partial Updates:** Only send the fields you want to change — no need to send the full config
3. **Validation:** Ensure `purchasePercentage` stays within 0–1 range and thresholds are positive integers
4. **Confirmation Dialog:** Prompt confirmation before saving config changes since they affect platform-wide behavior
5. **Audit Display:** Show `createdDate` and `updatedDate` so admins know when config was last modified
6. **Cross-Module Impact:** Clearly label which settings affect which modules (Purchases, Sales, Inventory)