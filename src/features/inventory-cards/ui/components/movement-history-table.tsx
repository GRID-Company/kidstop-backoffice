'use client';

import React from 'react';
import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';
import {
  Chip,
  Pagination,
  SortDescriptor,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  CardBody,
  Skeleton,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { KidstopTable } from '@/shared/base/heorui-overrides/table';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { formatUnixDateTime } from '@/lib/utils/format-date';
import { IInventoryMovement } from '../../domain/types';
import {
  MOVEMENT_TYPE_LABELS,
  MOVEMENT_TYPE_COLORS,
  MOVEMENT_TYPE_ICONS,
  formatMovementQuantity,
} from '../../domain/constants';

interface MovementHistoryTableProps {
  items: IInventoryMovement[];
  totalItems: number;
  page: number;
  totalPages: number;
  sortDescriptor?: SortDescriptor;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (descriptor: SortDescriptor) => void;
  onMovementPress?: (item: IInventoryMovement) => void;
}

const COLUMNS = [
  { key: 'createdDate', label: 'Fecha', allowsSorting: true },
  { key: 'cardName', label: 'Carta', allowsSorting: true },
  { key: 'movementType', label: 'Tipo', allowsSorting: true },
  { key: 'quantity', label: 'Cantidad', allowsSorting: true },
  { key: 'userName', label: 'Usuario', allowsSorting: true },
  { key: 'reference', label: 'Referencia', allowsSorting: true },
];


function renderCell(item: IInventoryMovement, columnKey: string) {
  switch (columnKey) {
    case 'createdDate':
      return (
        <span className="text-sm text-default-500">
          {formatUnixDateTime(item.createdDate)}
        </span>
      );
    case 'cardName':
      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-default-100">
            {item.cardImageUrl ? (
              <img
                src={item.cardImageUrl}
                alt={item.cardName}
                className="absolute inset-0 h-full w-full object-contain"
              />
            ) : (
              <Image
                src={item.tcg === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder}
                alt="Card placeholder"
                fill
                sizes="32px"
                className="object-contain"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.cardName}</p>
            <p className="truncate text-xs text-default-400">
              {item.setName} ({item.setCode}) · {item.cardNumber}
            </p>
          </div>
        </div>
      );
    case 'movementType':
      return (
        <Chip
          size="sm"
          variant="flat"
          color={MOVEMENT_TYPE_COLORS[item.movementType] ?? 'default'}
          startContent={
            <Icon
              icon={MOVEMENT_TYPE_ICONS[item.movementType] ?? 'lucide:circle'}
              className="ml-1 text-sm"
            />
          }
        >
          {MOVEMENT_TYPE_LABELS[item.movementType] ?? item.movementType}
        </Chip>
      );
    case 'quantity': {
      const { text, className } = formatMovementQuantity(item);
      return <span className={`text-sm font-semibold ${className}`}>{text}</span>;
    }
    case 'userName':
      return <span className="text-sm">{item.userName}</span>;
    case 'reference':
      return (
        <span className="text-sm text-default-500">
          {item.reference ?? '—'}
        </span>
      );
    default:
      return null;
  }
}

function MovementMobileCard({
  item,
  onPress,
}: {
  item: IInventoryMovement;
  onPress?: (item: IInventoryMovement) => void;
}) {
  const { text: qtyText, className: qtyClass } = formatMovementQuantity(item);

  return (
    <KidstopCard
      isPressable={!!onPress}
      onPress={() => onPress?.(item)}
    >
      <CardBody className="flex flex-row gap-3 !p-4">
        <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-default-100">
          {item.cardImageUrl ? (
            <img
              src={item.cardImageUrl}
              alt={item.cardName}
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-default-400">
              🃏
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold">{item.cardName}</p>
            <span className={`flex-shrink-0 text-sm font-bold ${qtyClass}`}>
              {qtyText}
            </span>
          </div>

          <p className="truncate text-xs text-default-500">
            {item.setName} ({item.setCode}) · {item.cardNumber}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Chip
              size="sm"
              variant="flat"
              color={MOVEMENT_TYPE_COLORS[item.movementType] ?? 'default'}
              startContent={
                <Icon
                  icon={MOVEMENT_TYPE_ICONS[item.movementType] ?? 'lucide:circle'}
                  className="ml-1 text-xs"
                />
              }
            >
              {MOVEMENT_TYPE_LABELS[item.movementType] ?? item.movementType}
            </Chip>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-default-400">
            <span>{formatUnixDateTime(item.createdDate)}</span>
            <span>{item.userName}</span>
            {item.reference && <span>{item.reference}</span>}
          </div>
        </div>
      </CardBody>
    </KidstopCard>
  );
}

export default function MovementHistoryTable({
  items,
  totalItems,
  page,
  totalPages,
  sortDescriptor,
  isLoading = false,
  onPageChange,
  onSortChange,
  onMovementPress,
}: MovementHistoryTableProps) {
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
        <span className="text-5xl">📋</span>
        <p className="mt-4 text-lg font-medium">No se encontraron movimientos</p>
        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden lg:block">
        <KidstopTable
          aria-label="Historial de movimientos"
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
          onRowAction={
            onMovementPress
              ? (key: React.Key) => {
                  const item = items.find((i) => i.guid === String(key));
                  if (item) onMovementPress(item);
                }
              : undefined
          }
          className={onMovementPress ? '[&_tr]:cursor-pointer' : ''}
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
              <TableRow key={item.guid}>
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
          <MovementMobileCard key={item.guid} item={item} onPress={onMovementPress} />
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
