import { useMemo, useState, useCallback } from 'react';
import { SortDescriptor } from '@heroui/react';
import { useQuery } from '@apollo/client/react';
import { InventoryMovementsDocument } from '@/lib/api/generated/inventory.generated';
import { fromApiInventoryMovement } from '../../adapters/mappers/inventory.mapper';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';
import { DateRange, IInventoryMovement, MovementFilters } from '../../domain/types';

export function useMovementSearch() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<MovementFilters, 'search' | 'dateRange'>>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | undefined>({
    column: 'createdDate',
    direction: 'descending',
  });
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
  }, []);

  const sortColumn = sortDescriptor?.column as string | undefined;
  const sortOrder = sortDescriptor?.direction === 'descending' ? 'DESC' : 'ASC';

  const { data, loading, error, refetch } = useQuery(InventoryMovementsDocument, {
    variables: {
      findInventoryMovementsArgs: {
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        limit: DEFAULT_PAGE_SIZE,
        sort: { column: sortColumn ?? 'createdDate', order: sortOrder },
        search: search.trim() || undefined,
        filters: {
          movementType: filters.movementType || undefined,
          ...(dateRange && {
            createdDate: {
              filterType: ':daterange:',
              range: { from: dateRange.start, to: dateRange.end },
            },
          }),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const results = useMemo<IInventoryMovement[]>(() => {
    if (!data?.inventoryMovements?.data) return [];
    return data.inventoryMovements.data.map(fromApiInventoryMovement);
  }, [data]);

  const totalCount = data?.inventoryMovements?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  const hasActiveFilters =
    search.trim() !== '' || Object.keys(filters).length > 0 || !!dateRange;

  return {
    search,
    setSearch: handleSetSearch,
    filters,
    handleFilterChange,
    dateRange,
    handleDateRangeChange,
    resetFilters,
    results,
    paginatedResults: results,
    hasActiveFilters,
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
