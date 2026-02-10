'use client';

import { useCallback, useMemo } from 'react';
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

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import Search from '@/shared/base/heorui-overrides/search';
import { ITableColumn } from '@/lib/types/datatable.types';
import { IPurchase, PurchaseStatus } from '../../domain/types';
import {
  PURCHASE_STATUS_OPTIONS,
  PURCHASE_STATUS_LABELS,
} from '../../domain/constants';
import { formatCurrency } from '@/lib/utils/format-currency';
import { calculateTotal } from '../../domain/purchases.domain';
import { usePurchases } from '../hooks/use-purchases';
import PurchaseStatusBadge from '../components/purchase-status-badge';

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export default function Purchases() {
  const router = useRouter();
  const {
    purchases,
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
  } = usePurchases();

  const handleStatusChange = useCallback(
    (keys: Set<string> | 'all') => {
      if (keys === 'all') return;
      const selected = Array.from(keys)[0] as PurchaseStatus | undefined;
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
        key: 'code',
        label: 'Código',
        className: '!text-left min-w-[140px]',
        customCol: (row: IPurchase) => (
          <span className="text-sm font-semibold text-accent">{row.code}</span>
        ),
      },
      {
        key: 'status',
        label: 'Estado',
        className: 'min-w-[140px]',
        customCol: (row: IPurchase) => (
          <PurchaseStatusBadge status={row.status} />
        ),
      },
      {
        key: 'seller',
        label: 'Vendedor',
        className: '!text-left min-w-[160px]',
        customCol: (row: IPurchase) => (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{row.seller.name}</span>
            <span className="text-xs text-default-400">{row.seller.phone}</span>
          </div>
        ),
      },
      {
        key: 'items',
        label: 'Items',
        className: 'w-[80px]',
        customCol: (row: IPurchase) => (
          <Chip size="sm" variant="flat">
            {row.items.length} {row.items.length === 1 ? 'carta' : 'cartas'}
          </Chip>
        ),
      },
      {
        key: 'total',
        label: 'Total',
        className: 'min-w-[120px]',
        customCol: (row: IPurchase) => (
          <span className="text-sm font-semibold">
            {formatCurrency(calculateTotal(row.items))}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Fecha',
        className: 'min-w-[120px]',
        customCol: (row: IPurchase) => (
          <span className="text-sm text-default-500">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
      {
        key: 'actions',
        label: '',
        className: 'w-[60px]',
        customCol: (row: IPurchase) => (
          <Tooltip content="Ver detalle">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label={`Ver compra ${row.code}`}
              onPress={() => router.push(`/compras/${row.id}`)}
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
      <EntitiesPage.Toolbar label="Compras">
        <Button
          className="bg-accent text-white"
          startContent={<Icon icon="lucide:plus" width={16} />}
          size="sm"
        >
          Nueva compra
        </Button>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1">
              <Search
                label="Buscar"
                placeholder="Código, vendedor o carta..."
                value={filters.search || ''}
                onValueChange={setSearch}
                aria-label="Buscar compras"
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
              selectedKeys={filters.status ? new Set([filters.status]) : new Set()}
              onSelectionChange={(keys) =>
                handleStatusChange(keys as Set<string>)
              }
              classNames={{
                trigger: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
            >
              {PURCHASE_STATUS_OPTIONS.map((opt) => (
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
          <DataTable cols={columns} data={purchases} isLoading={false} />
        </div>

        {purchases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-default-400">
            <Icon icon="lucide:shopping-cart" width={40} className="mb-2" />
            <span className="text-sm">
              {hasActiveFilters
                ? 'No se encontraron compras con esos filtros'
                : 'No hay compras registradas'}
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
