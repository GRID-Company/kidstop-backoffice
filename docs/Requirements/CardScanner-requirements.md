# CardScanner Requirements

## Overview

- The backoffice operates a **card scanner** for purchase receiving: a buyer photographs a physical Pokémon/Magic card and the system identifies it against the internal catalog to pre-fill a purchase item.
- The frontend owns everything that requires the device camera: card detection, perspective correction, and image normalization (OpenCV.js, client-side). Its output is a normalized card image (~744×1039 px, card fills the frame).
- The backend owns everything that requires external AI services and catalog access: extracting card identity fields from the image, resolving the set, and matching against the internal catalog — exposed through the existing `pokemonCardScanSearch` / `magicCardScanSearch` queries.
- This module **extends the existing catalog scan-search operations**; it is not an independent entity and introduces no new persisted entities.
- Goal of this change: move OCR/field extraction from the frontend (`/api/ocr` + Google Cloud Vision credentials) into the backend so that the frontend sends only the card image and optional hints, and the backend returns `resolvedByAI`, `aiResolved`, `bestMatch`, `relatedCards`, and `error` — all fields already present in the current schema.

## What the Frontend Sends

### CardScanSearchInput (existing input — no new fields required)

- `name: String` (optional) — card name hint, user-edited or omitted.
- `cardNumber: String` (optional) — collector number hint (Pokémon `cardNumber`, Magic `collectorNumber`).
- `setCode: String` (optional) — set code hint.
- `text: String` (optional) — rules text hint; not sent by the scanner.
- `originalImage: Upload` (optional) — **normalized card photo produced by the frontend** (JPEG/PNG, ~744×1039 px). This is the primary input for AI extraction.
- `setIcon: Upload` (optional) — cropped set-symbol region extracted from the normalized image by the frontend; intended to help the backend identify the set.
- `effort: CardScanEffort` (enum, optional, default `NORMAL`) — `NORMAL` runs deterministic catalog matching first and falls back to AI (`gemini-2.5-flash-lite`) when no match is found; `HIGH`/`MAX` skip the initial catalog search and resolve via AI first (`gemini-2.5-flash` / `gemini-2.5-pro`). The AI-resolved `name`/`cardNumber`/`setCode` are always re-applied to the catalog search.
- `withCardsMetrics: Boolean` (optional, default false) — frontend always sends `true` for scanner requests (purchase flow needs prices/stock).

At least one text field or `originalImage` is required (existing rule). For the scanner flow, `originalImage` is always present.

## Required Behavior

### Field extraction from `originalImage` (new)

- When `originalImage` is present and text hints are absent/insufficient — or when `effort` is `HIGH`/`MAX` — the backend must extract the card's identity fields from the image using a vision-capable model (implementation choice: Google Cloud Vision, Gemini multimodal, or equivalent).
- Extraction output must populate `aiResolved` (existing `CardScanAiData`):
  - `name` — card name as printed.
  - `cardNumber` — collector number (e.g. `026/163`, Magic collector number).
  - `setCode` — set code if resolvable (e.g. `MEW`, `MH3`).
  - `setName` — full set name.
  - `cardText` — rules/abilities text when legible (optional content).
  - `detectedLanguage` — `CardLanguage` enum value inferred from the card text.
  - `nameEs`, `setNameEs`, `cardTextEs` — Spanish translations for UI display (already in the type).
- `resolvedByAI` must be `true` when the response used the AI extraction path (existing field semantics).
- Extraction must be robust to: moderate glare, non-studio backgrounds, slightly rotated crops already corrected to portrait aspect, and English/Spanish/Japanese card text.

### Set icon usage

- `setIcon` is a small crop of the set-symbol area (Pokemon: bottom-left; Magic: right of the type line) already cut by the frontend.
- The backend should use it to identify or disambiguate the set (icon matching or vision-based symbol recognition). If the icon is not usable, fall back to `setName`/`setCode` extraction from the full image. Unusable icon must not fail the request.

### Matching order (existing contract — restate)

