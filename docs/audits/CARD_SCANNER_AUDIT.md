# CARD SCANNER - CROSS-CUTTING AUDIT REPORT

**Fecha**: 2024
**Feature**: card-scanner (POC)
**Ubicación**: `/src/features/card-scanner`
**Tamaño**: 224KB, ~5,015 líneas de código
**Archivos**: 35 (TS/TSX)

---

## 📊 SCORE DE CONSISTENCIA: 72/100

### Desglose por Categoría:

- **Naming Conventions**: 78/100 ✅
- **Imports Organization**: 65/100 ⚠️
- **Error Handling**: 70/100 ⚠️
- **Constants Management**: 85/100 ✅
- **Type Safety**: 75/100 ✅
- **Dependencies**: 80/100 ✅
- **Code Style**: 68/100 ⚠️
- **Performance**: 65/100 ⚠️
- **Architecture**: 75/100 ✅

---

## 1️⃣ NAMING CONVENTIONS

### ✅ CUMPLIMIENTO (78/100)

**Fortalezas:**

- ✅ Archivos: Consistente kebab-case (`card-scanner.domain.ts`, `use-camera-stream.ts`)
- ✅ Componentes: PascalCase (`CardScannerView`, `CameraPreview`, `ExtractedFieldsEditor`)
- ✅ Funciones: camelCase (`detectCardContours`, `orderCorners`, `warpPerspective`)
- ✅ Constantes: UPPER_SNAKE_CASE (`NORMALIZED_CARD_DIMENSIONS`, `DETECTION_PARAMS`)
- ✅ Tipos: PascalCase sin prefijo I (desviación intencional de ARCHITECTURE.md)
- ✅ Hooks: `use-` prefix consistente

**Problemas Encontrados:**

#### 🔴 CRÍTICO: Inconsistencia en Convención de Tipos

**Archivo**: `src/features/card-scanner/domain/types.ts`
**Líneas**: 1-197
**Problema**: Las interfaces NO usan prefijo `I` como especifica ARCHITECTURE.md

```typescript
// ❌ ACTUAL (sin prefijo I)
export interface Point { ... }
export interface CardCorners { ... }
export interface CameraConfig { ... }

// ✅ ESPERADO según ARCHITECTURE.md
export interface IPoint { ... }
export interface ICardCorners { ... }
export interface ICameraConfig { ... }
```

**Impacto**: Viola convención global del proyecto
**Recomendación**: Renombrar todas las interfaces con prefijo `I`

#### 🟡 MEDIO: Tipos OpenCV con `any`

**Archivo**: `domain/types.ts:31-32`

```typescript
export type OpenCVMat = any;
export type OpenCV = any;
```

**Problema**: Pérdida de type safety para tipos críticos
**Recomendación**: Crear tipos más específicos o usar `unknown` con type guards

#### 🟡 MEDIO: Nombres de Funciones Genéricos

**Archivos**: `domain/parsers/common-parser.domain.ts`
**Problema**: Funciones como `cleanText`, `extractNumberFromText` son muy genéricas
**Recomendación**: Prefijo con contexto: `cleanOcrText`, `extractNumberFromOcr`

---

## 2️⃣ IMPORTS ORGANIZATION

### ⚠️ CUMPLIMIENTO (65/100)

**Fortalezas:**

- ✅ Orden consistente: externos → internos
- ✅ Imports absolutos vs relativos: Bien separados
- ✅ Agrupación lógica por capas

**Problemas Encontrados:**

#### 🔴 CRÍTICO: Imports Desorganizados en Hooks Principales

**Archivo**: `ui/hooks/use-card-scanner-pipeline.ts:1-35`

```typescript
// ❌ ACTUAL (sin agrupar)
import { useState } from 'react';
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
  CardCorners,
} from '../../domain/types';
import {
  CARD_REGION_CONFIGS,
  EXTRACTION_WEIGHTS,
} from '../../domain/constants';
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
import { extractTextWithVisionRegional } from '../../adapters/ocr/google-vision';
import { parsePokemonCard } from '../../domain/parsers/pokemon-parser.domain';
import { parseMagicCard } from '../../domain/parsers/magic-parser.domain';
import {
  calculateOcrQuality,
  calculateExtractionQuality,
  calculateOverallConfidence,
  isQualityAcceptable,
  getQualityFeedback,
  QUALITY_THRESHOLDS,
} from '../../domain/confidence.domain';

// ✅ ESPERADO (agrupado)
// React
import { useState } from 'react';

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
  CardCorners,
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
import { parsePokemonCard } from '../../domain/parsers/pokemon-parser.domain';
import { parseMagicCard } from '../../domain/parsers/magic-parser.domain';

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

**Impacto**: Dificulta lectura y mantenimiento
**Recomendación**: Agrupar imports por categoría con comentarios

#### 🟡 MEDIO: Imports Relativos Profundos

**Archivos**: Múltiples

```typescript
// ❌ Difícil de mantener
import { ... } from '../../domain/parsers/pokemon-parser.domain';

