# CSV Exports API Guide

## Overview

The CSV Exports API provides asynchronous data export functionality. When called, it immediately returns `{ success: true }` and processes the export in the background. Once complete, a download link is sent via email to the requesting user.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All export endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Key Concepts

### Async Flow

Exports are **fire-and-forget**: the query returns immediately without waiting for the file to be generated. The process runs in the background and delivers the result via email. This prevents timeouts for large datasets.

```
Client → exportPurchases query
          ↓ returns { success: true } immediately
          ↓ (background) generate XLSX → upload to S3
          ↓ (background) send email with download link
User's email inbox ← download link
```

### Exported File Format

All exports produce `.xlsx` files uploaded to AWS S3 and served via a pre-signed URL included in the delivery email.

---

## Available Endpoints

### 1. Export Purchases

**Query:** `exportPurchases`
**Description:** Export all purchases matching the given filters to an XLSX file. The download link is sent to the requesting user's email address.
**Access:** ADMIN, BUYER, RECEPTION

```graphql
query ExportPurchases($findPurchasesArgs: FindPurchasesArgs!) {
  exportPurchases(findPurchasesArgs: $findPurchasesArgs) {
    success
  }
}
```

**Variables:**

```json
{
  "findPurchasesArgs": {
    "skip": 0,
    "limit": 0,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "tcg": "POKEMON"
    }
  }
}
```

**Variables with Filters:**

```json
{
  "findPurchasesArgs": {
    "skip": 0,
    "limit": 0,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "status": "FINALIZED",
      "tcg": "POKEMON",
      "buyer": "BUYER_USER_GUID",
      "createdDate": {
        "filterType": ":daterange:",
        "range": {
          "from": "2025-01-01T00:00:00.000Z",
          "to": "2025-12-31T23:59:59.999Z"
        }
      }
    }
  }
}
```

**Available Filters:**

- `status`: Purchase status (DRAFT, QUOTED, WAITING_PRICE, FINALIZED, REJECTED)
- `tcg`: **Required** — Trading card game type (POKEMON, MAGIC)
- `buyer`: Buyer user GUID
- `createdDate`: Date range filter with `filterType: ":daterange:"` and `range: { from, to }`

**Available Sort Columns:** `createdDate`, `total`, `status`, `sellerName`, `buyerName`, `itemCount`, `purchaseReference`

**Search:** Supports the same `search` field as the `purchases` query — searches across purchase reference, seller name, seller phone, and seller email.

**Response:**

```json
{
  "data": {
    "exportPurchases": {
      "success": true
    }
  }
}
```

A `success: true` response means the export job has been queued. The XLSX file will be generated asynchronously and the download link will be sent to the authenticated user's email.

### XLSX Columns

The generated file contains one row per purchase with the following columns:

| Column | Description |
|---|---|
| Referencia | Purchase reference code |
| Vendedor (Nombre) | Seller name |
| Vendedor (Teléfono) | Seller phone |
| Vendedor (Email) | Seller email |
| Comprador | Buyer name |
| Estado | Purchase status |
| Total | Purchase total (currency formatted) |
| Total de Items | Sum of all item quantities |
| Pago en Efectivo | Total payments made in cash (CASH) |
| Pago en Transferencia | Total payments made by transfer (TRANSFER) |
| Pago en Crédito en Tienda | Total payments made in store credit (STORE_CREDIT) |

---

### 2. Export Sales

**Query:** `exportSales`
**Description:** Export all sales matching the given filters to an XLSX file. The download link is sent to the requesting user's email address.
**Access:** ADMIN, RECEPTION

```graphql
query ExportSales($findSalesArgs: FindSalesArgs!) {
  exportSales(findSalesArgs: $findSalesArgs) {
    success
  }
}
```

**Variables:**

```json
{
  "findSalesArgs": {
    "skip": 0,
    "limit": 0,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "tcg": "POKEMON"
    }
  }
}
```

**Variables with Filters:**

```json
{
  "findSalesArgs": {
    "skip": 0,
    "limit": 0,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "status": "COMPLETED",
      "tcg": "POKEMON",
      "customer": "CUSTOMER_USER_GUID",
      "createdDate": {
        "filterType": ":daterange:",
        "range": {
          "from": "2025-01-01T00:00:00.000Z",
          "to": "2025-12-31T23:59:59.999Z"
        }
      }
    }
  }
}
```

**Available Filters:**

- `status`: Sale status (NEW, IN_PROGRESS, READY, COMPLETED, CANCELLED)
- `tcg`: **Required** — Trading card game type (POKEMON, MAGIC)
- `customer`: Customer user GUID
- `createdDate`: Date range filter with `filterType: ":daterange:"` and `range: { from, to }`

**Search:** Supports the same `search` field as the `sales` query — searches across sale code, kiosk customer name, customer name, email, phone, and card names.

**Response:**

```json
{
  "data": {
    "exportSales": {
      "success": true
    }
  }
}
```

A `success: true` response means the export job has been queued. The XLSX file will be generated asynchronously and the download link will be sent to the authenticated user's email.

### XLSX Columns (Sales)

The generated file contains one row per sale with the following columns:

| Column | Description |
|---|---|
| Fecha de Creación | Sale creation date (DD/MM/YYYY) |
| Código | Sale code (e.g. KSS-2025-00001) |
| Cliente | Customer name (or kiosk customer name) |
| Cliente (Email) | Customer email (or kiosk customer email) |
| TCG | Trading card game type |
| Estado | Sale status |
| Total | Sale total (currency formatted) |
| Total de Items | Sum of all item quantities |

---

## Typical Usage

1. Call `exportPurchases` or `exportSales` with the desired filters (same args as the `purchases`/`sales` query)
2. Receive `{ success: true }` immediately
3. Wait for the email — it arrives once the XLSX is generated and uploaded
4. Click the download link in the email to get the file

---

## Error Handling & Notes

- If the export or email delivery fails, the error is logged server-side. The client will **not** receive an error response since the job runs asynchronously.
- `limit` and `skip` in the args are ignored for exports — all matching records are always exported regardless of these values.
- The user email is derived from the authenticated JWT token. Make sure the requesting user has a valid email address on their account.