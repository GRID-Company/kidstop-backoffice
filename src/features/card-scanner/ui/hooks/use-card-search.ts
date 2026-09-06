import { useState, useCallback } from 'react';
import {
  IExtractedCardData,
  IScanConfidence,
  TCGGame,
  ICardSearchResponse,
  IRegionalOcrResult,
} from '../../domain/types';
import {
  prepareCardSearchPayload,
  searchCardInBackend,
  hasMinimumSearchCriteria,
  getSearchCriteriaFeedback,
} from '../../adapters/backend/card-search.adapter';
import { logger } from '../../domain/logger';

interface UseCardSearchResult {
  searchResults: ICardSearchResponse | null;
  isSearching: boolean;
  searchError: string | null;
  validationErrors: string[];
  searchFeedback: string[];
  canSearch: boolean;
  performSearch: () => Promise<void>;
  clearResults: () => void;
}

export const useCardSearch = (
  game: TCGGame,
  extractedData: IExtractedCardData,
  confidence: IScanConfidence,
  rawOcr: IRegionalOcrResult
): UseCardSearchResult => {
  const [searchResults, setSearchResults] =
    useState<ICardSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const canSearch = hasMinimumSearchCriteria(extractedData);
  const searchFeedback = getSearchCriteriaFeedback(extractedData);

  const performSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    setValidationErrors([]);
    setSearchResults(null);

    try {
      const payload = prepareCardSearchPayload(
        game,
        extractedData,
        confidence,
        rawOcr
      );

      if (!payload.valid) {
        setValidationErrors(payload.errors);
        setSearchError('Datos inválidos para búsqueda');
        return;
      }

      logger.debug('📦 Payload validado:', payload.payload);

      const results = await searchCardInBackend(payload.payload);

      setSearchResults(results);

      if (results.candidates.length === 0) {
        setSearchError('No se encontraron resultados');
      }
    } catch (error) {
      logger.error('Error en búsqueda:', error);
      setSearchError(
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setSearchError(null);
    setValidationErrors([]);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    validationErrors,
    searchFeedback,
    canSearch,
    performSearch,
    clearResults,
  };
};
