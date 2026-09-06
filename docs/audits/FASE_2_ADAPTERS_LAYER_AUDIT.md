# FASE 2: AUDITORÍA ADAPTERS LAYER - CARD SCANNER

**Feature**: card-scanner  
**Capa auditada**: Adapters (Integraciones y Seguridad)  
**Fecha**: 2026-09-03  
**Subagentes utilizados**: reviewer (seguridad) + reviewer (arquitectura)  
**Líneas auditadas**: ~400 LOC  
**Archivos analizados**: 5

---

## 📊 RESUMEN EJECUTIVO

### Score General: **55/100** 🔴 CRÍTICO

| Aspecto                 | Score  | Interpretación  |
| ----------------------- | ------ | --------------- |
| **Seguridad**           | 32/100 | 🔴 Crítica      |
| **Arquitectura**        | 62/100 | ⚠️ Aceptable    |
| **Correctness**         | 45/100 | 🔴 Crítica      |
| **Performance**         | 40/100 | 🔴 Crítica      |
| **Style & Conventions** | 70/100 | ✅ Buena        |
| **Error Handling**      | 50/100 | ⚠️ Insuficiente |
| **Validación**          | 55/100 | ⚠️ Mejorable    |
| **Mantenibilidad**      | 60/100 | ⚠️ Aceptable    |

### Interpretación del Score

- **80-100**: Excelente, listo para producción
- **60-79**: Aceptable, necesita mejoras menores
- **40-59**: Insuficiente, requiere refactorización
- **0-39**: Crítico, no apto para producción

**Veredicto**: 🔴 **NO LISTO PARA PRODUCCIÓN** - Requiere correcciones críticas en seguridad y funcionalidad

---

## 🚨 HALLAZGOS CRÍTICOS (P0) - BLOQUEADORES

### 1. Credenciales Expuestas en Repositorio ⚠️ CRÍTICO - SEGURIDAD

**Ubicación**: `.env` (raíz del proyecto)

**Problema**:

```bash
# ❌ CRÍTICO: Credenciales de Google Cloud Vision en git
GOOGLE_CLOUD_PROJECT_ID=xxxxx
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_CLOUD_CLIENT_EMAIL=xxxxx@xxxxx.iam.gserviceaccount.com
```

**Impacto**:

- 🔴 **Severidad CRÍTICA**: Cualquiera con acceso al repo puede:
  - Impersonar la cuenta de servicio
  - Hacer llamadas ilimitadas a Google Cloud Vision
  - Generar costos no autorizados
  - Acceder a otros recursos de GCP
- Violación de compliance (PCI-DSS, SOC 2)
- Riesgo legal y financiero

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 2-3 horas  
**Prioridad**: P0 - BLOQUEADOR INMEDIATO

**Solución recomendada**:

```bash
# PASO 1: ACCIÓN INMEDIATA (HOY)
# 1.1 Rotar credenciales en Google Cloud Console
gcloud iam service-accounts keys create new-key.json \
  --iam-account=SERVICE_ACCOUNT_EMAIL

# 1.2 Revocar la clave comprometida
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=SERVICE_ACCOUNT_EMAIL

# 1.3 Eliminar .env del historial de git
git filter-branch --tree-filter 'rm -f .env' HEAD
# O usar BFG Repo-Cleaner (más rápido)
bfg --delete-files .env

# 1.4 Forzar push (CUIDADO: coordinar con equipo)
git push origin --force --all

# PASO 2: PREVENCIÓN (ESTA SEMANA)
# 2.1 Agregar .env a .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# 2.2 Usar variables de entorno en deployment
# Vercel:
vercel env add GOOGLE_CLOUD_PROJECT_ID
vercel env add GOOGLE_CLOUD_PRIVATE_KEY
vercel env add GOOGLE_CLOUD_CLIENT_EMAIL

# GitHub Actions:
# Settings > Secrets > Actions > New repository secret

# 2.3 Implementar secret scanning
# GitHub: Settings > Security > Secret scanning (enable)

# 2.4 Agregar pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
if git diff --cached --name-only | grep -q "\.env$"; then
  echo "ERROR: Attempting to commit .env file!"
  exit 1
fi
EOF
chmod +x .git/hooks/pre-commit
```

