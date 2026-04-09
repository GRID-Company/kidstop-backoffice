'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { ICustomer } from '../../domain/types';
import { useCustomerSearch } from '../hooks/use-customer-search';
import CustomersList from '../components/customers-list';

export default function Customers() {
  const router = useRouter();

  const {
    setSearch,
    handleFilterChange,
    resetFilters,
    results,
    loading,
    hasActiveFilters,
  } = useCustomerSearch();

  const handleCustomerPress = useCallback(
    (customer: ICustomer) => {
      router.push(`/clientes/${customer.guid}`);
    },
    [router]
  );

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Clientes">{null}</EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <CustomersList
          customers={results}
          loading={loading}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          onCustomerPress={handleCustomerPress}
        />
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
