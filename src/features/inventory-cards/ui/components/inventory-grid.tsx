'use client';

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
import { CardImage } from '@/shared/components/card-image';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
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
  { key: 'language', label: 'Idioma', allowsSorting: true },
  { key: 'stock', label: 'Stock', allowsSorting: true },
  { key: 'stockStatus', label: 'Estado', allowsSorting: true },
  { key: 'sellPrice', label: 'Precio', allowsSorting: true },
  { key: 'lastSellDate', label: 'Última venta', allowsSorting: true },
  { key: 'avgDaysInInventory', label: 'Días en inv.', allowsSorting: true },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDays(days: number | null): string {
  if (days == null) return '—';
  return `${days.toFixed(1)}d`;
}

function renderCell(
  item: IInventoryItem,
  columnKey: string,
  openPreview: (
    url: string | null,
    alt: string,
    tcg: 'POKEMON' | 'MAGIC'
  ) => void
) {
  switch (columnKey) {
    case 'name':
      return (
        <div className='flex items-center gap-3'>
          <CardImage
            src={item.imageUrl}
            alt={item.name}
            tcgType={item.tcg as 'POKEMON' | 'MAGIC'}
            containerClassName='relative h-28 w-20 flex-shrink-0 overflow-hidden rounded bg-default-100'
            className='object-contain'
            fill
            sizes='80px'
            enablePreview
            onImageClick={() =>
              openPreview(
                item.imageUrl,
                item.name,
                item.tcg as 'POKEMON' | 'MAGIC'
              )
            }
          />
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>{item.name}</p>
            <p className='text-default-400 truncate text-xs'>
              {item.number} · {item.rarity}
            </p>
          </div>
        </div>
      );
    case 'setName':
      return (
        <span className='text-sm'>
          {item.setName}{' '}
          <span className='text-default-400'>({item.setCode})</span>
        </span>
      );
    case 'condition':
      return (
        <span className='bg-default-100 text-default-600 rounded-full px-2 py-0.5 text-xs'>
          {CARD_CONDITION_SHORT_LABELS[item.condition] ?? item.condition}
        </span>
      );
    case 'language':
      return (
        <span className='text-sm'>
          {LANGUAGE_LABELS[item.language] ?? item.language}
        </span>
      );
    case 'stock':
      return <span className='text-sm font-semibold'>{item.stock}</span>;
    case 'stockStatus':
      return (
        <StockIndicator stockStatus={item.stockStatus} stock={item.stock} />
      );
    case 'sellPrice':
      return (
        <span className='text-success text-sm font-semibold'>
          ${item.sellPrice.toFixed(2)}
        </span>
      );
    case 'lastSellDate':
      return (
        <span className='text-default-500 text-sm'>
          {formatDate(item.lastSellDate)}
        </span>
      );
    case 'avgDaysInInventory':
      return (
        <span className='text-default-500 text-sm'>
          {formatDays(item.avgDaysInInventory)}
        </span>
      );
    default:
      return null;
  }
}

function InventoryMobileCard({
  item,
  onPress,
  openPreview,
}: {
  item: IInventoryItem;
  onPress?: (item: IInventoryItem) => void;
  openPreview: (
    url: string | null,
    alt: string,
    tcg: 'POKEMON' | 'MAGIC'
  ) => void;
}) {
  return (
    <KidstopCard isPressable={!!onPress} onPress={() => onPress?.(item)}>
      <CardBody className='flex flex-row gap-3 !p-4'>
        <CardImage
          src={item.imageUrl}
          alt={item.name}
          tcgType={item.tcg as 'POKEMON' | 'MAGIC'}
          containerClassName='relative h-32 w-24 shrink-0 overflow-hidden rounded bg-default-100'
          className='object-contain'
          fill
          sizes='96px'
          enablePreview
          onImageClick={() =>
            openPreview(
              item.imageUrl,
              item.name,
              item.tcg as 'POKEMON' | 'MAGIC'
            )
          }
        />

        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <div className='flex items-start justify-between gap-2'>
            <p className='truncate text-sm font-semibold'>{item.name}</p>
            <span className='text-success flex-shrink-0 text-sm font-bold'>
              ${item.sellPrice.toFixed(2)}
            </span>
          </div>

          <p className='text-default-500 truncate text-xs'>
            {item.setName} ({item.setCode}) · {item.number}
          </p>

          <div className='flex flex-wrap items-center gap-2'>
            <span className='bg-default-100 text-default-600 rounded-full px-2 py-0.5 text-[10px]'>
              {CARD_CONDITION_SHORT_LABELS[item.condition] ?? item.condition}
            </span>
            <span className='text-default-500 text-[10px]'>
              {LANGUAGE_LABELS[item.language]}
            </span>
            <StockIndicator stockStatus={item.stockStatus} stock={item.stock} />
          </div>

          <div className='text-default-400 flex items-center gap-3 text-[11px]'>
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
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();
  if (isLoading) {
    return (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-14 w-full rounded-lg' />
        ))}
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className='text-default-400 flex flex-col items-center justify-center py-16'>
        <span className='text-5xl'>📦</span>
        <p className='mt-4 text-lg font-medium'>
          No se encontraron items en inventario
        </p>
        <p className='text-sm'>Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='hidden lg:block'>
        <KidstopTable
          aria-label='Inventario de cartas'
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
        >
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn
                key={column.key}
                allowsSorting={column.allowsSorting}
                className='text-center'
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow
                key={item.guid}
                className='cursor-pointer'
                onClick={() => onItemPress?.(item)}
              >
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} className='text-center'>
                    {renderCell(item, col.key, openPreview)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </KidstopTable>
      </div>

      <div className='flex flex-col gap-3 lg:hidden'>
        {items.map((item) => (
          <InventoryMobileCard
            key={item.guid}
            item={item}
            onPress={onItemPress}
            openPreview={openPreview}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <p className='text-default-400 text-xs'>
            Mostrando {items.length} de {totalItems}
          </p>
          <Pagination
            total={totalPages}
            page={page}
            onChange={onPageChange}
            showControls
            size='sm'
          />
        </div>
      )}
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </div>
  );
}
