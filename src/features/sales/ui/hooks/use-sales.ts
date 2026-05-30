import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { SalesDocument } from '@/lib/api/generated/sales.generated';
import { ISale, SaleFilters, SaleStatus } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';

interface UseSalesReturn {
  sales: ISale[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filters: SaleFilters;
  setStatusFilter: (status: SaleStatus | undefined) => void;
  setSearch: (search: string) => void;
  setCustomerFilter: (customerGuid: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
  setDateTo: (to: string | undefined) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

const DEFAULT_FILTERS: SaleFilters = {};

export function useSales(): UseSalesReturn {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [filters, setFilters] = useState<SaleFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useQuery(SalesDocument, {
    variables: {
      findSalesArgs: {
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        limit: DEFAULT_PAGE_SIZE,
        sort: { column: 'createdDate', order: 'DESC' },
        search: filters.search?.trim() || undefined,
        filters: {
          tcg: selectedTCG,
          status: filters.status || undefined,
          customer: filters.customer || undefined,
          ...(filters.dateFrom || filters.dateTo
            ? {
                createdDate: {
                  filterType: ':daterange:',
                  range: {
                    from: filters.dateFrom,
                    to: filters.dateTo,
                  },
                },
              }
            : {}),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const sales = useMemo(() => {
    if (!data?.sales?.data) return [];
    return data.sales.data as unknown as ISale[];
  }, [data]);

  const totalCount = data?.sales?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  const setStatusFilter = (status: SaleStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
    setPage(1);
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  };

  const setCustomerFilter = (customerGuid: string | undefined) => {
    setFilters((prev) => ({ ...prev, customer: customerGuid }));
    setPage(1);
  };

  const handleSetDateFrom = (from: string | undefined) => {
    setFilters((prev) => ({ ...prev, dateFrom: from }));
    setPage(1);
  };

  const handleSetDateTo = (to: string | undefined) => {
    setFilters((prev) => ({ ...prev, dateTo: to }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const hasActiveFilters =
    !!filters.status ||
    !!filters.customer ||
    !!filters.search?.trim() ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return {
    sales,
    totalCount,
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
    loading,
    error,
    refetch,
  };
}
