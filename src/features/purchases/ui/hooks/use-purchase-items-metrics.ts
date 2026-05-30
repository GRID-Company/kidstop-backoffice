import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';

import { IPurchaseItem } from '../../domain/types';
import { PokemonCardWithMetricsDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardWithMetricsDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { extractVariantMetrics } from '../../domain/metrics.utils';

interface UseItemsMetricsReturn {
  itemsWithMetrics: IPurchaseItem[];
  loading: boolean;
  refetch: () => void;
}

export function usePurchaseItemsMetrics(items: IPurchaseItem[]): UseItemsMetricsReturn {
  const [metricsCache, setMetricsCache] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(pokemonLoading || magicLoading);
  }, [pokemonLoading, magicLoading]);

  const fetchPokemonData = useCallback(async () => {
    if (pokemonCardGuids.length > 0) {
      for (const guid of pokemonCardGuids) {
        try {
          const { data } = await fetchPokemonMetrics({
            variables: { guid },
          });
          if (data?.pokemonCardWithMetrics) {
            setMetricsCache((prev) => ({
              ...prev,
              [guid]: data.pokemonCardWithMetrics,
            }));
          }
        } catch (error) {
          console.error('Error fetching Pokemon metrics:', error);
        }
      }
    }
  }, [pokemonCardGuids, fetchPokemonMetrics]);

  const fetchMagicData = useCallback(async () => {
    if (magicCardGuids.length > 0) {
      for (const guid of magicCardGuids) {
        try {
          const { data } = await fetchMagicMetrics({
            variables: { guid },
          });
          if (data?.magicCardWithMetrics) {
            setMetricsCache((prev) => ({
              ...prev,
              [guid]: data.magicCardWithMetrics,
            }));
          }
        } catch (error) {
          console.error('Error fetching Magic metrics:', error);
        }
      }
    }
  }, [magicCardGuids, fetchMagicMetrics]);

  useEffect(() => {
    fetchPokemonData();
  }, [fetchPokemonData, pokemonCardGuids]);

  useEffect(() => {
    fetchMagicData();
  }, [fetchMagicData, magicCardGuids]);

  const itemsWithMetrics = useMemo(() => {
    return items.map((item) => {
      const cachedMetrics = metricsCache[item.cardGuid] as { variantsMetrics?: unknown } | undefined;

      if (cachedMetrics && 'variantsMetrics' in cachedMetrics && cachedMetrics.variantsMetrics) {
        const variantMetrics = extractVariantMetrics(
          cachedMetrics.variantsMetrics as Parameters<typeof extractVariantMetrics>[0],
          item.condition
        );

        if (variantMetrics) {
          return {
            ...item,
            metrics: {
              referencePrice: item.metrics?.referencePrice ?? item.referencePrice ?? 0,
              currentStock: variantMetrics.stock,
              lastSaleDate: variantMetrics.lastSaleDate,
              daysInInventory: variantMetrics.daysInInventory,
              wishlistCount: variantMetrics.wishlistCount,
            },
          };
        }
      }

      return item;
    });
  }, [items, metricsCache]);

  const refetch = () => {
    setMetricsCache({});
    pokemonCardGuids.forEach((guid) => {
      fetchPokemonMetrics({ variables: { guid } });
    });
    magicCardGuids.forEach((guid) => {
      fetchMagicMetrics({ variables: { guid } });
    });
  };

  return {
    itemsWithMetrics,
    loading,
    refetch,
  };
}
