import { useMemo, useState, useCallback, useEffect } from 'react';
import { SortDescriptor } from '@heroui/react';
import { useQuery } from '@apollo/client/react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { InventoryItemsDocument } from '@/lib/api/generated/inventory.generated';
import { CardLanguage } from '@/lib/api/schema-types';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { fromApiInventoryItem } from '../../adapters/mappers/inventory.mapper';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';
import {
  DateRange,
  IInventoryItem,
  InventoryFilters,
} from '../../domain/types';

export function useInventorySearch() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<
    Omit<InventoryFilters, 'search' | 'dateRange'>
  >({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [resetKey, setResetKey] = useState(0);
  const [sortDescriptor, setSortDescriptor] = useState<
    SortDescriptor | undefined
  >(undefined);
  const [page, setPage] = useState(1);

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      if (value === '') {
        setFilters((prev) => {
          const next = { ...prev };
          delete next[key as keyof typeof prev];
          return next;
        });
        setPage(1);
        return;
      }
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    []
  );

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  }, []);

  const handleSetSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters({});
    setDateRange(undefined);
    setPage(1);
    setResetKey((k) => k + 1);
  }, []);

  const sortColumn = sortDescriptor?.column as string | undefined;
  const sortOrder = sortDescriptor?.direction === 'descending' ? 'DESC' : 'ASC';
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  useEffect(() => {
    setPage(1);
    setFilters({});
    setSearch('');
    setDateRange(undefined);
    setResetKey((k) => k + 1);
  }, [selectedTCG]);

  const { data, loading, error, refetch } = useQuery(InventoryItemsDocument, {
    variables: {
      findInventoryItemsArgs: {
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        limit: DEFAULT_PAGE_SIZE,
        sort: { column: sortColumn ?? 'createdDate', order: sortOrder },
        search: search.trim() || undefined,
        filters: {
          tcg: selectedTCG,
          condition: filters.condition || undefined,
          language: (filters.language as CardLanguage) || undefined,
          // TODO: Backend no soporta lastSellDate como DateRangeFilter
          // Error: invalid input syntax for type timestamp
          // ...(dateRange && {
          //   lastSellDate: {
          //     filterType: ':daterange:',
          //     range: { from: dateRange.start, to: dateRange.end },
          //   },
          // }),
          ...(isPokemon &&
            (filters.rarity || filters.set) && {
              pokemonFilters: {
                rarity: filters.rarity || undefined,
                set: filters.set || undefined,
              },
            }),
          ...(!isPokemon &&
            (filters.rarity ||
              filters.edition ||
              filters.isFoil !== undefined) && {
              magicFilters: {
                rarity: filters.rarity || undefined,
                edition: filters.edition || undefined,
                isFoil: filters.isFoil ?? undefined,
              },
            }),
        },
      },
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const items = useMemo<IInventoryItem[]>(() => {
    if (!data?.inventoryItems?.data) return [];
    return data.inventoryItems.data.map(fromApiInventoryItem);
  }, [data]);

  const totalCount = data?.inventoryItems?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  const activeFilterCount = Object.keys(filters).length;
  const hasActiveFilters =
    search.trim() !== '' || activeFilterCount > 0 || !!dateRange;

  return {
    search,
    setSearch: handleSetSearch,
    filters,
    handleFilterChange,
    dateRange,
    handleDateRangeChange,
    resetFilters,
    resetKey,
    activeFilterCount,
    items,
    hasActiveFilters,
    selectedTCG,
    sortDescriptor,
    setSortDescriptor,
    page,
    setPage,
    totalPages,
    totalCount,
    loading,
    error,
    refetch,
  };
}
