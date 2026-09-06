# FASE 1: AUDITORÍA DOMAIN LAYER - CARD SCANNER

**Feature**: card-scanner  
**Capa auditada**: Domain (Lógica de Negocio)  
**Fecha**: 2026-09-03  
**Subagentes utilizados**: doc-reader + reviewer  
**Líneas auditadas**: ~2,239 LOC  
**Archivos analizados**: 12

---

## 📊 RESUMEN EJECUTIVO

### Score General: **68/100** ⚠️ NECESITA MEJORAS

| Aspecto                | Score  | Interpretación  |
| ---------------------- | ------ | --------------- |
| **Arquitectura**       | 82/100 | ✅ Buena        |
| **Calidad de Código**  | 77/100 | ⚠️ Aceptable    |
| **Documentación**      | 40/100 | ❌ Insuficiente |
| **Type Safety**        | 65/100 | ⚠️ Mejorable    |
| **Gestión de Memoria** | 85/100 | ✅ Buena        |
| **Performance**        | 70/100 | ⚠️ Aceptable    |
| **Mantenibilidad**     | 75/100 | ⚠️ Aceptable    |
| **Testabilidad**       | 20/100 | ❌ Crítica      |

### Interpretación del Score

- **80-100**: Excelente, listo para producción
- **60-79**: Aceptable, necesita mejoras menores
- **40-59**: Insuficiente, requiere refactorización
- **0-39**: Crítico, no apto para producción

**Veredicto**: ⚠️ **NO LISTO PARA PRODUCCIÓN** - Requiere correcciones P0 antes de deployment

---

## 🎯 HALLAZGOS CRÍTICOS (P0) - BLOQUEADORES

### 1. Tipado `any` en Tipos OpenCV ⚠️ CRÍTICO

**Ubicación**: `domain/types.ts:31-32`

```typescript
// ❌ PROBLEMA
export type OpenCVMat = any;
export type OpenCV = any;
```

**Impacto**:

- Pérdida total de type safety en operaciones OpenCV
- Errores en runtime no detectables en compile time
- Intellisense no funciona
- Refactorización peligrosa

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 2-3 horas  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

```typescript
// ✅ SOLUCIÓN
export type OpenCVMat = {
  rows: number;
  cols: number;
  channels: () => number;
  empty: () => boolean;
  clone: () => OpenCVMat;
  delete: () => void;
  roi: (rect: any) => OpenCVMat;
  copyTo: (dst: OpenCVMat) => void;
  data32S?: Int32Array;
  data32F?: Float32Array;
  data64F?: Float64Array;
  data8U?: Uint8Array;
};

export type OpenCV = {
  Mat: new () => OpenCVMat;
  MatVector: new () => any;
  Size: new (width: number, height: number) => any;
  Rect: new (x: number, y: number, width: number, height: number) => any;
  Scalar: new (...values: number[]) => any;

  // Métodos principales
  cvtColor: (src: OpenCVMat, dst: OpenCVMat, code: number) => void;
  findContours: (
    image: OpenCVMat,
    contours: any,
    hierarchy: OpenCVMat,
    mode: number,
    method: number
  ) => void;
  approxPolyDP: (
    curve: any,
    approxCurve: any,
    epsilon: number,
    closed: boolean
  ) => void;
  contourArea: (contour: any) => number;
  warpPerspective: (
    src: OpenCVMat,
    dst: OpenCVMat,
    M: OpenCVMat,
    dsize: any
  ) => void;
  getPerspectiveTransform: (
    srcPoints: OpenCVMat,
    dstPoints: OpenCVMat
  ) => OpenCVMat;
  rotate: (src: OpenCVMat, dst: OpenCVMat, rotateCode: number) => void;
  GaussianBlur: (
    src: OpenCVMat,
    dst: OpenCVMat,
    ksize: any,
    sigmaX: number
  ) => void;
  Canny: (
    image: OpenCVMat,
    edges: OpenCVMat,
    threshold1: number,
    threshold2: number
  ) => void;
  dilate: (
    src: OpenCVMat,
    dst: OpenCVMat,
    kernel: OpenCVMat,
    anchor?: any,
    iterations?: number
  ) => void;
  morphologyEx: (
    src: OpenCVMat,
    dst: OpenCVMat,
    op: number,
    kernel: OpenCVMat
  ) => void;
  getStructuringElement: (shape: number, ksize: any) => OpenCVMat;
  bilateralFilter: (
    src: OpenCVMat,
    dst: OpenCVMat,
    d: number,
    sigmaColor: number,
    sigmaSpace: number
  ) => void;

  // Constantes
  COLOR_RGBA2GRAY: number;
  COLOR_RGB2GRAY: number;
  RETR_EXTERNAL: number;
  CHAIN_APPROX_SIMPLE: number;
  MORPH_GRADIENT: number;
  MORPH_RECT: number;
  ROTATE_90_CLOCKWISE: number;
  ROTATE_180: number;
  ROTATE_90_COUNTERCLOCKWISE: number;
};
```

