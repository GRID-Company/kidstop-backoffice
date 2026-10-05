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
5. **Captura automática** o presionar **"📷 Capturar Carta"**
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

- **Automático**: Captura cuando detecta carta estable por 1 segundo
- **Manual**: Presionar botón de captura cuando esté lista

## 🎯 Funcionalidades

### Detección en Tiempo Real

- ✅ Detección automática de contornos rectangulares
- ✅ Feedback visual con contorno verde cuando detecta carta
- ✅ Procesamiento a ~30 FPS
- ✅ Parámetros configurables por área, precisión y umbrales Canny

### Pipeline Completo de Procesamiento

- ✅ **Corrección de perspectiva** (warp) con ordenamiento inteligente de esquinas
- ✅ **Normalización** a dimensiones estándar TCG (350x490px, ratio 1:1.4)
- ✅ **Rotación automática** basada en orientación detectada
- ✅ **Extracción regional compuesta** por zonas específicas del juego
- ✅ **Preprocesamiento avanzado** con OpenCV (escala de grises, CLAHE, bilateral filter)
- ✅ **Métricas de calidad** de captura (sharpness, brightness, contrast)

### OCR Regional con Google Cloud Vision

- ✅ Extracción por regiones específicas (nombre, HP, número, set, rareza, etc.)
- ✅ Imagen compuesta optimizada para Vision API
- ✅ Clasificación de texto por región (nombre, número, texto, metadata)
- ✅ Precisión ~90-95% vs Tesseract ~30-40%
- ✅ Velocidad 1-2 segundos vs Tesseract 5-10 segundos

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
- ✅ Fallback a mock: `NEXT_PUBLIC_CARD_SCAN_USE_MOCK=true` u operación ausente del schema

### Visualización y Debug

- ✅ Vista de imagen normalizada
- ✅ Tabs: Editor / OCR Raw / Debug
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
│   ├── types.ts                         # Tipos del dominio (ScannerStatus, CaptureMetrics, etc.)
│   ├── constants.ts                     # Constantes (dimensiones, thresholds, regiones)
│   ├── card-scanner.domain.ts           # Detección de contornos + perspectiva
│   ├── image-processing.domain.ts       # Preprocesamiento OpenCV
│   ├── normalization.domain.ts          # Normalización, rotación y métricas de captura
│   ├── region-extraction.domain.ts      # Extracción regional compuesta + clasificación OCR
│   ├── confidence.domain.ts             # Cálculo de confianza y feedback
│   ├── utils.domain.ts                  # Throttle, debounce, formatters, retry
│   └── parsers/
│       ├── common-parser.domain.ts      # Helpers de parsing compartidos
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
    │   ├── camera-preview.tsx           # Video + canvas con overlay de carga
    │   ├── card-result.tsx              # Canvas de imagen normalizada
    │   ├── extracted-text.tsx           # Texto OCR completo + acciones
    │   ├── extracted-fields-editor.tsx  # Editor visual de campos extraídos
    │   ├── editable-field.tsx           # Campo editable individual
    │   ├── scanner-controls.tsx         # Botones capturar/reset + indicador auto
    │   ├── loading-state.tsx            # Overlay de estado del scanner
    │   ├── ocr-regions-debug.tsx        # Vista debug de regiones OCR
    │   └── scan-results-view.tsx        # Vista completa de resultados
    ├── hooks/
    │   ├── use-camera-stream.ts         # Gestión de getUserMedia y permisos
    │   ├── use-opencv.ts                # Inicialización de OpenCV.js
    │   ├── use-card-detection.ts        # Loop de detección de contornos
    │   ├── use-card-scanner-pipeline.ts # Pipeline completo (hook principal)
    │   └── use-card-search.ts           # Búsqueda en catálogo backend
    └── views/
        └── card-scanner.tsx             # Vista principal (orquestador)
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

1. **Captura** → Obtiene frame del video
2. **Warp** → Corrección de perspectiva con esquinas ordenadas
3. **Normalización** → Redimensiona a 350x490px
4. **Rotación** → Detecta y corrige orientación
5. **Métricas** → Calcula sharpness, brightness, contrast
6. **Extracción regional** → Recorta zonas específicas del juego
7. **Imagen compuesta** → Crea imagen optimizada para Vision
8. **OCR** → Envía a Google Cloud Vision
9. **Clasificación** → Asigna texto a regiones
10. **Parsing** → Extrae campos con parser del juego
11. **Confianza** → Calcula scores y genera feedback

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

Configurables en `DETECTION_PARAMS` (`domain/constants.ts`):

```typescript
{
  minArea: 15000,           // Área mínima del contorno
  approxEpsilon: 0.02,      // Precisión de aproximación poligonal
  cannyThreshold1: 75,      // Umbral bajo Canny
  cannyThreshold2: 200,     // Umbral alto Canny
  blurKernelSize: 5,        // Tamaño kernel de blur
  dilationIterations: 2     // Iteraciones de dilatación
}
```

### Thresholds de Confianza

Configurados en `CONFIDENCE_THRESHOLDS` (`domain/constants.ts`):

```typescript
{
  captureQuality: { good: 0.7, acceptable: 0.5 },
  ocrQuality: { good: 0.8, acceptable: 0.6 },
  extractionQuality: { good: 0.7, acceptable: 0.5 },
  overall: { good: 0.75, acceptable: 0.6 }
}
```

## 🐛 Troubleshooting

### La cámara no se activa

- Verificar permisos del navegador (Settings > Privacy > Camera)
- En iOS Safari: Settings > Safari > Camera
- Probar con HTTPS en producción (HTTP solo funciona en localhost)
- Revisar consola para errores de `getUserMedia`

### No detecta la carta

- **Mejorar iluminación** - Luz uniforme sin sombras
- **Aumentar contraste** - Fondo oscuro para cartas claras, viceversa
- **Ajustar distancia** - Carta debe ocupar ~60-80% del frame
- **Revisar parámetros** - Ajustar `DETECTION_PARAMS` en `domain/constants.ts`
- **Limpiar lente** - Asegurar cámara sin manchas

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

- **Actualmente es mock** - Pendiente integración con backend real
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

- [ ] Cache de resultados OCR por imagen hash
- [ ] Web Worker para procesamiento OpenCV
- [ ] Compresión de imagen antes de enviar a Vision
- [ ] Retry automático en caso de error OCR
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

- **Versión**: 2.3 (Pipeline completo + UI producción + integración real `cardScanSearch`)
- **Estado**: 🔵 POC congelado en `/escaneo-cartas` + 🟢 Producción integrada a `pokemonCardScanSearch`/`magicCardScanSearch` (mock detrás de `NEXT_PUBLIC_CARD_SCAN_USE_MOCK`)
- **Última actualización**: 2026-10-01
- **Próximo milestone**: Probar en dev → ajuste de regiones `setSymbol` si el backend requiere crops distintos

---
