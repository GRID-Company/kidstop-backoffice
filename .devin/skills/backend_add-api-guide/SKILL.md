---
name: backend_add-api-guide
description: Step-by-step guide to create an API Guide markdown document for a new GraphQL module, covering required sections, TypeScript interfaces, response examples, business rules, and error handling.
---

# Adding an API Guide

API Guides live in `api-guides/` at the root of the project. Each module gets one file named `{Module}API.md` (e.g. `ServiceOrdersAPI.md`, `ProjectsAPI.md`).

They serve as the **frontend integration contract**: a developer should be able to implement the full UI for a module by reading only this file.

---

## File Location & Naming

```
api-guides/
└── {Module}API.md      e.g. ServiceOrdersAPI.md
```

---

## Required Sections (in order)

### 1. Title & Overview

```markdown
# {Module} GraphQL API - Frontend Integration Guide

## Overview

One-paragraph description of what this API manages.

**Base Endpoint**: Your GraphQL endpoint (typically `/graphql`)

**Authentication**: All queries and mutations require JWT authentication.
(Add role restriction note if applicable.)
```

---

### 2. Table of Contents

Always include a ToC with anchor links to every query and mutation, plus the structural sections at the bottom:

```markdown
## Table of Contents

- [Queries](#queries)
  - [List {Entities} (with search and filters)](#list-{entities})
  - [Get Single {Entity}](#get-single-{entity})
- [Mutations](#mutations)
  - [Create {Entity}](#create-{entity})
  - [Update {Entity}](#update-{entity})
  - [Delete {Entity}](#delete-{entity})
  - (lifecycle mutations if any)
- [Types & Data Structures](#types--data-structures)
- [Search & Filtering](#search--filtering)
- [Status Lifecycle](#status-lifecycle)   ← only if module has statuses
```

---

### 3. Queries

#### 3a. List Query

For each query, provide:

1. **Short description**
2. **Query Name** (the resolver field name, e.g. `serviceOrders`)
3. **GraphQL Schema** block — full query with all relevant fields
4. **Variables Example** — at least three: basic pagination, with search, with filters
5. **TypeScript Interface** — `Find{Entities}Args` + the enum if applicable
6. **Response Example** — realistic JSON with Mexican context values

**GraphQL schema block template:**
```graphql
query {Entities}($find{Entities}Args: Find{Entities}Args!) {
  {entities}(find{Entities}Args: $find{Entities}Args) {
    data {
      guid
      # ... all entity fields
      client { guid name contact { name phone emailAddress } }
      agent  { guid name emailAddress }
      clientAddress { street postalCode suburb exteriorNumber interiorNumber city state alias }
      createdDate
      updatedDate
    }
    count
  }
}
```

**TypeScript Interface template:**
```typescript
interface Find{Entities}Args {
  limit: number;
  skip: number;
  sort: {
    column: 'field1' | 'field2' | 'clientName' | 'agentName' | 'createdDate' | 'updatedDate';
    order: 'ASC' | 'DESC';
  };
  search?: string; // document which fields are searched
  filters?: {
    status?: MyStatus;
    agentGuid?: string;
    clientGuid?: string;
    dateFrom?: string; // YYYY-MM-DD
    dateTo?: string;
    // ... other filters
  };
}
```

#### 3b. Detail Query

Same structure but returns a single entity. Expose more nested fields (e.g. `client.contact`, `createdBy.name`, `updatedBy.name`). Variables are just `{ "guid": "..." }`.

---

### 4. Mutations

For each mutation, provide:

1. **Short description**
2. **Mutation Name** (resolver field name)
3. **GraphQL Schema** block
4. **Variables** (may have multiple examples for different use cases)
5. **TypeScript Interface** for the input
6. **Response Example** (always JSON, even for `GenericOutput`)
7. **Business Rules** — bullet list of validation, defaults, error conditions

#### Return types

- **Create** → returns the full entity (so the frontend can immediately populate the UI)
- **Update / Delete / Lifecycle** → returns `GenericOutput`:
  ```graphql
  {
    success
    message
  }
  ```

#### Input interface template (create):
```typescript
interface Create{Entity}Input {
  requiredField: string;       // Required
  date: string;                // Required, format: YYYY-MM-DD
  budget: number;              // Required
  clientGuid: string;          // Required, reference to existing Client
  agentGuid: string;           // Required, reference to existing User
  optionalField?: string;      // Optional
  clientAddress: AddressInput; // Required
}
```

#### Input interface template (update):
```typescript
interface Update{Entity}Input {
  guid: string;               // Required
  requiredField?: string;     // all optional except guid
  date?: string;
  budget?: number;
  clientGuid?: string;
  agentGuid?: string;
  status?: MyStatus;
  clientAddress?: AddressInput;
}
```