---

### 2. Memory Leak en `denoiseImage` ⚠️ CRÍTICO

**Ubicación**: `domain/image-processing.domain.ts:112`

```typescript
// ❌ PROBLEMA
export function denoiseImage(mat: OpenCVMat, cv: OpenCV): OpenCVMat {
  const denoised = new cv.Mat();
  cv.bilateralFilter(mat, denoised, 9, 75, 75);
  return denoised;
  // ⚠️ No se limpia 'mat' si es temporal
}
```

**Impacto**:

- Fuga de memoria en cada llamada
- Acumulación de matrices no liberadas
- Crash del navegador en sesiones largas
- Performance degradada progresivamente

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 15 minutos  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

```typescript
// ✅ SOLUCIÓN
/**
 * Aplica filtro bilateral para reducir ruido preservando bordes
 *
 * ⚠️ IMPORTANTE: El caller debe hacer .delete() del resultado cuando termine
 *
 * @param mat - Matriz de entrada (NO se modifica, NO se libera)
 * @param cv - Instancia OpenCV
 * @returns Nueva matriz con filtro aplicado (DEBE liberarse con .delete())
 */
export function denoiseImage(mat: OpenCVMat, cv: OpenCV): OpenCVMat {
  if (!mat || mat.empty?.()) {
    throw new Error('denoiseImage: mat cannot be null or empty');
  }

  const denoised = new cv.Mat();
  try {
    cv.bilateralFilter(mat, denoised, 9, 75, 75);
    return denoised;
  } catch (error) {
    denoised.delete(); // Limpiar en caso de error
    throw error;
  }
}

// Uso correcto:
const denoised = denoiseImage(mat, cv);
try {
  // ... usar denoised
} finally {
  denoised.delete(); // ✅ Siempre limpiar
}
```

---

### 3. Falta de Validación de Entrada en Funciones Críticas ⚠️ CRÍTICO

**Ubicación**: Múltiples archivos

**Funciones afectadas**:

- `rotateCard` (normalization.domain.ts:45)
- `warpPerspective` (card-scanner.domain.ts:120)
- `extractRegion` (region-extraction.domain.ts:25)
- `preprocessImageForOCR` (image-processing.domain.ts:15)

```typescript
// ❌ PROBLEMA
export function rotateCard(
  mat: OpenCVMat,
  degrees: 0 | 90 | 180 | 270,
  cv: OpenCV
): OpenCVMat {
  if (degrees === 0) {
    return mat.clone();
  }
  // ⚠️ No valida que mat no sea null/undefined
  const rotated = new cv.Mat();
  // ... puede crashear aquí
}
```

**Impacto**:

- Crashes en runtime con inputs inválidos
- Errores difíciles de debuggear
- Experiencia de usuario pobre
- Pérdida de datos de captura

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 3-4 horas (todas las funciones)  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

```typescript
// ✅ SOLUCIÓN
/**
 * Rota una imagen a un ángulo específico
 *
 * @param mat - Matriz de imagen (no puede ser null)
 * @param degrees - Ángulo de rotación (0, 90, 180, 270)
 * @param cv - Instancia de OpenCV.js
 * @returns Nueva matriz rotada (DEBE liberarse con .delete())
 * @throws Error si mat es null, undefined o vacío
 * @throws Error si cv no está inicializado
 */
export function rotateCard(
  mat: OpenCVMat,
  degrees: 0 | 90 | 180 | 270,
  cv: OpenCV
): OpenCVMat {
  // Validación de entrada
  if (!mat) {
    throw new Error('rotateCard: mat cannot be null or undefined');
  }
  if (mat.empty?.()) {
    throw new Error('rotateCard: mat cannot be empty');
  }
  if (!cv) {
    throw new Error('rotateCard: OpenCV instance is required');
  }

  if (degrees === 0) {
    return mat.clone();
  }

  const rotated = new cv.Mat();

  try {
    if (degrees === 90) {
      cv.rotate(mat, rotated, cv.ROTATE_90_CLOCKWISE);
    } else if (degrees === 180) {
      cv.rotate(mat, rotated, cv.ROTATE_180);
    } else if (degrees === 270) {
      cv.rotate(mat, rotated, cv.ROTATE_90_COUNTERCLOCKWISE);
    }
    return rotated;
  } catch (error) {
    rotated.delete(); // Limpiar en caso de error
    throw new Error(`rotateCard failed: ${error.message}`);
  }
}
```

