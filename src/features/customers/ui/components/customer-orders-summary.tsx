'use client';

import { useMemo } from 'react';
import {
  Chip,
  Button,
  Tooltip,
  Pagination,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { ICustomerOrder, ICustomerOrdersSummary } from '../../domain/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  DEFAULT_PAGE_SIZE,
} from '../../domain/constants';

interface CustomerOrdersSummaryProps {
  summary: ICustomerOrdersSummary;
  loading?: boolean;
  onViewOrder?: (orderId: string) => void;
  pageSize?: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

function buildColumns(onViewOrder?: (orderId: string) => void): ITableColumn[] {
  const columns: ITableColumn[] = [
    { key: 'code', label: 'Código' },
    {
      key: 'status',
      label: 'Estado',
      customCol: (row: ICustomerOrder) => (
        <Chip
          size="sm"
          variant="flat"
          color={ORDER_STATUS_COLORS[row.status]}
        >
          {ORDER_STATUS_LABELS[row.status]}
        </Chip>
      ),
    },
    { key: 'totalItems', label: 'Artículos' },
    {
      key: 'totalAmount',
      label: 'Monto',
      customCol: (row: ICustomerOrder) => (
        <span>{formatCurrency(row.totalAmount)}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      customCol: (row: ICustomerOrder) => (
        <span>{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  if (onViewOrder) {
    columns.push({
      key: 'actions',
      label: '',
      customCol: (row: ICustomerOrder) => (
        <Tooltip content="Ver pedido">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onViewOrder(row.id)}
            aria-label={`Ver detalle del pedido ${row.code}`}
          >
            <Icon icon="lucide:external-link" className="text-base text-default-500" />
          </Button>
        </Tooltip>
      ),
    });
  }

  return columns;
}

export default function CustomerOrdersSummary({
  summary,
  loading = false,
  onViewOrder,
  pageSize = DEFAULT_PAGE_SIZE,
}: CustomerOrdersSummaryProps) {
  const columns = useMemo(() => buildColumns(onViewOrder), [onViewOrder]);

  const metrics = [
    {
      label: 'Total pedidos',
      value: summary.totalOrders,
      icon: 'lucide:shopping-bag',
      color: 'text-default-700',
    },
    {
      label: 'Completados',
      value: summary.completedOrders,
      icon: 'lucide:check-circle',
      color: 'text-success',
    },
    {
      label: 'Cancelados',
      value: summary.cancelledOrders,
      icon: 'lucide:x-circle',
      color: 'text-danger',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-accent">Resumen de pedidos</h3>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col items-center gap-1 rounded-lg bg-default-50 p-3"
          >
            <Icon icon={metric.icon} className={`text-xl ${metric.color}`} />
            <span className={`text-lg font-bold ${metric.color}`}>
              {metric.value}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-default-400">
              {metric.label}
            </span>
          </div>
        ))}
      </div>

      {summary.orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-default-400">
          <Icon icon="lucide:package" className="text-4xl" />
          <p className="mt-2 text-sm">Sin pedidos registrados</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              cols={columns}
              data={summary.orders}
              isLoading={loading}
            />
          </div>

          <div className="flex flex-col gap-2 md:hidden">
            {summary.orders.map((order) => (
              <button
                key={order.id}
                type="button"
                className="flex flex-col gap-2 rounded-lg border border-default-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md"
                onClick={() => onViewOrder?.(order.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{order.code}</span>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={ORDER_STATUS_COLORS[order.status]}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Chip>
                </div>
                <div className="flex items-center justify-between text-xs text-default-500">
                  <span>{order.totalItems} artículos</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <span className="text-[10px] text-default-400">
                  {formatDate(order.createdAt)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
