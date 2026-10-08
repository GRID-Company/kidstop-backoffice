# Card Scanner - Pipeline v2

Sistema completo de escaneo y extracción de datos de cartas TCG usando OpenCV.js, Google Cloud Vision API y parsers específicos por juego.

## 🚀 Acceso

### UI de producción (Drawer + FAB)

El scanner de producción vive en un **Drawer global** accesible desde cualquier página autenticada:

- **FAB**: botón flotante `CardScannerFab` (esquina inferior derecha) montado en `AuthenticatedLayout`, visible para todos los roles.
- **Flujos**: botón "Escanear" en `/compras/nueva` (sección "Agregar cartas").
- **Estado global**: `useCardScannerStore` (`src/lib/store/card-scanner.ts`) controla `isOpen` y `source` (`'fab' | 'purchase' | 'catalog'`), que determina el CTA del candidato seleccionado.
- **Componentes producción** (`ui/components/`): `card-scanner-drawer.tsx` (shell), `scanner-panel.tsx` (orquestador de captura), `scanner-action-bar.tsx`, `scanner-results.tsx`, `scan-fields-editor.tsx`, `scan-field-row.tsx`, `scan-ocr-text.tsx`, `scan-status-banner.tsx`. Tema claro alineado al design system; el TCG se toma de `useSelectedTCGStore`.
- **Reutilizados del POC sin cambios**: `camera-preview`, `card-positioning-guide`, `torch-control` y todos los hooks (`use-camera-stream`, `use-opencv`, `use-card-detection`, `use-card-scanner-pipeline`, `use-card-search`).

### POC congelado (referencia)

La primera iteración queda **intacta** como referencia y demo:

- **Ruta local**: http://localhost:3000/escaneo-cartas (standalone, sin layout autenticado)
- **Acceso desde iPhone en red local**: http://192.168.100.9:3000/escaneo-cartas
- **Vista**: `ui/views/card-scanner.tsx` + componentes originales (tema oscuro) — no modificar.

## 📱 Uso

### Flujo Básico

1. **Permitir acceso a la cámara** cuando el navegador lo solicite
2. **Seleccionar el juego** (Pokémon o Magic) en el selector superior
3. **Posicionar la carta** dentro del recuadro de la cámara
4. Cuando detecte los 4 bordes, aparecerá un **contorno verde**
5. Presionar **"📷 Capturar Carta"** o activar **captura automática** (off por default)
6. El sistema procesará la carta automáticamente:
   - Corrección de perspectiva
   - Normalización y rotación
   - Extracción regional compuesta
   - OCR con Google Cloud Vision
   - Parsing de campos específicos del juego
   - Cálculo de confianza
7. **Revisar resultados** en la vista de resultados:
   - Imagen normalizada
   - Campos extraídos editables
   - Texto OCR completo
   - Vista debug de regiones
8. **Buscar en catálogo** para validar la carta
9. **Capturar otra carta** o ajustar campos manualmente

### Modos de Captura

- **Manual** (default): Presionar botón de captura cuando el contorno esté verde
- **Automático** (opt-in): Captura cuando detecta carta estable; **bloqueado** si hay flags de calidad activos (reflejos, escena oscura, carta muy lejos)

## 🎯 Funcionalidades

### Detección en Tiempo Real

Detección en cascada sobre el ROI de la guía (crop +4% margen) a ≤640px, con mapeo de esquinas a resolución completa:

1. **Canny adaptativo** — umbrales derivados de la media del frame + dilate/erode para unir bordes rotos
2. **Segmentación por color de fondo** — mediana de parches en las 4 esquinas del crop + `absdiff` + Otsu; resuelve combos de bajo contraste (p.ej. borde amarillo Pokémon sobre fondo blanco)
3. **Threshold Otsu dual-polarity** — escanea la máscara y su inversa (carta oscura sobre fondo claro y viceversa)
4. **ROI de la guía** — último recurso (nunca captura)

