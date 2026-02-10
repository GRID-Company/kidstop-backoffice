'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
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
    hasActiveFilters,
  } = useCustomerSearch();

  const handleCustomerPress = useCallback(
    (customer: ICustomer) => {
      router.push(`/clientes/${customer.id}`);
    },
    [router]
  );

  const handleCreateCustomer = useCallback(() => {
    console.info('[mock] Create new customer');
  }, []);

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Clientes">
        <Button
          color="primary"
          startContent={<Icon icon="lucide:user-plus" />}
          onPress={handleCreateCustomer}
        >
          Nuevo cliente
        </Button>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <CustomersList
          customers={results}
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