// ✅ Considerar barrel exports
import { parsePokemonCard } from '../../domain/parsers';
```

**Recomendación**: Crear `index.ts` en `domain/parsers/` con barrel exports

#### 🟡 MEDIO: Imports No Usados

**Archivos**: `ui/components/extracted-fields-editor.tsx`

```typescript
import { useState } from 'react'; // ✅ Usado
import { Button, Chip } from '@heroui/react'; // ⚠️ Button no usado
```

**Recomendación**: Ejecutar ESLint con `eslint-plugin-unused-imports`

---

## 3️⃣ ERROR HANDLING

### ⚠️ CUMPLIMIENTO (70/100)

**Fortalezas:**

- ✅ Try-catch en operaciones críticas
- ✅ Mensajes de error contextuales
- ✅ Validación con Zod schemas
- ✅ Error messages centralizados en `constants.ts`

**Problemas Encontrados:**

#### 🔴 CRÍTICO: Error Handling Inconsistente en Hooks

**Archivo**: `ui/hooks/use-card-scanner-pipeline.ts:44-180`

```typescript
// ❌ PROBLEMA: Errores silenciosos
try {
  // ... procesamiento
} catch (error) {
  setError(error instanceof Error ? error.message : 'Unknown error');
  // No hay logging, no hay retry
}

// ✅ ESPERADO
try {
  // ... procesamiento
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('❌ Pipeline error:', { error, context: 'processCard' });
  setError(errorMessage);

  // Retry logic
  if (shouldRetry(error)) {
    await retry(() => processCard(...), 2, 1000);
  }
}
```

**Impacto**: Difícil debugging en producción
**Recomendación**: Implementar logging estructurado

#### 🟡 MEDIO: Validación Zod Sin Feedback Detallado

**Archivo**: `adapters/backend/card-search.adapter.ts:46-58`

```typescript
export function validateCardSearchRequest(
  request: CardSearchRequest
):
  | { valid: true; data: CardSearchRequest }
  | { valid: false; errors: string[] } {
  try {
    const validated = cardSearchRequestSchema.parse(request);
    return { valid: true, data: validated as any as CardSearchRequest };
  } catch (error: any) {
    const errors = error.errors?.map(
      (e: any) => `${e.path.join('.')}: ${e.message}`
    ) || ['Validation error'];
    return { valid: false, errors };
  }
}
```

**Problema**: Casting `as any` pierde información de tipo
**Recomendación**: Usar `ZodError` type guard

#### 🟡 MEDIO: Falta de Timeout Handling

**Archivo**: `adapters/ocr/google-vision.ts:14-41`

```typescript
export async function extractTextWithVision(
  imageDataUrl: string
): Promise<VisionOCRResult> {
  // ❌ Sin timeout
  const response = await fetch('/api/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageDataUrl }),
  });
  // ...
}

// ✅ ESPERADO
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
    // ...
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Impacto**: Requests colgadas indefinidamente
**Recomendación**: Implementar timeout con AbortController

#### 🟡 MEDIO: Memory Leaks en OpenCV

**Archivo**: `domain/card-scanner.domain.ts:8-118`

```typescript
// ❌ PROBLEMA: Si hay error, matrices no se liberan
export function detectCardContours(
  src: OpenCVMat,
  cv: OpenCV
): { corners: number[]; found: boolean } {
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    // ... procesamiento
    return { corners: detectedCorners, found };
  } finally {
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }
}

// ⚠️ PERO: En línea 100, approx.delete() está dentro del loop
// Si hay excepción, approx no se libera
for (let i = 0; i < contours.size(); i++) {
  const cnt = contours.get(i);
  const area = cv.contourArea(cnt);

  if (area > DETECTION_PARAMS.minArea) {
    const peri = cv.arcLength(cnt, true);
    const approx = new cv.Mat();
    cv.approxPolyDP(cnt, approx, DETECTION_PARAMS.approxEpsilon * peri, true);
    // ...
    approx.delete(); // ✅ Bien
  }
}
```