**Checklist de remediación**:

- [ ] Rotar credenciales de Google Cloud (URGENTE)
- [ ] Eliminar .env del historial de git
- [ ] Agregar .env a .gitignore
- [ ] Configurar variables en plataforma de deployment
- [ ] Habilitar secret scanning en GitHub
- [ ] Agregar pre-commit hook
- [ ] Auditar logs de acceso a GCP (últimos 30 días)
- [ ] Documentar incidente en security log

---

### 2. Falta de Validación de Entrada en API Route ⚠️ CRÍTICO - SEGURIDAD

**Ubicación**: `src/app/api/ocr/route.ts:14-20`

```typescript
// ❌ PROBLEMA: Sin validación
export async function POST(request: Request) {
  const { image } = await request.json();
  // ⚠️ No valida:
  // - Tamaño de imagen (DoS attack)
  // - Formato MIME (malformed data)
  // - Formato base64 válido
  // - Rate limiting

  const result = await analyzeImageWithVision(image);
  // ...
}
```

**Impacto**:

- 🔴 **DoS Attack**: Enviar imágenes de 100MB+ causa memory exhaustion
- 🔴 **Malformed Data**: Procesar datos inválidos causa crashes
- 🔴 **Excessive Costs**: Sin rate limiting, llamadas ilimitadas a Vision API
- 🔴 **Poor UX**: Timeouts sin feedback al usuario

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 2-3 horas  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

```typescript
// ✅ SOLUCIÓN COMPLETA
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Schema de validación
const ocrRequestSchema = z.object({
  image: z
    .string()
    .min(1, 'Image is required')
    .regex(
      /^data:image\/(jpeg|jpg|png|webp);base64,/,
      'Invalid image format. Must be JPEG, PNG, or WebP'
    )
    .refine((val) => {
      // Validar tamaño (max 5MB)
      const base64Length = val.split(',')[1]?.length || 0;
      const sizeInBytes = (base64Length * 3) / 4;
      return sizeInBytes <= 5 * 1024 * 1024;
    }, 'Image must be smaller than 5MB')
    .refine((val) => {
      // Validar que sea base64 válido
      try {
        const base64 = val.split(',')[1];
        Buffer.from(base64, 'base64');
        return true;
      } catch {
        return false;
      }
    }, 'Invalid base64 encoding'),
});

// Rate limiting (10 requests/minute por IP)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          limit,
          reset,
          remaining,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    // 2. Validación de entrada
    const body = await request.json();
    const validationResult = ocrRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { image } = validationResult.data;

    // 3. Timeout (30 segundos)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // 4. Llamada a Vision API con retry
      const result = await analyzeImageWithVision(image, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return NextResponse.json(result);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
      }

      throw error;
    }
  } catch (error) {
    // 5. Error handling seguro
    console.error('[OCR Error]', {
      timestamp: new Date().toISOString(),
      type: error instanceof Error ? error.constructor.name : 'Unknown',
      // NO loggear detalles sensibles
    });

    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
```

**Dependencias a instalar**:

```bash
npm install @upstash/ratelimit @upstash/redis
```

**Configuración de Upstash** (gratis hasta 10K requests/día):

```bash
# 1. Crear cuenta en https://upstash.com
# 2. Crear Redis database
# 3. Agregar variables de entorno
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
```

---

### 3. Exposición de Detalles de Error al Cliente ⚠️ CRÍTICO - SEGURIDAD

**Ubicación**: `src/app/api/ocr/route.ts:57-65`

```typescript
// ❌ PROBLEMA: Expone stack traces y detalles internos
catch (error) {
  console.error('Error analyzing image:', error);
  return NextResponse.json(
    {
      error: 'Failed to analyze image',
      details: error.message,  // ⚠️ Expone detalles internos
      stack: error.stack        // ⚠️ Expone stack trace
    },
    { status: 500 }
  );
}
```

**Impacto**:

