import { useMemo, useState, useCallback } from 'react';
import { MOCK_CUSTOMERS } from '../../adapters/api/customers.mock';
import { CustomerFilters, ICustomer } from '../../domain/types';

export function useCustomerSearch() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Omit<CustomerFilters, 'search'>>({});

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

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters({});
  }, []);

  const results = useMemo(() => {
    let customers: ICustomer[] = [...MOCK_CUSTOMERS];

    if (search.trim()) {
      const term = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          (c.phone && c.phone.toLowerCase().includes(term))
      );
    }

    if (filters.type) {
      customers = customers.filter((c) => c.type === filters.type);
    }

    if (filters.status) {
      customers = customers.filter((c) => c.status === filters.status);
    }

    return customers;
  }, [search, filters]);

  const hasActiveFilters = search.trim() !== '' || Object.keys(filters).length > 0;

  return {
    search,
    setSearch,
    filters,
    handleFilterChange,
    resetFilters,
    results,
    hasActiveFilters,
  };
}
