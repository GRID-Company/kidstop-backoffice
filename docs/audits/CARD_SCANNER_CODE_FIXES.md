# CARD SCANNER - CODE FIXES EXAMPLES

## 🔧 QUICK FIX TEMPLATES

### 1. FIX: Add Timeout to Fetch

**File**: `adapters/ocr/google-vision.ts`

```typescript
// ❌ BEFORE
export async function extractTextWithVision(
  imageDataUrl: string
): Promise<VisionOCRResult> {
  const response = await fetch('/api/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageDataUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Vision API error: ${error.details || response.statusText}`
    );
  }

  return response.json();
}

// ✅ AFTER
export async function extractTextWithVision(
  imageDataUrl: string,
  timeoutMs: number = 15000
): Promise<VisionOCRResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageDataUrl }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vision API error: ${error.details || response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`OCR timeout after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

---

### 2. FIX: Add useCallback to Hooks

**File**: `ui/hooks/use-card-scanner-pipeline.ts`

```typescript
// ❌ BEFORE
export const useCardScannerPipeline = (game: TCGGame) => {
  const [status, setStatus] = useState<ScannerStatus>('camera-ready');
  const [scannedData, setScannedData] = useState<ScannedCardData | null>(null);

  const processCard = async (
    frameMat: OpenCVMat,
    corners: number[],
    cv: OpenCV,
    frameSize: { width: number; height: number }
  ): Promise<void> => {
    // ... 150 líneas de lógica
  };

  return { status, scannedData, processCard };
};

// ✅ AFTER
export const useCardScannerPipeline = (game: TCGGame) => {
  const [status, setStatus] = useState<ScannerStatus>('camera-ready');
  const [scannedData, setScannedData] = useState<ScannedCardData | null>(null);

  const processCard = useCallback(
    async (
      frameMat: OpenCVMat,
      corners: number[],
      cv: OpenCV,
      frameSize: { width: number; height: number }
    ): Promise<void> => {
      // ... 150 líneas de lógica
    },
    [game] // Dependencias
  );

  return { status, scannedData, processCard };
};
```

---

### 3. FIX: Remove Double Casts

**File**: `adapters/backend/card-search.adapter.ts`

```typescript
// ❌ BEFORE
export function buildCardSearchRequest(
  game: TCGGame,
  extractedData: ExtractedCardData,
  confidence: ScanConfidence,
  rawOcr: RegionalOcrResult
): CardSearchRequest {
  const request = {
    schemaVersion: '1.0' as const,
    game: (game === 'pokemon' || game === 'magic' ? game : 'unknown') as
      | TCGGame
      | 'unknown',
    // ...
  };

  return request as any as CardSearchRequest; // ❌ Double cast
}

export function validateCardSearchRequest(
  request: CardSearchRequest
):
  | { valid: true; data: CardSearchRequest }
  | { valid: false; errors: string[] } {
  try {
    const validated = cardSearchRequestSchema.parse(request);
    return { valid: true, data: validated as any as CardSearchRequest }; // ❌ Double cast
  } catch (error: any) {
    const errors = error.errors?.map(
      (e: any) => `${e.path.join('.')}: ${e.message}`
    ) || ['Validation error'];
    return { valid: false, errors };
  }
}

// ✅ AFTER
export function buildCardSearchRequest(
  game: TCGGame,
  extractedData: ExtractedCardData,
  confidence: ScanConfidence,
  rawOcr: RegionalOcrResult
): CardSearchRequest {
  return {
    schemaVersion: '1.0' as const,
    game: (game === 'pokemon' || game === 'magic' ? game : 'unknown') as
      | TCGGame
      | 'unknown',
    scan: {
      capturedAt: new Date().toISOString(),
      orientation: 'portrait' as const,
      layout: null,
      captureQuality: confidence.captureQuality,
      ocrQuality: confidence.ocrQuality,
      extractionQuality: confidence.extractionQuality,
    },
    fields: extractedData,
    rawOcr: {
      fullText: rawOcr.fullText,
      regions: Object.fromEntries(
        Object.entries(rawOcr.regions).map(([key, value]) => [
          key,
          {
            text: value.text,
            averageConfidence: value.averageConfidence,
          },
        ])
      ),
    },
  };
}

export function validateCardSearchRequest(
  request: CardSearchRequest
):
  | { valid: true; data: CardSearchRequest }
  | { valid: false; errors: string[] } {
  try {
    const validated = cardSearchRequestSchema.parse(request);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(
        (e) => `${e.path.join('.')}: ${e.message}`
      );
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}
```

---

### 4. FIX: Rename Interfaces with I Prefix

**File**: `domain/types.ts`

```typescript
// ❌ BEFORE
export interface Point {
  x: number;
  y: number;
}

export interface CardCorners {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

export interface CameraConfig {
  facingMode: 'environment' | 'user';
  width: { ideal: number };
  height: { ideal: number };
}

// ✅ AFTER
export interface IPoint {
  x: number;
  y: number;
}

export interface ICardCorners {
  topLeft: IPoint;
  topRight: IPoint;
  bottomRight: IPoint;
  bottomLeft: IPoint;
}

export interface ICameraConfig {
  facingMode: 'environment' | 'user';
  width: { ideal: number };
  height: { ideal: number };
}
```

**Then update all imports**:

```typescript
// domain/card-scanner.domain.ts
import { ICardCorners, IPoint, OpenCV, OpenCVMat } from './types';

export function orderCorners(corners: number[]): ICardCorners {
  const pts: IPoint[] = [
    { x: corners[0], y: corners[1] },
    // ...
  ];
  // ...
}
```

---

### 5. FIX: Remove console.log Spam

**File**: `domain/card-scanner.domain.ts`

```typescript
// ❌ BEFORE
if (found) {
  console.log(`✅ Carta detectada! Área: ${Math.round(maxArea)}`);
} else if (largeContours.length > 0) {
  console.log(`🔍 Contornos grandes encontrados:`, largeContours.slice(0, 3));
}

// ✅ AFTER
if (process.env.NODE_ENV === 'development') {
  if (found) {
    console.log(`✅ Carta detectada! Área: ${Math.round(maxArea)}`);
  } else if (largeContours.length > 0) {
    console.log(`🔍 Contornos grandes encontrados:`, largeContours.slice(0, 3));
  }
}
```

Or better, use a logger:

```typescript
// lib/logger.ts
export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
};

// domain/card-scanner.domain.ts
import { logger } from '@/lib/logger';

if (found) {
  logger.debug(`✅ Carta detectada! Área: ${Math.round(maxArea)}`);
}
```

---

### 6. FIX: Add useCallback to Components

**File**: `ui/components/extracted-fields-editor.tsx`

```typescript
// ❌ BEFORE
export const ExtractedFieldsEditor = ({
  extractedData,
  confidence,
  onSave,
  onCancel,
  disabled = false,
}: ExtractedFieldsEditorProps) => {
  const [editedData, setEditedData] =
    useState<ExtractedCardData>(extractedData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (
    fieldName: keyof ExtractedCardData,
    value: any
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        normalizedValue: value,
        confidence: value !== null ? prev[fieldName].confidence : 0,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editedData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setEditedData(extractedData);
    setHasChanges(false);
  };

  // ...
};

// ✅ AFTER
export const ExtractedFieldsEditor = ({
  extractedData,
  confidence,
  onSave,
  onCancel,
  disabled = false,
}: ExtractedFieldsEditorProps) => {
  const [editedData, setEditedData] =
    useState<ExtractedCardData>(extractedData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = useCallback(
    (fieldName: keyof ExtractedCardData, value: any) => {
      setEditedData((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          normalizedValue: value,
          confidence: value !== null ? prev[fieldName].confidence : 0,
        },
      }));
      setHasChanges(true);
    },
    []
  );

  const handleSave = useCallback(() => {
    onSave(editedData);
    setHasChanges(false);
  }, [editedData, onSave]);

  const handleReset = useCallback(() => {
    setEditedData(extractedData);
    setHasChanges(false);
  }, [extractedData]);

  // ...
};
```

---

### 7. FIX: Consolidate Constants

**File**: `domain/constants.ts`

```typescript
// ❌ BEFORE: QUALITY_THRESHOLDS en confidence.domain.ts
// domain/confidence.domain.ts
export const QUALITY_THRESHOLDS = {
  MINIMUM_CAPTURE: 0.25,
  MINIMUM_OCR: 0.08,
  // ...
};

// ✅ AFTER: Consolidar en constants.ts
// domain/constants.ts
export const QUALITY_THRESHOLDS = {
  MINIMUM_CAPTURE: 0.25,
  MINIMUM_OCR: 0.08,
  MINIMUM_EXTRACTION: 0.05,
  MINIMUM_OVERALL: 0.15,
  GOOD_CAPTURE: 0.6,
  GOOD_OCR: 0.7,
  GOOD_EXTRACTION: 0.5,
  EXCELLENT_CAPTURE: 0.8,
  EXCELLENT_OCR: 0.85,
  EXCELLENT_EXTRACTION: 0.7,
} as const;

// domain/confidence.domain.ts
import { QUALITY_THRESHOLDS } from './constants';

export function isQualityAcceptable(confidence: ScanConfidence): boolean {
  return (
    confidence.captureQuality >= QUALITY_THRESHOLDS.MINIMUM_CAPTURE &&
    confidence.ocrQuality >= QUALITY_THRESHOLDS.MINIMUM_OCR &&
    confidence.overall >= QUALITY_THRESHOLDS.MINIMUM_OVERALL
  );
}
```

---

### 8. FIX: Create Barrel Exports

**File**: `domain/parsers/index.ts` (NEW)

```typescript
// ✅ NEW FILE
export {
  parsePokemonCard,
  extractPokemonName,
  extractHP,
  extractPokemonCollectorNumber,
  extractPokemonSetCode,
  extractRarity,
} from './pokemon-parser.domain';
export {
  parseMagicCard,
  extractMagicName,
  extractMagicCollectorNumber,
  extractMagicSetCode,
  extractMagicRarity,
  extractManaCost,
  extractTypeLine,
} from './magic-parser.domain';
export {
  createExtractedField,
  createEmptyField,
  detectLanguage,
  extractYear,
  normalizeCollectorNumber,
  calculateFieldConfidence,
  cleanText,
  extractNumberFromText,
  normalizeWhitespace,
  removeNonAlphanumeric,
  levenshteinDistance,
  correctCommonOCRErrors,
} from './common-parser.domain';
```

**Then simplify imports**:

```typescript
// ❌ BEFORE
import { parsePokemonCard } from '../../domain/parsers/pokemon-parser.domain';
import { parseMagicCard } from '../../domain/parsers/magic-parser.domain';

// ✅ AFTER
import { parsePokemonCard, parseMagicCard } from '../../domain/parsers';
```

---

### 9. FIX: Organize Imports with Comments

**File**: `ui/hooks/use-card-scanner-pipeline.ts`

```typescript
// ✅ ORGANIZED IMPORTS
// React
import { useState, useCallback } from 'react';

// Domain - Types
import {
  ExtractedCardData,
  OpenCV,
  OpenCVMat,
  RegionalOcrResult,
  ScanConfidence,
  ScannerMetrics,
  ScannerStatus,
  ScannedCardData,
  TCGGame,
  ICardCorners,
} from '../../domain/types';

// Domain - Constants
import {
  CARD_REGION_CONFIGS,
  EXTRACTION_WEIGHTS,
} from '../../domain/constants';

// Domain - Card Processing
import {
  orderCorners,
  warpPerspectiveNormalized,
} from '../../domain/card-scanner.domain';
import {
  calculateCaptureQuality,
  detectOrientation,
  rotateCard,
} from '../../domain/normalization.domain';
import {
  createCompositeOcrImage,
  matToDataURL,
} from '../../domain/region-extraction.domain';

// Domain - Parsers
import { parsePokemonCard, parseMagicCard } from '../../domain/parsers';

// Domain - Confidence
import {
  calculateOcrQuality,
  calculateExtractionQuality,
  calculateOverallConfidence,
  isQualityAcceptable,
  getQualityFeedback,
  QUALITY_THRESHOLDS,
} from '../../domain/confidence.domain';

// Adapters
import { extractTextWithVisionRegional } from '../../adapters/ocr/google-vision';
```

---

### 10. FIX: Add JSDoc Comments

**File**: `domain/parsers/pokemon-parser.domain.ts`

```typescript
// ✅ ADD JSDoc
/**
 * Parsea datos de una carta Pokémon desde OCR regional.
 *
 * Extrae los campos principales de una carta Pokémon:
 * - Nombre de la carta
 * - HP (puntos de vida)
 * - Número de colección y total del set
 * - Código del set
 * - Rareza
 * - Idioma detectado
 * - Año de publicación
 *
 * @param regionalOcr - Resultado de OCR clasificado por regiones
 * @returns Datos extraídos de la carta con confianza para cada campo
 *
 * @example
 * const regionalOcr = classifyTokensByRegion(words, regionMap);
 * const cardData = parsePokemonCard(regionalOcr);
 * console.log(cardData.name.value); // "Pikachu"
 */
export function parsePokemonCard(
  regionalOcr: RegionalOcrResult
): ExtractedCardData {
  // ...
}

/**
 * Extrae el nombre de una carta Pokémon del OCR regional.
 *
 * Limpia el texto removiendo:
 * - Valores de HP (HP 100, 100 HP, etc.)
 * - Tipos de cartas (Basic, Stage 1, VMAX, etc.)
 *
 * @param regionalOcr - Resultado de OCR con región 'name'
 * @returns Campo extraído con nombre de la carta y confianza
 */
export function extractPokemonName(
  regionalOcr: RegionalOcrResult
): ExtractedField {
  // ...
}
```

---

## 📋 REFACTORING CHECKLIST

- [ ] Fix timeout in fetch (1h)
- [ ] Add useCallback to hooks (2h)
- [ ] Remove double casts (1h)
- [ ] Rename interfaces with I prefix (2-3h)
- [ ] Remove console.log spam (1h)
- [ ] Add useCallback to components (1h)
- [ ] Consolidate constants (1h)
- [ ] Create barrel exports (1h)
- [ ] Organize imports (2h)
- [ ] Add JSDoc comments (4h)

**Total Effort**: ~16-17 hours

---

**Generated**: 2024
**For**: card-scanner feature refactoring
**Confidence**: High (tested patterns)
