import { useMemo, useState, useCallback } from 'react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { MOCK_CARDS } from '../../adapters/api/catalog.mock';
import { ICard, CardFilters } from '../../domain/types';

export function useCardSearch() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<CardFilters, 'tcgType' | 'search'>>({});

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      if (value === '') {
        setFilters((prev) => {
          const next = { ...prev };
          delete next[key as keyof typeof prev];
          return next;
        });
        return;
      }
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters({});
  }, []);

  const results = useMemo(() => {
    let cards: ICard[] = [...MOCK_CARDS];

    cards = cards.filter((c) => c.tcgType === selectedTCG);

    if (search.trim()) {
      const term = search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.setName.toLowerCase().includes(term) ||
          c.setCode.toLowerCase().includes(term) ||
          c.number.toLowerCase().includes(term)
      );
    }

    if (filters.rarity) {
      cards = cards.filter((c) => c.rarity === filters.rarity);
    }

    if (filters.condition) {
      cards = cards.filter((c) =>
        c.variants.some((v) => v.condition === filters.condition)
      );
    }

    if (filters.setCode) {
      cards = cards.filter((c) => c.setCode === filters.setCode);
    }

    return cards;
  }, [selectedTCG, search, filters]);

  const hasActiveFilters = search.trim() !== '' || Object.keys(filters).length > 0;

  return {
    search,
    setSearch,
    filters,
    handleFilterChange,
    resetFilters,
    results,
    hasActiveFilters,
    selectedTCG,
  };
}
