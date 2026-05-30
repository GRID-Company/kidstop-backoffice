import { useMemo, useState, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';

import { IPurchaseItem } from '../../domain/types';
import { PokemonCardWithMetricsDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardWithMetricsDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCG_TYPES } from '@/lib/types/tcg.types';

interface UseItemsReferencePricesReturn {
  itemsWithPrices: IPurchaseItem[];
  loading: boolean;
  refetch: (itemsToRefetch?: IPurchaseItem[]) => void;
}

export function useItemsReferencePrices(items: IPurchaseItem[]): UseItemsReferencePricesReturn {
  const [pricesCache, setPricesCache] = useState<Record<string, number>>({});
  const fetchedGuidsRef = useRef<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

  const pokemonItems = useMemo(() => items.filter((i) => i.tcgType === TCG_TYPES.POKEMON), [items]);
  const magicItems = useMemo(() => items.filter((i) => i.tcgType === TCG_TYPES.MAGIC), [items]);

  const pokemonCardGuids = useMemo(() => [...new Set(pokemonItems.map((i) => i.cardGuid))], [pokemonItems]);
  const magicCardGuids = useMemo(() => [...new Set(magicItems.map((i) => i.cardGuid))], [magicItems]);

  const [fetchPokemonMetrics, { loading: pokemonLoading }] = useLazyQuery(
    PokemonCardWithMetricsDocument,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const [fetchMagicMetrics, { loading: magicLoading }] = useLazyQuery(
    MagicCardWithMetricsDocument,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const itemsWithPrices = useMemo(() => {
    return items.map((item) => {
      const price = pricesCache[item.cardGuid];
      if (price) {
        return {
          ...item,
          currentReferencePrice: price,
        };
      }
      return item;
    });
  }, [items, pricesCache]);

  const refetch = useCallback((itemsToRefetch?: IPurchaseItem[]) => {
    const itemsForRefetch = itemsToRefetch || items;
    const pokemonGuids = [...new Set(itemsForRefetch.filter(i => i.tcgType === TCG_TYPES.POKEMON).map(i => i.cardGuid))];
    const magicGuids = [...new Set(itemsForRefetch.filter(i => i.tcgType === TCG_TYPES.MAGIC).map(i => i.cardGuid))];
    
    // Cancel previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    fetchedGuidsRef.current.clear();
    setPricesCache({});
    
    // Re-fetch all Pokemon cards sequentially to avoid AbortError
    const refetchPokemon = async () => {
      for (const guid of pokemonGuids) {
        if (abortControllerRef.current?.signal.aborted) break;
        try {
          const result = await fetchPokemonMetrics({
            variables: { guid },
          });
          if (result.data?.pokemonCardWithMetrics?.ungradedPrice != null) {
            setPricesCache((prev) => ({
              ...prev,
              [guid]: result.data!.pokemonCardWithMetrics!.ungradedPrice!,
            }));
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.warn(`Failed to refetch Pokemon price for ${guid}:`, error);
          }
        }
      }
    };
    
    // Re-fetch all Magic cards sequentially to avoid AbortError
    const refetchMagic = async () => {
      for (const guid of magicGuids) {
        if (abortControllerRef.current?.signal.aborted) break;
        try {
          const result = await fetchMagicMetrics({
            variables: { guid },
          });
          if (result.data?.magicCardWithMetrics?.priceRetail != null) {
            setPricesCache((prev) => ({
              ...prev,
              [guid]: result.data!.magicCardWithMetrics!.priceRetail!,
            }));
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.warn(`Failed to refetch Magic price for ${guid}:`, error);
          }
        }
      }
    };
    
    // Execute both in parallel
    Promise.all([refetchPokemon(), refetchMagic()]).catch((error) => {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Error during refetch:', error);
      }
    });
  }, [items, fetchPokemonMetrics, fetchMagicMetrics]);

  return {
    itemsWithPrices,
    loading: pokemonLoading || magicLoading,
    refetch,
  };
}
