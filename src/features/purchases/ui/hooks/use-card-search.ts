import { useMemo, useState } from 'react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { ICardSearchResult } from '../../domain/types';
import { MOCK_CARD_SEARCH_RESULTS } from '../../adapters/api/card-search.mock';

export function useCardSearch() {
  const [search, setSearch] = useState('');
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const results = useMemo(() => {
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
  }, [search, selectedTCG]);

  const resetSearch = () => setSearch('');

  return {
    search,
    setSearch,
    results,
    resetSearch,
    selectedTCG,
  };
}
