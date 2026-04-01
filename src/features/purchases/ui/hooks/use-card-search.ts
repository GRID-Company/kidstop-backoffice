import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { PokemonCardInternalListDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { ICardSearchResult } from '../../domain/types';
import { MOCK_CARD_SEARCH_RESULTS } from '../../adapters/api/card-search.mock';

export function useCardSearch() {
  const [search, setSearch] = useState('');
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const { data: pokemonData, loading: pokemonLoading } = useQuery(
    PokemonCardInternalListDocument,
    {
      variables: {
        findPokemonCardsPublicArgs: {
          skip: 0,
          limit: 50,
          sort: { column: 'name', order: 'ASC' },
          search: search.trim() || undefined,
        },
      },
      skip: selectedTCG !== TCG_TYPES.POKEMON,
    }
  );

  const results = useMemo(() => {
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

    const filtered = MOCK_CARD_SEARCH_RESULTS.filter(
      (card) => card.tcgType === selectedTCG
    );

    if (!search.trim()) return filtered;

    const term = search.toLowerCase().trim();
    return filtered.filter(
      (card) =>
        card.name.toLowerCase().includes(term) ||
        card.setName.toLowerCase().includes(term) ||
        card.setCode.toLowerCase().includes(term) ||
        card.number.includes(term)
    );
  }, [search, selectedTCG, pokemonData]);

  const resetSearch = () => setSearch('');

  return {
    search,
    setSearch,
    results,
    resetSearch,
    selectedTCG,
    loading: selectedTCG === TCG_TYPES.POKEMON ? pokemonLoading : false,
  };
}