#### Business Rules block

Always document:
- Auto-generated fields (format + logic)
- Default values on creation
- Validation rules (date ranges, required-when conditions)
- FK existence checks (client, agent) and their error
- Status transition rules if status is in input

---

### 5. Types & Data Structures

Provide TypeScript interfaces for every type used in the API:

- The main entity interface (all fields, optional marked with `?`)
- The status enum (if present)
- `Address` interface (reused across modules)

```typescript
interface {Entity} {
  guid: string;
  status: {Entity}Status;
  name: string;
  // ...all fields...
  client: Client;
  agent: User;
  clientAddress: Address;
  createdDate: string;
  updatedDate: string;
  createdBy?: User;
  updatedBy?: User;
}

enum {Entity}Status {
  PENDING = "PENDING",
  // ...
}

interface Address {
  street: string;
  postalCode: string;
  suburb: string;
  exteriorNumber: string;
  interiorNumber?: string;
  city: string;
  state: string;
  alias?: string;
}
```

---

### 6. Search & Filtering

#### Search Functionality

List **every field** the `search` parameter matches against, with the ILIKE note:

```markdown
The `search` parameter searches in (case-insensitive, `ILIKE`):
- **Field A** (`columnName`) — e.g., "SRV-2026"
- **Field B** (`name`)
- **Client name** (`client.name`)
- **Agent name** (`agent.name`)
```

Show 2 concrete examples.

#### Filter Options

Reproduce the full filter TypeScript interface with inline comments.

Show 2 filter examples in JSON.

#### Sorting Options

Provide a Markdown table:

| Column | Description |
|---|---|
| `fieldName` | What it sorts by |
| `clientName` | Client name (joined column) |
| `agentName` | Agent name (joined column) |
| `createdDate` | Creation date |
| `updatedDate` | Last update date |

> Note: `clientName` and `agentName` are **joined columns** — they sort on the related table, not a local column.

---

### 7. Status Lifecycle (if applicable)

#### ASCII Flow Diagram

```
STATE_A
  ├─→ STATE_B     (via dedicatedMutation or updateX)
  └─→ CANCELLED   (terminal)

STATE_B
  ├─→ COMPLETED   (terminal)
  └─→ CANCELLED   (terminal)

COMPLETED  (terminal — no further transitions)
CANCELLED  (terminal — no further transitions)
```

#### Status Descriptions

Short bullet for each status value.

#### Dedicated vs. Generic Transitions table (if module has lifecycle mutations)

| Transition | Dedicated Mutation | Also via `update{Entity}` |
|---|---|---|
| `A → B` | `startX` | ✅ |
| `B → COMPLETED` | `completeX` | ✅ |

---

### 8. Error Handling

Document **every distinct error** the API can return, with its HTTP-style code and message text:

| Error | Message | Code |
|---|---|---|
| Entity not found | `"Orden de servicio no encontrada."` | `NOT_FOUND` |
| Client not found | `"Cliente no encontrado."` | `NOT_FOUND` |
| Agent not found | `"Agente no encontrado."` | `NOT_FOUND` |
| Invalid transition | `"Transición de estado inválida: X → Y."` | `BAD_REQUEST` |
| Terminal state | `"No se puede cancelar una orden en estado COMPLETED."` | `BAD_REQUEST` |
| Period validation | `"periodEndDate debe ser posterior a periodStartDate."` | `BAD_REQUEST` |
| Unauthorized | `"Unauthorized"` | `UNAUTHENTICATED` |

Format each as a fenced JSON block:
```json
{
  "errors": [
    {
      "message": "The exact error message from the service.",
      "extensions": { "code": "NOT_FOUND" }
    }
  ]
}
```

---

## Content Quality Checklist

- [ ] All GQL field names match the actual resolver/entity (copy from source, don't guess)
- [ ] Date fields documented as `YYYY-MM-DD`
- [ ] GQL uses `UUID!` type for `guid` arguments (not `String!`)
- [ ] Paginated list returns `{ data { ... } count }` — never `items` or `total`
- [ ] `GenericOutput` returns `{ success message }` — not just `{ message }`
- [ ] Every FK input uses `Guid` suffix (e.g. `clientGuid`, `agentGuid`)
- [ ] Response examples use realistic Spanish/Mexican context values (names, addresses, etc.)
- [ ] `serviceId`-style auto IDs show the real format (e.g. `SRV-2026000001`)
- [ ] Business rules bullet list covers: defaults, required-when conditions, FK checks, date validations
- [ ] All errors extracted from the actual service throw statements (not guessed)
