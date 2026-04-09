'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

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
    error,
    hasActiveFilters,
  } = useCustomerSearch();

  const handleCustomerPress = useCallback(
    (customer: ICustomer) => {
      router.push(`/clientes/${customer.guid}`);
    },
    [router]
  );

  if (error) {
    return (
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Clientes">{null}</EntitiesPage.Toolbar>
        <EntitiesPage.CardContainer>
          <div className="flex flex-col items-center justify-center py-16 text-default-400">
            <Icon icon="lucide:wifi-off" className="text-5xl" />
            <p className="mt-4 text-lg font-medium">Error al cargar clientes</p>
            <p className="text-sm">Verifica tu conexión e intenta de nuevo</p>
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>
    );
  }

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