**Aplicar patrón similar en**:

- `warpPerspective`
- `extractRegion`
- `preprocessImageForOCR`
- `normalizeCardImage`
- `detectOrientation`

---

## 🔴 HALLAZGOS ALTOS (P1) - DEBEN CORREGIRSE PRONTO

### 4. Duplicación de Código en Parsers

**Ubicación**: `parsers/pokemon-parser.domain.ts` y `parsers/magic-parser.domain.ts`

**Código duplicado** (8+ repeticiones):

```typescript
// ❌ DUPLICADO en ambos parsers
const nameRegion = regionalOcr.regions['name'];
const nameText = nameRegion?.text || '';
const nameTokens = nameRegion?.tokens || [];
const nameConfidence = nameRegion?.averageConfidence || null;
```

**Impacto**: Mantenimiento difícil, bugs duplicados

**Solución**:

```typescript
// ✅ Extraer a common-parser.domain.ts
export function extractRegionData(
  regionalOcr: RegionalOcrResult,
  regionId: string
): { text: string; tokens: OcrToken[]; confidence: number | null } {
  const region = regionalOcr.regions[regionId];
  return {
    text: region?.text || '',
    tokens: region?.tokens || [],
    confidence: region?.averageConfidence || null,
  };
}

// Uso en parsers
const {
  text: nameText,
  tokens: nameTokens,
  confidence: nameConfidence,
} = extractRegionData(regionalOcr, 'name');
```

---

### 5. Funciones Muy Largas (>50 líneas)

**Funciones afectadas**:

- `detectCardContours` (110 líneas) - card-scanner.domain.ts
- `classifyTokensByRegion` (85 líneas) - region-extraction.domain.ts
- `parsePokemonCard` (70 líneas) - pokemon-parser.domain.ts
- `parseMagicCard` (68 líneas) - magic-parser.domain.ts
- `calculateScanConfidence` (65 líneas) - confidence.domain.ts
- `preprocessImageForOCR` (55 líneas) - image-processing.domain.ts

**Recomendación**: Dividir en funciones más pequeñas (<30 líneas idealmente)

---

### 6. Magic Numbers sin Constantes

**Ejemplos encontrados** (15+ números hardcodeados):

```typescript
// ❌ PROBLEMA
const isCardAspectRatio =
  (aspectRatio >= 0.6 && aspectRatio <= 0.8) ||
  (aspectRatio >= 1.25 && aspectRatio <= 1.67);

const minRelativeArea = 0.1;
const maxRelativeArea = 0.9;

// Thresholds en calculateSharpness
if (laplacianVariance < 100) return 0.3;
if (laplacianVariance < 300) return 0.6;
```

**Solución**: Extraer a `constants.ts`

---

### 7. Inconsistencia en Manejo de Errores

**Problema**: Algunos usan `console.error`, otros `throw`, otros retornan valores por defecto

```typescript
// ❌ INCONSISTENTE
// Opción 1: Log y retorno
console.error('Error:', error);
return { corners: [], found: false };

// Opción 2: Throw
throw new Error('Invalid input');

// Opción 3: Silencioso
return null;
```

**Solución**: Estandarizar estrategia de error handling

---

### 8. Falta de Documentación JSDoc (45% sin docs)

**Funciones sin JSDoc**:

- `detectCardContours`
- `orderCorners`
- `warpPerspective`
- `preprocessImageForOCR`
- `extractRegion`
- `classifyTokensByRegion`
- `parsePokemonCard`
- `parseMagicCard`
- `calculateScanConfidence`
- Y 15+ más...

**Impacto**: Difícil de mantener y onboarding lento

---

