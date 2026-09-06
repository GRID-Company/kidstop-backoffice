# Plan de implementación: escáner inteligente de cartas TCG

Necesito que analices la arquitectura actual de este proyecto Next.js y propongas la implementación más compatible con el código existente.

No quiero que reemplaces la arquitectura actual ni que generes componentes paralelos innecesarios. Primero inspecciona el proyecto, identifica los módulos existentes relacionados con cámara, OpenCV, captura, OCR, APIs y tipos; después adapta este plan a esa estructura.

## Contexto actual

Tenemos un POC en Next.js que:

1. Accede a la cámara del dispositivo.
2. Usa OpenCV.js para detectar el cuadrilátero de una carta TCG.
3. Corrige la perspectiva de la carta.
4. Genera una imagen frontal recortada.
5. Usa Google Cloud Vision OCR para extraer texto.
6. Ya dispone de un backend responsable de buscar y validar la carta.

El frontend no debe identificar definitivamente la carta ni consultar directamente los catálogos de Pokémon o Magic.

La responsabilidad del frontend es:

- Capturar y normalizar la imagen.
- Extraer mediante OCR la mayor cantidad posible de datos relevantes.
- Interpretar y normalizar localmente los datos encontrados.
- Asignar confianza a cada campo.
- Mandar al backend un payload estructurado.
- Mostrar los resultados devueltos por el backend.

## Objetivo

Construir un pipeline de extracción orientado a identificar cartas Pokémon y Magic mediante estos campos:

### Campos principales

- Nombre de la carta.
- Número de colección.
- Código de expansión, cuando exista como texto.
- Símbolo de expansión, cuando pueda detectarse visualmente.

### Campos secundarios

- HP, principalmente para Pokémon.
- Rareza.
- Idioma detectado.
- Año impreso.
- Texto OCR completo como respaldo.

Todos los campos deben poder enviarse como `null` cuando no sean detectados de forma confiable.

## Arquitectura esperada

```text
Cámara
  ↓
Detección del cuadrilátero con OpenCV
  ↓
Corrección de perspectiva
  ↓
Detección de orientación
  ↓
Normalización de dimensiones
  ↓
Extracción de regiones de interés
  ↓
Creación de una imagen OCR compuesta
  ↓
Una llamada a Google Vision
  ↓
Clasificación del texto por región
  ↓
Extracción y normalización de campos
  ↓
Cálculo de confianza
  ↓
Payload estructurado al backend
  ↓
Resultados candidatos
```

## 1. Analizar la implementación existente

Antes de modificar código:

1. Identifica dónde se inicializa OpenCV.
2. Identifica dónde se procesa cada frame.
3. Identifica cómo se detecta actualmente el cuadrilátero.
4. Identifica dónde se ejecuta `warpPerspective`.
5. Identifica cómo se captura la imagen final.
6. Identifica el endpoint o Server Action que llama a Google Vision.
7. Identifica los tipos y contratos utilizados actualmente.
8. Identifica cómo se calcula el porcentaje de confianza.
9. Revisa si existen utilidades reutilizables para:
   - Canvas.
   - Conversión a Blob.
   - Procesamiento de imágenes.
   - Manejo de cámara.
   - Llamadas HTTP.
   - Validación con Zod.
10. Señala código duplicado o responsabilidades mezcladas.

Entrega primero un resumen de la arquitectura encontrada y un plan de cambios por archivo.

No implementes una arquitectura nueva hasta comprender la existente.

## 2. Separar responsabilidades

Adapta los nombres y rutas a la arquitectura existente, pero intenta conservar esta separación conceptual:

```text
camera/
  Captura y control del stream.

opencv/
  Detección, perspectiva, orientación y recortes.

ocr/
  Construcción de la imagen compuesta y llamada a Vision.

parsers/
  Extracción de nombre, número, HP, set, rareza y año.

confidence/
  Cálculo de calidad y confianza por campo.

api/
  Contrato y envío al backend.

types/
  Modelos comunes del escaneo.
```

No es obligatorio crear estas carpetas literalmente si la arquitectura actual ya tiene otra organización.

## 3. Normalización de la carta

