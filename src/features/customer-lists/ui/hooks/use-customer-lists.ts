import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { SortDescriptor } from '@heroui/react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import {
  CustomerCardListsDocument,
  type CustomerCardListsQuery,
} from '@/lib/api/generated/card-lists.generated';
import { toCustomerCardList } from '../../adapters/mappers/customer-list.mapper';
import {
  CUSTOMER_LIST_SORT_COLUMNS,
  DEFAULT_PAGE_SIZE,
} from '../../domain/constants';
import { CustomerListFilters, ICustomerCardList } from '../../domain/types';

type CustomerListSortColumn = (typeof CUSTOMER_LIST_SORT_COLUMNS)[number];

const SORT_COLUMN_MAP: Record<string, CustomerListSortColumn> = {
  name: 'name',
  createdDate: 'createdDate',
  customer: 'customerName',
};

interface UseCustomerListsReturn {
  lists: ICustomerCardList[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filters: CustomerListFilters;
  setSearch: (search: string) => void;
  setCustomerFilter: (customerGuid: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
  setDateTo: (to: string | undefined) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

const DEFAULT_FILTERS: CustomerListFilters = {};

export function useCustomerLists(): UseCustomerListsReturn {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [filters, setFilters] = useState<CustomerListFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'createdDate',
    direction: 'descending',
  });

  const sortColumn =
    SORT_COLUMN_MAP[sortDescriptor.column as string] ?? 'createdDate';
  const sortOrder = sortDescriptor.direction === 'descending' ? 'DESC' : 'ASC';

  const { data, loading, error, refetch } = useQuery<CustomerCardListsQuery>(
    CustomerCardListsDocument,
    {
      variables: {
        findCustomerCardListsArgs: {
          skip: (page - 1) * DEFAULT_PAGE_SIZE,
          limit: DEFAULT_PAGE_SIZE,
          sort: { column: sortColumn, order: sortOrder },
          search: filters.search?.trim() || undefined,
          filters: {
            tcg: selectedTCG,
            customerGuid: filters.customerGuid || undefined,
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
          },
        },
      },
      fetchPolicy: 'network-only',
    }
  );

  const lists = useMemo(
    () => (data?.customerCardLists.data ?? []).map(toCustomerCardList),
    [data]
  );

  const totalCount = data?.customerCardLists.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  };

  const setCustomerFilter = (customerGuid: string | undefined) => {
    setFilters((prev) => ({ ...prev, customerGuid }));
    setPage(1);
  };

  const setDateFrom = (dateFrom: string | undefined) => {
    setFilters((prev) => ({ ...prev, dateFrom }));
    setPage(1);
  };

  const setDateTo = (dateTo: string | undefined) => {
    setFilters((prev) => ({ ...prev, dateTo }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const hasActiveFilters =
    !!filters.search?.trim() ||
    !!filters.customerGuid ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return {
    lists,
    totalCount,
    page,
    setPage,
    totalPages,
    filters,
    setSearch,
    setCustomerFilter,
    setDateFrom,
    setDateTo,
    resetFilters,
    hasActiveFilters,
    sortDescriptor,
    setSortDescriptor,
    loading,
    error,
    refetch,
  };
}
