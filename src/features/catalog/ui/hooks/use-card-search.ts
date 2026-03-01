import { useMemo, useState, useCallback } from 'react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { MOCK_CARDS } from '../../adapters/api/catalog.mock';
import { ICard, CardFilters } from '../../domain/types';
import { TCG_TYPES } from '@/lib/types/tcg.types';

export function useCardSearch() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<CardFilters, 'tcgType' | 'search'>>({});
  const [sortValue, setSortValue] = useState('');
  const [resetKey, setResetKey] = useState(0);

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

  const handleSortChange = useCallback((value: string) => {
    setSortValue(value);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters({});
    setSortValue('');
    setResetKey((k) => k + 1);
  }, []);

  const results = useMemo(() => {
    let cards: ICard[] = MOCK_CARDS.filter((c) => c.tcgType === TCG_TYPES.MAGIC);

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

    if (sortValue) {
      const [column, order] = sortValue.split('_');
      cards = [...cards].sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';
        if (column === 'name') { aVal = a.name; bVal = b.name; }
        else if (column === 'rarity') { aVal = a.rarity; bVal = b.rarity; }
        else if (column === 'setName') { aVal = a.setName; bVal = b.setName; }
        const cmp = aVal.toString().localeCompare(bVal.toString());
        return order === 'DESC' ? -cmp : cmp;
      });
    }

    return cards;
  }, [selectedTCG, search, filters, sortValue]);

  const hasActiveFilters = search.trim() !== '' || Object.keys(filters).length > 0;
  const activeFilterCount = Object.keys(filters).length;

  return {
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleSortChange,
    sortValue,
    resetFilters,
    resetKey,
    results,
    hasActiveFilters,
    activeFilterCount,
    selectedTCG,
  };
}
