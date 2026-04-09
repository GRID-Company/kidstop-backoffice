import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client/react';

import { CardCondition } from '../../domain/types';
import { PokemonCardWithMetricsDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardWithMetricsDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCGType, TCG_TYPES } from '@/lib/types/tcg.types';

interface UseCardVariantMetricsReturn {
  metrics: {
    stock: number;
    lastSaleDate: string | null;
    daysInInventory: number;
    wishlistCount: number;
  } | null;
  referencePrice: number | null;
  loading: boolean;
  refetch: () => void;
}

export function useCardVariantMetrics(
  cardGuid: string,
  condition: CardCondition,
  tcgType: TCGType
): UseCardVariantMetricsReturn {
  const [fetchPokemonMetrics, { data: pokemonData, loading: pokemonLoading }] = useLazyQuery(
    PokemonCardWithMetricsDocument,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const [fetchMagicMetrics, { data: magicData, loading: magicLoading }] = useLazyQuery(
    MagicCardWithMetricsDocument,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (tcgType === TCG_TYPES.POKEMON) {
      fetchPokemonMetrics({ variables: { guid: cardGuid } });
    } else if (tcgType === TCG_TYPES.MAGIC) {
      fetchMagicMetrics({ variables: { guid: cardGuid } });
    }
  }, [cardGuid, tcgType, fetchPokemonMetrics, fetchMagicMetrics]);

  const metrics = useMemo(() => {
    if (tcgType === TCG_TYPES.POKEMON) {
      if (!pokemonData?.pokemonCardWithMetrics?.variantsMetrics) return null;

      const variantMetric = pokemonData.pokemonCardWithMetrics.variantsMetrics.find(
        (v) => v?.condition === condition
      );

      if (!variantMetric) return null;

      return {
        stock: variantMetric.stock ?? 0,
        lastSaleDate: (variantMetric.lastSellDate as string | null) ?? null,
        daysInInventory: variantMetric.avgDaysInInventory ?? 0,
        wishlistCount: variantMetric.wishlistCount ?? 0,
      };
    }

    if (tcgType === TCG_TYPES.MAGIC) {
      if (!magicData?.magicCardWithMetrics?.variantsMetrics) return null;

      const variantMetric = magicData.magicCardWithMetrics.variantsMetrics.find(
        (v) => v?.condition === condition
      );

      if (!variantMetric) return null;

      return {
        stock: variantMetric.stock ?? 0,
        lastSaleDate: (variantMetric.lastSellDate as string | null) ?? null,
        daysInInventory: variantMetric.avgDaysInInventory ?? 0,
        wishlistCount: variantMetric.wishlistCount ?? 0,
      };
    }

    return null;
  }, [tcgType, pokemonData, magicData, condition]);

  const referencePrice = useMemo(() => {
    if (tcgType === TCG_TYPES.POKEMON) {
      return pokemonData?.pokemonCardWithMetrics?.ungradedPrice ?? null;
    }
    if (tcgType === TCG_TYPES.MAGIC) {
      return magicData?.magicCardWithMetrics?.priceRetail ?? null;
    }
    return null;
  }, [tcgType, pokemonData, magicData]);

  return {
    metrics,
    referencePrice,
    loading: tcgType === TCG_TYPES.POKEMON ? pokemonLoading : magicLoading,
    refetch: () => {
      if (tcgType === TCG_TYPES.POKEMON) {
        fetchPokemonMetrics({ variables: { guid: cardGuid } });
      } else if (tcgType === TCG_TYPES.MAGIC) {
        fetchMagicMetrics({ variables: { guid: cardGuid } });
      }
    },
  };
}