Después de corregir la perspectiva, todas las cartas deben tener dimensiones normalizadas.

Usar inicialmente una proporción estándar vertical:

```ts
const NORMALIZED_CARD_WIDTH = 744;
const NORMALIZED_CARD_HEIGHT = 1039;
```

La implementación debe:

- Mantener la relación de aspecto.
- Evitar estirar la imagen.
- Corregir rotaciones de 90°, 180° o 270° cuando sea posible.
- Mantener una copia de la carta completa.
- Generar las regiones OCR desde la imagen normalizada.
- Liberar correctamente cada `cv.Mat` para evitar fugas de memoria.

Si la carta no alcanza una calidad mínima, no debe llamarse inmediatamente al OCR.

## 4. Regiones de interés

Crear una configuración independiente por juego y, cuando sea necesario, por layout.

Ejemplo inicial:

```ts
type NormalizedRegion = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type CardRegionConfig = {
  game: 'pokemon' | 'magic';
  layout: string;
  regions: NormalizedRegion[];
};
```

Las coordenadas deben expresarse preferentemente como porcentajes entre `0` y `1`, no como píxeles absolutos.

Ejemplo:

```ts
const pokemonDefaultRegions: NormalizedRegion[] = [
  {
    id: 'name',
    x: 0.04,
    y: 0.02,
    width: 0.68,
    height: 0.1,
  },
  {
    id: 'hp',
    x: 0.7,
    y: 0.02,
    width: 0.26,
    height: 0.1,
  },
  {
    id: 'footer',
    x: 0.02,
    y: 0.82,
    width: 0.96,
    height: 0.16,
  },
  {
    id: 'setSymbol',
    x: 0.78,
    y: 0.82,
    width: 0.2,
    height: 0.16,
  },
];
```

Estas coordenadas son puntos de partida y deben ajustarse usando muestras reales.

### Pokémon

Extraer preferentemente:

- Encabezado: nombre y HP.
- Footer: número de colección, total, año y rareza.
- Área del símbolo de expansión.

### Magic

Extraer preferentemente:

- Encabezado: nombre y coste de maná.
- Línea de tipo.
- Footer izquierdo: collector number, rareza e idioma.
- Footer derecho: set code, cuando esté impreso.
- Área del símbolo de expansión.

Debido a que los layouts cambian entre generaciones, la configuración debe permitir agregar variantes sin modificar el pipeline principal.

## 5. Imagen OCR compuesta

No hacer una llamada independiente a Vision por cada región.

Después de recortar las regiones:

1. Escalar cada región para que el texto pequeño tenga mayor resolución.
2. Colocarlas verticalmente en un canvas o `cv.Mat`.
3. Separarlas mediante espacios blancos suficientemente grandes.
4. Registrar las coordenadas ocupadas por cada región.
5. Enviar la imagen compuesta a Vision mediante una sola operación de `TEXT_DETECTION`.
6. Clasificar cada palabra o bloque devuelto por Vision según sus coordenadas.

Ejemplo conceptual:

```text
┌──────────────────────────────┐
│ Región: nombre + HP          │
├──────────────────────────────┤
│                              │
├──────────────────────────────┤
│ Región: línea de tipo        │
├──────────────────────────────┤
│                              │
├──────────────────────────────┤
│ Región: footer               │
├──────────────────────────────┤
│                              │
├──────────────────────────────┤
│ Región: símbolo/set          │
└──────────────────────────────┘
```

No agregar etiquetas visibles como `NAME` o `FOOTER` dentro de la imagen, porque Vision podría incluirlas en el resultado.

Crear metadata separada:

```ts
type CompositeRegionMap = {
  regionId: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
};
```

Cada palabra devuelta por Vision tiene un bounding box. Calcular su centro y asignarla a la región correspondiente:

```ts
type OcrToken = {
  text: string;
  confidence: number | null;
  centerX: number;
  centerY: number;
  regionId: string | null;
};
```

La salida de esta etapa debe ser:

```ts
type RegionalOcrResult = {
  fullText: string;
  regions: Record<
    string,
    {
      text: string;
      tokens: OcrToken[];
      averageConfidence: number | null;
    }
  >;
};
```

