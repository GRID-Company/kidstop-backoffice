'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import toast from 'react-hot-toast';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import Search from '@/shared/base/heorui-overrides/search';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/format-date';
import { ISale, SaleStatus } from '../../domain/types';
import { SALE_STATUS_OPTIONS } from '../../domain/constants';
import { getCustomerDisplayName, getCustomerDisplayEmail } from '../../adapters/mappers/sale.mapper';
import { useSales } from '../hooks/use-sales';
import SaleStatusBadge from '../components/sale-status-badge';

export default function Sales() {
  const router = useRouter();
  const {
    sales,
    totalCount,
    page,
    setPage,
    totalPages,
    filters,
    setStatusFilter,
    setSearch,
    setDateFrom,
    setDateTo,
    resetFilters,
    hasActiveFilters,
    loading,
    error,
  } = useSales();

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar los pedidos');
    }
  }, [error]);

  const handleStatusChange = useCallback(
    (keys: unknown) => {
      const selected = Array.from(keys as Set<string>)[0] as SaleStatus | undefined;
      setStatusFilter(selected || undefined);
    },
    [setStatusFilter]
  );

  const handleDateFromChange = useCallback(
    (value: string) => {
      setDateFrom(value || undefined);
    },
    [setDateFrom]
  );

  const handleDateToChange = useCallback(
    (value: string) => {
      setDateTo(value || undefined);
    },
    [setDateTo]
  );

  const columns: ITableColumn[] = useMemo(
    () => [
      {
        key: 'saleCode',
        label: 'Código',
        className: '!text-left min-w-[140px]',
        customCol: (row: ISale) => (
          <span className="text-sm font-semibold text-accent">{row.saleCode}</span>
        ),
      },
      {
        key: 'status',
        label: 'Estado',
        className: 'min-w-[140px]',
        customCol: (row: ISale) => <SaleStatusBadge status={row.status} />,
      },
      {
        key: 'customer',
        label: 'Cliente',
        className: '!text-left min-w-[160px]',
        customCol: (row: ISale) => (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">
              {getCustomerDisplayName(row.customer?.name, row.kioskCustomerName)}
            </span>
            <span className="text-xs text-default-400">
              {getCustomerDisplayEmail(row.customer?.emailAddress, row.kioskCustomerEmail)}
            </span>
          </div>
        ),
      },
      {
        key: 'items',
        label: 'Items',
        className: 'w-[80px]',
        customCol: (row: ISale) => {
          const count = row.items.reduce((sum, i) => sum + i.quantity, 0);
          return (
            <Chip size="sm" variant="flat">
              {count} {count === 1 ? 'carta' : 'cartas'}
            </Chip>
          );
        },
      },
      {
        key: 'total',
        label: 'Total',
        className: 'min-w-[120px]',
        customCol: (row: ISale) => (
          <span className="text-sm font-semibold">
            {formatCurrency(row.total)}
          </span>
        ),
      },
      {
        key: 'createdDate',
        label: 'Fecha',
        className: 'min-w-[120px]',
        customCol: (row: ISale) => (
          <span className="text-sm text-default-500">
            {formatDate(row.createdDate)}
          </span>
        ),
      },
      {
        key: 'actions',
        label: '',
        className: 'w-[60px]',
        customCol: (row: ISale) => (
          <Tooltip content="Ver detalle">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label={`Ver pedido ${row.saleCode}`}
              onPress={() => router.push(`/ventas/${row.guid}`)}
            >
              <Icon icon="lucide:eye" width={16} />
            </Button>
          </Tooltip>
        ),
      },
    ],
    [router]
  );

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Pedidos / Ventas">
        <></>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1">
              <Search
                label="Buscar"
                placeholder="Código, cliente o carta..."
                value={filters.search || ''}
                onValueChange={setSearch}
                aria-label="Buscar pedidos"
                isClearable
                onClear={() => setSearch('')}
              />
            </div>

            <Select
              aria-label="Filtrar por estado"
              label="Estado"
              size="sm"
              variant="bordered"
              className="w-[180px]"
              selectedKeys={
                filters.status ? new Set([filters.status]) : new Set()
              }
              onSelectionChange={(keys) =>
                handleStatusChange(keys as Set<string>)
              }
              classNames={{
                trigger: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
            >
              {SALE_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>

            <Input
              aria-label="Fecha desde"
              type="date"
              label="Desde"
              size="sm"
              variant="bordered"
              className="w-[160px]"
              onValueChange={handleDateFromChange}
              classNames={{
                inputWrapper: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
            />

            <Input
              aria-label="Fecha hasta"
              type="date"
              label="Hasta"
              size="sm"
              variant="bordered"
              className="w-[160px]"
              onValueChange={handleDateToChange}
              classNames={{
                inputWrapper: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
            />

            {hasActiveFilters && (
              <Button
                size="sm"
                variant="flat"
                onPress={resetFilters}
                startContent={<Icon icon="lucide:x" width={14} />}
              >
                Limpiar
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-default-400">
                {totalCount} {totalCount === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <DataTable cols={columns} data={sales} isLoading={loading} />
        </div>

        {sales.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-default-400">
            <Icon icon="lucide:receipt" width={40} className="mb-2" />
            <span className="text-sm">
              {hasActiveFilters
                ? 'No se encontraron pedidos con esos filtros'
                : 'No hay pedidos registrados'}
            </span>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              showControls
              size="sm"
              color="primary"
            />
          </div>
        )}
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
