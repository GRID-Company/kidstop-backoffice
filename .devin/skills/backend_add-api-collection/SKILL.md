---
name: backend_add-api-collection
description: Step-by-step guide to create a Bruno API collection for a new GraphQL module in this backend, covering file structure, YAML format, query/mutation patterns, and conventions for all operation types.
---

# Adding an API Collection

This collection uses **Bruno** (OpenCollection 1.0.0). Each request is a standalone `.yml` file inside a folder under `api-collection/`.

---

## Directory Structure

```
api-collection/
└── {module}/
    ├── get-{entities}.yml                     ← seq: 1  — paginated list
    ├── get-{entities}-with-filters.yml        ← seq: 2  — list + filters
    ├── get-{entities}-with-search.yml         ← seq: 3  — list + search
    ├── get-{entity}-detail.yml                ← seq: 4  — single item detail
    ├── create-{entity}.yml                    ← seq: 5  — create
    ├── update-{entity}.yml                    ← seq: 6  — partial update
    ├── delete-{entity}.yml                    ← seq: last — soft delete
    └── (extra mutations per lifecycle need)
```

The `seq` field controls ordering inside Bruno's sidebar. Use consecutive integers starting at 1.

---

## File Anatomy

Every `.yml` file follows this structure:

```yaml
info:
  name: operation-name-kebab-case   # matches filename (without .yml)
  type: graphql
  seq: 1                            # order in Bruno sidebar

graphql:
  method: POST
  url: "{{base_url}}"
  headers:
    - name: Authorization
      value: "Bearer {{auth_token}}"
  body:
    query: |-
      # GraphQL operation here
    variables: |-
      # JSON variables here

settings:
  encodeUrl: true
  timeout: 0
  followRedirects: true
  maxRedirects: 5
```

Variables `{{base_url}}` and `{{auth_token}}` come from Bruno environments — never hardcode them.

---

## Pattern: Paginated List Query

```yaml
info:
  name: get-{entities}
  type: graphql
  seq: 1

graphql:
  method: POST
  url: "{{base_url}}"
  headers:
    - name: Authorization
      value: "Bearer {{auth_token}}"
  body:
    query: |-
      query {Entities}($find{Entities}Args: Find{Entities}Args!) {
        {entities}(find{Entities}Args: $find{Entities}Args) {
          data {
            guid
            # ... entity fields
            client {
              guid
              name
            }
            agent {
              guid
              name
            }
            createdDate
            updatedDate
          }
          count
        }
      }
    variables: |-
      {
        "find{Entities}Args": {
          "limit": 10,
          "skip": 0,
          "sort": {
            "column": "createdDate",
            "order": "DESC"
          }
        }
      }

settings:
  encodeUrl: true
  timeout: 0
  followRedirects: true
  maxRedirects: 5
```

---

## Pattern: List with Filters

Same query as the base list, add `"filters"` to variables:

```yaml
    variables: |-
      {
        "find{Entities}Args": {
          "limit": 10,
          "skip": 0,
          "sort": {
            "column": "createdDate",
            "order": "DESC"
          },
          "filters": {
            "status": "PENDING"
          }
        }
      }
```

You can trim the returned fields to only what's relevant for filtered views.

---

## Pattern: List with Search

Add `"search"` to variables; no `"filters"` needed:

```yaml
    variables: |-
      {
        "find{Entities}Args": {
          "limit": 10,
          "skip": 0,
          "sort": {
            "column": "createdDate",
            "order": "DESC"
          },
          "search": "keyword"
        }
      }
```

---

## Pattern: Detail Query

Return the full object including nested relations and `createdBy`/`updatedBy` from `BaseEntity`:

```yaml
  body:
    query: |-
      query {Entity}($guid: UUID!) {
        {entity}(guid: $guid) {
          guid
          # ... all fields
          client {
            guid
            name
            contact {
              name
              phone
              emailAddress
            }
          }
          agent {
            guid
            name
            emailAddress
          }
          createdBy {
            name
          }
          updatedBy {
            name
          }
          createdDate
          updatedDate
        }
      }
    variables: |-
      {
        "guid": "00000000-0000-0000-0000-000000000000"
      }
```

---

## Pattern: Create Mutation

Returns the created entity (not `GenericOutput`):

```yaml
  body:
    query: |-
      mutation Create{Entity}($input: Create{Entity}Input!) {
        create{Entity}(input: $input) {
          guid
          # ... key fields to confirm creation
          createdDate
        }
      }
    variables: |-
      {
        "input": {
          "name": "Example Name",
          "clientGuid": "00000000-0000-0000-0000-000000000000",
          "agentGuid": "00000000-0000-0000-0000-000000000000",
          "clientAddress": {
            "street": "Av. Insurgentes Sur",
            "postalCode": "03100",
            "suburb": "Del Valle",
            "exteriorNumber": "1500",
            "city": "Ciudad de México",
            "state": "CDMX"
          }
        }
      }
```

Use realistic placeholder values in Spanish/Mexican context (street names, city, state, etc.).

---

## Pattern: Update Mutation

Returns `GenericOutput` (`{ success, message }`). Only include the fields being changed; all update fields are optional except `guid`:

```yaml
  body:
    query: |-
      mutation Update{Entity}($input: Update{Entity}Input!) {
        update{Entity}(input: $input) {
          success
          message
        }
      }
    variables: |-
      {
        "input": {
          "guid": "00000000-0000-0000-0000-000000000000",
          "name": "Updated Name"
        }
      }
```

---

## Pattern: Simple guid Mutation (lifecycle transitions / delete)

Used for `start`, `complete`, `cancel`, `delete`, or any action that takes only a `guid`:

```yaml
  body:
    query: |-
      mutation {Action}{Entity}($guid: UUID!) {
        {action}{Entity}(guid: $guid) {
          success
          message
        }
      }
    variables: |-
      {
        "guid": "00000000-0000-0000-0000-000000000000"
      }
```

Create one file per lifecycle action (e.g. `start-service-order.yml`, `complete-service-order.yml`, `cancel-service-order.yml`).

---

## Naming Conventions

| Concept | Convention | Example |
|---|---|---|
| Folder | `kebab-case`, plural | `service-orders/` |
| Filename | `verb-entity.yml` | `create-service-order.yml` |
| `info.name` | same as filename (no `.yml`) | `create-service-order` |
| GQL operation name | `PascalCase` | `CreateServiceOrder` |
| GQL resolver field | `camelCase` | `createServiceOrder` |
| GQL args variable | `$find{Entities}Args` | `$findServiceOrdersArgs` |
| GQL input variable | `$input` | `$input` |

---

## Typical seq Order for a Full CRUD Module

| seq | File | Notes |
|---|---|---|
| 1 | `get-{entities}.yml` | Base list |
| 2 | `get-{entities}-with-filters.yml` | List + status/date filters |
| 3 | `get-{entities}-with-search.yml` | List + text search |
| 4 | `get-{entity}-detail.yml` | Full detail |
| 5 | `create-{entity}.yml` | Basic create |
| 6+ | extra create variants (e.g. with period) | Optional |
| 7 | `update-{entity}.yml` | Partial update |
| 8+ | lifecycle mutations | start, complete, cancel… |
| last | `delete-{entity}.yml` | Soft delete |
