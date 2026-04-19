import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';

import { IPurchaseItem } from '../../domain/types';
import { PokemonCardWithMetricsDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardWithMetricsDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCG_TYPES } from '@/lib/types/tcg.types';

interface UseItemsReferencePricesReturn {
  itemsWithPrices: IPurchaseItem[];
  loading: boolean;
}

export function useItemsReferencePrices(items: IPurchaseItem[]): UseItemsReferencePricesReturn {
  const [pricesCache, setPricesCache] = useState<Record<string, number>>({});
  const fetchedGuidsRef = useRef<Set<string>>(new Set());

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

  const fetchPokemonPrices = useCallback(async () => {
    for (const guid of pokemonCardGuids) {
      if (fetchedGuidsRef.current.has(guid)) continue;
      fetchedGuidsRef.current.add(guid);

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
      } catch {
        // Silently handle errors
      }
    }
  }, [pokemonCardGuids, fetchPokemonMetrics]);

  const fetchMagicPrices = useCallback(async () => {
    for (const guid of magicCardGuids) {
      if (fetchedGuidsRef.current.has(guid)) continue;
      fetchedGuidsRef.current.add(guid);

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
      } catch {
        // Silently handle errors
      }
    }
  }, [magicCardGuids, fetchMagicMetrics]);

  useEffect(() => {
    if (pokemonCardGuids.length > 0) {
      fetchPokemonPrices();
    }
  }, [pokemonCardGuids, fetchPokemonPrices]);

  useEffect(() => {
    if (magicCardGuids.length > 0) {
      fetchMagicPrices();
    }
  }, [magicCardGuids, fetchMagicPrices]);

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

  return {
    itemsWithPrices,
    loading: pokemonLoading || magicLoading,
  };
}
