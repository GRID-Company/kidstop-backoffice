import { useMemo, useState } from 'react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { IPurchase, PurchaseFilters, PurchaseStatus } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';
import { MOCK_PURCHASES } from '../../adapters/api/purchases.mock';

interface UsePurchasesReturn {
  purchases: IPurchase[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filters: PurchaseFilters;
  setStatusFilter: (status: PurchaseStatus | undefined) => void;
  setSearch: (search: string) => void;
  setSellerFilter: (sellerId: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
  setDateTo: (to: string | undefined) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: PurchaseFilters = {};

export function usePurchases(): UsePurchasesReturn {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [filters, setFilters] = useState<PurchaseFilters>(DEFAULT_FILTERS);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = MOCK_PURCHASES.filter((p) => p.tcgType === selectedTCG);

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.sellerId) {
      result = result.filter((p) => p.seller.id === filters.sellerId);
    }

    if (filters.search?.trim()) {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.code.toLowerCase().includes(term) ||
          p.seller.name.toLowerCase().includes(term) ||
          p.items.some((i) => i.cardName.toLowerCase().includes(term))
      );
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((p) => new Date(p.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((p) => new Date(p.createdAt) <= to);
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [selectedTCG, filters, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEFAULT_PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return filtered.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [filtered, page]);

  const setStatusFilter = (status: PurchaseStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
    setPage(1);
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  };

  const setSellerFilter = (sellerId: string | undefined) => {
    setFilters((prev) => ({ ...prev, sellerId }));
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
    !!filters.sellerId ||
    !!filters.search?.trim() ||
    !!dateFrom ||
    !!dateTo;

  return {
    purchases: paginated,
    totalCount: filtered.length,
    page,
    setPage,
    totalPages,
    filters,
    setStatusFilter,
    setSearch,
    setSellerFilter,
    setDateFrom: handleSetDateFrom,
    setDateTo: handleSetDateTo,
    resetFilters,
    hasActiveFilters,
  };
}
