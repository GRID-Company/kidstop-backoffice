import { useCallback, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { TCGType, TCG_TYPES } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';
import {
  MagicBatchCardSearchDocument,
  PokemonBatchCardSearchDocument,
  MagicBatchCardSearchQuery,
  PokemonBatchCardSearchQuery,
} from '../generated/bulk-search.generated';
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

const mapMagicCardToBulkCardData = (card: MagicCard): BulkCardData => {
  const inventoryCards: BulkCardInventoryData[] = (card.inventoryCards || []).map((inv) => ({
    guid: inv.guid,
    condition: inv.condition as CardCondition,
    stock: inv.stock,
    purchasePrice: inv.purchasePrice,
    sellPrice: inv.sellPrice,
  }));

  return {
    guid: card.guid,
    name: card.name,
    edition: card.edition || '',
    collectorNumber: card.collectorNumber || '',
    isFoil: card.isFoil,
    sellPrice: card.sellPrice,
    availableStock: card.availableStock,
    totalStock: card.totalStock,
    imageUri: card.imageUri,
    inventoryCards,
  };
};

const mapPokemonCardToBulkCardData = (card: PokemonCard): BulkCardData => {
  const inventoryCards: BulkCardInventoryData[] = (card.inventoryCards || []).map((inv) => ({
    guid: inv.guid,
    condition: inv.condition as CardCondition,
    stock: inv.stock,
    purchasePrice: inv.purchasePrice,
    sellPrice: inv.sellPrice,
  }));

  return {
    guid: card.guid,
    name: card.name,
    edition: card.setName || '',
    collectorNumber: card.cardNumber || '',
    sellPrice: card.sellPrice,
    availableStock: card.availableStock,
    totalStock: card.totalStock,
    imageUri: card.imageUri,
    inventoryCards,
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
          parsedName: result.parsedName,
          parsedSet: result.parsedSet,
          parsedNumber: result.parsedNumber,
          bestMatch: result.bestMatch ? mapMagicCardToBulkCardData(result.bestMatch) : null,
          relatedCards: result.relatedCards?.map(mapMagicCardToBulkCardData) || [],
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
          parsedName: result.parsedName,
          parsedSet: result.parsedSet,
          parsedNumber: result.parsedNumber,
          bestMatch: result.bestMatch ? mapPokemonCardToBulkCardData(result.bestMatch) : null,
          relatedCards: result.relatedCards?.map(mapPokemonCardToBulkCardData) || [],
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
            },
          },
        });
      } else if (tcgType === TCG_TYPES.POKEMON) {
        await searchPokemon({
          variables: {
            input: {
              searchText: searchText.trim(),
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
