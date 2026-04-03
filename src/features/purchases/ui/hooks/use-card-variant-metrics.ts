import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client/react';

import { CardCondition } from '../../domain/types';
import { PokemonCardWithMetricsDocument } from '@/lib/api/generated/catalog-pokemon.generated';

interface UseCardVariantMetricsReturn {
  metrics: {
    stock: number;
    lastSaleDate: string | null;
    daysInInventory: number;
    wishlistCount: number;
  } | null;
  ungradedPrice: number | null;
  loading: boolean;
  refetch: () => void;
}

export function useCardVariantMetrics(
  cardGuid: string,
  condition: CardCondition
): UseCardVariantMetricsReturn {
  const [fetchMetrics, { data, loading, refetch }] = useLazyQuery(
    PokemonCardWithMetricsDocument,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    fetchMetrics({ variables: { guid: cardGuid } });
  }, [cardGuid, fetchMetrics]);

  const metrics = useMemo(() => {
    if (!data?.pokemonCardWithMetrics?.variantsMetrics) return null;

    const variantMetric = data.pokemonCardWithMetrics.variantsMetrics.find(
      (v) => v?.condition === condition
    );

    if (!variantMetric) return null;

    return {
      stock: variantMetric.stock ?? 0,
      lastSaleDate: (variantMetric.lastSellDate as string | null) ?? null,
      daysInInventory: variantMetric.avgDaysInInventory ?? 0,
      wishlistCount: variantMetric.wishlistCount ?? 0,
    };
  }, [data, condition]);

  const ungradedPrice = useMemo(() => {
    return data?.pokemonCardWithMetrics?.ungradedPrice ?? null;
  }, [data]);

  return {
    metrics,
    ungradedPrice,
    loading,
    refetch: () => {
      fetchMetrics({ variables: { guid: cardGuid } });
    },
  };
}
