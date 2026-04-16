# Seller API Guide

## Overview

The Seller API manages information about individuals or entities who sell cards to the business. Sellers are referenced in purchases and track seller contact information including name, phone, email, and notes. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All seller endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Key Concepts

### Seller Model

- **name**: Seller's full name (required)
- **phone**: Contact phone number (optional, unique across all sellers)
- **email**: Contact email address (optional, unique across all sellers)
- **notes**: Additional information about the seller (optional)

### Unique Constraints

- **email** must be unique — if provided, no other seller can have the same email
- **phone** must be unique — if provided, no other seller can have the same phone
- Creating or updating a seller with duplicate email/phone will result in a BadRequest error

### Roles & Permissions

All seller operations require one of the following roles:
- **ADMIN**
- **BUYER**
- **RECEPTION**

These roles are homologated with purchase operations for consistency.

### Search Functionality

The sellers list endpoint supports searching across:
- Seller name
- Phone number
- Email address

Search is case-insensitive and matches partial strings.

---

## Available Endpoints

### 1. Get Sellers (Paginated List)

**Query:** `sellers`
**Description:** Retrieve paginated list of sellers with search and sorting
**Access:** ADMIN, BUYER, RECEPTION

```graphql
query Sellers($findSellersArgs: FindSellersArgs!) {
  sellers(findSellersArgs: $findSellersArgs) {
    data {
      guid
      name
      phone
      email
      notes
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
  "findSellersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "name",
      "order": "ASC"
    },
    "search": ""
  }
}
```

**Variables with Search:**

```json
{
  "findSellersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "search": "john"
  }
}
```

**Response Fields:**

- `data`: Array of seller objects
  - `guid`: Unique identifier for the seller
  - `name`: Seller's full name
  - `phone`: Contact phone number (nullable)
  - `email`: Contact email address (nullable)
  - `notes`: Additional notes about the seller (nullable)
  - `createdDate`: Timestamp when seller was created
  - `updatedDate`: Timestamp when seller was last updated
- `count`: Total number of sellers matching the query

**Available Sort Columns:** `name`, `createdDate`, `updatedDate`, `email`, `phone`

**Search:** Searches across name, phone, and email fields

---

### 2. Get Single Seller

**Query:** `seller`
**Description:** Get detailed information for a specific seller by GUID
**Access:** ADMIN, BUYER, RECEPTION

```graphql
query Seller($guid: String!) {
  seller(guid: $guid) {
    guid
    name
    phone
    email
    notes
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "guid": "SELLER_GUID_HERE"
}
```

**Response Fields:**

- Same as list endpoint, single seller object
- Returns 404 Not Found if seller doesn't exist

---

### 3. Create Seller

**Mutation:** `createSeller`
**Description:** Create a new seller with contact information
**Access:** ADMIN, BUYER, RECEPTION

```graphql
mutation CreateSeller($createSellerInput: CreateSellerInput!) {
  createSeller(createSellerInput: $createSellerInput) {
    guid
    name
    phone
    email
    notes
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "createSellerInput": {
    "name": "John Doe",
    "phone": "5551234567",
    "email": "john@example.com",
    "notes": "Regular seller of Pokemon cards"
  }
}
```

**Variables (Minimal - name only):**

```json
{
  "createSellerInput": {
    "name": "Jane Smith"
  }
}
```

**Input Fields:**

- `name` (required): Seller's full name
- `phone` (optional): Contact phone number
- `email` (optional): Contact email address (must be valid email format)
- `notes` (optional): Additional information

**Validation:**

- `name` cannot be empty
- `email` must be valid email format if provided
- `phone` and `email` must be unique if provided

**Possible Errors:**

- **400 Bad Request:** Duplicate email or phone
- **400 Bad Request:** Invalid email format
- **400 Bad Request:** Missing required field (name)

---

### 4. Update Seller

**Mutation:** `updateSeller`
**Description:** Update an existing seller's information
**Access:** ADMIN, BUYER, RECEPTION

```graphql
mutation UpdateSeller($updateSellerInput: UpdateSellerInput!) {
  updateSeller(updateSellerInput: $updateSellerInput) {
    guid
    name
    phone
    email
    notes
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "updateSellerInput": {
    "guid": "SELLER_GUID_HERE",
    "name": "John Doe Updated",
    "phone": "5559876543",
    "email": "john.updated@example.com",
    "notes": "Updated seller information"
  }
}
```

