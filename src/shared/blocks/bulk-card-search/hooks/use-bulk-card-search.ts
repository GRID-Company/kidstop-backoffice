import { useCallback, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { TCGType, TCG_TYPES } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';
import {
  MagicBatchCardSearchDocument,
  MagicBatchCardSearchQuery,
} from '@/lib/api/generated/catalog-magic.generated';
import {
  PokemonBatchCardSearchDocument,
  PokemonBatchCardSearchQuery,
} from '@/lib/api/generated/catalog-pokemon.generated';
import { BulkCardResult, BulkCardData, BulkCardInventoryData } from '../types';

interface UseBulkCardSearchReturn {
  search: (searchText: string, tcgType: TCGType) => Promise<void>;
  results: BulkCardResult[];
  loading: boolean;
  error: string | null;
  reset: () => void;
}

type MagicCard = NonNullable<
  NonNullable<MagicBatchCardSearchQuery['magicBatchCardSearch']>['results'][number]['bestMatch']
>;
type PokemonCard = NonNullable<
  NonNullable<PokemonBatchCardSearchQuery['pokemonBatchCardSearch']>['results'][number]['bestMatch']
>;
type MagicRelatedCard = NonNullable<MagicBatchCardSearchQuery['magicBatchCardSearch']>['results'][number]['relatedCards'][number];
type PokemonRelatedCard = NonNullable<PokemonBatchCardSearchQuery['pokemonBatchCardSearch']>['results'][number]['relatedCards'][number];

const mapMagicCardToBulkCardData = (card: MagicCard): BulkCardData => {
  const inventoryCards: BulkCardInventoryData[] = card.cardMetrics?.variantsMetrics?.map((variant) => ({
    guid: `${card.guid}-${variant.condition}`,
    condition: variant.condition as CardCondition,
    stock: variant.stock,
    purchasePrice: null,
    sellPrice: null,
  })) || [];

  return {
    guid: card.guid,
    name: card.name,
    edition: card.edition || '',
    collectorNumber: card.collectorNumber || '',
    isFoil: card.isFoil,
    sellPrice: card.sellPrice,
    totalStock: card.totalStock,
    imageUri: card.imageUri,
    inventoryCards,
    referencePrice: card.cardMetrics?.priceRetail || null,
  };
};

const mapPokemonCardToBulkCardData = (card: PokemonCard): BulkCardData => {
  const inventoryCards: BulkCardInventoryData[] = card.cardMetrics?.variantsMetrics?.map((variant) => ({
    guid: `${card.guid}-${variant.condition}`,
    condition: variant.condition as CardCondition,
    stock: variant.stock,
    purchasePrice: null,
    sellPrice: null,
  })) || [];

  return {
    guid: card.guid,
    name: card.name,
    edition: card.setName || '',
    collectorNumber: card.cardNumber || '',
    sellPrice: card.sellPrice,
    totalStock: card.totalStock,
    imageUri: card.imageUri,
    inventoryCards,
    referencePrice: card.cardMetrics?.ungradedPrice || null,
  };
};

const mapMagicRelatedCardToBulkCardData = (card: MagicRelatedCard): BulkCardData => {
  return {
    guid: card.guid,
    name: card.name,
    edition: card.edition || '',
    collectorNumber: card.collectorNumber || '',
    isFoil: card.isFoil,
    sellPrice: card.sellPrice,
    totalStock: card.totalStock,
    imageUri: card.imageUri,
    inventoryCards: [],
    referencePrice: null,
  };
};

const mapPokemonRelatedCardToBulkCardData = (card: PokemonRelatedCard): BulkCardData => {
  return {
    guid: card.guid,
    name: card.name,
    edition: card.setName || '',
    collectorNumber: card.cardNumber || '',
    sellPrice: card.sellPrice,
    totalStock: card.totalStock,
    imageUri: card.imageUri,
    inventoryCards: [],
    referencePrice: null,
  };
};

export function useBulkCardSearch(): UseBulkCardSearchReturn {
  const [results, setResults] = useState<BulkCardResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [searchMagic, { data: magicData, loading: magicLoading, error: magicError }] =
    useLazyQuery(MagicBatchCardSearchDocument, {
      fetchPolicy: 'network-only',
    });

  const [searchPokemon, { data: pokemonData, loading: pokemonLoading, error: pokemonError }] =
    useLazyQuery(PokemonBatchCardSearchDocument, {
      fetchPolicy: 'network-only',
    });

  useEffect(() => {
    if (magicData?.magicBatchCardSearch?.results) {
      const mappedResults: BulkCardResult[] = magicData.magicBatchCardSearch.results.map(
        (result) => ({
          originalLine: result.originalLine,
          parsedQuantity: result.parsedQuantity,
          parsedName: result.parsedName,
          parsedSet: result.parsedSet,
          parsedNumber: result.parsedNumber,
          bestMatch: result.bestMatch ? mapMagicCardToBulkCardData(result.bestMatch) : null,
          relatedCards: result.relatedCards?.map(mapMagicRelatedCardToBulkCardData) || [],
          error: result.error,
        })
      );
      setResults(mappedResults);
      setError(null);
    }
  }, [magicData]);

  useEffect(() => {
    if (pokemonData?.pokemonBatchCardSearch?.results) {
      const mappedResults: BulkCardResult[] = pokemonData.pokemonBatchCardSearch.results.map(
        (result) => ({
          originalLine: result.originalLine,
          parsedQuantity: result.parsedQuantity,
          parsedName: result.parsedName,
          parsedSet: result.parsedSet,
          parsedNumber: result.parsedNumber,
          bestMatch: result.bestMatch ? mapPokemonCardToBulkCardData(result.bestMatch) : null,
          relatedCards: result.relatedCards?.map(mapPokemonRelatedCardToBulkCardData) || [],
          error: result.error,
        })
      );
      setResults(mappedResults);
      setError(null);
    }
  }, [pokemonData]);

  useEffect(() => {
    if (magicError) {
      setError(magicError.message);
      setResults([]);
    }
  }, [magicError]);

  useEffect(() => {
    if (pokemonError) {
      setError(pokemonError.message);
      setResults([]);
    }
  }, [pokemonError]);

  const search = useCallback(
    async (searchText: string, tcgType: TCGType) => {
      if (!searchText.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      if (tcgType === TCG_TYPES.MAGIC) {
        await searchMagic({
          variables: {
            input: {
              searchText: searchText.trim(),
              withCardsMetrics: true,
            },
          },
        });
      } else if (tcgType === TCG_TYPES.POKEMON) {
        await searchPokemon({
          variables: {
            input: {
              searchText: searchText.trim(),
              withCardsMetrics: true,
            },
          },
        });
      }
    },
    [searchMagic, searchPokemon]
  );

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    results,
    loading: magicLoading || pokemonLoading,
    error,
    reset,
  };
}