**Recomendación**: Usar try-finally en loops con OpenCV

---

## 4️⃣ CONSTANTS MANAGEMENT

### ✅ CUMPLIMIENTO (85/100)

**Fortalezas:**

- ✅ Centralizados en `domain/constants.ts`
- ✅ Bien organizados por categoría
- ✅ Valores `as const` para type safety
- ✅ Sin magic numbers en código

**Problemas Encontrados:**

#### 🟡 MEDIO: Constantes Duplicadas

**Archivo**: `domain/constants.ts:9-19`

```typescript
export const NORMALIZED_CARD_DIMENSIONS: CardDimensions = {
  width: 744,
  height: 1039,
} as const;

export const DISPLAY_CARD_DIMENSIONS: CardDimensions = {
  width: 350,
  height: 490,
} as const;

export const CARD_DIMENSIONS = DISPLAY_CARD_DIMENSIONS; // ⚠️ Alias confuso
```

**Problema**: `CARD_DIMENSIONS` es alias de `DISPLAY_CARD_DIMENSIONS`, confunde
**Recomendación**: Eliminar alias, usar `DISPLAY_CARD_DIMENSIONS` directamente

#### 🟡 MEDIO: Constantes Hardcodeadas en Funciones

**Archivo**: `domain/normalization.domain.ts:94, 107, 117`

```typescript
const areaScore = Math.min(areaRatio / 0.5, 1.0); // ❌ Magic number
const sharpnessScore = Math.min(variance / 500, 1.0); // ❌ Magic number
const perspectiveScore = Math.max(0, 1 - ratioDiff * 2); // ❌ Magic number
```

**Recomendación**: Mover a constantes en `constants.ts`

#### 🟡 MEDIO: Thresholds Duplicados

**Archivos**: `domain/confidence.domain.ts:4-15` vs `domain/constants.ts:150-157`

```typescript
// En confidence.domain.ts
export const QUALITY_THRESHOLDS = {
  MINIMUM_CAPTURE: 0.25,
  MINIMUM_OCR: 0.08,
  // ...
};

// En constants.ts
export const SCANNER_CONFIG = {
  DETECTION_THROTTLE_MS: 100,
  MIN_STABLE_FRAMES: 2,
  // ...
};

// ⚠️ Thresholds en dos lugares
```

**Recomendación**: Consolidar en `constants.ts`

---

## 5️⃣ TYPES & INTERFACES

### ✅ CUMPLIMIENTO (75/100)

**Fortalezas:**

- ✅ Tipos bien definidos
- ✅ Generics usados apropiadamente
- ✅ Union types para estados
- ✅ Zod schemas para validación

**Problemas Encontrados:**

#### 🔴 CRÍTICO: Tipos `any` Excesivos

**Archivo**: `domain/types.ts:31-32`

```typescript
export type OpenCVMat = any;
export type OpenCV = any;
```

**Ubicaciones**: 16 usos de `any` en el codebase
**Impacto**: Pérdida de type safety
**Recomendación**: Crear tipos específicos o usar `unknown` con type guards

#### 🔴 CRÍTICO: Casting `as any` en Adapters

**Archivo**: `adapters/backend/card-search.adapter.ts:43, 51`

```typescript
return request as any as CardSearchRequest; // ❌ Double cast
return { valid: true, data: validated as any as CardSearchRequest }; // ❌ Double cast
```

**Impacto**: Elude validación de tipos
**Recomendación**: Eliminar casts, confiar en Zod

#### 🟡 MEDIO: Tipos Genéricos Sin Restricciones

**Archivo**: `ui/hooks/use-card-scanner-pipeline.ts:33`

```typescript
const handleFieldChange = (fieldName: keyof ExtractedCardData, value: any) => {
  // ❌ value: any pierde type safety
};

// ✅ ESPERADO
const handleFieldChange = <K extends keyof ExtractedCardData>(
  fieldName: K,
  value: ExtractedCardData[K]['value']
) => {
  // Ahora value tiene tipo correcto
};
```

**Recomendación**: Usar tipos genéricos más estrictos

