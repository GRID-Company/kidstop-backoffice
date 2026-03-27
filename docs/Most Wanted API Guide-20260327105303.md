# Most Wanted API Guide

# Most Wanted Cards API Guide

## Overview

The Most Wanted Cards API allows the business to maintain curated lists of cards they are actively seeking to purchase from clients. Each list is scoped to a single TCG (Pokemon or Magic) and can be displayed publicly to customers. Only ADMIN users can manage the Most Wanted lists, but the public endpoints are accessible without authentication.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for admin endpoints only

## Authentication

Admin endpoints require a Bearer token in the Authorization header:

```css
Authorization: Bearer {{auth_token}}
```

Public endpoints (`mostWantedPokemonCards`, `mostWantedMagicCards`) do not require authentication.

## Key Concepts

### Roles & Permissions

*   **PUBLIC (No Auth):** Can view active most wanted cards for Pokemon and Magic
*   **ADMIN:** Can view all most wanted cards (including inactive), add/update/remove cards, and reorder priorities

### Supported TCGs

*   `POKEMON`
*   `MAGIC`

### Priority Levels

Cards are organized by priority to indicate urgency:

*   `HIGH` — Highest priority, displayed first
*   `MEDIUM` — Default priority for new cards
*   `LOW` — Lower priority, displayed last

Multiple cards can share the same priority level. Within the same priority, cards are sorted by creation date (newest first).

### Active Status

*   **Active cards** (`active: true`) — Displayed in public endpoints
*   **Inactive cards** (`active: false`) — Hidden from public view, only visible to admins
* * *

## Available Endpoints

### 1\. Get Most Wanted Pokemon Cards (Public)

**Query:** `mostWantedPokemonCards`
**Description:** Retrieve all active Pokemon cards from the Most Wanted list
**Access:** PUBLIC (no authentication required)

```plain
query MostWantedPokemonCards {
  mostWantedPokemonCards {
    guid
    tcg
    priority
    active
    notes
    pokemonCardSummary {
      guid
      name
      setName
      setCode
      cardNumber
      rarity
      imageUri
    }
    createdDate
    updatedDate
  }
}
```

**No variables needed**

**Response:** Array of active Pokemon most wanted cards, sorted by priority (HIGH → MEDIUM → LOW), then by creation date (newest first)

**Notes:**

*   No authentication required
*   Only returns active cards
*   No pagination (Most Wanted lists are kept reasonably small)
* * *

### 2\. Get Most Wanted Magic Cards (Public)

**Query:** `mostWantedMagicCards`
**Description:** Retrieve all active Magic cards from the Most Wanted list
**Access:** PUBLIC (no authentication required)

```plain
query MostWantedMagicCards {
  mostWantedMagicCards {
    guid
    tcg
    priority
    active
    notes
    magicCardSummary {
      guid
      name
      edition
      collectorNumber
      rarity
      imageUri
      isFoil
    }
    createdDate
    updatedDate
  }
}
```

**No variables needed**

**Response:** Array of active Magic most wanted cards, sorted by priority (HIGH → MEDIUM → LOW), then by creation date (newest first)

**Notes:**

*   No authentication required
*   Only returns active cards
*   No pagination (Most Wanted lists are kept reasonably small)
* * *

### 3\. Get Most Wanted Cards (Admin List)

**Query:** `mostWantedCards`
**Description:** Retrieve paginated list of most wanted cards with filters and search (admin only)
**Access:** ADMIN only

```plain
query MostWantedCards($findMostWantedCardsArgs: FindMostWantedCardsArgs!) {
  mostWantedCards(findMostWantedCardsArgs: $findMostWantedCardsArgs) {
    data {
      guid
      tcg
      priority
      active
      notes
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
  "findMostWantedCardsArgs": {
    "skip": 0,
    "limit": 20,
    "sort": {
      "column": "priority",
      "order": "ASC"
    },
    "filters": {
      "tcg": "POKEMON"
    }
  }
}
```

**Variables with Search and Filters:**