- ✅ `convexHull` + `approxPolyDP` agresivo (epsilon 0.1·perímetro) para esquinas exactas
- ✅ **Motion gate**: diff entre frames consecutivos salta la detección si hay movimiento (menos CPU, cero capturas borrosas)
- ✅ **EMA** en esquinas (α=0.4) + estabilidad temporal antes de habilitar captura
- ✅ **Buffer de frames estables** (6) con sharpness Laplacian — la captura usa el frame más nítido
- ✅ **Rechazos**: skew extremo, quads que tocan el borde del crop, cobertura fuera de rango, aspecto medido inválido
- ✅ **Quality flags** con debounce: `glare` (reflejos), `dark` (escena oscura), `tooSmall` (carta lejos) → hints persistentes + bloqueo de auto-captura
- ✅ Feedback visual con contorno verde (polyline sobre `drawImage` GPU — sin `cv.imshow` por frame)

### Pipeline Completo de Procesamiento

- ✅ **Gate de aspecto medido** del quad antes de procesar (rechaza detecciones deformadas)
- ✅ **Padding ~4%** al quad antes del warp — conserva margen de fondo real sin cortar bordes
- ✅ **Corrección de perspectiva** (warp) con ordenamiento inteligente de esquinas
- ✅ **Normalización** a 744×1039px (JPEG q0.9); preview de 350×490px
- ✅ **Rotación** por aspecto real del quad (landscape > 1.15 rota 90°)
- ✅ **Extracción regional compuesta** por zonas específicas del juego
- ✅ **Realce por región** (CLAHE si está disponible en el build de OpenCV, si no `equalizeHist`) + upscale ×2
- ✅ **Métricas de calidad** de captura (área, sharpness global + por zonas 4×3, perspectiva)

### OCR Regional con Google Cloud Vision

- ✅ `documentTextDetection` (modo documento denso) — **confianza real por palabra** (`textDetection` devolvía 0 siempre y rompía el quality gate)
- ✅ Extracción por regiones específicas (nombre, HP/manaCost, número, set, typeLine, etc.)
- ✅ Imagen compuesta optimizada para Vision API (regiones realzadas y escaladas ×2 sobre fondo blanco)
- ✅ Clasificación de texto por región (nombre, número, texto, metadata)
- ✅ Quality gate de OCR ponderado por región y por juego (Pokémon y Magic tienen pesos propios)
- ✅ Precisión ~90-95% vs Tesseract ~30-40%

### Parsers Específicos por Juego

**Pokémon Parser** (`pokemon-parser.domain.ts`):

- Nombre de la carta
- HP (puntos de vida)
- Número de carta / Total del set
- Código del set
- Rareza
- Idioma detectado
- Año de publicación

**Magic Parser** (`magic-parser.domain.ts`):

- Nombre de la carta
- Coste de maná
- Número de carta / Total del set
- Código del set
- Rareza
- Idioma detectado
- Año de publicación

### Sistema de Confianza

- ✅ **Calidad de captura** (sharpness, brightness, contrast)
- ✅ **Calidad de OCR** (confidence promedio de Vision API)
- ✅ **Calidad de extracción** (campos extraídos vs esperados)
- ✅ **Confianza general** (overall score)
- ✅ **Feedback contextual** basado en thresholds
- ✅ **Chips de confianza** por campo extraído

### Edición Manual de Campos

- ✅ Editor visual de campos extraídos
- ✅ Modo lectura/edición por campo
- ✅ Indicadores de confianza por campo
- ✅ Guardar/deshacer cambios
- ✅ Validación en tiempo real

### Búsqueda en Catálogo

- ✅ Integración real: `pokemonCardScanSearch` / `magicCardScanSearch` (Gemini + catálogo)
- ✅ Imagen normalizada como `originalImage` (Upload) + `setIcon` (crop región `setSymbol`)
- ✅ Criterios de búsqueda por nombre, set, número (imagen como fallback)
- ✅ `bestMatch` + `relatedCards` con precio/stock; `aiResolved` con traducciones ES
- ✅ Toggle "Búsqueda solo con IA" (`aiSearchOnly`) en `scanner-action-bar`: con AI ON captura el frame crudo del video sin detección ni OCR de Vision (`processRawCapture`), oculta el toggle de captura automática y envía solo `originalImage` al backend; con AI OFF mantiene el pipeline completo de detección + OCR. La respuesta muestra solo la interpretación de Gemini (sección "Interpretación" con chip "Resuelto por IA")
- ✅ Fallback a mock: `NEXT_PUBLIC_CARD_SCAN_USE_MOCK=true` u operación ausente del schema

### Visualización y Debug

