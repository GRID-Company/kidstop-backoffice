# Card Scan Search API Guide

> **Status:** Implemented by backend — live in dev schema.
> Queries: `pokemonCardScanSearch` / `magicCardScanSearch`.
> The frontend calls them by default and falls back to mock candidates when
> `NEXT_PUBLIC_CARD_SCAN_USE_MOCK=true` or the operation is unavailable
> (`Cannot query field` error).

## Overview

The scan-search queries identify a scanned TCG card using a hybrid pipeline on
the backend:

1. **Deterministic catalog search:** matches `name`/`cardNumber`/`setCode`/`text`
   against the local card catalog.
2. **Gemini fallback (multimodal):** when the catalog returns no results, Gemini
   interprets the card from the provided data plus the uploaded images
   (`originalImage`, `setIcon`) — including Japanese and other non-English
   printings — translates the fields and re-applies the catalog search.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests, multipart when images are sent)
**Authentication:** Internal endpoint — requires Bearer token.
**Roles:** ADMIN, BUYER, RECEPTION

Reference guides (authoritative):

- [Pokemon-catalog-api-guide.md](Pokemon-catalog-api-guide.md) — section 14
- [Magic-Catalog-API-Guide.md](Magic-Catalog-API-Guide.md) — section 12

## Frontend pipeline (input source)

```
Camera → OpenCV (contour + perspective) → normalized card (350x490)
→ Google Cloud Vision OCR (regional composite) → field parsers + confidence
→ pokemonCardScanSearch | magicCardScanSearch (input)
```

## Queries

```graphql
query PokemonCardScanSearch($input: CardScanSearchInput!) {
  pokemonCardScanSearch(input: $input) {
    resolvedByAI
    bestMatch {
      guid
      name
      variant
      setName
      setCode
      cardNumber
      sellPrice
      availableStock
      totalStock
      imageUri
      language
      cardMetrics {
        ungradedPrice
        gradedPriceSeven
        gradedPriceEightOrAbove
      }
    }
    relatedCards {
      guid
      name
      variant
      setName
      setCode
      cardNumber
      sellPrice
      availableStock
      totalStock
      imageUri
      language
    }
    aiResolved {
      name
      cardNumber
      setCode
      setName
      cardText
      detectedLanguage
      nameEs
      setNameEs
      cardTextEs
    }
    error
  }
}
```

`magicCardScanSearch` has the same shape with `MagicCardInternalItem`
(`edition`, `collectorNumber`, `isFoil`, `cardMetrics { priceRetail priceBuy }`).

## Input

```graphql
input CardScanSearchInput {
  aiSearchOnly: Boolean
  cardNumber: String
  name: String
  originalImage: Upload
  setCode: String
  setIcon: Upload
  text: String
  withCardsMetrics: Boolean
}
```

All fields optional; at least one text field or an image is required.

- `originalImage` (Upload): normalized card image — sent as `File` via
  `apollo-upload-client` (`UploadHttpLink` already configured).
- `setIcon` (Upload): crop of the `setSymbol` region from the normalized card.
- `withCardsMetrics`: the frontend sends `true` so `bestMatch.cardMetrics`
  includes external reference prices used as the purchase offer suggestion.
- `text`: intended for card rules text. The frontend currently omits it — the
  composite OCR dump is not rules text and could create false deterministic
  matches that skip the AI path.
- `aiSearchOnly`: `false` — the frontend always wants catalog candidates.

## Output

- `resolvedByAI`: `true` when Gemini produced the identification.
- `bestMatch` / `relatedCards`: catalog items (same shapes as
  `pokemonBatchCardSearch`/`magicBatchCardSearch`).
- `aiResolved`: canonical English fields + Spanish translations
  (`nameEs`/`setNameEs`/`cardTextEs`) + `detectedLanguage` (ISO 639-1).
- `error`: message when the search failed or matched nothing.

## Frontend integration

- Operations live in `src/lib/api/graphql/card-scan-search.gql`; generated
  documents: `PokemonCardScanSearchDocument`, `MagicCardScanSearchDocument`.
- `card-search.adapter.ts` builds `CardScanSearchInput` from the extracted
  fields (prefers `normalizedValue`), converts the normalized card + set icon
  data URLs to `File` (`dataUrlToFile`) and dispatches the game-specific query.
- `card-scan.mapper.ts` maps both item shapes to `ICardCandidate`
  (`setName` = pokemon `setName` / magic `edition`; `referencePrice` =
  `cardMetrics.ungradedPrice` | `priceRetail` ?? `sellPrice`; `bestMatch` gets
  `isBestMatch: true`).
- Response → domain: `ICardSearchResponse { resolvedByAI, bestMatch,
candidates[], aiResolved, error }` where `candidates` = bestMatch + related.

## Mock mode

`NEXT_PUBLIC_CARD_SCAN_USE_MOCK=true` forces mock candidates (useful without a
backend or for UI work). The adapter also falls back to mock automatically when
the schema does not expose the operation (`Cannot query field` error).
