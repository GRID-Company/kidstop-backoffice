import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { SortDescriptor } from '@heroui/react';
import { CustomersDocument } from '@/lib/api/generated/customers.generated';
import { toCustomerDomain } from '../../adapters/mappers/customer.mapper';
import { CLIENT_STATUSES, DEFAULT_CUSTOMERS_SORT, DEFAULT_PAGE_SIZE } from '../../domain/constants';
import { ClientStatus } from '../../domain/types';

export function useCustomerSearch() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [clientStatus, setClientStatus] = useState<ClientStatus | ''>('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const sortColumn = sortDescriptor.column as string;
  const sortOrder = sortDescriptor.direction === 'descending' ? 'DESC' : 'ASC';

  const { data, loading, error, refetch } = useQuery(CustomersDocument, {
    variables: {
      findUsersArgs: {
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        limit: DEFAULT_PAGE_SIZE,
        sort: { column: sortColumn, order: sortOrder },
        ...(search.trim() ? { search: search.trim() } : {}),
        filters: {
          role: { filterType: ':multiple_values:', values: ['CLIENT'] },
          active: true,
          ...(clientStatus ? { clientStatus } : {}),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      if (key !== 'clientStatus') return;
      const strValue = typeof value === 'boolean' ? '' : value;
      const isValidStatus = Object.values(CLIENT_STATUSES).includes(strValue as ClientStatus);
      setClientStatus(isValidStatus ? (strValue as ClientStatus) : '');
      setPage(1);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setClientStatus('');
    setPage(1);
  }, []);

  const results = (data?.users.data ?? []).map(toCustomerDomain);
  const totalCount = data?.users.count ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE)), [totalCount]);
  const hasActiveFilters = search.trim() !== '' || clientStatus !== '';

  return {
    search,
    setSearch,
    clientStatus,
    handleFilterChange,
    resetFilters,
    results,
    totalCount,
    totalPages,
    page,
    setPage,
    loading,
    error,
    refetch,
    hasActiveFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
