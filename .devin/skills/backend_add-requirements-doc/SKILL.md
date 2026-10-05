---
name: backend_add-requirements-doc
description: Step-by-step guide to write an API Requirements document for a new module, covering the exact structure, sections, and level of detail used in this codebase.
---

# Adding a Requirements Document

Requirements documents live in `docs/Requirements/` and are named `{Module}-requirements.md` (e.g. `ServiceOrders-requirements.md`, `Proyects-requirements.md`).

They serve as the **implementation contract between product and engineering**: a developer should be able to implement the full backend module by reading only this file. They are also read by AI agents to bootstrap implementation, so precision is essential.

---

## File Location & Naming

```
docs/Requirements/
└── {Module}-requirements.md      e.g. ServiceOrders-requirements.md
```

---

## Required Sections (in order)

### 1. Title

```markdown
# {Module} Requirements
```

---

### 2. Overview

A short bulleted list (3–6 items) that conveys:

- What the entity represents in business terms
- The auto-generated human-readable ID format (if any)
- The status lifecycle summary (if any)
- Key relationships to other entities
- Any important independence/disambiguation note (e.g. "this module is independent from X")

```markdown
## Overview

- The system manages ... A **{Entity}** represents ...
- Each {entity} has an auto-generated human-readable ID (`PRE-{YYYY}{6-digit-number}`), a status lifecycle (...), and an assigned agent.
- {Entities} track ...
- Optionally, ...
- This module is independent from the existing **X** module.
```

---

### 3. Entity Data Model

#### 3a. Main entity

Header: `### {Entity} (inherits from BaseEntity)`

List every field as:
```
- fieldName: type (required|nullable, unique?) — description. Include format/examples when relevant.
```

Always include:
- The auto-generated ID field with its exact format and example values
- The status enum field with its default value
- All date fields with their nullable/required rules
- FK fields in pairs: the relation (`client: Client`) AND the column (`clientId: number (FK column)`)
- Boolean flags with their default value
- JSONB fields with their type reference

**Example:**
```markdown
### ServiceOrder (inherits from BaseEntity)
- serviceId: string (required, unique, auto-generated) — human-readable ID, format `SRV-{YYYY}{6-digit-zero-padded}` (e.g. `SRV-2026000001`). Counter resets every year.
- status: ServiceStatus enum (required, default PENDING)
- name: string (required) — service order name/title.
- assignedDate: date (required) — delivery/due date.
- budget: float (required)
- client: Client (ManyToOne, required)
- clientId: number (FK column)
- agent: User (ManyToOne, required) — any user role accepted.
- agentId: number (FK column)
- hasPeriod: boolean (required, default false)
- periodStartDate: date (nullable) — required when hasPeriod is true; null when false.
- periodEndDate: date (nullable) — required when hasPeriod is true; null when false.
- clientAddress: jsonb (Address, required)
```

#### 3b. JSONB / nested types

Document inline with a fenced block:

```markdown
### Address type (JSONB)
\`\`\`
{
  street: string (required)
  postalCode: string (required)
  suburb: string (required)
  exteriorNumber: string (required)
  interiorNumber: string (optional)
  city: string (required)
  state: string (required)
  alias: string (optional)
}
\`\`\`
```

#### 3c. Enums

```markdown
### {Entity}Status enum
\`\`\`
enum {Entity}Status {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
\`\`\`
```

---

### 4. Business Rules

A flat bulleted list. Cover all of these when applicable:

- **Access control** — which roles can access (or "all authenticated roles")
- **Soft delete** note
- **Auto-generated ID** — restate format + reset behavior
- **Default values** on creation (e.g. status defaults to PENDING)
- **Status lifecycle rules** — sub-section with:
  - All valid transitions listed explicitly (`A → B (description)`)
  - Terminal states identified
  - Error type for invalid transitions (`BadRequestException`)
- **Conditional validation rules** — e.g. period dates, date range checks
- **FK existence checks** — one bullet per relation (client, agent, quotation, etc.) with 404 behavior
- **Partial update behavior** — confirm only provided fields are modified
- Any **special business logic** (e.g. auto-clearing fields when a flag is set to false)

