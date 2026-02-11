'use client';

import React from 'react';
import Image from 'next/image';
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';

import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import {
  FulfillmentStatus,
  FULFILLMENT_STATUS,
  ISaleItem,
} from '../../domain/types';
import { calculateItemSubtotal } from '../../domain/sales.domain';
import {
  CARD_CONDITION_SHORT_LABELS,
  FULFILLMENT_STATUS_COLORS,
  FULFILLMENT_STATUS_LABELS,
} from '../../domain/constants';

interface SaleItemsTableProps {
  items: ISaleItem[];
  loading?: boolean;
  onFulfillmentChange?: (itemId: string, status: FulfillmentStatus) => void;
}

const SALE_ITEMS_COLUMNS: ITableColumn[] = [
  { key: 'image', label: '', className: 'w-14' },
  { key: 'cardName', label: 'Carta' },
  { key: 'set', label: 'Set' },
  { key: 'condition', label: 'Condición', className: 'w-24' },
  { key: 'quantity', label: 'Cant.', className: 'w-16' },
  { key: 'unitPrice', label: 'Precio', className: 'w-24' },
  { key: 'subtotal', label: 'Subtotal', className: 'w-24' },
  { key: 'fulfillmentStatus', label: 'Surtido', className: 'w-32' },
  { key: 'actions', label: 'Acciones', className: 'w-28' },
];

type ColumnRenderer = (row: ISaleItem) => React.ReactNode;

function getColumnRenderers(
  onFulfillmentChange?: (itemId: string, status: FulfillmentStatus) => void
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
    fulfillmentStatus: (row) => (
      <Chip
        size="sm"
        variant="flat"
        color={FULFILLMENT_STATUS_COLORS[row.fulfillmentStatus]}
      >
        {FULFILLMENT_STATUS_LABELS[row.fulfillmentStatus]}
      </Chip>
    ),
    actions: (row) => (
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" variant="light" isIconOnly aria-label="Acciones">
            ⋮
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Acciones del item"
          onAction={(key) => {
            onFulfillmentChange?.(row.id, key as FulfillmentStatus);
          }}
        >
          <DropdownItem
            key={FULFILLMENT_STATUS.FOUND}
            className="text-success"
          >
            {FULFILLMENT_STATUS_LABELS[FULFILLMENT_STATUS.FOUND]}
          </DropdownItem>
          <DropdownItem
            key={FULFILLMENT_STATUS.NOT_AVAILABLE}
            className="text-danger"
          >
            {FULFILLMENT_STATUS_LABELS[FULFILLMENT_STATUS.NOT_AVAILABLE]}
          </DropdownItem>
          <DropdownItem key={FULFILLMENT_STATUS.PENDING}>
            {FULFILLMENT_STATUS_LABELS[FULFILLMENT_STATUS.PENDING]}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    ),
  };
}

function buildColumns(
  onFulfillmentChange?: (itemId: string, status: FulfillmentStatus) => void
): ITableColumn[] {
  const renderers = getColumnRenderers(onFulfillmentChange);
  return SALE_ITEMS_COLUMNS.map((col) => {
    const renderer = renderers[col.key];
    return renderer ? { ...col, customCol: renderer } : col;
  });
}

export default function SaleItemsTable({
  items,
  loading = false,
  onFulfillmentChange,
}: SaleItemsTableProps) {
  const columns = buildColumns(onFulfillmentChange);

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
