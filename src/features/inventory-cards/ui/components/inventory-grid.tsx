'use client';

import Image from 'next/image';
import {
  Pagination,
  Skeleton,
  SortDescriptor,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  CardBody,
} from '@heroui/react';
import { KidstopTable } from '@/shared/base/heorui-overrides/table';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { IInventoryItem } from '../../domain/types';
import StockIndicator from './stock-indicator';

interface InventoryGridProps {
  items: IInventoryItem[];
  totalItems: number;
  page: number;
  totalPages: number;
  sortDescriptor?: SortDescriptor;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (descriptor: SortDescriptor) => void;
  onItemPress?: (item: IInventoryItem) => void;
}

const COLUMNS = [
  { key: 'name', label: 'Carta', allowsSorting: true },
  { key: 'setName', label: 'Set', allowsSorting: true },
  { key: 'condition', label: 'Condición', allowsSorting: true },
  { key: 'stock', label: 'Stock', allowsSorting: true },
  { key: 'stockStatus', label: 'Estado', allowsSorting: true },
  { key: 'sellPrice', label: 'Precio', allowsSorting: true },
  { key: 'lastSellDate', label: 'Última venta', allowsSorting: true },
  { key: 'avgDaysInInventory', label: 'Días en inv.', allowsSorting: true },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDays(days: number | null): string {
  if (days == null) return '—';
  return `${days.toFixed(1)}d`;
}

function renderCell(item: IInventoryItem, columnKey: string) {
  switch (columnKey) {
    case 'name':
      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-default-100">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="32px"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-default-400 text-xs">
                🃏
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="truncate text-xs text-default-400">
              {item.number} · {item.rarity}
            </p>
          </div>
        </div>
      );
    case 'setName':
      return (
        <span className="text-sm">
          {item.setName} <span className="text-default-400">({item.setCode})</span>
        </span>
      );
    case 'condition':
      return (
        <span className="rounded-full bg-default-100 px-2 py-0.5 text-xs text-default-600">
          {CARD_CONDITION_SHORT_LABELS[item.condition] ?? item.condition}
        </span>
      );
    case 'stock':
      return <span className="text-sm font-semibold">{item.stock}</span>;
    case 'stockStatus':
      return <StockIndicator stockStatus={item.stockStatus} stock={item.stock} />;
    case 'sellPrice':
      return <span className="text-sm font-semibold text-success">${item.sellPrice.toFixed(2)}</span>;
    case 'lastSellDate':
      return <span className="text-sm text-default-500">{formatDate(item.lastSellDate)}</span>;
    case 'avgDaysInInventory':
      return <span className="text-sm text-default-500">{formatDays(item.avgDaysInInventory)}</span>;
    default:
      return null;
  }
}

function InventoryMobileCard({
  item,
  onPress,
}: {
  item: IInventoryItem;
  onPress?: (item: IInventoryItem) => void;
}) {
  return (
    <KidstopCard
      isPressable={!!onPress}
      onPress={() => onPress?.(item)}
    >
      <CardBody className="flex flex-row gap-3 !p-4">
        <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-default-100">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="48px"
              className="object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-default-400">
              🃏
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold">{item.name}</p>
            <span className="flex-shrink-0 text-sm font-bold text-success">
              ${item.sellPrice.toFixed(2)}
            </span>
          </div>

          <p className="truncate text-xs text-default-500">
            {item.setName} ({item.setCode}) · {item.number}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-default-100 px-2 py-0.5 text-[10px] text-default-600">
              {CARD_CONDITION_SHORT_LABELS[item.condition] ?? item.condition}
            </span>
            <StockIndicator stockStatus={item.stockStatus} stock={item.stock} />
          </div>

          <div className="flex items-center gap-3 text-[11px] text-default-400">
            <span>Venta: {formatDate(item.lastSellDate)}</span>
            <span>Inv: {formatDays(item.avgDaysInInventory)}</span>
          </div>
        </div>
      </CardBody>
    </KidstopCard>
  );
}

export default function InventoryGrid({
  items,
  totalItems,
  page,
  totalPages,
  sortDescriptor,
  isLoading = false,
  onPageChange,
  onSortChange,
  onItemPress,
}: InventoryGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-default-400">
        <span className="text-5xl">📦</span>
        <p className="mt-4 text-lg font-medium">No se encontraron items en inventario</p>
        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden lg:block">
        <KidstopTable
          aria-label="Inventario de cartas"
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
        >
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn
                key={column.key}
                allowsSorting={column.allowsSorting}
                className="text-center"
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow
                key={item.guid}
                className="cursor-pointer"
                onClick={() => onItemPress?.(item)}
              >
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} className="text-center">
                    {renderCell(item, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </KidstopTable>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {items.map((item) => (
          <InventoryMobileCard
            key={item.guid}
            item={item}
            onPress={onItemPress}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-default-400">
            Mostrando {items.length} de {totalItems}
          </p>
          <Pagination
            total={totalPages}
            page={page}
            onChange={onPageChange}
            showControls
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
