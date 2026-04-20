import { useLazyQuery } from '@apollo/client/react';
import { useCallback, useState } from 'react';
import { IBatchSearchResult, IPokemonCardMetricsResponse, IMagicCardMetricsResponse } from '../../domain/bulk-lookup.types';
import type {
  BulkSearchMagicCardsQuery,
  BulkSearchMagicCardsQueryVariables,
  BulkSearchPokemonCardsQuery,
  BulkSearchPokemonCardsQueryVariables,
  BulkMagicCardMetricsQuery,
  BulkMagicCardMetricsQueryVariables,
  BulkPokemonCardMetricsQuery,
  BulkPokemonCardMetricsQueryVariables,
} from '@/lib/api/generated/bulk-lookup.generated';
import {
  BulkSearchMagicCardsDocument,
  BulkSearchPokemonCardsDocument,
  BulkMagicCardMetricsDocument,
  BulkPokemonCardMetricsDocument,
} from '@/lib/api/generated/bulk-lookup.generated';

interface BatchSearchInput {
  searchText: string;
}

export function useMagicBatchSearch() {
  const [search, { loading, error }] = useLazyQuery<
    BulkSearchMagicCardsQuery,
    BulkSearchMagicCardsQueryVariables
  >(BulkSearchMagicCardsDocument);

  const execute = useCallback(
    async (input: BatchSearchInput): Promise<IBatchSearchResult[]> => {
      try {
        const { data } = await search({ variables: { input } });
        return data?.magicBatchCardSearch?.results ?? [];
      } catch (err) {
        console.error('Magic batch search error:', err);
        return [];
      }
    },
    [search]
  );

  return {
    search: execute,
    loading,
    error,
  };
}

export function usePokemonBatchSearch() {
  const [search, { loading, error }] = useLazyQuery<
    BulkSearchPokemonCardsQuery,
    BulkSearchPokemonCardsQueryVariables
  >(BulkSearchPokemonCardsDocument);

  const execute = useCallback(
    async (input: BatchSearchInput): Promise<IBatchSearchResult[]> => {
      try {
        const { data } = await search({ variables: { input } });
        return data?.pokemonBatchCardSearch?.results ?? [];
      } catch (err) {
        console.error('Pokemon batch search error:', err);
        return [];
      }
    },
    [search]
  );

  return {
    search: execute,
    loading,
    error,
  };
}

export function useMagicCardMetrics() {
  const [getMetrics, { loading, error }] = useLazyQuery<
    BulkMagicCardMetricsQuery,
    BulkMagicCardMetricsQueryVariables
  >(BulkMagicCardMetricsDocument);

  const execute = useCallback(
    async (guid: string): Promise<IMagicCardMetricsResponse | null> => {
      try {
        const { data } = await getMetrics({ variables: { guid } });
        return data?.magicCardWithMetrics ?? null;
      } catch (err) {
        console.error('Magic card metrics error:', err);
        return null;
      }
    },
    [getMetrics]
  );

  return {
    getMetrics: execute,
    loading,
    error,
  };
}

export function usePokemonCardMetrics() {
  const [getMetrics, { loading, error }] = useLazyQuery<
    BulkPokemonCardMetricsQuery,
    BulkPokemonCardMetricsQueryVariables
  >(BulkPokemonCardMetricsDocument);

  const execute = useCallback(
    async (guid: string): Promise<IPokemonCardMetricsResponse | null> => {
      try {
        const { data } = await getMetrics({ variables: { guid } });
        return data?.pokemonCardWithMetrics ?? null;
      } catch (err) {
        console.error('Pokemon card metrics error:', err);
        return null;
      }
    },
    [getMetrics]
  );

  return {
    getMetrics: execute,
    loading,
    error,
  };
}

export function useBulkLoadInventory() {
  // TODO: Uncomment when backend mutation is ready
  const [isLoading, setIsLoading] = useState(false);

  const bulkLoad = useCallback(
    async (payload: any) => {
      setIsLoading(true);
      try {
        console.log('Bulk load inventory:', payload);
        // TODO: Call Apollo mutation when backend is ready
        // const { data } = await bulkLoadInventory({ variables: { input: payload } });
        return {
          success: false,
          createdCount: 0,
          updatedCount: 0,
          errors: ['Backend mutation not yet implemented'],
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    bulkLoad,
    loading: isLoading,
    error: null,
  };
}