**Variables (Partial Update):**

```json
{
  "updateSellerInput": {
    "guid": "SELLER_GUID_HERE",
    "notes": "Added new note"
  }
}
```

**Input Fields:**

- `guid` (required): Seller's unique identifier
- `name` (optional): New name
- `phone` (optional): New phone number
- `email` (optional): New email address
- `notes` (optional): New notes

**Behavior:**

- Only provided fields will be updated
- Omitted fields remain unchanged
- Setting a field to `null` will clear that field's value

**Validation:**

- `guid` must exist
- `email` must be valid format if provided
- `phone` and `email` must be unique if changed (won't conflict with same seller)

**Possible Errors:**

- **404 Not Found:** Seller with provided guid doesn't exist
- **400 Bad Request:** Duplicate email or phone (when changed to existing value)
- **400 Bad Request:** Invalid email format

---

### 5. Delete Seller

**Mutation:** `deleteSeller`
**Description:** Soft-delete a seller (marks as deleted but preserves data)
**Access:** ADMIN, BUYER, RECEPTION

```graphql
mutation DeleteSeller($guid: String!) {
  deleteSeller(guid: $guid)
}
```

**Variables:**

```json
{
  "guid": "SELLER_GUID_HERE"
}
```

**Response:**

- Returns `true` if deletion was successful
- Returns `false` or error if deletion failed

**Behavior:**

- This is a **soft delete** — the seller record is not physically removed from the database
- The seller's `deletedDate` field is set to the current timestamp
- Soft-deleted sellers won't appear in list queries by default
- Existing purchases that reference this seller will retain the reference

**Possible Errors:**

- **404 Not Found:** Seller with provided guid doesn't exist

---

## Usage Examples

### Example 1: Create a Seller and Use in Purchase

```graphql
# Step 1: Create the seller
mutation {
  createSeller(createSellerInput: {
    name: "Card Shop Inc",
    phone: "5551234567",
    email: "sales@cardshop.com",
    notes: "Wholesale seller"
  }) {
    guid
    name
  }
}

# Response: { "guid": "abc-123-def", "name": "Card Shop Inc" }

# Step 2: Create purchase with seller
mutation {
  createPurchase(createPurchaseInput: {
    sellerGuid: "abc-123-def",
    tcg: "POKEMON",
    items: [...]
  }) {
    guid
    seller {
      name
      phone
      email
    }
  }
}
```

### Example 2: Search for Sellers

```graphql
query {
  sellers(findSellersArgs: {
    search: "john",
    limit: 20,
    skip: 0
  }) {
    data {
      guid
      name
      email
      phone
    }
    count
  }
}
```

### Example 3: Update Seller Contact Info

```graphql
mutation {
  updateSeller(updateSellerInput: {
    guid: "abc-123-def",
    email: "newemail@cardshop.com",
    notes: "Email updated per seller request"
  }) {
    guid
    email
    updatedDate
  }
}
```

---

## Error Handling

### Common Error Responses

**Duplicate Email:**
```json
{
  "errors": [{
    "message": "Seller with email john@example.com already exists",
    "extensions": { "code": "BAD_REQUEST" }
  }]
}
```

**Duplicate Phone:**
```json
{
  "errors": [{
    "message": "Seller with phone 5551234567 already exists",
    "extensions": { "code": "BAD_REQUEST" }
  }]
}
```

**Seller Not Found:**
```json
{
  "errors": [{
    "message": "Seller with guid abc-123-def not found",
    "extensions": { "code": "NOT_FOUND" }
  }]
}
```

**Invalid Email Format:**
```json
{
  "errors": [{
    "message": "email must be a valid email",
    "extensions": { "code": "BAD_REQUEST" }
  }]
}
```

---

## Best Practices

1. **Search Before Create:** Search for existing sellers before creating new ones to avoid duplicates
2. **Validate Contact Info:** Ensure email and phone are in correct format before submitting
3. **Use Notes Field:** Document important information about sellers in the notes field
4. **Soft Deletes:** Remember that deleted sellers are soft-deleted and can be restored if needed
5. **Unique Constraints:** Always handle potential duplicate email/phone errors gracefully in your application

---

## Related APIs

- **Purchases API:** Uses sellers via the `sellerGuid` field when creating or updating purchases
- **Users API:** Separate from sellers — users are system accounts, sellers are external contacts
