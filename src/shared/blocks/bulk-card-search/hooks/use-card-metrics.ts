import { useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { PokemonCardWithMetricsDocument, PokemonCardWithMetricsQuery } from '@/lib/api/generated/catalog-pokemon.generated';
import { BulkCardDetailMetrics, BulkCardVariantMetrics } from '../types';

type VariantMetric = NonNullable<NonNullable<PokemonCardWithMetricsQuery['pokemonCardWithMetrics']>['variantsMetrics']>[number];

interface UseCardMetricsReturn {
  metrics: BulkCardDetailMetrics | null;
  loading: boolean;
  error: string | null;
}

const mapVariantMetric = (v: VariantMetric): BulkCardVariantMetrics => ({
  condition: v.condition,
  stock: v.stock,
  lastSellDate: v.lastSellDate as string | null,
  avgDaysInInventory: v.avgDaysInInventory ?? null,
  wishlistCount: v.wishlistCount,
});

const metricsCache = new Map<string, BulkCardDetailMetrics>();

export function useCardMetrics(cardGuid: string | null): UseCardMetricsReturn {
  const cacheRef = useRef(metricsCache);

  const [fetchMetrics, { data, loading, error }] = useLazyQuery(
    PokemonCardWithMetricsDocument,
    {
      fetchPolicy: 'cache-first',
    }
  );

  useEffect(() => {
    if (!cardGuid) return;

    // Verificar si ya está en caché
    if (cacheRef.current.has(cardGuid)) {
      return;
    }

    // Ejecutar query
    fetchMetrics({
      variables: { guid: cardGuid },
    });
  }, [cardGuid, fetchMetrics]);

  useEffect(() => {
    if (data?.pokemonCardWithMetrics && cardGuid) {
      const metrics: BulkCardDetailMetrics = {
        variantsMetrics: data.pokemonCardWithMetrics.variantsMetrics?.map(mapVariantMetric) || [],
        ungradedPrice: data.pokemonCardWithMetrics.ungradedPrice,
        gradedPriceSeven: data.pokemonCardWithMetrics.gradedPriceSeven,
        gradedPriceEightOrAbove: data.pokemonCardWithMetrics.gradedPriceEightOrAbove,
      };
      cacheRef.current.set(cardGuid, metrics);
    }
  }, [data, cardGuid]);

  if (!cardGuid) {
    return { metrics: null, loading: false, error: null };
  }

  // Retornar desde caché si existe
  const cachedMetrics = cacheRef.current.get(cardGuid);
  if (cachedMetrics) {
    return { metrics: cachedMetrics, loading: false, error: null };
  }

  return {
    metrics: data?.pokemonCardWithMetrics ? {
      variantsMetrics: data.pokemonCardWithMetrics.variantsMetrics?.map(mapVariantMetric) || [],
      ungradedPrice: data.pokemonCardWithMetrics.ungradedPrice,
      gradedPriceSeven: data.pokemonCardWithMetrics.gradedPriceSeven,
      gradedPriceEightOrAbove: data.pokemonCardWithMetrics.gradedPriceEightOrAbove,
    } : null,
    loading,
    error: error?.message || null,
  };
}