```markdown
## Business Rules

- All operations are accessible to all authenticated roles.
- {Entities} are soft-deleted (can be recovered).
- The `{entityId}` is auto-generated with format `PRE-{YYYY}{6-digit-zero-padded}`. Counter resets each year.
- Status defaults to PENDING on creation.
- **Status lifecycle rules**:
  - Valid status transitions:
    - PENDING → IN_PROGRESS (start)
    - IN_PROGRESS → COMPLETED (complete)
    - PENDING or IN_PROGRESS → CANCELLED (cancel at any non-terminal point)
  - Terminal states: COMPLETED and CANCELLED cannot transition to any other status.
  - Invalid transitions return BadRequestException with a descriptive error.
- **{Condition} validation**:
  - If `flag` is `true`: both `fieldA` and `fieldB` are required.
  - If `flag` is `true`: `fieldB` must be after `fieldA` (400 BadRequestException if invalid).
  - If `flag` is `false`: `fieldA` and `fieldB` must be null/omitted.
- **Client validation**: Client must exist (404 if not found).
- **Agent validation**: Agent (User) must exist (404 if not found). {role restriction note or "No role restriction applied."}.
- Partial updates are supported — only provided fields are modified.
```

---

### 5. GraphQL API

One sub-section per query/mutation. Order: list query → detail query → create → update → delete → lifecycle mutations.

#### Per-operation structure

```markdown
### {operationName} ({Query|Mutation})
- **Access**: All authenticated roles  (or specific roles)
- **Parameters**:
  - paramName: Type! — description
  - paramName: Type (optional) — description
  - filters: {FilterInput} (optional)
    - filterField: Type — description
- **Data available**: (queries only)
  - List all entity fields available
  - Nested relations with their fields listed
- **Returns**: (mutations only)
  - Created {Entity} with all relations  — for create
  - GenericOutput with success message    — for update/delete/lifecycle
- **Business rules**:
  - Bullet list of rules specific to this operation
  - Always include: entity-not-found (NotFoundException), FK checks (NotFoundException), validation errors (BadRequestException)
```

#### Queries — additional fields to document

For the **list query**, always document:
- `search` fields (which columns it matches)
- `sort` fields (all allowed column names, note joined columns like `clientName`)

For the **detail query**, always note:
- `createdBy` and `updatedBy` are available (from BaseEntity)

#### Mutations — return type rule

- **Create** → returns the full entity with all relations
- **Update / Delete / Lifecycle** → returns `GenericOutput with success message`

---

### 6. Modifications to Existing Entities (if any)

If the new module affects existing entities, document it here:

```markdown
## Modifications to Existing Entities

### {ExistingEntity}
- {Field name}: {what changes and why}
- Note: no schema changes required if only a soft reference is added (e.g. workId referencing a human-readable ID).
```

If no existing entities are affected, omit this section entirely.

---

## Writing Guidelines

- **Be exhaustive on business rules** — every validation that will be implemented should appear here. The developer or AI agent implementing the module should not need to infer behavior.
- **Use exact field names** — use the exact camelCase name the TypeScript property will have.
- **Mark required vs optional clearly** — use `(required)` and `(optional)` in the data model.
- **Document default values** — especially enum defaults and boolean defaults.
- **Disambiguation notes** — if the new module shares a name or concept with an existing entity (e.g. "Service" vs "ServiceOrder"), add a note in the Overview clarifying they are independent.
- **Conditional requirements** — use the pattern `"Required when X is Y"` to avoid ambiguity.
- **Error types** — always specify `NotFoundException` (404) vs `BadRequestException` (400) for each validation.
- **Counter reset behavior** — when documenting auto-generated IDs with year prefix, always state whether the counter resets per year.

---

## Quick Checklist

- [ ] Overview explains what the entity is and why it exists
- [ ] All entity fields listed with type, required/nullable, and description
- [ ] FK fields documented in pairs (relation + FK column)
- [ ] All enum values listed
- [ ] JSONB types have their structure documented inline
- [ ] Status lifecycle lists every valid transition explicitly
- [ ] Terminal states identified
- [ ] All FK validation rules listed (client, agent, etc.) with 404 note
- [ ] Conditional field rules (e.g. period dates) documented with both true and false cases
- [ ] Each GraphQL operation has: access, parameters, return type, and business rules
- [ ] List query documents searchable fields and sortable columns
- [ ] Detail query notes availability of `createdBy`/`updatedBy`
- [ ] Lifecycle mutations each document their required pre-condition status
