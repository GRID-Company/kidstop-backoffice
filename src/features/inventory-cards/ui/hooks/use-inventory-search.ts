import { useMemo, useState, useCallback } from 'react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { MOCK_INVENTORY_ITEMS } from '../../adapters/api/inventory.mock';
import { DateRange, IInventoryItem, InventoryFilters } from '../../domain/types';

export function useInventorySearch() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<InventoryFilters, 'tcgType' | 'search' | 'dateRange'>>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters({});
    setDateRange(undefined);
  }, []);

  const results = useMemo(() => {
    let items: IInventoryItem[] = [...MOCK_INVENTORY_ITEMS];

    items = items.filter((i) => i.tcgType === selectedTCG);

    if (search.trim()) {
      const term = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.setName.toLowerCase().includes(term) ||
          i.setCode.toLowerCase().includes(term) ||
          i.number.toLowerCase().includes(term)
      );
    }

    if (filters.condition) {
      items = items.filter((i) => i.condition === filters.condition);
    }

    if (filters.stockStatus) {
      items = items.filter((i) => i.stockStatus === filters.stockStatus);
    }

    if (filters.rarity) {
      items = items.filter((i) => i.rarity === filters.rarity);
    }

    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      items = items.filter((i) => {
        if (!i.lastSoldAt) return false;
        const soldDate = new Date(i.lastSoldAt);
        return soldDate >= startDate && soldDate <= endDate;
      });
    }

    return items;
  }, [selectedTCG, search, filters, dateRange]);

  const hasActiveFilters = search.trim() !== '' || Object.keys(filters).length > 0 || !!dateRange;

  return {
    search,
    setSearch,
    filters,
    handleFilterChange,
    dateRange,
    handleDateRangeChange,
    resetFilters,
    results,
    hasActiveFilters,
    selectedTCG,
  };
}