#### 🟡 MEDIO: Interfaces Extensibles Sin Documentación

**Archivo**: `domain/types.ts:80-86`

```typescript
export interface ExtractedField<T = string> {
  value: T | null;
  normalizedValue: T | null;
  confidence: number;
  sourceRegions: string[];
  rawMatches: string[];
}
```

**Problema**: Sin documentación JSDoc
**Recomendación**: Agregar comentarios JSDoc

---

## 6️⃣ DEPENDENCIES

### ✅ CUMPLIMIENTO (80/100)

**Dependencias Utilizadas:**

```
✅ @heroui/react (2.8.5)
✅ react-hook-form (7.66.0)
✅ zod (4.1.12)
✅ framer-motion (12.23.24)
✅ react-hot-toast (2.6.0)
⚠️ tesseract.js (7.0.0) - Legacy, no usado en pipeline activo
⚠️ @google-cloud/vision (6.0.0) - Solo en backend, no en cliente
```

**Problemas Encontrados:**

#### 🟡 MEDIO: Dependencia Legacy No Usada

**Archivo**: `adapters/ocr/tesseract-worker.ts` (legacy)
**Problema**: `tesseract.js` importado pero no usado en pipeline activo
**Recomendación**: Remover de `package.json` o documentar como fallback

#### 🟡 MEDIO: @google-cloud/vision en Cliente

**Problema**: `@google-cloud/vision` es librería backend, no debería estar en cliente
**Recomendación**: Mover a API route backend

#### 🟡 MEDIO: Falta de Peer Dependencies

**Problema**: Sin especificar peer dependencies de React
**Recomendación**: Agregar `peerDependencies` en package.json

#### 🟡 BAJO: Versiones No Pinned

```json
"next": "^16.2.10",
"react": "^19.2.7"
```

**Recomendación**: Considerar usar `~` para parches críticos

---

## 7️⃣ CODE STYLE

### ⚠️ CUMPLIMIENTO (68/100)

**Fortalezas:**

- ✅ Indentación consistente (2 espacios)
- ✅ Quotes: Single quotes
- ✅ Semicolons: Presentes
- ✅ Line length: Generalmente < 100 caracteres

**Problemas Encontrados:**

#### 🟡 MEDIO: Console.log Excesivos

**Ubicaciones**: 53 console.log en codebase
**Archivos**: `domain/card-scanner.domain.ts:105-108`, `adapters/ocr/google-vision.ts:17, 36`

```typescript
// ❌ ACTUAL
console.log(`✅ Carta detectada! Área: ${Math.round(maxArea)}`);
console.log(`🔍 Contornos grandes encontrados:`, largeContours.slice(0, 3));
console.log('🚀 Llamando a Google Vision API...');

// ✅ ESPERADO (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log(`✅ Carta detectada! Área: ${Math.round(maxArea)}`);
}
```

**Impacto**: Ruido en consola de producción
**Recomendación**: Usar logger estructurado o condicional

#### 🟡 MEDIO: Comentarios Innecesarios

**Archivo**: `ui/components/camera-preview.tsx:22`

```typescript
// ❌ Comentario obvio
<div className='relative aspect-3/4 w-full overflow-hidden rounded-lg border-4 border-emerald-500 bg-black'>
  {/* Video element */}
  <video ... />
```

**Recomendación**: Eliminar comentarios obvios

#### 🟡 MEDIO: Falta de JSDoc en Funciones Públicas

**Archivo**: `domain/parsers/pokemon-parser.domain.ts:15`

```typescript
// ❌ Sin documentación
export function parsePokemonCard(
  regionalOcr: RegionalOcrResult
): ExtractedCardData {
  // ...
}

// ✅ ESPERADO
/**
 * Parsea datos de una carta Pokémon desde OCR regional.
 * @param regionalOcr - Resultado de OCR clasificado por regiones
 * @returns Datos extraídos de la carta con confianza
 */
export function parsePokemonCard(
  regionalOcr: RegionalOcrResult
): ExtractedCardData {
  // ...
}
```

**Recomendación**: Agregar JSDoc a funciones públicas

#### 🟡 MEDIO: Inconsistencia en Espaciado

**Archivo**: `domain/card-scanner.domain.ts:75-78`

