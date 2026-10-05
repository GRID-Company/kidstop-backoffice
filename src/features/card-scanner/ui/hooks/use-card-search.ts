import { useState, useCallback } from 'react';
import { useApolloClient } from '@apollo/client/react';
import {
  TCGGame,
  ICardSearchResponse,
  IScannedCardData,
} from '../../domain/types';
import { dataUrlToFile } from '../../domain/utils.domain';
import {
  buildCardScanSearchInput,
  searchCardInBackend,
  validateCardScanSearchInput,
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
  scannedData: IScannedCardData
): UseCardSearchResult => {
  const client = useApolloClient();
  const [searchResults, setSearchResults] =
    useState<ICardSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { extractedData, normalizedImageUrl, setIconImageUrl } = scannedData;
  const hasImage = Boolean(normalizedImageUrl);
  const canSearch = hasMinimumSearchCriteria(extractedData) || hasImage;
  const searchFeedback = getSearchCriteriaFeedback(extractedData, hasImage);

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    setSearchError(null);
    setValidationErrors([]);
    setSearchResults(null);

    try {
      const originalImage = normalizedImageUrl
        ? await dataUrlToFile(normalizedImageUrl, 'card-scan')
        : null;
      const setIcon = setIconImageUrl
        ? await dataUrlToFile(setIconImageUrl, 'set-icon')
        : null;

      const input = buildCardScanSearchInput(
        extractedData,
        originalImage,
        setIcon
      );

      const validation = validateCardScanSearchInput(input);

      if (!validation.valid) {
        setValidationErrors(validation.errors);
        setSearchError('Datos inválidos para búsqueda');
        return;
      }

      logger.debug('📦 Input validado:', input);

      const results = await searchCardInBackend(client, game, input);

      setSearchResults(results);

      if (results.error) {
        setSearchError(results.error);
      } else if (results.candidates.length === 0) {
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
  }, [client, extractedData, game, normalizedImageUrl, setIconImageUrl]);

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