- ✅ Vista de imagen normalizada
- ✅ Tabs: Editor / OCR Raw / Debug (siempre visible en la vista de resultados)
- ✅ Vista debug con imagen compuesta y texto por región
- ✅ Copiar texto OCR al portapapeles
- ✅ Descargar texto como .txt
- ✅ Métricas de rendimiento del pipeline

### Multi-TCG

- ✅ Soporte para Pokémon TCG
- ✅ Soporte para Magic: The Gathering
- ✅ Selector de juego en la UI
- ✅ Regiones específicas por juego
- ✅ Parsers específicos por juego

## 🏗️ Arquitectura

Sigue la arquitectura Feature-First del proyecto con separación en tres capas:

```
card-scanner/
├── domain/                              # Lógica de negocio
│   ├── types.ts                         # Tipos del dominio (ScannerStatus, IBufferedFrame, ICaptureFlags, etc.)
│   ├── constants.ts                     # Constantes (dimensiones, thresholds, regiones, motion/buffer)
│   ├── card-scanner.domain.ts           # Detección en cascada + perspectiva + padding de esquinas
│   ├── normalization.domain.ts          # Normalización, rotación, glare/brightness/sharpness por zonas
│   ├── region-extraction.domain.ts      # Extracción regional compuesta (realce CLAHE/equalizeHist)
│   ├── confidence.domain.ts             # Cálculo de confianza y quality gates (pesos por juego)
│   ├── haptic-feedback.domain.ts        # Vibración háptica en eventos clave
│   ├── logger.ts                        # Logger dev-gated (debug/info/warn/error)
│   ├── utils.domain.ts                  # Throttle, debounce, formatters, retry
│   └── parsers/
│       ├── common-parser.domain.ts      # Helpers de parsing + corrección de typos OCR
│       ├── pokemon-parser.domain.ts     # Parser específico de Pokémon
│       └── magic-parser.domain.ts       # Parser específico de Magic
│
├── adapters/                            # Adaptadores externos
│   ├── ocr/
│   │   └── google-vision.ts             # Adaptador Google Cloud Vision API
│   ├── mappers/
│   │   └── card-scan.mapper.ts          # Mapper respuesta API → dominio
│   ├── backend/
│   │   ├── card-search.adapter.ts       # CardScanSearchInput + queries reales con fallback a mock
│   │   └── card-search.mock.ts          # bestMatch/related/aiResolved mock
│   └── schemas/
│       └── card-search.schema.ts        # Schema Zod de CardScanSearchInput
│
└── ui/                                  # Capa de presentación
    ├── components/
    │   ├── card-scanner-drawer.tsx      # Shell del Drawer global (producción)
    │   ├── scanner-panel.tsx            # Orquestador de captura (producción)
    │   ├── scanner-action-bar.tsx       # Botones capturar + toggles auto-capture/aiSearchOnly
    │   ├── scanner-results.tsx          # Vista de resultados + editor + debug
    │   ├── scan-empty-state.tsx         # Estado inicial con tips por TCG
    │   ├── scan-status-banner.tsx       # Banner de estados/errores/quality flags
    │   ├── scan-fields-editor.tsx       # Editor de campos extraídos
    │   ├── scan-field-row.tsx           # Campo editable individual
    │   ├── scan-ocr-text.tsx            # Texto OCR raw
    │   ├── scan-results-view.tsx        # Vista de resultados del POC
    │   ├── camera-preview.tsx           # Video + canvas overlay
    │   ├── card-positioning-guide.tsx   # Guía visual de posicionamiento
    │   ├── torch-control.tsx            # Control de flash/linterna
    │   ├── card-result.tsx              # Canvas de imagen normalizada
    │   ├── extracted-text.tsx           # Texto OCR completo + acciones
    │   ├── extracted-fields-editor.tsx  # Editor visual (POC)
    │   ├── editable-field.tsx           # Campo editable individual (POC)
    │   ├── scanner-controls.tsx         # Botones capturar/reset (POC)
    │   ├── loading-state.tsx            # Overlay de estado del scanner
    │   └── ocr-regions-debug.tsx        # Vista debug de regiones OCR
    ├── hooks/
    │   ├── use-camera-stream.ts         # Gestión de getUserMedia y permisos
    │   ├── use-opencv.ts                # Inicialización de OpenCV.js
    │   ├── use-card-detection.ts        # Loop de detección + motion gate + frame buffer
    │   ├── use-card-scanner-pipeline.ts # Pipeline completo (hook principal)
    │   └── use-card-search.ts           # Búsqueda en catálogo backend
    └── views/
        └── card-scanner.tsx             # Vista principal del POC (/escaneo-cartas)
```