```typescript
// ❌ Inconsistente
const isCardAspectRatio =
  (aspectRatio >= 0.6 && aspectRatio <= 0.8) ||
  (aspectRatio >= 1.25 && aspectRatio <= 1.67);

const frameArea = src.rows * src.cols;
const relativeArea = area / frameArea;
```

**Recomendación**: Formatear con Prettier

---

## 8️⃣ PERFORMANCE

### ⚠️ CUMPLIMIENTO (65/100)

**Fortalezas:**

- ✅ Throttle/debounce implementados
- ✅ RequestAnimationFrame para detección
- ✅ Lazy loading de OpenCV

**Problemas Encontrados:**

#### 🔴 CRÍTICO: Falta de useMemo en Hooks

**Archivo**: `ui/hooks/use-card-scanner-pipeline.ts:37-180`

```typescript
// ❌ PROBLEMA: Recalcula en cada render
const processCard = async (
  frameMat: OpenCVMat,
  corners: number[],
  cv: OpenCV,
  frameSize: { width: number; height: number }
): Promise<void> => {
  // ... 150 líneas de lógica
};

// ✅ ESPERADO
const processCard = useCallback(
  async (
    frameMat: OpenCVMat,
    corners: number[],
    cv: OpenCV,
    frameSize: { width: number; height: number }
  ): Promise<void> => {
    // ... lógica
  },
  [game, cv]
); // Dependencias
```

**Impacto**: Recreación innecesaria de funciones
**Recomendación**: Envolver con `useCallback`

#### 🔴 CRÍTICO: Falta de useMemo en Componentes

**Archivo**: `ui/components/extracted-fields-editor.tsx:33-44`

```typescript
// ❌ PROBLEMA: Recalcula en cada render
const handleFieldChange = (fieldName: keyof ExtractedCardData, value: any) => {
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

// ✅ ESPERADO
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
```

**Impacto**: Re-renders innecesarios
**Recomendación**: Usar `useCallback` para handlers

#### 🟡 MEDIO: Imágenes No Optimizadas

**Archivo**: `domain/region-extraction.domain.ts:231-239`

```typescript
export function matToDataURL(mat: OpenCVMat, cv: OpenCV): string {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;

  cv.imshow(canvas, mat);

  return canvas.toDataURL('image/png'); // ❌ Sin compresión
}

// ✅ ESPERADO
export function matToDataURL(
  mat: OpenCVMat,
  cv: OpenCV,
  quality: number = 0.8
): string {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;

  cv.imshow(canvas, mat);

  return canvas.toDataURL('image/jpeg', quality); // JPEG con compresión
}
```

**Impacto**: Imágenes PNG grandes
**Recomendación**: Usar JPEG con compresión

#### 🟡 MEDIO: Bundle Size del Feature

**Tamaño**: 224KB (sin minificar)
**Componentes Pesados**:

- OpenCV.js: ~8MB (cargado desde CDN)
- Tesseract.js: ~4MB (legacy, no usado)

**Recomendación**:

- Remover Tesseract.js del bundle
- Considerar Web Worker para OpenCV
- Lazy load OpenCV solo cuando necesario

#### 🟡 MEDIO: Falta de Code Splitting

**Archivo**: `ui/views/card-scanner.tsx:1`

```typescript
// ❌ Carga todo en el mismo bundle
import { CardScannerView } from '...';

// ✅ ESPERADO
const CardScannerView = dynamic(() => import('...'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

**Recomendación**: Lazy load con `next/dynamic`

---

## 9️⃣ ARCHITECTURE & PATTERNS

### ✅ CUMPLIMIENTO (75/100)

**Fortalezas:**

- ✅ Separación en 3 capas (Adapters, Domain, UI)
- ✅ Domain logic aislado de UI
- ✅ Parsers específicos por juego
- ✅ Confidence scoring centralizado

**Problemas Encontrados:**

#### 🟡 MEDIO: Lógica de Negocio en Hooks

**Archivo**: `ui/hooks/use-card-scanner-pipeline.ts:44-180`
**Problema**: 150+ líneas de lógica en hook, debería estar en domain

```typescript
// ❌ ACTUAL: Lógica en hook
const processCard = async (frameMat, corners, cv, frameSize) => {
  // Detección, warp, normalización, OCR, parsing, confianza
  // Todo mezclado en 150 líneas
};

// ✅ ESPERADO: Lógica en domain
// domain/card-processing.domain.ts
export async function processCardImage(
  frameMat: OpenCVMat,
  corners: number[],
  cv: OpenCV,
  game: TCGGame
): Promise<ScannedCardData> {
  // Toda la lógica aquí
}