## 6. Preprocesamiento

Implementar estrategias configurables, no una sola transformación destructiva.

Probar inicialmente:

- Imagen original.
- Escala 2x o 3x.
- Conversión a escala de grises.
- Mejora moderada de contraste.
- Threshold adaptativo solo cuando realmente mejore la lectura.

No aplicar threshold agresivo globalmente porque puede eliminar:

- Texto sobre fondos de color.
- Detalles holográficos.
- Caracteres finos.
- Símbolos de expansión.

Si se necesita comparar variantes, hacerlo localmente antes de llamar a Vision y seleccionar una variante usando métricas de calidad de imagen, sin realizar múltiples llamadas al OCR.

## 7. Extracción de campos

Construir parsers puros y testeables.

```ts
type ExtractedField<T = string> = {
  value: T | null;
  normalizedValue: T | null;
  confidence: number;
  sourceRegions: string[];
  rawMatches: string[];
};
```

Resultado general:

```ts
type ExtractedCardData = {
  name: ExtractedField;
  collectorNumber: ExtractedField;
  printedTotal: ExtractedField;
  setCode: ExtractedField;
  setSymbol: ExtractedField;
  hp: ExtractedField<number>;
  rarity: ExtractedField;
  language: ExtractedField;
  printedYear: ExtractedField<number>;
};
```

### Número de colección Pokémon

Soportar, al menos:

```text
25/102
123/182
TG05/TG30
GG44/GG70
SV107/SV122
SWSH020
SM210
XY124
001/P
```

No convertir siempre el número a entero, porque puede contener letras, ceros iniciales y sufijos.

Separar:

```ts
{
  collectorNumber: "TG05",
  printedTotal: "TG30"
}
```

### Número de colección Magic

Soportar valores como:

```text
123
0123
123a
A-123
```

Preservar el valor original y producir también una versión normalizada.

### Nombre

El nombre no debe depender de una regex rígida.

Usar:

- Texto de la región de encabezado.
- Orden visual de tokens.
- Eliminación de HP, costes, etapas y ruido evidente.
- Preservación de Unicode.
- Compatibilidad con inglés, español y japonés.
- Lista de alternativas cuando existan varias líneas plausibles.

No traducir nombres japoneses en frontend.

### HP

Buscar patrones tolerantes:

```text
HP 50
50 HP
PV 120
KP 100
```

Normalizar a número, pero conservar el match original.

### Rareza

Detectar únicamente texto o símbolos soportados con una confianza razonable.

Ejemplos textuales:

```text
Common
Uncommon
Rare
Promo
C
U
R
M
```

No asumir que un símbolo visual equivale a una rareza sin tener un clasificador o tabla de correspondencia.

### Código o símbolo de expansión

Separar dos conceptos:

```ts
setCode: ExtractedField<string>;
setSymbol: ExtractedField<string>;
```

`setCode` es texto, por ejemplo:

```text
SV4
MEW
WOE
MKM
```

`setSymbol` es un elemento visual y no debe esperarse que Google OCR lo interprete correctamente.

Para la primera versión:

- Enviar `setCode` cuando exista texto.
- Enviar `setSymbol.value = null` si no se puede clasificar.
- Registrar que el símbolo fue localizado visualmente.
- Opcionalmente calcular un hash perceptual del recorte.
- No inventar un código basándose en OCR poco confiable.

Ejemplo:

```ts
setSymbol: {
  value: null,
  normalizedValue: null,
  confidence: 0,
  sourceRegions: ["setSymbol"],
  rawMatches: [],
}
```

Puede agregarse posteriormente un clasificador de símbolos o comparación contra plantillas.

## 8. Confianza

No usar un único porcentaje para todo.

Separar:

```ts
type ScanConfidence = {
  captureQuality: number;
  ocrQuality: number;
  extractionQuality: number;
  overall: number;
};
```

### Capture quality

Considerar:

- Área de la carta respecto al frame.
- Nitidez.
- Iluminación.
- Perspectiva.
- Bordes completos.
- Reflejos.
- Resolución final.