### Hooks Principales

| Hook                     | Propósito                           | Uso                        |
| ------------------------ | ----------------------------------- | -------------------------- |
| `useCardScannerPipeline` | Pipeline completo de procesamiento  | Hook principal del feature |
| `useCameraStream`        | Gestión de cámara y permisos        | Inicialización de video    |
| `useOpenCV`              | Carga e inicialización de OpenCV.js | Detección de contornos     |
| `useCardDetection`       | Loop de detección en tiempo real    | Feedback visual            |
| `useCardSearch`          | Búsqueda en catálogo backend        | Validación de carta        |

### Componentes Clave

| Componente              | Responsabilidad                           |
| ----------------------- | ----------------------------------------- |
| `CardScannerView`       | Orquestador principal, gestión de estados |
| `CameraPreview`         | Renderizado de video y canvas OpenCV      |
| `ScanResultsView`       | Vista completa de resultados con tabs     |
| `ExtractedFieldsEditor` | Editor de campos con confianza            |
| `OCRRegionsDebug`       | Visualización debug de regiones           |

## 🔧 Tecnologías

### Core

- **OpenCV.js 5.0** - Detección de contornos, transformación de perspectiva, preprocesamiento
- **Google Cloud Vision API** - OCR de alta precisión con extracción regional
- **Next.js 16** - Framework React con App Router
- **React 19** - Componentes y hooks
- **TypeScript 5** - Tipado estático

### UI & Utilities

- **HeroUI 2.8+** - Componentes UI (Button, Card, Chip, Tabs, Select)
- **Tailwind CSS 4** - Estilos
- **Framer Motion** - Animaciones
- **react-hot-toast** - Notificaciones
- **Zod** - Validación de schemas

### State Management

- **React useState** - Estado local de componentes
- **Custom hooks** - Lógica reutilizable

## 📝 Notas Técnicas

### OpenCV.js

