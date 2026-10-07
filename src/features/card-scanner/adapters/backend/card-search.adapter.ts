import type { ApolloClient } from '@apollo/client';
import type { CardScanSearchInput } from '@/lib/api/schema-types';
import {
  MagicCardScanSearchDocument,
  PokemonCardScanSearchDocument,
} from '@/lib/api/generated/card-scan-search.generated';
import {
  IExtractedCardData,
  ICardSearchResponse,
  TCGGame,
} from '../../domain/types';
import { cardScanSearchInputSchema } from '../schemas/card-search.schema';
import {
  mapMagicScanResultFromApi,
  mapPokemonScanResultFromApi,
} from '../mappers/card-scan.mapper';
import { mockCardSearchResponse } from './card-search.mock';
import { logger } from '../../domain/logger';

const EMPTY_SCAN_RESPONSE: ICardSearchResponse = {
  resolvedByAI: false,
  bestMatch: null,
  candidates: [],
  aiResolved: null,
  error: null,
};

export function buildCardScanSearchInput(
  extractedData: IExtractedCardData,
  originalImage: File | null,
  setIcon: File | null,
  aiSearchOnly = false
): CardScanSearchInput {
  return {
    name: extractedData.name.normalizedValue ?? extractedData.name.value,
    cardNumber:
      extractedData.collectorNumber.normalizedValue ??
      extractedData.collectorNumber.value,
    setCode:
      extractedData.setCode.normalizedValue ?? extractedData.setCode.value,
    originalImage,
    setIcon,
    aiSearchOnly,
    withCardsMetrics: true,
  };
}

export function validateCardScanSearchInput(
  input: CardScanSearchInput
): { valid: true } | { valid: false; errors: string[] } {
  const result = cardScanSearchInputSchema.safeParse(input);

  if (result.success) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    ),
  };
}

async function searchCardInBackendMock(
  game: TCGGame,
  aiSearchOnly = false
): Promise<ICardSearchResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockCardSearchResponse(game, aiSearchOnly);
}

function isCardScanOperationUnavailable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('Cannot query field') && message.includes('CardScanSearch')
  );
}

export async function searchCardInBackend(
  client: ApolloClient,
  game: TCGGame,
  input: CardScanSearchInput
): Promise<ICardSearchResponse> {
  logger.debug('🔍 Buscando carta en backend:', { game, input });

  if (process.env.NEXT_PUBLIC_CARD_SCAN_USE_MOCK === 'true') {
    return searchCardInBackendMock(game, Boolean(input.aiSearchOnly));
  }

  try {
    if (game === 'magic') {
      const { data } = await client.query({
        query: MagicCardScanSearchDocument,
        variables: { input },
        fetchPolicy: 'no-cache',
      });

      if (!data?.magicCardScanSearch) {
        return EMPTY_SCAN_RESPONSE;
      }

      return mapMagicScanResultFromApi(data.magicCardScanSearch);
    }

    const { data } = await client.query({
      query: PokemonCardScanSearchDocument,
      variables: { input },
      fetchPolicy: 'no-cache',
    });

    if (!data?.pokemonCardScanSearch) {
      return EMPTY_SCAN_RESPONSE;
    }

    return mapPokemonScanResultFromApi(data.pokemonCardScanSearch);
  } catch (error) {
    if (isCardScanOperationUnavailable(error)) {
      logger.warn('⚠️ cardScanSearch no disponible en el backend, usando mock');
      return searchCardInBackendMock(game, Boolean(input.aiSearchOnly));
    }
    throw error;
  }
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
  extractedData: IExtractedCardData,
  hasImage: boolean
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

  if (!hasMinimumSearchCriteria(extractedData) && !hasImage) {
    feedback.push(
      '❌ Criterios insuficientes. Necesitas al menos: Nombre O (Número + Set) o una imagen.'
    );
  }

  return feedback;
}