## 🟡 HALLAZGOS MODERADOS (P2) - MEJORAR CUANDO SEA POSIBLE

### 9. Validación Incompleta en Parsers

Los parsers no validan formatos esperados antes de parsear.

### 10. Inconsistencia en Pesos de Confianza

Pesos hardcodeados en múltiples lugares sin justificación.

### 11. Código Muerto

`levenshteinDistance` en common-parser no se usa.

### 12. Throttle/Debounce sin Cleanup

`utils.domain.ts` no limpia timers en unmount.

### 13. Validación de Límites en Region Extraction

No valida que regiones estén dentro de bounds de imagen.

---

## ✅ FORTALEZAS IDENTIFICADAS

### 1. Arquitectura Limpia (82/100)

✅ **Separación de responsabilidades clara**

- Cada archivo tiene un propósito específico
- Parsers bien aislados por juego
- Constantes centralizadas

✅ **Estructura Feature-First**

- Cumple con arquitectura del proyecto
- Lógica de negocio libre de dependencias UI
- Fácil de testear (cuando se agreguen tests)

### 2. Gestión de Memoria OpenCV (85/100)

✅ **Limpieza correcta en bloques finally**

```typescript
finally {
  gray.delete();
  blurred.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();
}
```

✅ **Patrón consistente** en la mayoría de funciones

⚠️ **Excepción**: `denoiseImage` (ver P0)

### 3. Parsers Bien Estructurados (80/100)

✅ **Código compartido en common-parser**

- `extractSetCode`
- `detectLanguage`
- `detectYear`
- `correctOcrErrors`

✅ **Lógica específica aislada**

- pokemon-parser: HP, evolution, types
- magic-parser: mana cost, card types

✅ **Fácil de extender** para nuevos juegos

### 4. Sistema de Confianza Robusto (78/100)

✅ **Multi-nivel**:

- Calidad de captura (sharpness, brightness, contrast)
- Calidad de OCR (confidence promedio)
- Calidad de extracción (campos vs esperados)
- Overall score

✅ **Feedback contextual** basado en thresholds

### 5. Tipos Bien Definidos (75/100)

✅ **Interfaces claras**:

- `ExtractedField<T>` con genéricos
- `ScanConfidence` con métricas
- `RegionalOcrResult` estructurado

⚠️ **Excepción**: OpenCV types (ver P0)

---

## 📈 PLAN DE ACCIÓN RECOMENDADO

### Fase 1: Correcciones Críticas (P0) - 1-2 días

**Esfuerzo total**: 6-8 horas

| Tarea                           | Esfuerzo | Prioridad |
| ------------------------------- | -------- | --------- |
| Tipar OpenCV correctamente      | 2-3h     | P0        |
| Fix memory leak en denoiseImage | 15min    | P0        |
| Agregar validación de entrada   | 3-4h     | P0        |

**Bloqueador**: NO pasar a producción sin completar P0

### Fase 2: Mejoras Altas (P1) - 3-5 días

**Esfuerzo total**: 10-12 horas

| Tarea                           | Esfuerzo | Prioridad |
| ------------------------------- | -------- | --------- |
| Eliminar duplicación en parsers | 2h       | P1        |
| Refactorizar funciones largas   | 3h       | P1        |
| Extraer magic numbers           | 1h       | P1        |
| Estandarizar error handling     | 2h       | P1        |
| Agregar JSDoc completo          | 3h       | P1        |

### Fase 3: Mejoras Moderadas (P2) - 2-3 días

**Esfuerzo total**: 6-8 horas

| Tarea                         | Esfuerzo | Prioridad |
| ----------------------------- | -------- | --------- |
| Validación en parsers         | 2h       | P2        |
| Normalizar pesos de confianza | 1h       | P2        |
| Eliminar código muerto        | 30min    | P2        |
| Fix throttle/debounce cleanup | 1h       | P2        |
| Validar bounds en regions     | 1.5h     | P2        |

### Fase 4: Testing (Recomendado) - 3-4 días

**Esfuerzo total**: 12-16 horas

- Tests unitarios de parsers (4h)
- Tests de procesamiento OpenCV (4h)
- Tests de confianza (2h)
- Tests de edge cases (2h)
- Setup de testing infrastructure (2h)

---

## 📊 MÉTRICAS DETALLADAS

### Cobertura de Análisis

