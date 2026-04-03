import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { PurchasesDocument } from '@/lib/api/generated/purchases.generated';
import { IPurchase, PurchaseFilters, PurchaseStatus } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';

interface UsePurchasesReturn {
  purchases: IPurchase[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filters: PurchaseFilters;
  setStatusFilter: (status: PurchaseStatus | undefined) => void;
  setSearch: (search: string) => void;
  setSellerFilter: (sellerGuid: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
  setDateTo: (to: string | undefined) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

const DEFAULT_FILTERS: PurchaseFilters = {};

export function usePurchases(): UsePurchasesReturn {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [filters, setFilters] = useState<PurchaseFilters>(DEFAULT_FILTERS);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useQuery(PurchasesDocument, {
    variables: {
      findPurchasesArgs: {
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        limit: DEFAULT_PAGE_SIZE,
        sort: { column: 'createdDate', order: 'DESC' },
        filters: {
          tcg: selectedTCG,
          status: filters.status,
          buyer: filters.buyerGuid,
        },
        search: filters.search?.trim() || undefined,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const purchases = useMemo(() => {
    if (!data?.purchases?.data) return [];
    return data.purchases.data as unknown as IPurchase[];
  }, [data]);

  const totalCount = data?.purchases?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  const setStatusFilter = (status: PurchaseStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
    setPage(1);
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  };

  const setSellerFilter = (sellerGuid: string | undefined) => {
    setFilters((prev) => ({ ...prev, sellerGuid }));
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
    !!filters.sellerGuid ||
    !!filters.search?.trim() ||
    !!dateFrom ||
    !!dateTo;

  return {
    purchases,
    totalCount,
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
    loading,
    error,
    refetch,
  };
}