### OCR quality

Usar la confianza de tokens y palabras cuando esté disponible.

No colocar `0%` únicamente porque no se detectó el número o porque no hubo coincidencia con el backend.

### Extraction quality

Calcular según los campos encontrados:

```ts
const extractionWeights = {
  collectorNumber: 0.35,
  name: 0.35,
  setCode: 0.15,
  hp: 0.075,
  rarity: 0.075,
};
```

Estos pesos deben ser configurables por juego.

El frontend solamente mide la calidad de extracción. El backend será responsable de la confianza final de identificación.

## 9. Contrato con backend

Proponer un contrato versionado.

```ts
type CardSearchRequest = {
  schemaVersion: '1.0';
  game: 'pokemon' | 'magic' | 'unknown';

  scan: {
    capturedAt: string;
    orientation: 'portrait' | 'landscape';
    layout: string | null;
    captureQuality: number;
    ocrQuality: number;
    extractionQuality: number;
  };

  fields: {
    name: ExtractedField;
    collectorNumber: ExtractedField;
    printedTotal: ExtractedField;
    setCode: ExtractedField;
    setSymbol: ExtractedField;
    hp: ExtractedField<number>;
    rarity: ExtractedField;
    language: ExtractedField;
    printedYear: ExtractedField<number>;
  };

  rawOcr: {
    fullText: string;
    regions: Record<
      string,
      {
        text: string;
        averageConfidence: number | null;
      }
    >;
  };
};
```

Ejemplo:

```json
{
  "schemaVersion": "1.0",
  "game": "pokemon",
  "scan": {
    "capturedAt": "2026-09-03T20:00:00.000Z",
    "orientation": "portrait",
    "layout": "pokemon-default",
    "captureQuality": 0.91,
    "ocrQuality": 0.84,
    "extractionQuality": 0.76
  },
  "fields": {
    "name": {
      "value": "ピカチュウ",
      "normalizedValue": "ピカチュウ",
      "confidence": 0.94,
      "sourceRegions": ["name"],
      "rawMatches": ["ピカチュウ"]
    },
    "collectorNumber": {
      "value": "001",
      "normalizedValue": "001",
      "confidence": 0.68,
      "sourceRegions": ["footer"],
      "rawMatches": ["001/P"]
    },
    "printedTotal": {
      "value": null,
      "normalizedValue": null,
      "confidence": 0,
      "sourceRegions": ["footer"],
      "rawMatches": []
    },
    "setCode": {
      "value": "P",
      "normalizedValue": "P",
      "confidence": 0.62,
      "sourceRegions": ["footer"],
      "rawMatches": ["001/P"]
    },
    "setSymbol": {
      "value": null,
      "normalizedValue": null,
      "confidence": 0,
      "sourceRegions": ["setSymbol"],
      "rawMatches": []
    },
    "hp": {
      "value": 50,
      "normalizedValue": 50,
      "confidence": 0.92,
      "sourceRegions": ["hp"],
      "rawMatches": ["HP 50"]
    },
    "rarity": {
      "value": "promo",
      "normalizedValue": "promo",
      "confidence": 0.58,
      "sourceRegions": ["footer"],
      "rawMatches": ["P"]
    },
    "language": {
      "value": "ja",
      "normalizedValue": "ja",
      "confidence": 0.96,
      "sourceRegions": ["name", "footer"],
      "rawMatches": ["ja"]
    },
    "printedYear": {
      "value": 2010,
      "normalizedValue": 2010,
      "confidence": 0.91,
      "sourceRegions": ["footer"],
      "rawMatches": ["©2010"]
    }
  },
  "rawOcr": {
    "fullText": "ピカチュウ HP 50 ...",
    "regions": {
      "name": {
        "text": "ピカチュウ",
        "averageConfidence": 0.94
      },
      "hp": {
        "text": "HP 50",
        "averageConfidence": 0.92
      },
      "footer": {
        "text": "001/P ©2010",
        "averageConfidence": 0.75
      }
    }
  }
}
```

Validar el payload con Zod antes de enviarlo.

