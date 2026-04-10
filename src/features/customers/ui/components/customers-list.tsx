'use client';

import { Button, SortDescriptor } from '@heroui/react';
import { Icon } from '@iconify/react';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { ICustomer } from '../../domain/types';
import { CLIENT_STATUS_FILTER_OPTIONS } from '../../domain/constants';
import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import CustomerTypeBadge from './customer-type-badge';
import CustomerStatusBadge from './customer-status-badge';

interface CustomersListProps {
  customers: ICustomer[];
  loading?: boolean;
  hasActiveFilters?: boolean;
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onReset: () => void;
  onCustomerPress?: (customer: ICustomer) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const COLUMNS: ITableColumn[] = [
  { key: 'name', label: 'Nombre', allowSorting: true },
  { key: 'emailAddress', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  {
    key: 'clientType',
    label: 'Tipo',
    customCol: (row: ICustomer) => <CustomerTypeBadge role={row.role} clientStatus={row.clientStatus} />,
  },
  {
    key: 'clientStatus',
    label: 'Estado',
    customCol: (row: ICustomer) => <CustomerStatusBadge clientStatus={row.clientStatus} />,
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
  sortDescriptor,
  onSortChange,
  page,
  totalPages,
  onPageChange,
}: CustomersListProps) {
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
          placeholder="Todos los estados"
          label="Estado"
          items={CLIENT_STATUS_FILTER_OPTIONS}
          onChange={(e) => onFilterChange('clientStatus', e.target.value)}
          aria-label="Filtrar por estado del cliente"
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
              data={customers}
              isLoading={loading}
              sortDescriptor={sortDescriptor}
              onSortChange={onSortChange}
              onRowAction={
                onCustomerPress
                  ? (key) => {
                      const customer = customers.find((c) => c.guid === key);
                      if (customer) onCustomerPress(customer);
                    }
                  : undefined
              }
            />
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {customers.map((customer) => (
              <button
                key={customer.guid}
                type="button"
                className="flex flex-col gap-2 rounded-lg border border-default-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
                onClick={() => onCustomerPress?.(customer)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <CustomerTypeBadge role={customer.role} clientStatus={customer.clientStatus} />
                </div>
                <p className="text-xs text-default-500">{customer.emailAddress}</p>
                {customer.phone && (
                  <p className="text-xs text-default-400">{customer.phone}</p>
                )}
                <div className="flex items-center justify-between">
                  <CustomerStatusBadge clientStatus={customer.clientStatus} />
                  <span className="text-xs text-default-400">
                    {customer.totalOrders ?? 0} pedidos
                  </span>
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <KidstopPagination
                total={totalPages}
                page={page}
                onChange={onPageChange}
                showControls
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
