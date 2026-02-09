'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Chip, Pagination } from '@heroui/react';
import { Icon } from '@iconify/react';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { ICustomer } from '../../domain/types';
import {
  CUSTOMER_TYPE_OPTIONS,
  CUSTOMER_TYPE_LABELS,
  CUSTOMER_TYPE_COLORS,
  CUSTOMER_STATUS_OPTIONS,
  CUSTOMER_STATUS_LABELS,
  CUSTOMER_STATUS_COLORS,
  DEFAULT_PAGE_SIZE,
} from '../../domain/constants';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';

interface CustomersListProps {
  customers: ICustomer[];
  loading?: boolean;
  hasActiveFilters?: boolean;
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onReset: () => void;
  onCustomerPress?: (customer: ICustomer) => void;
  pageSize?: number;
}

const COLUMNS: ITableColumn[] = [
  { key: 'name', label: 'Nombre', allowSorting: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  {
    key: 'type',
    label: 'Tipo',
    customCol: (row: ICustomer) => (
      <Chip size="sm" variant="flat" color={CUSTOMER_TYPE_COLORS[row.type]}>
        {CUSTOMER_TYPE_LABELS[row.type]}
      </Chip>
    ),
  },
  {
    key: 'status',
    label: 'Estado',
    customCol: (row: ICustomer) => (
      <Chip size="sm" variant="flat" color={CUSTOMER_STATUS_COLORS[row.status]}>
        {CUSTOMER_STATUS_LABELS[row.status]}
      </Chip>
    ),
  },
  { key: 'totalOrders', label: 'Pedidos' },
];

export default function CustomersList({
  customers,
  loading = false,
  hasActiveFilters = false,
  onSearchChange,
  onFilterChange,
  onReset,
  onCustomerPress,
  pageSize = DEFAULT_PAGE_SIZE,
}: CustomersListProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(customers.length / pageSize));

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return customers.slice(start, start + pageSize);
  }, [customers, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  return (
    <div className="flex flex-col gap-4">
      <Search
        label="Buscar cliente"
        placeholder="Nombre, email o teléfono"
        onValueChange={onSearchChange}
        aria-label="Buscar cliente por nombre, email o teléfono"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          placeholder="Todos los tipos"
          label="Tipo"
          items={CUSTOMER_TYPE_OPTIONS}
          onChange={(e) => onFilterChange('type', e.target.value)}
          aria-label="Filtrar por tipo de cliente"
        />
        <Select
          placeholder="Todos los estados"
          label="Estado"
          items={CUSTOMER_STATUS_OPTIONS}
          onChange={(e) => onFilterChange('status', e.target.value)}
          aria-label="Filtrar por estado"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-default-500">
          {customers.length} {customers.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
        </p>
        {hasActiveFilters && (
          <Button
            variant="light"
            size="sm"
            startContent={<Icon icon="lucide:x" />}
            onPress={onReset}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {customers.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-default-400">
          <Icon icon="lucide:users" className="text-5xl" />
          <p className="mt-4 text-lg font-medium">No se encontraron clientes</p>
          <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              cols={COLUMNS}
              data={paginatedCustomers}
              isLoading={loading}
              onRowAction={
                onCustomerPress
                  ? (key) => {
                      const customer = paginatedCustomers.find((c) => c.id === key);
                      if (customer) onCustomerPress(customer);
                    }
                  : undefined
              }
            />
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {paginatedCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                className="flex flex-col gap-2 rounded-lg border border-default-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
                onClick={() => onCustomerPress?.(customer)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <Chip size="sm" variant="flat" color={CUSTOMER_TYPE_COLORS[customer.type]}>
                    {CUSTOMER_TYPE_LABELS[customer.type]}
                  </Chip>
                </div>
                <p className="text-xs text-default-500">{customer.email}</p>
                {customer.phone && (
                  <p className="text-xs text-default-400">{customer.phone}</p>
                )}
                <div className="flex items-center justify-between">
                  <Chip size="sm" variant="flat" color={CUSTOMER_STATUS_COLORS[customer.status]}>
                    {CUSTOMER_STATUS_LABELS[customer.status]}
                  </Chip>
                  <span className="text-xs text-default-400">
                    {customer.totalOrders} pedidos
                  </span>
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                showControls
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