No eliminar `rawOcr`, porque el backend puede tener mejores algoritmos de búsqueda y utilizar texto que el frontend todavía no sabe interpretar.

## 10. Integración con backend

Implementar un cliente independiente:

```ts
type CardSearchResponse = {
  candidates: Array<{
    id: string;
    game: 'pokemon' | 'magic';
    name: string;
    setName: string | null;
    collectorNumber: string | null;
    imageUrl: string | null;
    confidence: number;
    matchedBy: string[];
  }>;
};
```

Flujo esperado:

1. Frontend construye `CardSearchRequest`.
2. Valida mediante Zod.
3. Envía el payload al backend.
4. Backend devuelve candidatos ordenados.
5. Frontend muestra los primeros resultados.
6. Usuario selecciona la carta correcta.
7. Si no hay coincidencias, permitir:
   - Reintentar captura.
   - Editar nombre o número manualmente.
   - Realizar búsqueda usando el texto disponible.

No mezclar la confianza de extracción del frontend con la confianza de identificación del backend.

## 11. Seguridad

La credencial de Google Cloud Vision:

- Debe permanecer exclusivamente en servidor.
- No debe exponerse en variables públicas.
- No debe aparecer en el bundle del navegador.
- No debe enviarse desde un Client Component.

El frontend del navegador debe enviar la imagen compuesta a:

- Un Route Handler de Next.js.
- Una Server Action apropiada.
- O el backend existente, si ya centraliza la integración.

Selecciona la alternativa que mejor respete la arquitectura actual.

Agregar límites para:

- Tipo MIME.
- Tamaño de imagen.
- Resolución.
- Tiempo de procesamiento.
- Rate limiting, si ya existe infraestructura.

## 12. Rendimiento y lifecycle de OpenCV

Asegurar que:

- El OCR no se ejecute en cada frame.
- La detección en vivo tenga throttling.
- La captura OCR ocurra solamente cuando la carta esté estable.
- Exista un periodo mínimo de estabilidad.
- Se liberen todos los `cv.Mat`.
- No haya múltiples solicitudes simultáneas.
- Pueda cancelarse una solicitud al reiniciar el escaneo.
- La interfaz muestre estados claros.

Estados sugeridos:

```ts
type ScannerStatus =
  | 'initializing'
  | 'camera-ready'
  | 'detecting'
  | 'card-stable'
  | 'capturing'
  | 'processing-image'
  | 'extracting-text'
  | 'searching'
  | 'results'
  | 'error';
```

## 13. Pruebas

Crear pruebas unitarias para los parsers usando texto OCR real y texto degradado.

### Casos mínimos

#### Pokémon

```text
Pikachu
HP 60
025/165
```

```text
Charizard ex
330 HP
199/165
```

```text
ピカチュウ
HP 50
001/P
```

```text
Mew ex
HP 180
SVP 053
```

#### Magic

```text
Lightning Bolt
M11
146
C
```

```text
The One Ring
LTR EN 0246
M
```

Agregar casos con errores típicos:

```text
O25/165
025I165
HP GO
l99/165
SVP O53
```

Comprobar que:

- Se preservan ceros iniciales.
- No se confunde `O` con `0` sin evidencia.
- Se conservan prefijos.
- Se admiten valores parciales.
- La confianza disminuye cuando se aplican correcciones.
- No se inventan valores ausentes.

## 14. Instrumentación para el POC

En modo debug mostrar:

- Carta normalizada.
- Regiones recortadas.
- Imagen OCR compuesta.
- Bounding boxes devueltos por Vision.
- Texto asignado a cada región.
- Campos extraídos.
- Confianza por campo.
- Payload final.
- Tiempo de cada etapa.

Ejemplo:

```ts
type ScannerMetrics = {
  contourDetectionMs: number;
  perspectiveTransformMs: number;
  regionExtractionMs: number;
  ocrRequestMs: number;
  parsingMs: number;
  backendSearchMs: number;
  totalMs: number;
};
```

No habilitar información sensible en producción.

## 15. Estrategia incremental

### Fase 1: Pokémon con layout moderno

- Normalización.
- Nombre.
- HP.
- Número de colección.
- Total impreso.
- OCR compuesto.
- Payload al backend.
- Candidatos y selección manual.