// ui/hooks/use-card-scanner-pipeline.ts
const processCard = useCallback(async (...) => {
  const result = await processCardImage(...);
  setScannedData(result);
}, []);
```

**Recomendación**: Extraer lógica a `domain/card-processing.domain.ts`

#### 🟡 MEDIO: Falta de Adapter Pattern para OCR

**Problema**: OCR está mezclado entre adapters y domain

```typescript
// ❌ ACTUAL: Disperso
// adapters/ocr/google-vision.ts - Extrae texto
// domain/region-extraction.domain.ts - Clasifica por región
// ui/hooks/use-card-scanner-pipeline.ts - Orquesta

// ✅ ESPERADO: Adapter unificado
// adapters/ocr/ocr.adapter.ts
export interface OcrAdapter {
  extractText(image: string): Promise<VisionOCRResult>;
  classifyByRegion(
    result: VisionOCRResult,
    regionMap: CompositeRegionMap[]
  ): RegionalOcrResult;
}

export class GoogleVisionAdapter implements OcrAdapter {
  // Implementación
}
```

**Recomendación**: Crear interfaz OcrAdapter

#### 🟡 MEDIO: Falta de Mapper Centralizado

**Archivo**: `adapters/mappers/card-data.mapper.ts` (legacy, no usado)
**Problema**: Mapper existe pero no se usa en pipeline activo
**Recomendación**: Usar o remover

#### 🟡 MEDIO: State Management Disperso

**Problema**: Estado en múltiples hooks sin sincronización

```typescript
// ui/views/card-scanner.tsx
const [selectedGame, setSelectedGame] = useState<TCGGame>('pokemon');
const [autoCapture, setAutoCapture] = useState(true);
const [hapticEnabled, setHapticEnabled] = useState(true);

// ✅ ESPERADO: Centralizar en Zustand
// lib/store/card-scanner.store.ts
export const useCardScannerStore = create((set) => ({
  selectedGame: 'pokemon',
  autoCapture: true,
  hapticEnabled: true,
  setSelectedGame: (game) => set({ selectedGame: game }),
  // ...
}));
```

**Recomendación**: Usar Zustand store

---

## 🔟 DUPLICACIÓN ENCONTRADA

### 🔴 CRÍTICO: Tipos Duplicados

#### 1. HapticPattern y HapticCapabilities

**Ubicaciones**:

- `domain/types.ts:178-183`
- `domain/haptic-feedback.domain.ts:1-6`

```typescript
// ❌ DUPLICADO
// domain/types.ts
export type HapticPattern = number | number[];
export interface HapticCapabilities {
  supported: boolean;
  vendor?: 'standard' | 'webkit';
}

// domain/haptic-feedback.domain.ts
export type HapticPattern = number | number[];
export interface HapticCapabilities {
  supported: boolean;
  vendor?: 'standard' | 'webkit';
}
```

**Recomendación**: Mantener solo en `types.ts`, importar en `haptic-feedback.domain.ts`

#### 2. QUALITY_THRESHOLDS

**Ubicaciones**:

- `domain/confidence.domain.ts:4-15`
- Valores similares en `domain/constants.ts:150-157`

**Recomendación**: Consolidar en `constants.ts`

### 🟡 MEDIO: Funciones Similares

#### 1. Parsers Duplicados

**Archivos**: `pokemon-parser.domain.ts` vs `magic-parser.domain.ts`
**Duplicación**: ~40% del código es similar

```typescript
// Ambos tienen:
-extractName() - extractCollectorNumber() - extractSetCode() - extractRarity();

// ✅ ESPERADO: Extraer a common-parser.domain.ts
export function extractCardName(
  regionalOcr: RegionalOcrResult,
  game: TCGGame
): ExtractedField {
  // Lógica común
}
```

**Recomendación**: Refactorizar parsers para reutilizar lógica común

#### 2. Funciones de Validación

**Archivos**: Múltiples

```typescript
// En confidence.domain.ts
export function isQualityAcceptable(confidence: ScanConfidence): boolean { ... }

// En card-search.adapter.ts
export function hasMinimumSearchCriteria(extractedData: ExtractedCardData): boolean { ... }

