'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Chip } from '@heroui/react';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { InventoryMovementsDocument } from '@/lib/api/generated/inventory.generated';
import { formatDate } from '@/lib/utils/format-date';

interface InventoryMovementsTableProps {
  inventoryItemGuid: string;
  tcg: 'POKEMON' | 'MAGIC';
}

const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  PURCHASE_ENTRY: 'Compra',
  SALE_EXIT: 'Venta',
  MANUAL_ENTRY: 'Entrada manual',
  MANUAL_EXIT: 'Salida manual',
  MANUAL_SET: 'Ajuste manual',
};

const MOVEMENT_TYPE_COLORS: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
  PURCHASE_ENTRY: 'success',
  SALE_EXIT: 'danger',
  MANUAL_ENTRY: 'success',
  MANUAL_EXIT: 'warning',
  MANUAL_SET: 'default',
};

export default function InventoryMovementsTable({
  inventoryItemGuid,
  tcg,
}: InventoryMovementsTableProps) {
  const { data, loading } = useQuery(InventoryMovementsDocument, {
    variables: {
      findInventoryMovementsArgs: {
        skip: 0,
        limit: 50,
        sort: { column: 'createdDate', order: 'DESC' },
        filters: {
          tcg,
          inventoryItemGuid,
        },
      },
    },
    skip: !inventoryItemGuid,
  });

  const movements = useMemo(() => {
    return data?.inventoryMovements?.data ?? [];
  }, [data]);

  const columns: ITableColumn[] = useMemo(
    () => [
      {
        key: 'movementType',
        label: 'Tipo',
        allowSorting: false,
        customCol: (item) => (
          <Chip
            size="sm"
            variant="flat"
            color={MOVEMENT_TYPE_COLORS[item.movementType] ?? 'default'}
          >
            {MOVEMENT_TYPE_LABELS[item.movementType] ?? item.movementType}
          </Chip>
        ),
      },
      {
        key: 'quantity',
        label: 'Cantidad',
        allowSorting: false,
        customCol: (item) => (
          <span className="font-medium">{item.quantity}</span>
        ),
      },
      {
        key: 'reference',
        label: 'Referencia',
        allowSorting: false,
        customCol: (item) => (
          <span className="text-xs text-default-500">{item.reference ?? '—'}</span>
        ),
      },
      {
        key: 'notes',
        label: 'Notas',
        allowSorting: false,
        customCol: (item) => (
          <span className="text-xs text-default-500 max-w-50 truncate block">
            {item.notes ?? '—'}
          </span>
        ),
      },
      {
        key: 'createdDate',
        label: 'Fecha',
        allowSorting: false,
        customCol: (item) => (
          <span className="text-xs">{formatDate(item.createdDate as string)}</span>
        ),
      },
      {
        key: 'createdBy',
        label: 'Usuario',
        allowSorting: false,
        customCol: (item) => (
          <span className="text-xs text-default-500">
            {item.createdBy?.name ?? '—'}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold">Historial de movimientos</h4>
      <DataTable
        cols={columns}
        data={movements}
        isLoading={loading}
        aria-label="Historial de movimientos de inventario"
      />
      {!loading && movements.length === 0 && (
        <p className="text-center text-sm text-default-400 py-4">
          No hay movimientos registrados
        </p>
      )}
    </div>
  );
}
