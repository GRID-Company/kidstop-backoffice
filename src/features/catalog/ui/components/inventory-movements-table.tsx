'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Chip } from '@heroui/react';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { InventoryMovementsDocument } from '@/lib/api/generated/inventory.generated';
import { formatDate } from '@/lib/utils/format-date';
import { MOVEMENT_TYPE_LABELS, MOVEMENT_TYPE_COLORS } from '@/features/inventory-cards/domain/constants';
import { DEFAULT_HISTORY_LIMIT } from '../../domain/constants';

/**
 * Displays inventory movement history for a specific inventory item
 * @param inventoryItemGuid - GUID of the inventory item to show movements for
 * @param tcg - TCG type (POKEMON or MAGIC)
 */
interface InventoryMovementsTableProps {
  inventoryItemGuid: string;
  tcg: 'POKEMON' | 'MAGIC';
}

export default function InventoryMovementsTable({
  inventoryItemGuid,
  tcg,
}: InventoryMovementsTableProps) {
  const { data, loading, error } = useQuery(InventoryMovementsDocument, {
    variables: {
      findInventoryMovementsArgs: {
        skip: 0,
        limit: DEFAULT_HISTORY_LIMIT,
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
        customCol: (item: unknown) => {
          const movement = item as { movementType: string };
          return (
            <Chip
              size="sm"
              variant="flat"
              color={MOVEMENT_TYPE_COLORS[movement.movementType as keyof typeof MOVEMENT_TYPE_COLORS] ?? 'default'}
            >
              {MOVEMENT_TYPE_LABELS[movement.movementType as keyof typeof MOVEMENT_TYPE_LABELS] ?? movement.movementType}
            </Chip>
          );
        },
      },
      {
        key: 'quantity',
        label: 'Cantidad',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { quantity: number };
          return <span className="font-medium">{movement.quantity}</span>;
        },
      },
      {
        key: 'reference',
        label: 'Referencia',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { reference?: string };
          return <span className="text-xs text-default-500">{movement.reference ?? '—'}</span>;
        },
      },
      {
        key: 'notes',
        label: 'Notas',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { notes?: string };
          return (
            <span className="text-xs text-default-500 max-w-50 truncate block">
              {movement.notes ?? '—'}
            </span>
          );
        },
      },
      {
        key: 'createdDate',
        label: 'Fecha',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { createdDate: string };
          return <span className="text-xs">{formatDate(movement.createdDate)}</span>;
        },
      },
      {
        key: 'createdBy',
        label: 'Usuario',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { createdBy?: { name: string } };
          return (
            <span className="text-xs text-default-500">
              {movement.createdBy?.name ?? '—'}
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
        <h4 className="text-sm font-semibold">Historial de movimientos</h4>
        <p className="text-center text-sm text-danger py-4">
          Error al cargar movimientos: {error.message}
        </p>
      </div>
    );
  }

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
