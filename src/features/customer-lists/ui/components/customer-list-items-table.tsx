'use client';

import { useMemo } from 'react';
import { Chip } from '@heroui/react';

import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { CardImage } from '@/shared/components/card-image';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { ICustomerCardListItem } from '../../domain/types';

interface CustomerListItemsTableProps {
  items: ICustomerCardListItem[];
  loading?: boolean;
}

const ITEMS_COLUMNS: ITableColumn<ICustomerCardListItem>[] = [
  { key: 'image', label: '', className: 'w-14' },
  { key: 'cardName', label: 'Carta' },
  { key: 'cardSet', label: 'Set / Edición' },
  { key: 'cardNumber', label: '#', className: 'w-20' },
  { key: 'condition', label: 'Condición', className: 'w-24' },
  { key: 'language', label: 'Idioma', className: 'w-28' },
  { key: 'quantity', label: 'Cant.', className: 'w-20' },
  { key: 'availableStock', label: 'Stock', className: 'w-20' },
  { key: 'sellPrice', label: 'Precio', className: 'w-24' },
];

export default function CustomerListItemsTable({
  items,
  loading = false,
}: CustomerListItemsTableProps) {
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  type ColumnRenderer = (row: ICustomerCardListItem) => React.ReactNode;

  const COLUMN_RENDERERS: Record<string, ColumnRenderer> = useMemo(
    () => ({
      image: (row) => (
        <CardImage
          src={row.imageUri}
          alt={row.cardName}
          tcgType={row.tcg}
          containerClassName='relative mx-auto h-10 w-10 overflow-hidden rounded bg-default-100'
          className='object-contain'
          enablePreview
          onImageClick={() => openPreview(row.imageUri, row.cardName, row.tcg)}
        />
      ),
      cardName: (row) => (
        <span className='text-sm font-medium'>{row.cardName}</span>
      ),
      cardSet: (row) => (
        <span className='text-default-500 text-sm'>{row.cardSet ?? '—'}</span>
      ),
      cardNumber: (row) => (
        <span className='text-default-500 text-sm'>
          {row.cardNumber ?? '—'}
        </span>
      ),
      condition: (row) => (
        <Chip size='sm' variant='flat'>
          {CARD_CONDITION_SHORT_LABELS[row.condition] ?? row.condition}
        </Chip>
      ),
      language: (row) => (
        <span className='text-default-500 text-sm'>
          {LANGUAGE_LABELS[row.language] ?? row.language}
        </span>
      ),
      quantity: (row) => (
        <span className='text-sm font-semibold'>×{row.quantity}</span>
      ),
      availableStock: (row) => (
        <span
          className={`text-sm ${
            row.availableStock != null && row.availableStock >= row.quantity
              ? 'text-success'
              : 'text-warning'
          }`}
        >
          {row.availableStock ?? '—'}
        </span>
      ),
      sellPrice: (row) => (
        <span className='text-sm'>
          {row.sellPrice != null ? formatCurrency(row.sellPrice) : '—'}
        </span>
      ),
    }),
    [openPreview]
  );

  const COLUMNS_WITH_RENDERERS = useMemo(
    () =>
      ITEMS_COLUMNS.map((col) => {
        const renderer = COLUMN_RENDERERS[col.key];
        return renderer ? { ...col, customCol: renderer } : col;
      }),
    [COLUMN_RENDERERS]
  );

  if (!loading && items.length === 0) {
    return (
      <div className='text-default-400 flex flex-col items-center justify-center py-12'>
        <span className='text-4xl'>🗂️</span>
        <p className='mt-3 text-sm'>Esta lista no tiene cartas</p>
      </div>
    );
  }

  return (
    <>
      <DataTable<ICustomerCardListItem>
        cols={COLUMNS_WITH_RENDERERS}
        data={items}
        isLoading={loading}
      />
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
        onClose={closePreview}
      />
    </>
  );
}
