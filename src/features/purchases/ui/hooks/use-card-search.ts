import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useDebounce } from '@/lib/hooks/use-debounce';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { PokemonCardInternalListDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardInternalListDocument } from '@/lib/api/generated/catalog-magic.generated';
import { ICardSearchResult } from '../../domain/types';

export function useCardSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 800);
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const { data: pokemonData, loading: pokemonLoading } = useQuery(
    PokemonCardInternalListDocument,
    {
      variables: {
        findPokemonCardsPublicArgs: {
          skip: 0,
          limit: 5,
          sort: { column: 'name', order: 'ASC' },
          search: debouncedSearch.trim() || undefined,
        },
      },
      skip: selectedTCG !== TCG_TYPES.POKEMON || !debouncedSearch.trim(),
    }
  );

  const { data: magicData, loading: magicLoading } = useQuery(
    MagicCardInternalListDocument,
    {
      variables: {
        findMagicCardsPublicArgs: {
          skip: 0,
          limit: 5,
          sort: { column: 'name', order: 'ASC' },
          search: debouncedSearch.trim() || undefined,
        },
      },
      skip: selectedTCG !== TCG_TYPES.MAGIC || !debouncedSearch.trim(),
    }
  );

  const results = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    
    if (selectedTCG === TCG_TYPES.POKEMON) {
      if (!pokemonData?.pokemonCardInternalList?.data) return [];
      
      return pokemonData.pokemonCardInternalList.data.map((card): ICardSearchResult => ({
        guid: card.guid,
        name: card.name,
        setName: card.setName || '',
        setCode: card.setCode || '',
        number: '',
        rarity: '',
        imageUrl: card.imageUri || '',
        tcgType: TCG_TYPES.POKEMON,
        metrics: {
          referencePrice: card.sellPrice || 0,
          currentStock: card.availableStock ? 1 : 0,
          lastSaleDate: null,
          daysInInventory: 0,
          wishlistCount: 0,
        },
      }));
    }

    if (selectedTCG === TCG_TYPES.MAGIC) {
      if (!magicData?.magicCardInternalList?.data) return [];
      
      return magicData.magicCardInternalList.data.map((card): ICardSearchResult => ({
        guid: card.guid,
        name: card.name,
        setName: card.edition || '',
        setCode: '',
        number: card.collectorNumber || '',
        rarity: '',
        imageUrl: card.imageUri || '',
        tcgType: TCG_TYPES.MAGIC,
        metrics: {
          referencePrice: card.sellPrice || 0,
          currentStock: card.availableStock ? 1 : 0,
          lastSaleDate: null,
          daysInInventory: 0,
          wishlistCount: 0,
        },
      }));
    }

    return [];
  }, [debouncedSearch, selectedTCG, pokemonData, magicData]);

  const resetSearch = () => setSearch('');

  return {
    search,
    setSearch,
    results,
    resetSearch,
    selectedTCG,
    loading: selectedTCG === TCG_TYPES.POKEMON ? pokemonLoading : magicLoading,
  };
}
