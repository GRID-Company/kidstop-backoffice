'use client';

import React from 'react';
import { Chip } from '@heroui/react';

import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { CardImage } from '@/shared/components/card-image';
import { getCardName, getCardImageUri, getCardTCG, getSetInfo } from '@/shared/utils/card-utils';
import { ISaleItem } from '../../domain/types';
import { calculateItemSubtotal } from '../../domain/sales.domain';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';

interface SaleItemsTableProps {
  items: ISaleItem[];
  loading?: boolean;
}

const SALE_ITEMS_COLUMNS: ITableColumn[] = [
  { key: 'image', label: '', className: 'w-14' },
  { key: 'cardName', label: 'Carta' },
  { key: 'set', label: 'Set' },
  { key: 'condition', label: 'Condición', className: 'w-24' },
  { key: 'price', label: 'Precio', className: 'w-24' },
  { key: 'subtotal', label: 'Subtotal', className: 'w-24' },
];

type ColumnRenderer = (row: ISaleItem) => React.ReactNode;

const COLUMN_RENDERERS: Record<string, ColumnRenderer> = {
  image: (row) => {
    const imageUri = getCardImageUri(row as any);
    const cardName = getCardName(row as any);
    const tcg = getCardTCG(row as any);
    return (
      <CardImage
        src={imageUri}
        alt={cardName}
        tcgType={tcg}
        containerClassName="relative mx-auto h-10 w-10 overflow-hidden rounded bg-default-100"
        className="object-contain"
      />
    );
  },
  cardName: (row) => (
    <span className="font-medium">{getCardName(row as any)}</span>
  ),
  set: (row) => (
    <span className="text-sm text-default-500">{getSetInfo(row as any)}</span>
  ),
  condition: (row) => (
    <Chip size="sm" variant="flat">
      {CARD_CONDITION_SHORT_LABELS[row.condition]}
    </Chip>
  ),
  price: (row) => (
    <span className="text-sm">{formatCurrency(row.price)}</span>
  ),
  subtotal: (row) => (
    <span className="text-sm font-semibold">
      {formatCurrency(calculateItemSubtotal(row))}
    </span>
  ),
};

const COLUMNS_WITH_RENDERERS = SALE_ITEMS_COLUMNS.map((col) => {
  const renderer = COLUMN_RENDERERS[col.key];
  return renderer ? { ...col, customCol: renderer } : col;
});

export default function SaleItemsTable({
  items,
  loading = false,
}: SaleItemsTableProps) {
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
      cols={COLUMNS_WITH_RENDERERS}
      data={items}
      isLoading={loading}
    />
  );
}
