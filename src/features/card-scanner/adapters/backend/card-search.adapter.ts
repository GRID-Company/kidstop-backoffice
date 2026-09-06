import {
  IExtractedCardData,
  IScanConfidence,
  TCGGame,
  ICardSearchRequest,
  ICardSearchResponse,
  IRegionalOcrResult,
} from '../../domain/types';
import {
  cardSearchRequestSchema,
  CardSearchRequestSchema,
} from '../schemas/card-search.schema';
import { logger } from '../../domain/logger';

export function buildCardSearchRequest(
  game: TCGGame,
  extractedData: IExtractedCardData,
  confidence: IScanConfidence,
  rawOcr: IRegionalOcrResult
): ICardSearchRequest {
  const request: ICardSearchRequest = {
    schemaVersion: '1.0',
    game: (game === 'pokemon' || game === 'magic' ? game : 'unknown') as
      | TCGGame
      | 'unknown',
    scan: {
      capturedAt: new Date().toISOString(),
      orientation: 'portrait',
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

  return request;
}

export function validateCardSearchRequest(
  request: ICardSearchRequest
):
  | { valid: true; data: ICardSearchRequest }
  | { valid: false; errors: string[] } {
  try {
    const validated: CardSearchRequestSchema =
      cardSearchRequestSchema.parse(request);
    return { valid: true, data: validated as ICardSearchRequest };
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as {
        issues: Array<{ path: Array<string | number>; message: string }>;
      };
      const errors = zodError.issues.map(
        (e) => `${e.path.join('.')}: ${e.message}`
      );
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Validation error'] };
  }
}

export async function searchCardInBackend(
  request: ICardSearchRequest
): Promise<ICardSearchResponse> {
  logger.debug('🔍 Buscando carta en backend:', request);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockResponse: ICardSearchResponse = {
    candidates: [],
  };

  return mockResponse;
}

export function prepareCardSearchPayload(
  game: TCGGame,
  extractedData: IExtractedCardData,
  confidence: IScanConfidence,
  rawOcr: IRegionalOcrResult
):
  | { valid: true; payload: ICardSearchRequest }
  | { valid: false; errors: string[] } {
  const request = buildCardSearchRequest(
    game,
    extractedData,
    confidence,
    rawOcr
  );

  const validation = validateCardSearchRequest(request);

  if (!validation.valid) {
    return { valid: false, errors: validation.errors };
  }

  return { valid: true, payload: validation.data };
}

export function hasMinimumSearchCriteria(
  extractedData: IExtractedCardData
): boolean {
  const hasName = extractedData.name.value !== null;
  const hasNumber = extractedData.collectorNumber.value !== null;
  const hasSet = extractedData.setCode.value !== null;

  return hasName || (hasNumber && hasSet);
}

export function getSearchCriteriaFeedback(
  extractedData: IExtractedCardData
): string[] {
  const feedback: string[] = [];

  if (extractedData.name.value === null) {
    feedback.push(
      '⚠️ Nombre no detectado. Agrégalo manualmente para mejorar la búsqueda.'
    );
  }

  if (extractedData.collectorNumber.value === null) {
    feedback.push(
      '💡 Número de colección no detectado. Ayudaría a identificar la carta.'
    );
  }

  if (extractedData.setCode.value === null) {
    feedback.push(
      '💡 Código de set no detectado. Ayudaría a filtrar resultados.'
    );
  }

  if (!hasMinimumSearchCriteria(extractedData)) {
    feedback.push(
      '❌ Criterios insuficientes. Necesitas al menos: Nombre O (Número + Set).'
    );
  }

  return feedback;
}
