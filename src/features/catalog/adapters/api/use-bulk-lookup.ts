import { useCallback } from 'react';
import { IBatchSearchResult, IPokemonCardMetricsResponse, IMagicCardMetricsResponse } from '../../domain/bulk-lookup.types';
import type {
  BulkSearchMagicCardsQuery,
  BulkSearchPokemonCardsQuery,
  BulkMagicCardMetricsQuery,
  BulkPokemonCardMetricsQuery,
} from '@/lib/api/generated/bulk-lookup.generated';

interface BatchSearchInput {
  lines: string[];
}

export function useMagicBatchSearch() {
  // TODO: Replace with actual Apollo useLazyQuery when backend is ready
  const search = useCallback(
    async (input: BatchSearchInput): Promise<IBatchSearchResult[]> => {
      console.log('Magic batch search:', input);
      // TODO: Call Apollo query with input
      // const { data } = await magicBatchCardSearch({ variables: { input } });
      return [];
    },
    []
  );

  return {
    search,
    loading: false,
    error: null,
  };
}

export function usePokemonBatchSearch() {
  // TODO: Replace with actual Apollo useLazyQuery when backend is ready
  const search = useCallback(
    async (input: BatchSearchInput): Promise<IBatchSearchResult[]> => {
      console.log('Pokemon batch search:', input);
      // TODO: Call Apollo query with input
      // const { data } = await pokemonBatchCardSearch({ variables: { input } });
      return [];
    },
    []
  );

  return {
    search,
    loading: false,
    error: null,
  };
}

export function useMagicCardMetrics() {
  // TODO: Replace with actual Apollo useLazyQuery when backend is ready
  const getMetrics = useCallback(
    async (guid: string): Promise<IMagicCardMetricsResponse | null> => {
      console.log('Magic card metrics:', guid);
      // TODO: Call Apollo query with guid
      // const { data } = await bulkMagicCardMetrics({ variables: { guid } });
      return null;
    },
    []
  );

  return {
    getMetrics,
    loading: false,
    error: null,
  };
}

export function usePokemonCardMetrics() {
  // TODO: Replace with actual Apollo useLazyQuery when backend is ready
  const getMetrics = useCallback(
    async (guid: string): Promise<IPokemonCardMetricsResponse | null> => {
      console.log('Pokemon card metrics:', guid);
      // TODO: Call Apollo query with guid
      // const { data } = await bulkPokemonCardMetrics({ variables: { guid } });
      return null;
    },
    []
  );

  return {
    getMetrics,
    loading: false,
    error: null,
  };
}

export function useBulkLoadInventory() {
  // TODO: Uncomment when backend mutation is ready
  const bulkLoad = useCallback(
    async (payload: any) => {
      console.log('Bulk load inventory:', payload);
      // TODO: Call Apollo mutation when backend is ready
      // const { data } = await bulkLoadInventory({ variables: { input: payload } });
      return {
        success: false,
        createdCount: 0,
        updatedCount: 0,
        errors: ['Backend mutation not yet implemented'],
      };
    },
    []
  );

  return {
    bulkLoad,
    loading: false,
    error: null,
  };
}