### Fase 2: robustez

- Calidad de captura.
- Confianza por campo.
- Corrección de orientación.
- Soporte inglés, español y japonés.
- Layouts adicionales de Pokémon.
- Pruebas con foils y fundas.

### Fase 3: Magic

- Configuración de regiones propia.
- Nombre.
- Collector number.
- Set code.
- Rareza e idioma.
- Adaptación a cartas de doble cara y layouts alternativos.

### Fase 4: símbolos visuales

- Recorte aislado del símbolo.
- Dataset de símbolos.
- Comparación por template matching, hash perceptual o clasificador.
- Envío de identificador y confianza al backend.

No bloquear las primeras fases por la detección de símbolos.

## 16. Criterios de aceptación del MVP

La implementación se considera lista cuando:

1. OpenCV produce una carta frontal normalizada.
2. Las regiones se configuran mediante porcentajes.
3. Se genera una sola imagen OCR compuesta.
4. Se ejecuta una sola llamada de Vision por escaneo.
5. El texto se vuelve a separar por región.
6. Se extraen nombre, HP y número cuando estén visibles.
7. Los campos ausentes se mandan como `null`.
8. Cada campo incluye su confianza y texto original.
9. Se incluye el OCR completo como fallback.
10. El payload está validado con Zod.
11. El backend recibe la información y devuelve candidatos.
12. La interfaz permite confirmar o corregir el resultado.
13. No existen credenciales de Google en el cliente.
14. No hay fugas evidentes de `cv.Mat`.
15. Existen fixtures y pruebas unitarias para los parsers.

## Entregables solicitados

Después de inspeccionar el repositorio, entrega:

1. Resumen de la arquitectura actual.
2. Diagrama breve del flujo actual.
3. Diferencias entre el flujo actual y el propuesto.
4. Plan de implementación por archivos.
5. Tipos TypeScript definitivos.
6. Esquemas Zod.
7. Diseño de la imagen OCR compuesta.
8. Parsers puros.
9. Estrategia de confianza.
10. Contrato con backend.
11. Plan de pruebas.
12. Riesgos y decisiones pendientes.
13. Implementación por fases pequeñas y verificables.

Antes de modificar archivos, confirma:

- Qué partes actuales pueden reutilizarse.
- Qué archivos se modificarían.
- Qué archivos nuevos son realmente necesarios.
- Si una sola imagen compuesta es compatible con la integración actual de Google Vision.

Evita sobrearquitectura. Prioriza que el POC genere una búsqueda útil y medible.

## Decisiones técnicas que deben conservarse

Las cuatro decisiones más importantes del plan son:

- **Una imagen compuesta:** nombre, HP y footer se agrupan físicamente en un solo canvas. Esto permite una sola anotación de Vision por escaneo.
- **Campos acompañados de evidencia:** no mandar únicamente `name: "Pikachu"`, sino también confianza, región y texto original.
- **`rawOcr` siempre incluido:** el backend puede aprovechar información que el parser del frontend todavía no comprenda.
- **Símbolo y código separados:** un símbolo gráfico no es OCR. Durante el MVP debe poder enviarse como `null` sin invalidar la búsqueda.

También se debe cambiar la “confianza general” por tres mediciones diferentes:

- Calidad de captura.
- Calidad del OCR.
- Calidad de extracción.

Esto permitirá explicar por qué una carta puede leerse correctamente, como el ejemplo de Pikachu en japonés, pero el sistema mostrar actualmente una confianza del `0%`.

## Referencias

Google Cloud. (2026). _Detect and extract text from images_. Google Cloud Vision API. https://cloud.google.com/vision/docs/ocr

Google Cloud. (2025). _ImageContext_. Google Cloud Vision API. https://cloud.google.com/vision/docs/reference/rest/v1/ImageContext

Pokémon TCG Developers. (s. f.). _Pokémon TCG API documentation_. https://docs.pokemontcg.io/

Scryfall. (s. f.). _Cards: Collector number_. Scryfall API Documentation. https://scryfall.com/docs/api/cards/collector