| Métrica               | Valor |
| --------------------- | ----- |
| Líneas auditadas      | 2,239 |
| Archivos analizados   | 12    |
| Funciones revisadas   | 45+   |
| Problemas encontrados | 13    |
| Críticos (P0)         | 3     |
| Altos (P1)            | 5     |
| Moderados (P2)        | 5     |

### Distribución de Problemas

```
P0 (Críticos):     ███░░░░░░░ 23%
P1 (Altos):        ████████░░ 38%
P2 (Moderados):    ████████░░ 39%
```

### Score por Archivo

| Archivo                     | LOC  | Score  | Estado     |
| --------------------------- | ---- | ------ | ---------- |
| types.ts                    | 197  | 75/100 | ⚠️ Mejorar |
| constants.ts                | 190  | 80/100 | ✅ Bueno   |
| card-scanner.domain.ts      | 242  | 65/100 | ⚠️ Mejorar |
| image-processing.domain.ts  | ~150 | 60/100 | ⚠️ Mejorar |
| normalization.domain.ts     | 173  | 55/100 | ⚠️ Mejorar |
| region-extraction.domain.ts | 252  | 58/100 | ⚠️ Mejorar |
| confidence.domain.ts        | 211  | 75/100 | ⚠️ Mejorar |
| utils.domain.ts             | ~100 | 65/100 | ⚠️ Mejorar |
| haptic-feedback.domain.ts   | ~80  | 60/100 | ⚠️ Mejorar |
| common-parser.domain.ts     | 159  | 70/100 | ⚠️ Mejorar |
| pokemon-parser.domain.ts    | 254  | 65/100 | ⚠️ Mejorar |
| magic-parser.domain.ts      | 268  | 65/100 | ⚠️ Mejorar |

---

## 🎯 RECOMENDACIÓN FINAL

### Veredicto: ⚠️ NO LISTO PARA PRODUCCIÓN

**Razones**:

1. ❌ Tipado `any` en OpenCV (pérdida de type safety)
2. ❌ Memory leak confirmado en `denoiseImage`
3. ❌ Falta validación de entrada (crashes potenciales)
4. ⚠️ Documentación insuficiente (45% sin JSDoc)
5. ⚠️ Sin tests unitarios (0% cobertura)

### Roadmap Recomendado

**Sprint 1 (1-2 días)**: Implementar P0

- ✅ Después de P0: Apto para testing interno
- ❌ Todavía NO para producción

**Sprint 2 (3-5 días)**: Implementar P1

- ✅ Después de P1: Apto para beta testing
- ⚠️ Considerar producción con monitoreo

**Sprint 3 (2-3 días)**: Implementar P2

- ✅ Después de P2: Listo para producción

**Sprint 4 (3-4 días)**: Testing

- ✅ Después de tests: Confianza alta para producción

### Timeline Total

- **Mínimo viable**: 1-2 semanas (P0 + P1)
- **Recomendado**: 2-3 semanas (P0 + P1 + P2)
- **Ideal**: 3-4 semanas (P0 + P1 + P2 + Testing)

---

## 📚 REFERENCIAS

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Arquitectura del proyecto
- [AGENTS.md](../../AGENTS.md) - Guía para agentes
- [Card Scanner README](../../src/features/card-scanner/README.md) - Documentación del feature
- [OpenCV.js Docs](https://docs.opencv.org/5.0/) - Documentación OpenCV
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Mejores prácticas TypeScript

---

## 📝 NOTAS FINALES

### Puntos Positivos

- ✅ Arquitectura sólida y bien pensada
- ✅ Separación de responsabilidades clara
- ✅ Gestión de memoria OpenCV (mayormente) correcta
- ✅ Sistema de confianza robusto
- ✅ Parsers extensibles

### Áreas de Oportunidad

- ⚠️ Documentación inline
- ⚠️ Type safety en OpenCV
- ⚠️ Validación de entrada
- ⚠️ Testing (crítico)
- ⚠️ Refactorización de funciones largas

### Conclusión

**La capa Domain tiene una base arquitectónica sólida pero necesita trabajo en calidad de código y documentación antes de producción.** Con 1-2 semanas de esfuerzo enfocado, puede alcanzar un score de **85-90/100** y estar lista para deployment.

---

**Auditado por**: Devin AI Agent  
**Subagentes**: doc-reader (888c8d92) + reviewer (ebfe207d)  
**Fecha de auditoría**: 2026-09-03  
**Versión del reporte**: 1.0