- With `effort=NORMAL`: deterministic catalog matching on provided text fields first; if no satisfactory match, fall back to AI extraction from `originalImage` and match on its output.
- With `effort=HIGH`/`MAX`: skip deterministic matching; extract via AI and match on extracted fields.
- `bestMatch` and `relatedCards` continue to return catalog items as today, including `cardMetrics` when `withCardsMetrics=true` (also under `HIGH`/`MAX`).
- `error` may be populated together with `aiResolved` when the AI resolved the card but the catalog search found no match.

### Business Rules

- All operations are accessible to all authenticated roles (existing JWT requirement).
- **Image constraints**: `originalImage`/`setIcon` accept JPEG and PNG, max 5MB each (backend is raising the multipart body limit accordingly).
- **Oversized or unreadable uploads** must return a graceful response: populate `error` with a descriptive message (e.g. `"Could not extract card data from image"`) instead of throwing a GraphQL transport error.
- **AI extraction failure** (no text legible, non-card image) → `error` populated, `bestMatch`/`relatedCards` empty — not a thrown exception.
- **Language mapping**: `detectedLanguage` must map to the existing `CardLanguage` enum (`ENGLISH`, `SPANISH`, `JAPANESE`, `FRENCH`, `GERMAN`, `ITALIAN`, `PORTUGUESE`, `RUSSIAN`, `KOREAN`, `CHINESE_*` as applicable).
- Partial input support is unchanged: users may submit corrected `name`/`cardNumber`/`setCode` together with `originalImage` to re-run a search after editing extracted fields.
- No new mutations, no persistence, no new entities.

### Optional (nice-to-have, not blocking)

- Per-field or overall `confidence: Float` on `aiResolved` so the UI can keep its quality indicator and "re-scan" suggestion. TCGplayer's Roca Vision exposes GOOD/FAIR/POOR labels — a `matchConfidence: GOOD | FAIR | POOR` enum per candidate would map directly to our candidate chips.
- `aiResolved.variant`/`isFoil` hints for Magic (foil/non-foil affects the matched variant).
- `issueDetails: String` — human-readable reason when extraction is degraded (e.g. `"Heavy glare on bottom right"`, `"Card too small"`). Pattern used by the Roboflow/Gemini scanner (`status: PASS/FAIL/FLAG_FOR_HUMAN` + `next_step: RETRY_SCAN|CONFIRM`) — gives the frontend an actionable message instead of a generic failure.
- `nextStep: RETRY_SCAN | CONFIRM` hint so the UI can pick the right CTA without inferring from `error`.

## Frontend Contract Recap (for the backend team's context)

The scanner flow after this change becomes a **single GraphQL round-trip**:

1. Frontend: camera → detect card → perspective-correct → normalized JPEG (~744×1039) + `setIcon` crop.
2. `pokemonCardScanSearch`/`magicCardScanSearch` with `{ originalImage, setIcon, effort: 'HIGH', withCardsMetrics: true }` (text hints omitted on first pass).
3. Backend: AI extraction → `aiResolved` + `resolvedByAI` + catalog matches.
4. UI shows AI-resolved fields (editable); user edits → re-submit with corrected text fields + `originalImage` (`effort='NORMAL'`).
5. Confirmed candidate → purchase form (existing integration, unchanged).

### Removed from the frontend once this lands

- `/api/ocr` Next.js route and `GOOGLE_CLOUD_*` env vars.
- Regional OCR composite image + per-region token classification.
- Local OCR parsers and confidence calculation (confidence display may remain if backend returns it).

## Error Handling

| Error               | Message                                                   | Code                       |
| ------------------- | --------------------------------------------------------- | -------------------------- |
| Unauthenticated     | `"Unauthorized"`                                          | `UNAUTHENTICATED`          |
| No input provided   | `"At least one text field or image is required"`          | `BAD_USER_INPUT`           |
| Image unreadable    | `error` field: `"Could not extract card data from image"` | 200 with `error` populated |
| AI extraction empty | `error` field populated; empty match lists                | 200 with `error` populated |
| Image too large     | Request rejected (multipart limit)                        | `413`                      |

## Open Questions for Backend

1. Vision provider: Google Cloud Vision vs. Gemini multimodal directly on the image — implementation choice, contract identical either way.
2. Should `aiResolved` include `confidence` for UI quality feedback? (optional item above)
3. Cost/rate-limit policy for AI calls (Vision/Gemini quota) — any per-user or global throttling expected?