- 🔴 **Information Disclosure**: Expone rutas de archivos, versiones de librerías
- 🔴 **Attack Surface**: Facilita exploits al revelar estructura interna
- 🔴 **Compliance**: Violación de OWASP Top 10 (A05:2021 - Security Misconfiguration)

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 1 hora  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

```typescript
// ✅ SOLUCIÓN: Error handling seguro
import { logger } from '@/lib/logger'; // Implementar logger estructurado

catch (error) {
  // Log detallado en servidor (NO en cliente)
  logger.error('OCR processing failed', {
    timestamp: new Date().toISOString(),
    errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    // Contexto útil para debugging
    requestId: request.headers.get('x-request-id'),
    userAgent: request.headers.get('user-agent'),
  });

  // Respuesta genérica al cliente
  return NextResponse.json(
    {
      error: 'Processing failed',
      // Opcionalmente: código de error para soporte
      errorCode: 'OCR_PROCESSING_ERROR',
      // Opcionalmente: request ID para tracking
      requestId: request.headers.get('x-request-id'),
    },
    { status: 500 }
  );
}
```

**Implementar logger estructurado**:

```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const logEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ...context,
    };

    // En producción: enviar a servicio de logging (Datadog, Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con servicio de logging
      console[level](JSON.stringify(logEntry));
    } else {
      // En desarrollo: log legible
      console[level](`[${level.toUpperCase()}]`, message, context || '');
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();
```

---

### 4. Mock Incompleto - Feature No Funciona ⚠️ CRÍTICO - FUNCIONALIDAD

**Ubicación**: `adapters/backend/card-search.adapter.ts:60-72`

```typescript
// ❌ PROBLEMA: Mock siempre retorna array vacío
export async function searchCardInBackend(
  request: CardSearchRequest
): Promise<CardSearchResponse> {
  console.log('🔍 Searching card in backend (MOCK):', request);

  // TODO: Implement real backend search with Apollo Client
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    cards: [], // ⚠️ Siempre vacío - feature no funciona
    total: 0,
  };
}
```

**Impacto**:

- 🔴 **Feature Broken**: Búsqueda de cartas no funciona
- 🔴 **Poor UX**: Usuario no puede validar cartas escaneadas
- 🔴 **Testing Imposible**: No se puede probar flujo completo
- 🔴 **Demo No Viable**: No se puede demostrar el feature

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 4-6 horas  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

```typescript
// ✅ SOLUCIÓN: Implementar con Apollo Client

// 1. Crear query GraphQL
// adapters/api/card-search.gql
import { gql } from '@apollo/client';

export const SEARCH_CARD = gql`
  query SearchCard($input: CardSearchInput!) {
    searchCard(input: $input) {
      cards {
        id
        name
        setCode
        collectorNumber
        rarity
        imageUrl
        tcgGame
        # ... más campos según schema del backend
      }
      total
    }
  }
`;

// 2. Implementar adaptador real
import { apolloClient } from '@/lib/api/apollo-client';
import { SEARCH_CARD } from '../api/card-search.gql';
import type {
  SearchCardQuery,
  SearchCardQueryVariables,
} from '@/lib/api/generated/card-search.generated';

export async function searchCardInBackend(
  request: CardSearchRequest
): Promise<CardSearchResponse> {
  try {
    // Validar entrada
    const validatedRequest = cardSearchRequestSchema.parse(request);

    // Mapear a input de GraphQL
    const input: SearchCardQueryVariables = {
      input: {
        tcgGame: validatedRequest.tcgGame,
        name: validatedRequest.name,
        setCode: validatedRequest.setCode,
        collectorNumber: validatedRequest.collectorNumber,
        // ... más campos
      },
    };

    // Llamar a GraphQL
    const { data, errors } = await apolloClient.query<
      SearchCardQuery,
      SearchCardQueryVariables
    >({
      query: SEARCH_CARD,
      variables: input,
      fetchPolicy: 'network-only', // No usar cache para búsquedas
    });

    if (errors) {
      throw new Error(
        `GraphQL errors: ${errors.map((e) => e.message).join(', ')}`
      );
    }

    if (!data?.searchCard) {
      throw new Error('No data returned from searchCard query');
    }

    // Mapear respuesta
    return {
      cards: data.searchCard.cards.map((card) => ({
        id: card.id,
        name: card.name,
        setCode: card.setCode,
        collectorNumber: card.collectorNumber,
        rarity: card.rarity,
        imageUrl: card.imageUrl,
        tcgGame: card.tcgGame,
        // ... más campos
      })),
      total: data.searchCard.total,
    };
  } catch (error) {
    console.error('[searchCardInBackend] Error:', error);

    // Re-throw con contexto
    throw new Error(
      `Failed to search card: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