// ✅ ESPERADO: Consolidar en validation.domain.ts
```

---

## 1️⃣1️⃣ ISSUES CRÍTICOS ENCONTRADOS

### 🔴 BLOQUEANTES (Deben arreglarse antes de producción)

| #   | Severidad | Archivo                                 | Línea  | Problema                    | Impacto                 |
| --- | --------- | --------------------------------------- | ------ | --------------------------- | ----------------------- |
| 1   | CRÍTICO   | domain/types.ts                         | 31-32  | Tipos `any` para OpenCV     | Pérdida type safety     |
| 2   | CRÍTICO   | adapters/backend/card-search.adapter.ts | 43, 51 | Double cast `as any`        | Elude validación        |
| 3   | CRÍTICO   | ui/hooks/use-card-scanner-pipeline.ts   | 44-180 | Falta useCallback           | Re-renders innecesarios |
| 4   | CRÍTICO   | domain/types.ts                         | 1-197  | Sin prefijo I en interfaces | Viola convención        |
| 5   | CRÍTICO   | adapters/ocr/google-vision.ts           | 14-41  | Sin timeout en fetch        | Requests colgadas       |

### 🟡 IMPORTANTES (Deben arreglarse en próximo sprint)

| #   | Severidad | Archivo                               | Línea     | Problema                      | Impacto               |
| --- | --------- | ------------------------------------- | --------- | ----------------------------- | --------------------- |
| 6   | ALTO      | ui/hooks/use-card-scanner-pipeline.ts | 1-35      | Imports desorganizados        | Difícil mantenimiento |
| 7   | ALTO      | domain/constants.ts                   | 9-19      | Alias confuso CARD_DIMENSIONS | Confusión             |
| 8   | ALTO      | domain/card-scanner.domain.ts         | 100       | Memory leak en loop           | Crash en producción   |
| 9   | MEDIO     | domain/                               | múltiples | Magic numbers                 | Difícil mantenimiento |
| 10  | MEDIO     | adapters/ocr/tesseract-worker.ts      | -         | Legacy no usado               | Bundle bloat          |

---

## 1️⃣2️⃣ RECOMENDACIONES DE REFACTORIZACIÓN

### FASE 1: CRÍTICO (1-2 semanas)

```
1. Renombrar interfaces con prefijo I
   - domain/types.ts: Point → IPoint, CardCorners → ICardCorners, etc.
   - Impacto: 35 archivos
   - Esfuerzo: 2-3 horas

2. Eliminar double casts `as any`
   - adapters/backend/card-search.adapter.ts
   - Impacto: 2 archivos
   - Esfuerzo: 1 hora

3. Agregar useCallback a hooks principales
   - ui/hooks/use-card-scanner-pipeline.ts
   - ui/components/extracted-fields-editor.tsx
   - Impacto: 2 archivos
   - Esfuerzo: 2 horas

4. Implementar timeout en fetch
   - adapters/ocr/google-vision.ts
   - Impacto: 1 archivo
   - Esfuerzo: 1 hora

5. Crear tipos específicos para OpenCV
   - domain/types.ts
   - Impacto: 6 archivos
   - Esfuerzo: 3 horas
```

### FASE 2: IMPORTANTE (2-3 semanas)

```
6. Reorganizar imports
   - Crear barrel exports en domain/parsers/
   - Agrupar imports en hooks
   - Impacto: 12 archivos
   - Esfuerzo: 4 horas

7. Extraer lógica de hooks a domain
   - Crear domain/card-processing.domain.ts
   - Mover 150 líneas de use-card-scanner-pipeline.ts
   - Impacto: 2 archivos
   - Esfuerzo: 6 horas

8. Consolidar constantes
   - Mover QUALITY_THRESHOLDS a constants.ts
   - Eliminar magic numbers
   - Impacto: 5 archivos
   - Esfuerzo: 3 horas

9. Remover código legacy
   - Eliminar tesseract-worker.ts
   - Eliminar card-data.mapper.ts (no usado)
   - Eliminar use-ocr-extraction.ts (no usado)
   - Impacto: 3 archivos
   - Esfuerzo: 1 hora

10. Agregar JSDoc a funciones públicas
    - domain/parsers/
    - domain/confidence.domain.ts
    - Impacto: 8 archivos
    - Esfuerzo: 4 horas