```json
{
  "findMostWantedCardsArgs": {
    "skip": 0,
    "limit": 20,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "search": "Charizard",
    "filters": {
      "tcg": "POKEMON",
      "active": true
    }
  }
}
```

**Available Filters:**

*   `tcg`: Required — Trading card game type (POKEMON, MAGIC)
*   `active`: Optional — Filter by active status (true/false)

**Search:** Searches across Pokemon card `titleName`, Magic card `name`, and `notes` field

**Sortable Columns:**

*   `priority` — Sort by priority level
*   `createdDate` — Sort by creation date
*   `active` — Sort by active status
* * *

### 4\. Get Most Wanted Card Detail (Admin)

**Query:** `mostWantedCard`
**Description:** Get detailed information about a specific most wanted card
**Access:** ADMIN only

```plain
query MostWantedCard($mostWantedCardGuid: String!) {
  mostWantedCard(mostWantedCardGuid: $mostWantedCardGuid) {
    guid
    tcg
    priority
    active
    notes
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
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "mostWantedCardGuid": "MOST_WANTED_CARD_GUID"
}
```

* * *

### 5\. Add Most Wanted Card

**Mutation:** `addMostWantedCard`
**Description:** Add a card to the Most Wanted list
**Access:** ADMIN only

```plain
mutation AddMostWantedCard($addMostWantedCardInput: AddMostWantedCardInput!) {
  addMostWantedCard(addMostWantedCardInput: $addMostWantedCardInput) {
    guid
    tcg
    priority
    active
    notes
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
    createdDate
    updatedDate
  }
}
```

**Variables (Pokemon card):**

```json
{
  "addMostWantedCardInput": {
    "tcg": "POKEMON",
    "cardGuid": "POKEMON_CARD_GUID",
    "priority": "HIGH",
    "active": true,
    "notes": "Looking for mint condition only"
  }
}
```

**Variables (Magic card):**

```json
{
  "addMostWantedCardInput": {
    "tcg": "MAGIC",
    "cardGuid": "MAGIC_CARD_GUID",
    "priority": "MEDIUM",
    "active": true,
    "notes": "Need 3 copies"
  }
}
```

**Input Fields:**

*   `tcg`: Required — POKEMON or MAGIC
*   `cardGuid`: Required — GUID of the Pokemon or Magic card (based on `tcg`)
*   `priority`: Optional — HIGH, MEDIUM, or LOW (defaults to MEDIUM)
*   `active`: Optional — Boolean (defaults to true)
*   `notes`: Optional — Additional context or requirements

**Rules:**

*   Card must exist in the catalog
*   Card cannot already be in the Most Wanted list for that TCG
*   TCG must match the card type (Pokemon card → POKEMON, Magic card → MAGIC)
*   If priority is not provided, defaults to MEDIUM
*   Multiple cards can have the same priority level
* * *

### 6\. Update Most Wanted Card

**Mutation:** `updateMostWantedCard`
**Description:** Update priority, active status, or notes for a most wanted card
**Access:** ADMIN only

```plain
mutation UpdateMostWantedCard($updateMostWantedCardInput: UpdateMostWantedCardInput!) {
  updateMostWantedCard(updateMostWantedCardInput: $updateMostWantedCardInput) {
    guid
    tcg
    priority
    active
    notes
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
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "updateMostWantedCardInput": {
    "mostWantedCardGuid": "MOST_WANTED_CARD_GUID",
    "priority": "LOW",
    "active": false,
    "notes": "No longer needed - sufficient stock"
  }
}
```

**Input Fields:**

*   `mostWantedCardGuid`: Required — GUID of the most wanted card to update
*   `priority`: Optional — HIGH, MEDIUM, or LOW
*   `active`: Optional — Boolean
*   `notes`: Optional — Updated notes

**Rules:**

*   All fields except `mostWantedCardGuid` are optional
*   Only provided fields are updated
*   Cannot change the card itself or TCG (would require remove + add)
* * *

### 7\. Remove Most Wanted Card

**Mutation:** `removeMostWantedCard`
**Description:** Remove a card from the Most Wanted list
**Access:** ADMIN only

