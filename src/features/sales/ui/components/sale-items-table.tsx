'use client';

import React from 'react';
import Image from 'next/image';
import { Chip } from '@heroui/react';

import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
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

function getCardName(row: ISaleItem): string {
  return row.pokemonCardSummary?.name ?? row.magicCardSummary?.name ?? '—';
}

function getCardImageUri(row: ISaleItem): string | null {
  return row.pokemonCardSummary?.imageUri ?? row.magicCardSummary?.imageUri ?? null;
}

function getSetInfo(row: ISaleItem): string {
  if (row.pokemonCardSummary) {
    const { setName, setCode } = row.pokemonCardSummary;
    return setName && setCode ? `${setName} (${setCode})` : setName ?? '—';
  }
  if (row.magicCardSummary) {
    const { edition, collectorNumber } = row.magicCardSummary;
    return edition && collectorNumber
      ? `${edition} #${collectorNumber}`
      : edition ?? '—';
  }
  return '—';
}

const COLUMN_RENDERERS: Record<string, ColumnRenderer> = {
  image: (row) => {
    const imageUri = getCardImageUri(row);
    const cardName = getCardName(row);
    return (
      <div className="relative mx-auto h-10 w-10 overflow-hidden rounded bg-default-100">
        {imageUri ? (
          <Image
            src={imageUri}
            alt={cardName}
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
    );
  },
  cardName: (row) => (
    <span className="font-medium">{getCardName(row)}</span>
  ),
  set: (row) => (
    <span className="text-sm text-default-500">{getSetInfo(row)}</span>
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
