import { useMemo, useState } from 'react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { ISale, SaleFilters, SaleStatus } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';
import { MOCK_SALES } from '../../adapters/api/sales.mock';

interface UseSalesReturn {
  sales: ISale[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filters: SaleFilters;
  setStatusFilter: (status: SaleStatus | undefined) => void;
  setSearch: (search: string) => void;
  setCustomerFilter: (customerId: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
  setDateTo: (to: string | undefined) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: SaleFilters = {};

export function useSales(): UseSalesReturn {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [filters, setFilters] = useState<SaleFilters>(DEFAULT_FILTERS);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = MOCK_SALES.filter((s) => s.tcgType === selectedTCG);

    if (filters.status) {
      result = result.filter((s) => s.status === filters.status);
    }

    if (filters.customerId) {
      result = result.filter((s) => s.customerId === filters.customerId);
    }

    if (filters.search?.trim()) {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.code.toLowerCase().includes(term) ||
          s.customerName.toLowerCase().includes(term) ||
          s.items.some((i) => i.cardName.toLowerCase().includes(term))
      );
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((s) => new Date(s.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((s) => new Date(s.createdAt) <= to);
    }

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [selectedTCG, filters, dateFrom, dateTo]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / DEFAULT_PAGE_SIZE)
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return filtered.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [filtered, page]);

  const setStatusFilter = (status: SaleStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
    setPage(1);
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  };

  const setCustomerFilter = (customerId: string | undefined) => {
    setFilters((prev) => ({ ...prev, customerId }));
    setPage(1);
  };

  const handleSetDateFrom = (from: string | undefined) => {
    setDateFrom(from);
    setPage(1);
  };

  const handleSetDateTo = (to: string | undefined) => {
    setDateTo(to);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  const hasActiveFilters =
    !!filters.status ||
    !!filters.customerId ||
    !!filters.search?.trim() ||
    !!dateFrom ||
    !!dateTo;

  return {
    sales: paginated,
    totalCount: filtered.length,
    page,
    setPage,
    totalPages,
    filters,
    setStatusFilter,
    setSearch,
    setCustomerFilter,
    setDateFrom: handleSetDateFrom,
    setDateTo: handleSetDateTo,
    resetFilters,
    hasActiveFilters,
  };
}
