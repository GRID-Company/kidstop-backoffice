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

- Each buyer has one budget per TCG (unique constraint: buyerId + tcg)
- `assignedAmount`: The monthly budget limit set by ADMIN
- `usedAmount`: Computed at query time — sum of `total` from the buyer's purchases with status IN (QUOTED, WAITING_PRICE, FINALIZED) for that TCG in the current calendar month
- `utilization`: Computed as `usedAmount / assignedAmount` (percentage)
- Budget resets automatically every calendar month
- ADMIN users have unlimited budget (no budget tracking) — ADMIN users don't have BuyerBudget records since budgets are only created for users with the BUYER role

---

## Available Endpoints

### 1. Get All Buyer Budgets

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

- `guid`: Unique budget identifier
- `tcg`: Trading card game type (POKEMON or MAGIC)
- `assignedAmount`: Monthly budget limit
- `usedAmount`: Amount used in the current calendar month
- `utilization`: Usage percentage (usedAmount / assignedAmount)
- `buyer`: The buyer user info (guid, name, emailAddress)

---

### 2. Get Single Buyer Budget

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

- Same as list endpoint, scoped to a single buyer + TCG combination

---

### 3. Create or Update Buyer Budget

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

- `buyerGuid`: Required — GUID of a user with BUYER role
- `tcg`: Required — POKEMON or MAGIC
- `assignedAmount`: Required — monthly budget limit (decimal)

**Rules:**

- If no budget exists for this buyer + tcg, one is created
- If a budget already exists, only `assignedAmount` is updated
- The buyer must have the BUYER role

---

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

---

## Error Handling & Notes

- **Buyer not found:** Returns error if the buyerGuid doesn't match an existing BUYER user
- **BUYER access restriction:** A BUYER can only query their own budget via `buyerBudget`, not other buyers'
- **Budget warnings are non-blocking:** Exceeding the budget raises a warning but does not prevent purchase creation or status transitions