```plain
mutation RemoveMostWantedCard($mostWantedCardGuid: String!) {
  removeMostWantedCard(mostWantedCardGuid: $mostWantedCardGuid)
}
```

**Variables:**

```json
{
  "mostWantedCardGuid": "MOST_WANTED_CARD_GUID"
}
```

**Returns:** `true` on success

**Rules:**

*   Permanently removes the card from the Most Wanted list
*   No priority adjustments needed (enum-based priorities don't have gaps)
* * *

### 8\. Reorder Most Wanted Cards (Bulk Priority Update)

**Mutation:** `reorderMostWantedCards`
**Description:** Update priorities for multiple cards in a single operation
**Access:** ADMIN only

```plain
mutation ReorderMostWantedCards($reorderMostWantedCardsInput: ReorderMostWantedCardsInput!) {
  reorderMostWantedCards(reorderMostWantedCardsInput: $reorderMostWantedCardsInput)
}
```

**Variables:**

```json
{
  "reorderMostWantedCardsInput": {
    "tcg": "POKEMON",
    "cardOrders": [
      {
        "mostWantedCardGuid": "CARD_GUID_1",
        "priority": "HIGH"
      },
      {
        "mostWantedCardGuid": "CARD_GUID_2",
        "priority": "HIGH"
      },
      {
        "mostWantedCardGuid": "CARD_GUID_3",
        "priority": "MEDIUM"
      },
      {
        "mostWantedCardGuid": "CARD_GUID_4",
        "priority": "LOW"
      }
    ]
  }
}
```

**Input Fields:**

*   `tcg`: Required — POKEMON or MAGIC
*   `cardOrders`: Required — Array of objects with:
    *   `mostWantedCardGuid`: Required — GUID of the card to update
    *   `priority`: Required — HIGH, MEDIUM, or LOW

**Returns:** `true` on success

**Rules:**

*   All provided cards must belong to the specified TCG
*   Multiple cards can have the same priority level
*   Cards not included in the operation keep their existing priorities
*   Useful for bulk reorganization of the Most Wanted list
* * *

## Typical Workflows

### Customer Workflow (Public)

1. **View Most Wanted** — Customer visits the website and views the public most wanted list
2. **Identify cards** — Customer sees which cards the business is actively seeking
3. **Bring cards** — Customer brings matching cards to the store for purchase evaluation

### Admin Workflow (Backoffice)

1. **Add new cards** — Admin adds high-demand cards to the Most Wanted list
2. **Set priorities** — Admin assigns HIGH priority to urgent needs, MEDIUM to regular needs
3. **Update notes** — Admin adds context like "Need 5 copies" or "Mint only"
4. **Reorder priorities** — Admin uses bulk reorder when priorities change
5. **Deactivate cards** — Admin sets cards to inactive when sufficient stock is acquired
6. **Remove cards** — Admin removes cards that are no longer needed
* * *

## Business Rules Summary

*   **Uniqueness:** Each card can only appear once per TCG in the Most Wanted list
*   **Priority sorting:** HIGH cards appear first, then MEDIUM, then LOW
*   **Active filtering:** Public endpoints only show active cards
*   **TCG consistency:** Pokemon cards must use `tcg: POKEMON`, Magic cards must use `tcg: MAGIC`
*   **Default values:** New cards default to MEDIUM priority and active status
*   **Multiple same priority:** Multiple cards can share the same priority level
* * *

## Error Handling & Notes

*   **Duplicate card** — Adding a card that already exists in the Most Wanted list for that TCG returns a `BadRequestException`
*   **Card not found** — Adding a card with an invalid GUID returns a not-found error
*   **TCG mismatch** — Adding a Pokemon card with `tcg: MAGIC` (or vice versa) returns a validation error
*   **Unauthorized access** — Non-ADMIN users attempting admin operations receive a `ForbiddenException`
*   **Invalid priority** — Providing an invalid priority value returns a validation error
*   **Reorder TCG mismatch** — If any card in the reorder operation doesn't match the specified TCG, the entire operation fails