```

**Bloqueadores para implementación**:

1. ❌ **Falta especificación del backend**: Necesita schema GraphQL de `searchCard` query
2. ❌ **Falta tipo `CardSearchInput`**: Necesita definición exacta de campos
3. ❌ **Falta endpoint GraphQL**: Necesita URL del backend

**Alternativa temporal** (mientras se implementa backend):

```typescript
// ✅ Mock realista para testing
const MOCK_CARDS: Card[] = [
  {
    id: '1',
    name: 'Pikachu',
    setCode: 'BASE',
    collectorNumber: '25',
    rarity: 'Common',
    imageUrl: 'https://images.pokemontcg.io/base1/25.png',
    tcgGame: 'pokemon',
  },
  {
    id: '2',
    name: 'Charizard',
    setCode: 'BASE',
    collectorNumber: '4',
    rarity: 'Rare Holo',
    imageUrl: 'https://images.pokemontcg.io/base1/4.png',
    tcgGame: 'pokemon',
  },
  // ... más cartas de ejemplo
];

export async function searchCardInBackend(
  request: CardSearchRequest
): Promise<CardSearchResponse> {
  console.log('🔍 Searching card in backend (MOCK):', request);

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filtrar por nombre (case-insensitive, partial match)
  const filtered = MOCK_CARDS.filter((card) => {
    if (request.name) {
      return card.name.toLowerCase().includes(request.name.toLowerCase());
    }
    if (request.setCode) {
      return card.setCode.toLowerCase() === request.setCode.toLowerCase();
    }
    if (request.collectorNumber) {
      return card.collectorNumber === request.collectorNumber;
    }
    return true;
  });

  return {
    cards: filtered,
    total: filtered.length,
  };
}
```

---

### 5. Sin Retry Logic en Google Vision API ⚠️ CRÍTICO - RELIABILITY

**Ubicación**: `adapters/ocr/google-vision.ts:19-25`

```typescript
// ❌ PROBLEMA: Sin retry en fallos transitorios
export async function analyzeImageWithVision(base64Image: string) {
  const [result] = await client.textDetection({
    image: { content: base64Image },
  });
  // ⚠️ Si falla (network timeout, 503, etc.), error inmediato
  // ⚠️ No reintenta
  // ⚠️ Usuario debe capturar de nuevo

  return result.textAnnotations || [];
}
```

**Impacto**:

- 🔴 **Poor Reliability**: Fallos transitorios causan errores permanentes
- 🔴 **Poor UX**: Usuario debe reintentar manualmente
- 🔴 **Wasted Captures**: Capturas válidas se pierden por errores de red
- 🔴 **Higher Costs**: Más capturas = más llamadas a Vision API

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 2-3 horas  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

```typescript
// ✅ SOLUCIÓN: Retry con exponential backoff

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  signal?: AbortSignal;
}

/**
 * Ejecuta una función con retry y exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    signal,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check if aborted
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }

      return await fn();
    } catch (error) {
      lastError = error as Error;

      // No reintentar en último intento
      if (attempt === maxRetries) {
        break;
      }

      // No reintentar en errores no transitorios
      if (isNonRetryableError(error)) {
        break;
      }

      // Log intento
      console.warn(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed:`, {
        error: lastError.message,
        nextRetryIn: `${delay}ms`,
      });

      // Esperar antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Incrementar delay (exponential backoff)
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Determina si un error es no-retriable
 */
