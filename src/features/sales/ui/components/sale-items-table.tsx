'use client';

import React from 'react';
import Image from 'next/image';
import { Chip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { ISaleItem } from '../../domain/types';
import { calculateItemSubtotal } from '../../domain/sales.domain';
import {
  CARD_CONDITION_SHORT_LABELS,
  FULFILLMENT_STATUS_COLORS,
  FULFILLMENT_STATUS_LABELS,
} from '../../domain/constants';

interface SaleItemsTableProps {
  items: ISaleItem[];
  loading?: boolean;
  onFoundQuantityChange?: (itemId: string, delta: number) => void;
}

const FULFILLMENT_BORDER_CLASSES: Record<string, string> = {
  PENDING: 'border-default-300',
  FOUND: 'border-success',
  PARTIAL: 'border-warning',
  NOT_AVAILABLE: 'border-danger',
};

function FoundQuantityStepper({
  item,
  onDelta,
}: {
  item: ISaleItem;
  onDelta?: (itemId: string, delta: number) => void;
}) {
  const borderClass = FULFILLMENT_BORDER_CLASSES[item.fulfillmentStatus] ?? 'border-default-300';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex items-center gap-0 rounded-lg border-2 ${borderClass} transition-colors`}>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="h-10 w-10 min-w-0 text-lg"
          onPress={() => onDelta?.(item.id, -1)}
          isDisabled={item.fulfillmentStatus === 'NOT_AVAILABLE' || !onDelta}
          aria-label="Disminuir cantidad encontrada"
        >
          <Icon icon="lucide:minus" width={18} />
        </Button>
        <span className="min-w-[3rem] text-center text-sm font-bold tabular-nums">
          {item.foundQuantity}/{item.quantity}
        </span>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="h-10 w-10 min-w-0 text-lg"
          onPress={() => onDelta?.(item.id, 1)}
          isDisabled={item.foundQuantity >= item.quantity || !onDelta}
          aria-label="Aumentar cantidad encontrada"
        >
          <Icon icon="lucide:plus" width={18} />
        </Button>
      </div>
      <Chip
        size="sm"
        variant="flat"
        color={FULFILLMENT_STATUS_COLORS[item.fulfillmentStatus]}
        className="h-5 text-[10px]"
      >
        {FULFILLMENT_STATUS_LABELS[item.fulfillmentStatus]}
      </Chip>
    </div>
  );
}

const SALE_ITEMS_COLUMNS: ITableColumn[] = [
  { key: 'image', label: '', className: 'w-14' },
  { key: 'cardName', label: 'Carta' },
  { key: 'set', label: 'Set' },
  { key: 'condition', label: 'Condición', className: 'w-24' },
  { key: 'unitPrice', label: 'Precio', className: 'w-24' },
  { key: 'subtotal', label: 'Subtotal', className: 'w-24' },
  { key: 'surtido', label: 'Surtido', className: 'w-36' },
];

type ColumnRenderer = (row: ISaleItem) => React.ReactNode;

function getColumnRenderers(
  onFoundQuantityChange?: (itemId: string, delta: number) => void
): Record<string, ColumnRenderer> {
  return {
    image: (row) => (
      <div className="relative mx-auto h-10 w-10 overflow-hidden rounded bg-default-100">
        {row.cardImageUrl ? (
          <Image
            src={row.cardImageUrl}
            alt={row.cardName}
            fill
            sizes="40px"
            className="object-contain"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-lg">
            🃏
          </span>
        )}
      </div>
    ),
    cardName: (row) => (
      <span className="font-medium">{row.cardName}</span>
    ),
    set: (row) => (
      <span className="text-sm text-default-500">
        {row.setName} ({row.setCode})
      </span>
    ),
    condition: (row) => (
      <Chip size="sm" variant="flat">
        {CARD_CONDITION_SHORT_LABELS[row.condition]}
      </Chip>
    ),
    unitPrice: (row) => (
      <span className="text-sm">{formatCurrency(row.unitPrice)}</span>
    ),
    subtotal: (row) => (
      <span className="text-sm font-semibold">
        {formatCurrency(calculateItemSubtotal(row))}
      </span>
    ),
    surtido: (row) => (
      <FoundQuantityStepper item={row} onDelta={onFoundQuantityChange} />
    ),
  };
}

function buildColumns(
  onFoundQuantityChange?: (itemId: string, delta: number) => void
): ITableColumn[] {
  const renderers = getColumnRenderers(onFoundQuantityChange);
  return SALE_ITEMS_COLUMNS.map((col) => {
    const renderer = renderers[col.key];
    return renderer ? { ...col, customCol: renderer } : col;
  });
}

export default function SaleItemsTable({
  items,
  loading = false,
  onFoundQuantityChange,
}: SaleItemsTableProps) {
  const columns = buildColumns(onFoundQuantityChange);

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-default-400">
        <span className="text-4xl">📦</span>
        <p className="mt-3 text-sm">No hay items en este pedido</p>
      </div>
    );
  }

  return (
    <DataTable
      cols={columns}
      data={items}
      isLoading={loading}
    />
  );
}