- Se carga desde CDN (https://docs.opencv.org/5.0/opencv.js)
- Inicialización asíncrona con polling en `useOpenCV`
- **Crítico**: Siempre llamar `.delete()` en matrices para evitar memory leaks
- Procesamiento en `requestAnimationFrame` para 30 FPS

### Google Cloud Vision API

- **Endpoint**: `/api/ocr` (API route segura)
- **Credenciales**: Variables de entorno en servidor
- **Precisión**: ~90-95% vs Tesseract ~30-40%
- **Velocidad**: 1-2 segundos vs Tesseract 5-10 segundos
- **Costo**: Primeras 1,000 unidades/mes GRATIS, luego $1.50/1,000
- **Formato**: Base64 de imagen compuesta con regiones específicas

### Pipeline de Procesamiento

El pipeline completo (`useCardScannerPipeline`) ejecuta:

1. **Captura** → Usa el frame más nítido del buffer de frames estables
2. **Aspect gate** → Rechaza quads con aspecto medido fuera de [1.1, 1.8]
3. **Quality gate** → `calculateCaptureQuality` (área + sharpness por zonas + perspectiva) debe superar el mínimo
4. **Padding** → Expande el quad ~4% para conservar margen de fondo real
5. **Warp** → Corrección de perspectiva con esquinas ordenadas
6. **Normalización** → Redimensiona a 744×1039px (JPEG q0.9)
7. **Rotación** → Rota 90° si el quad era landscape
8. **Extracción regional** → Recorta zonas específicas del juego
9. **Imagen compuesta** → Regiones realzadas (CLAHE/equalizeHist) y escaladas ×2 sobre fondo blanco
10. **OCR** → `/api/ocr` → Google Cloud Vision `documentTextDetection`
11. **Clasificación** → Asigna texto a regiones por posición
12. **Parsing** → Extrae campos con parser del juego (+ corrección de typos numéricos)
13. **Confianza** → Calcula scores y genera feedback

### Regiones por Juego

Configuradas en `CARD_REGION_CONFIGS` (`domain/constants.ts`):

**Pokémon**:

- Nombre (top-left)
- HP (top-right)
- Número (bottom-right)
- Set info (bottom-center)

**Magic**:

- Nombre (top-center)
- Coste de maná (top-right)
- Número (bottom-left)
- Set info (bottom-center)

### Parámetros de Detección

Configurables en `domain/constants.ts`:

```typescript
DETECTION_PARAMS = {
  bkgThresh: 60, // Distancia mínima al color de fondo (segmentación por color)
  minAreaRatio: 0.01, // Área mínima del contorno vs frame
  maxAreaRatio: 0.9, // Área máxima del contorno vs frame
  approxEpsilon: 0.02, // Epsilon base de approxPolyDP (hull usa 0.1)
  minAspectRatioPortrait: 0.55, // Rango válido de aspecto portrait
  maxAspectRatioPortrait: 0.85,
  minAspectRatioLandscape: 1.18, // Rango válido de aspecto landscape
  maxAspectRatioLandscape: 1.82,
};

DETECTION_MAX_WIDTH = 640; // Ancho máx del frame para detección
MOTION_SAMPLE_WIDTH = 160; // Downscale para el diff de movimiento
MOTION_MAE_THRESHOLD = 7; // MAE gray sobre el que se considera "en movimiento"
FRAME_BUFFER_SIZE = 6; // Frames estables en el buffer de captura
QUAD_EXPAND_FACTOR = 1.04; // Padding del quad antes del warp
QUAD_ASPECT_RANGE = { min: 1.1, max: 1.8 }; // Aspecto medido válido post-warp
```

### Thresholds de Calidad

Configurados en `QUALITY_THRESHOLDS` (`domain/constants.ts`):

```typescript
{
  MINIMUM_CAPTURE: 0.25, MINIMUM_OCR: 0.08, MINIMUM_EXTRACTION: 0.05, MINIMUM_OVERALL: 0.15,
  GOOD_CAPTURE: 0.6, GOOD_OCR: 0.7, GOOD_EXTRACTION: 0.5,
  EXCELLENT_CAPTURE: 0.8, EXCELLENT_OCR: 0.85, EXCELLENT_EXTRACTION: 0.7,
}
```

## 🐛 Troubleshooting

### La cámara no se activa

- Verificar permisos del navegador (Settings > Privacy > Camera)
- En iOS Safari: Settings > Safari > Camera
- Probar con HTTPS en producción (HTTP solo funciona en localhost)
- Revisar consola para errores de `getUserMedia`

### No detecta la carta

- **Fondo por TCG** - Pokémon: fondo liso y oscuro; Magic: fondo liso y claro
- **Mejorar iluminación** - Luz uniforme sin sombras ni reflejos (flag `glare` se activa si hay destellos)
- **Ajustar distancia** - Carta debe llenar la guía (flag `tooSmall` si queda muy lejos)
- **Mantener quieta** - El motion gate pausa la detección si el frame se mueve
- **Limpiar lente** - Asegurar cámara sin manchas
- **Revisar parámetros** - Ajustar constantes en `domain/constants.ts`

### Calidad de captura baja

- **Sharpness bajo** - Enfocar mejor, limpiar lente, mejorar iluminación
- **Brightness extremo** - Ajustar luz ambiental, evitar reflejos
- **Contrast bajo** - Cambiar fondo, mejorar iluminación

### OCR no extrae texto correctamente

- **Verificar calidad de captura** - Revisar métricas en resultados
- **Mejorar resolución** - Acercar carta para mayor detalle
- **Texto enfocado** - Asegurar nitidez en zonas de texto
- **Revisar regiones** - Usar vista debug para validar recortes
- **Ajustar thresholds** - Modificar `CONFIDENCE_THRESHOLDS` si es necesario

### Parsing incorrecto de campos

- **Verificar juego seleccionado** - Pokémon vs Magic
- **Revisar texto OCR raw** - Validar que Vision extrajo correctamente
- **Editar manualmente** - Usar editor de campos para corregir
- **Reportar patrón** - Si es recurrente, ajustar parser específico

### Búsqueda en catálogo no funciona

- **Verificar backend** - `Failed to fetch` indica que el endpoint GraphQL no es alcanzable (revisar `NEXT_PUBLIC_API_URL`)
- **Forzar mock** - `NEXT_PUBLIC_CARD_SCAN_USE_MOCK=true` para desarrollo sin backend
- **Validar payload** - Revisar consola para errores de validación Zod
- **Verificar campos** - Nombre es requerido para búsqueda

## 🚀 Próximos Pasos

### Mejoras de UX

- [ ] Overlay guía para posicionar carta (grid/marco)
- [ ] Feedback háptico en captura exitosa (vibración)
- [ ] Modo flash/linterna para baja iluminación
- [ ] Tutorial interactivo en primer uso
- [ ] Historial de cartas escaneadas en sesión
- [ ] Comparación lado a lado con catálogo

### Integración Backend

- [x] Búsqueda automática en catálogo por nombre
- [x] Integración real `pokemonCardScanSearch`/`magicCardScanSearch`: `src/lib/api/graphql/card-scan-search.gql` ([Pokemon](../../../docs/api-guides/Pokemon-catalog-api-guide.md) §14 / [Magic](../../../docs/api-guides/Magic-Catalog-API-Guide.md) §12)
- [x] Pipeline candidato → compra ("Usar en compra" agrega el item con defaults NM/idioma/qty 1/precio de referencia)
- [ ] Mutation GraphQL para guardar cartas escaneadas
- [ ] Asociar con inventario existente
- [x] Sincronizar con store global de TCG (`src/lib/store/selected-tcg.ts`)

### Features Avanzadas

- [x] Detección de set/número de carta
- [x] Multi-TCG (Pokémon y Magic)
- [ ] Reconocimiento de condición (NM, LP, MP, HP, DMG)
- [ ] Batch scanning (múltiples cartas en secuencia)
- [ ] Exportar resultados a CSV/Excel
- [ ] Integración con compras (agregar a buylist)
- [ ] Soporte para Yu-Gi-Oh! y otros TCGs
- [ ] OCR offline con Tesseract como fallback

### Optimizaciones

- [x] Detección a resolución reducida (≤640px) + display por `drawImage` GPU
- [x] Motion gate — omite el pipeline de detección con la cámara en movimiento
- [x] Buffer de frames estables — captura el frame más nítido, no el del instante
- [ ] Cache de resultados OCR por imagen hash
- [ ] Web Worker para procesamiento OpenCV
- [ ] Matching por imagen (pHash/embeddings) como verificador de candidatos — ver `docs/Requirements/CardScanner-requirements.md`
- [ ] Migrar OCR al backend (server-side Vision/Gemini) — contrato ya documentado en `docs/Requirements/CardScanner-requirements.md`
- [ ] Telemetría de precisión y performance

### Testing

- [ ] Tests unitarios de parsers
- [ ] Tests de integración del pipeline
- [ ] Tests E2E con Cypress
- [ ] Benchmarks de performance

## 📚 Referencias

### Documentación

- [OpenCV.js Docs](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [Zod Documentation](https://zod.dev/)

### Proyecto

- [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) - Arquitectura del proyecto
- [PROJECT_CONTEXT.md](../../../docs/PROJECT_CONTEXT.md) - Contexto completo
- [AGENTS.md](../../../AGENTS.md) - Guía para agentes de IA

### API Guides

- [Pokemon-catalog-api-guide.md](../../../docs/api-guides/Pokemon-catalog-api-guide.md)
- [Magic-Catalog-API-Guide.md](../../../docs/api-guides/Magic-Catalog-API-Guide.md)

## 🔐 Variables de Entorno

Requeridas para Google Cloud Vision:

```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY=your-private-key
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

Ver [ENVIRONMENT_SETUP.md](../../../docs/ENVIRONMENT_SETUP.md) para más detalles.

## 📊 Estado del Feature

- **Versión**: 2.4 (Pipeline endurecido: detección en cascada, quality gates, OCR `documentTextDetection`)
- **Estado**: 🔵 POC congelado en `/escaneo-cartas` + 🟢 Producción integrada a `pokemonCardScanSearch`/`magicCardScanSearch` (mock detrás de `NEXT_PUBLIC_CARD_SCAN_USE_MOCK`)
- **Última actualización**: 2026-10-01
- **Próximo milestone**: Migrar OCR al backend (`cardScanSearch` con `originalImage`) — contrato en `docs/Requirements/CardScanner-requirements.md`

---