function isNonRetryableError(error: any): boolean {
  // Errores de validación (400, 401, 403, 404)
  if (error.code >= 400 && error.code < 500) {
    return true;
  }

  // Errores específicos de Google Vision
  const nonRetryableCodes = [
    'INVALID_ARGUMENT',
    'PERMISSION_DENIED',
    'UNAUTHENTICATED',
  ];

  return nonRetryableCodes.includes(error.code);
}

/**
 * Analiza imagen con Google Cloud Vision (con retry)
 */
export async function analyzeImageWithVision(
  base64Image: string,
  options?: { signal?: AbortSignal }
): Promise<google.cloud.vision.v1.ITextAnnotation[]> {
  try {
    const result = await retryWithBackoff(
      async () => {
        const [response] = await client.textDetection({
          image: { content: base64Image },
        });

        if (!response.textAnnotations) {
          throw new Error('No text detected in image');
        }

        return response.textAnnotations;
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        backoffMultiplier: 2,
        signal: options?.signal,
      }
    );

    return result;
  } catch (error) {
    console.error('[Google Vision] Failed after retries:', error);
    throw new Error(
      `Vision API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
```

**Testing del retry logic**:

```typescript
// __tests__/google-vision.test.ts
describe('analyzeImageWithVision', () => {
  it('should retry on transient errors', async () => {
    let attempts = 0;
    const mockClient = {
      textDetection: jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('503 Service Unavailable');
        }
        return [{ textAnnotations: [{ description: 'test' }] }];
      }),
    };

    const result = await analyzeImageWithVision('base64image');

    expect(attempts).toBe(3);
    expect(result).toHaveLength(1);
  });

  it('should not retry on non-retryable errors', async () => {
    const mockClient = {
      textDetection: jest.fn().mockRejectedValue({
        code: 'INVALID_ARGUMENT',
      }),
    };

    await expect(analyzeImageWithVision('invalid')).rejects.toThrow();
    expect(mockClient.textDetection).toHaveBeenCalledTimes(1);
  });
});
```

---

### 6. Código Legacy Sin Documentar ⚠️ CRÍTICO - MANTENIBILIDAD

**Ubicación**:

- `adapters/ocr/tesseract-worker.ts` (75 líneas)
- `adapters/mappers/card-data.mapper.ts` (70 líneas)

```typescript
// ❌ PROBLEMA: Código legacy sin marcar como deprecated

// tesseract-worker.ts
export async function extractTextFromImage(imageData: string): Promise<string> {
  // ... implementación Tesseract
  // ⚠️ No se usa en el pipeline actual
  // ⚠️ No tiene @deprecated
  // ⚠️ Confunde a developers
}

// card-data.mapper.ts
export function mapOcrToCardData(ocrText: string): ExtractedCardData {
  // ... implementación antigua
  // ⚠️ No se usa (se usa parsePokemonCard/parseMagicCard)
  // ⚠️ Duplica responsabilidades
}
```

**Impacto**:

- 🔴 **Confusión**: Developers no saben qué código usar
- 🔴 **Duplicación**: Dos formas de hacer lo mismo
- 🔴 **Mantenimiento**: Código muerto que se debe mantener
- 🔴 **Testing**: Tests de código no usado

**Severidad**: 🔴 CRÍTICA  
**Esfuerzo**: 1-2 horas  
**Prioridad**: P0 - BLOQUEADOR

**Solución recomendada**:

**Opción 1: Eliminar** (recomendado si no se usa)

```bash
# Verificar que no se usa
grep -r "extractTextFromImage" src/
grep -r "mapOcrToCardData" src/
grep -r "tesseract-worker" src/
grep -r "card-data.mapper" src/

# Si no hay referencias, eliminar
git rm src/features/card-scanner/adapters/ocr/tesseract-worker.ts
git rm src/features/card-scanner/adapters/mappers/card-data.mapper.ts

# Commit
git commit -m "Remove legacy OCR code (Tesseract, old mapper)

- Removed tesseract-worker.ts (replaced by Google Vision)
- Removed card-data.mapper.ts (replaced by game-specific parsers)
- These files were not used in the current pipeline
"
```

**Opción 2: Deprecar** (si se quiere mantener como referencia)

```typescript
// tesseract-worker.ts
/**
 * @deprecated This file is deprecated and will be removed in v2.0
 *
 * Reason: Replaced by Google Cloud Vision API (google-vision.ts)
 *
 * Migration:
 * - Old: extractTextFromImage(imageData)
 * - New: analyzeImageWithVision(base64Image)
 *
 * DO NOT USE in new code.
 *
 * @see adapters/ocr/google-vision.ts
 */
export async function extractTextFromImage(imageData: string): Promise<string> {
  throw new Error(
    'extractTextFromImage is deprecated. Use analyzeImageWithVision instead.'
  );
}

// card-data.mapper.ts
/**
 * @deprecated This file is deprecated and will be removed in v2.0
 *
 * Reason: Replaced by game-specific parsers
 *
 * Migration:
 * - Old: mapOcrToCardData(ocrText)
 * - New: parsePokemonCard(regionalOcr) or parseMagicCard(regionalOcr)
 *
 * DO NOT USE in new code.
 *
 * @see domain/parsers/pokemon-parser.domain.ts
 * @see domain/parsers/magic-parser.domain.ts
 */
export function mapOcrToCardData(ocrText: string): ExtractedCardData {
  throw new Error(
    'mapOcrToCardData is deprecated. Use game-specific parsers instead.'
  );
}
```

**Recomendación**: **Opción 1 (Eliminar)** - Código no usado debe eliminarse para reducir complejidad.

---

## 🔴 HALLAZGOS ALTOS (P1) - DEBEN CORREGIRSE PRONTO

### 7. Falta de Rate Limiting

**Problema**: Sin límite de requests por IP/usuario  
**Impacto**: Abuso, costos excesivos  
**Solución**: Implementar con Upstash Redis (ver P0 #2)

### 8. Sin Timeout Handling

**Problema**: Requests pueden colgar indefinidamente  
**Impacto**: Resource exhaustion, poor UX  
**Solución**: AbortController con 30s timeout (ver P0 #2)

### 9. Falta de Environment Validation

**Problema**: No valida que credenciales estén presentes al inicio  
**Impacto**: Errores crípticos en runtime  
**Solución**:

```typescript
// lib/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_CLOUD_PROJECT_ID: z.string().min(1),
  GOOGLE_CLOUD_PRIVATE_KEY: z.string().min(1),
  GOOGLE_CLOUD_CLIENT_EMAIL: z.string().email(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

### 10. Logging Insuficiente

**Problema**: Logs no estructurados, difíciles de buscar  
**Impacto**: Debugging difícil, no hay métricas  
**Solución**: Implementar logger estructurado (ver P0 #3)

### 11. Type Casting Inseguro

**Ubicación**: `card-search.adapter.ts:43, 51`

```typescript
// ❌ PROBLEMA
const mockResponse = {
  cards: [] as any, // Bypasses type checking
  total: 0 as any,
};
```

**Solución**: Eliminar `as any`, usar tipos correctos

---

## 🟡 HALLAZGOS MODERADOS (P2) - MEJORAR CUANDO SEA POSIBLE

### 12. Sin Caching de Resultados OCR

**Problema**: Misma imagen se procesa múltiples veces  
**Impacto**: Costos innecesarios, latencia  
**Solución**: Cache con hash de imagen

### 13. Falta de JSDoc

**Problema**: Funciones sin documentación  
**Impacto**: Onboarding lento  
**Solución**: Agregar JSDoc a funciones públicas

### 14. Sin Tests

**Problema**: 0% cobertura de tests  
**Impacto**: Refactoring peligroso  
**Solución**: Agregar tests unitarios

---

## ✅ FORTALEZAS IDENTIFICADAS

### 1. Aislamiento de API Keys (70/100)

✅ **Credenciales en servidor**:

- API route `/api/ocr` maneja credenciales
- Cliente nunca ve GOOGLE_CLOUD_PRIVATE_KEY
- Patrón correcto de seguridad

⚠️ **Pero**: Credenciales en git (ver P0 #1)

### 2. Validación con Zod (75/100)

✅ **Schemas bien definidos**:

```typescript
export const cardSearchRequestSchema = z.object({
  tcgGame: z.enum(['pokemon', 'magic']),
  name: z.string().optional(),
  setCode: z.string().optional(),
  collectorNumber: z.string().optional(),
  rarity: z.string().optional(),
});
```

✅ **Validación de tipos**
✅ **Mensajes de error claros**

⚠️ **Falta**: Validación en API route (ver P0 #2)

### 3. Arquitectura Limpia (62/100)

✅ **Patrón Adapter bien aplicado**:

- `google-vision.ts` adapta Google Cloud Vision API
- `card-search.adapter.ts` adapta backend GraphQL
- Aislamiento de dependencias externas

✅ **Dependency Inversion**:

- UI no depende de Google Vision directamente
- Fácil de mockear para testing

⚠️ **Falta**: Interfaces explícitas

### 4. Mappers Puros (80/100)

✅ **Funciones puras sin side effects**:

```typescript
export function mapOcrToCardData(ocrText: string): ExtractedCardData {
  // Solo transforma datos, no hace I/O
  return {
    /* ... */
  };
}
```

✅ **Type-safe**
✅ **Fácil de testear**

⚠️ **Pero**: Código legacy (ver P0 #6)

---

## 📈 PLAN DE ACCIÓN RECOMENDADO

### Fase 1: Seguridad Crítica (P0) - URGENTE (1 día)

**Esfuerzo total**: 4-6 horas

| Tarea                              | Esfuerzo | Prioridad |
| ---------------------------------- | -------- | --------- |
| Rotar credenciales Google Cloud    | 30min    | P0        |
| Eliminar .env del historial git    | 1h       | P0        |
| Configurar variables en deployment | 30min    | P0        |
| Agregar validación de entrada      | 2h       | P0        |
| Implementar error handling seguro  | 1h       | P0        |

**BLOQUEADOR**: NO desplegar a producción sin completar Fase 1

### Fase 2: Funcionalidad Crítica (P0) - 1 semana

**Esfuerzo total**: 8-10 horas

| Tarea                     | Esfuerzo | Prioridad |
| ------------------------- | -------- | --------- |
| Implementar Apollo Client | 4-6h     | P0        |
| Agregar retry + backoff   | 2-3h     | P0        |
| Eliminar código legacy    | 1-2h     | P0        |

**BLOQUEADOR**: Necesita especificación GraphQL del backend

### Fase 3: Mejoras Altas (P1) - 1 semana

**Esfuerzo total**: 6-9 horas

| Tarea                            | Esfuerzo | Prioridad |
| -------------------------------- | -------- | --------- |
| Implementar rate limiting        | 2h       | P1        |
| Agregar timeout handling         | 1h       | P1        |
| Validar environment variables    | 1h       | P1        |
| Implementar logging estructurado | 2h       | P1        |
| Remover type casting             | 1h       | P1        |

### Fase 4: Mejoras Moderadas (P2) - 1 semana

**Esfuerzo total**: 6-8 horas

| Tarea                   | Esfuerzo | Prioridad |
| ----------------------- | -------- | --------- |
| Implementar caching OCR | 3h       | P2        |
| Agregar JSDoc completo  | 2h       | P2        |
| Agregar tests unitarios | 3h       | P2        |

---

## 📊 MÉTRICAS DETALLADAS

### Cobertura de Análisis

| Métrica               | Valor |
| --------------------- | ----- |
| Líneas auditadas      | ~400  |
| Archivos analizados   | 5     |
| Funciones revisadas   | 12    |
| Problemas encontrados | 14    |
| Críticos (P0)         | 6     |
| Altos (P1)            | 5     |
| Moderados (P2)        | 3     |

### Distribución de Problemas

```
P0 (Críticos):     ██████████░ 43%
P1 (Altos):        ███████░░░░ 36%
P2 (Moderados):    ████░░░░░░░ 21%
```

### Score por Archivo

| Archivo                | LOC | Score  | Estado     |
| ---------------------- | --- | ------ | ---------- |
| google-vision.ts       | ~50 | 50/100 | 🔴 Crítico |
| tesseract-worker.ts    | 75  | 0/100  | 🔴 Legacy  |
| card-search.adapter.ts | 119 | 40/100 | 🔴 Crítico |
| card-search.schema.ts  | ~30 | 75/100 | ⚠️ Bueno   |
| card-data.mapper.ts    | 70  | 0/100  | 🔴 Legacy  |
| /api/ocr/route.ts      | ~60 | 30/100 | 🔴 Crítico |

---

## 🎯 RECOMENDACIÓN FINAL

### Veredicto: 🔴 NO LISTO PARA PRODUCCIÓN

**Razones**:

1. 🔴 **CRÍTICO**: Credenciales expuestas en git (riesgo de seguridad)
2. 🔴 **CRÍTICO**: Sin validación de entrada (DoS attack)
3. 🔴 **CRÍTICO**: Exposición de errores (information disclosure)
4. 🔴 **CRÍTICO**: Mock no funciona (feature broken)
5. 🔴 **CRÍTICO**: Sin retry logic (poor reliability)
6. 🔴 **CRÍTICO**: Código legacy sin documentar (confusión)

### Bloqueadores para Producción

1. ❌ **Seguridad**: Rotar credenciales + eliminar de git
2. ❌ **Validación**: Implementar validación de entrada
3. ❌ **Error Handling**: Implementar manejo seguro de errores
4. ❌ **Funcionalidad**: Implementar búsqueda real (Apollo)
5. ❌ **Reliability**: Implementar retry logic
6. ❌ **Cleanup**: Eliminar código legacy

### Roadmap Recomendado

**Sprint 1 (1 día)**: Seguridad crítica (P0 #1-3)

- ✅ Después: Apto para deployment interno (sin datos reales)

**Sprint 2 (1 semana)**: Funcionalidad crítica (P0 #4-6)

- ✅ Después: Feature funcional para testing
- ❌ Todavía NO para producción

**Sprint 3 (1 semana)**: Mejoras altas (P1)

- ✅ Después: Apto para beta testing
- ⚠️ Considerar producción con monitoreo

**Sprint 4 (1 semana)**: Mejoras moderadas (P2)

- ✅ Después: Listo para producción

### Timeline Total

- **Mínimo viable**: 1-2 semanas (P0 completo)
- **Recomendado**: 3-4 semanas (P0 + P1)
- **Ideal**: 4-5 semanas (P0 + P1 + P2)

---

## 📚 REFERENCIAS

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Arquitectura del proyecto
- [AGENTS.md](../../AGENTS.md) - Guía para agentes
- [FASE_1_DOMAIN_LAYER_AUDIT.md](./FASE_1_DOMAIN_LAYER_AUDIT.md) - Auditoría Domain Layer
- [Google Cloud Vision Docs](https://cloud.google.com/vision/docs) - Documentación Vision API
- [Zod Documentation](https://zod.dev/) - Validación de schemas
- [Upstash Ratelimit](https://github.com/upstash/ratelimit) - Rate limiting

---

## 📝 NOTAS FINALES

### Puntos Positivos

- ✅ Credenciales en servidor (patrón correcto)
- ✅ Validación con Zod (schemas bien definidos)
- ✅ Arquitectura limpia (Adapter pattern)
- ✅ Mappers puros (sin side effects)

### Áreas Críticas

- 🔴 Seguridad (credenciales en git)
- 🔴 Validación (sin validación de entrada)
- 🔴 Error handling (exposición de detalles)
- 🔴 Funcionalidad (mock no funciona)
- 🔴 Reliability (sin retry logic)
- 🔴 Mantenibilidad (código legacy)

### Conclusión

**La capa Adapters tiene problemas críticos de seguridad y funcionalidad que deben resolverse antes de producción.** La arquitectura es sólida, pero la implementación necesita trabajo significativo. Con 2-3 semanas de esfuerzo enfocado, puede alcanzar un score de **80-85/100** y estar lista para deployment.

**Prioridad #1**: Resolver problemas de seguridad (Fase 1) **HOY**.

---

**Auditado por**: Devin AI Agent  
**Subagentes**: reviewer (01208fa9) + reviewer (00680efc)  
**Fecha de auditoría**: 2026-09-03  
**Versión del reporte**: 1.0