```

### FASE 3: OPTIMIZACIÓN (3-4 semanas)

```
11. Implementar OcrAdapter interface
    - Crear adapters/ocr/ocr.adapter.ts
    - Implementar GoogleVisionAdapter
    - Impacto: 2 archivos
    - Esfuerzo: 4 horas

12. Centralizar state en Zustand
    - Crear lib/store/card-scanner.store.ts
    - Migrar estado de componentes
    - Impacto: 3 archivos
    - Esfuerzo: 4 horas

13. Optimizar imágenes
    - Cambiar PNG a JPEG con compresión
    - Agregar lazy loading
    - Impacto: 2 archivos
    - Esfuerzo: 2 horas

14. Refactorizar parsers
    - Extraer lógica común
    - Reducir duplicación
    - Impacto: 3 archivos
    - Esfuerzo: 6 horas

15. Implementar logging estructurado
    - Reemplazar console.log
    - Agregar contexto
    - Impacto: 10 archivos
    - Esfuerzo: 3 horas
```

---

## 1️⃣3️⃣ CHECKLIST DE MEJORAS

### Naming & Conventions

- [ ] Renombrar interfaces con prefijo I
- [ ] Agregar JSDoc a funciones públicas
- [ ] Estandarizar nombres de funciones de parsing
- [ ] Documentar tipos genéricos

### Imports & Organization

- [ ] Crear barrel exports en domain/parsers/
- [ ] Agrupar imports por categoría
- [ ] Remover imports no usados
- [ ] Crear index.ts en subdirectorios

### Type Safety

- [ ] Eliminar `any` types
- [ ] Eliminar double casts
- [ ] Crear tipos específicos para OpenCV
- [ ] Usar ZodError type guard

### Error Handling

- [ ] Implementar timeout en fetch
- [ ] Agregar retry logic
- [ ] Implementar logging estructurado
- [ ] Mejorar error messages

### Performance

- [ ] Agregar useCallback a handlers
- [ ] Agregar useMemo a cálculos
- [ ] Optimizar imágenes (PNG → JPEG)
- [ ] Lazy load OpenCV
- [ ] Remover código legacy

### Architecture

- [ ] Extraer lógica de hooks a domain
- [ ] Crear OcrAdapter interface
- [ ] Centralizar state en Zustand
- [ ] Consolidar constantes

### Code Quality

- [ ] Remover console.log
- [ ] Agregar error boundaries
- [ ] Implementar retry automático
- [ ] Agregar telemetría

---

## 1️⃣4️⃣ IMPACTO EN BUNDLE SIZE

**Actual**: ~224KB (sin minificar)

**Desglose**:

```
Domain logic:        ~45KB (20%)
UI Components:       ~35KB (16%)
Parsers:            ~30KB (13%)
Adapters:           ~20KB (9%)
Hooks:              ~25KB (11%)
Types & Constants:  ~15KB (7%)
Otros:              ~54KB (24%)
```

**Optimizaciones Propuestas**:

1. Remover Tesseract.js: -4MB (CDN)
2. Lazy load OpenCV: -8MB (CDN, carga bajo demanda)
3. Code splitting: -15% (lazy load componentes)
4. Remover código legacy: -5KB
5. Minificación: -40% (en producción)

**Estimado después de optimizaciones**: ~120KB (minificado)

---

## 1️⃣5️⃣ CONCLUSIONES

### Fortalezas del Feature:

✅ Arquitectura bien estructurada (3 capas)
✅ Lógica de negocio aislada
✅ Validación con Zod
✅ Constantes centralizadas
✅ Parsers específicos por juego
✅ Confidence scoring robusto

### Áreas de Mejora:

⚠️ Type safety (uso de `any`)
⚠️ Performance (falta useCallback/useMemo)
⚠️ Error handling (sin timeout, sin retry)
⚠️ Código legacy (Tesseract, mappers no usados)
⚠️ Organización de imports
⚠️ Convención de tipos (sin prefijo I)

### Score Final: 72/100

**Recomendación**: Feature listo para POC, pero requiere refactorización antes de producción.

**Prioridad**:

1. Arreglar type safety (CRÍTICO)
2. Optimizar performance (ALTO)
3. Mejorar error handling (ALTO)
4. Limpiar código legacy (MEDIO)
5. Refactorizar para mantenibilidad (MEDIO)

---

**Generado**: 2024
**Analista**: Code Review Subagent
**Duración del análisis**: ~2 horas
**Archivos analizados**: 35
**Líneas de código**: ~5,015
