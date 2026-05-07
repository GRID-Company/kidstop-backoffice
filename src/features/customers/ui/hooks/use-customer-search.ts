import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { SortDescriptor } from '@heroui/react';
import { CustomersDocument } from '@/lib/api/generated/customers.generated';
import { toCustomerDomain } from '../../adapters/mappers/customer.mapper';
import { CLIENT_STATUSES, CUSTOMER_ROLES, DEFAULT_CUSTOMERS_SORT, DEFAULT_PAGE_SIZE } from '../../domain/constants';
import { ClientStatus, CustomerRole } from '../../domain/types';

export function useCustomerSearch() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [clientStatus, setClientStatus] = useState<ClientStatus | ''>('');
  const [role, setRole] = useState<CustomerRole | ''>('');
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
          ...(role ? { role: { filterType: ':multiple_values:', values: [role] } } : { role: { filterType: ':multiple_values:', values: ['CLIENT', 'CLIENT_KIOSK'] } }),
          active: true,
          ...(clientStatus ? { clientStatus } : {}),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      const strValue = typeof value === 'boolean' ? '' : value;
      
      if (key === 'clientStatus') {
        const isValidStatus = Object.values(CLIENT_STATUSES).includes(strValue as ClientStatus);
        setClientStatus(isValidStatus ? (strValue as ClientStatus) : '');
        setPage(1);
      } else if (key === 'role') {
        const isValidRole = Object.values(CUSTOMER_ROLES).includes(strValue as CustomerRole);
        setRole(isValidRole ? (strValue as CustomerRole) : '');
        setPage(1);
      }
    },
    []
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setClientStatus('');
    setRole('');
    setPage(1);
  }, []);

  const results = (data?.users.data ?? []).map(toCustomerDomain);
  const totalCount = data?.users.count ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE)), [totalCount]);
  const hasActiveFilters = search.trim() !== '' || clientStatus !== '' || role !== '';

  return {
    search,
    setSearch,
    clientStatus,
    role,
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
