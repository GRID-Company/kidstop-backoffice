'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Chip } from '@heroui/react';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { InventoryItemSellPriceHistoryDocument } from '@/lib/api/generated/inventory.generated';
import { formatDate } from '@/lib/utils/format-date';
import { DEFAULT_HISTORY_LIMIT } from '../../domain/constants';

/**
 * Displays sell price change history for a specific inventory item
 * @param inventoryItemGuid - GUID of the inventory item to show price history for
 */
interface SellPriceHistoryTableProps {
  inventoryItemGuid: string;
}

const REASON_LABELS: Record<string, string> = {
  DIRECT_UPDATE: 'Actualización directa',
  MANUAL_MOVEMENT: 'Movimiento manual',
  PURCHASE_FINALIZED: 'Compra finalizada',
};

const REASON_COLORS: Record<string, 'primary' | 'success' | 'warning' | 'default'> = {
  DIRECT_UPDATE: 'primary',
  MANUAL_MOVEMENT: 'warning',
  PURCHASE_FINALIZED: 'success',
};

export default function SellPriceHistoryTable({
  inventoryItemGuid,
}: SellPriceHistoryTableProps) {
  const { data, loading, error } = useQuery(InventoryItemSellPriceHistoryDocument, {
    variables: {
      findSellPriceHistoryArgs: {
        skip: 0,
        limit: DEFAULT_HISTORY_LIMIT,
        sort: { column: 'createdDate', order: 'DESC' },
        filters: {
          inventoryItemGuid,
        },
      },
    },
    skip: !inventoryItemGuid,
  });

  const priceHistory = useMemo(() => {
    return data?.inventoryItemSellPriceHistory?.data ?? [];
  }, [data]);

  const columns: ITableColumn[] = useMemo(
    () => [
      {
        key: 'previousPrice',
        label: 'Precio anterior',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { previousPrice?: number | null };
          return (
            <span className="text-sm">
              {history.previousPrice !== null && history.previousPrice !== undefined ? `$${history.previousPrice.toFixed(2)}` : '—'}
            </span>
          );
        },
      },
      {
        key: 'newPrice',
        label: 'Precio nuevo',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { newPrice: number };
          return (
            <span className="text-sm font-medium text-accent">
              ${history.newPrice.toFixed(2)}
            </span>
          );
        },
      },
      {
        key: 'reason',
        label: 'Razón',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { reason: string };
          return (
            <Chip
              size="sm"
              variant="flat"
              color={REASON_COLORS[history.reason as keyof typeof REASON_COLORS] ?? 'default'}
            >
              {REASON_LABELS[history.reason as keyof typeof REASON_LABELS] ?? history.reason}
            </Chip>
          );
        },
      },
      {
        key: 'notes',
        label: 'Notas',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { notes?: string };
          return (
            <span className="text-xs text-default-500 max-w-50 truncate block">
              {history.notes ?? '—'}
            </span>
          );
        },
      },
      {
        key: 'createdDate',
        label: 'Fecha',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { createdDate: string };
          return <span className="text-xs">{formatDate(history.createdDate)}</span>;
        },
      },
      {
        key: 'createdBy',
        label: 'Usuario',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { createdBy?: { name: string } };
          return (
            <span className="text-xs text-default-500">
              {history.createdBy?.name ?? '—'}
            </span>
          );
        },
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold">Historial de precios de venta</h4>
        <p className="text-center text-sm text-danger py-4">
          Error al cargar historial de precios: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold">Historial de precios de venta</h4>
      <DataTable
        cols={columns}
        data={priceHistory}
        isLoading={loading}
        aria-label="Historial de cambios de precio de venta"
      />
      {!loading && priceHistory.length === 0 && (
        <p className="text-center text-sm text-default-400 py-4">
          No hay cambios de precio registrados
        </p>
      )}
    </div>
  );
}
