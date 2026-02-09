import { useMemo, useState, useCallback, useEffect } from 'react';
import { SortDescriptor } from '@heroui/react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { MOCK_MOVEMENTS } from '../../adapters/api/movements.mock';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';
import { DateRange, IInventoryMovement, MovementFilters } from '../../domain/types';

export function useMovementSearch() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<MovementFilters, 'tcgType' | 'search' | 'dateRange'>>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | undefined>({
    column: 'createdAt',
    direction: 'descending',
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

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
    setPage(1);
  }, []);

  const results = useMemo(() => {
    let items: IInventoryMovement[] = [...MOCK_MOVEMENTS];

    items = items.filter((i) => i.tcgType === selectedTCG);

    if (search.trim()) {
      const term = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.cardName.toLowerCase().includes(term) ||
          i.setName.toLowerCase().includes(term) ||
          i.setCode.toLowerCase().includes(term) ||
          i.cardNumber.toLowerCase().includes(term) ||
          i.userName.toLowerCase().includes(term) ||
          (i.reference && i.reference.toLowerCase().includes(term))
      );
    }

    if (filters.type) {
      items = items.filter((i) => i.type === filters.type);
    }

    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      items = items.filter((i) => {
        const createdDate = new Date(i.createdAt);
        return createdDate >= startDate && createdDate <= endDate;
      });
    }

    if (sortDescriptor?.column) {
      const col = sortDescriptor.column as keyof IInventoryMovement;
      const dir = sortDescriptor.direction === 'descending' ? -1 : 1;
      items.sort((a, b) => {
        const aVal = a[col];
        const bVal = b[col];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
        return String(aVal).localeCompare(String(bVal)) * dir;
      });
    }

    return items;
  }, [selectedTCG, search, filters, dateRange, sortDescriptor]);

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));

  const paginatedResults = useMemo(() => {
    const start = (page - 1) * pageSize;
    return results.slice(start, start + pageSize);
  }, [results, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
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
    paginatedResults,
    hasActiveFilters,
    selectedTCG,
    sortDescriptor,
    setSortDescriptor,
    page,
    setPage,
    totalPages,
  };
}
