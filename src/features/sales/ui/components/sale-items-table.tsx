'use client';

import React, { useMemo } from 'react';
import { Chip } from '@heroui/react';

import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { CardImage } from '@/shared/components/card-image';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import {
  getCardName,
  getCardImageUri,
  getCardTCG,
  getSetInfo,
} from '@/shared/utils/card-utils';
import { ISaleItem } from '../../domain/types';
import { calculateItemSubtotal } from '../../domain/sales.domain';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';

interface SaleItemsTableProps {
  items: ISaleItem[];
  loading?: boolean;
}

const SALE_ITEMS_COLUMNS: ITableColumn<ISaleItem>[] = [
  { key: 'image', label: '', className: 'w-14' },
  { key: 'cardName', label: 'Carta' },
  { key: 'set', label: 'Set' },
  { key: 'condition', label: 'Condición', className: 'w-24' },
  { key: 'price', label: 'Precio', className: 'w-24' },
  { key: 'subtotal', label: 'Subtotal', className: 'w-24' },
];

export default function SaleItemsTable({
  items,
  loading = false,
}: SaleItemsTableProps) {
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  type ColumnRenderer = (row: ISaleItem) => React.ReactNode;

  const COLUMN_RENDERERS: Record<string, ColumnRenderer> = useMemo(
    () => ({
      image: (row) => {
        const imageUri = getCardImageUri(row);
        const cardName = getCardName(row);
        const tcg = getCardTCG(row);
        return (
          <CardImage
            src={imageUri}
            alt={cardName}
            tcgType={tcg}
            containerClassName='relative mx-auto h-10 w-10 overflow-hidden rounded bg-default-100'
            className='object-contain'
            enablePreview
            onImageClick={() => openPreview(imageUri, cardName, tcg)}
          />
        );
      },
      cardName: (row) => (
        <span className='font-medium'>{getCardName(row)}</span>
      ),
      set: (row) => (
        <span className='text-default-500 text-sm'>{getSetInfo(row)}</span>
      ),
      condition: (row) => (
        <Chip size='sm' variant='flat'>
          {
            CARD_CONDITION_SHORT_LABELS[
              row.condition as keyof typeof CARD_CONDITION_SHORT_LABELS
            ]
          }
        </Chip>
      ),
      price: (row) => (
        <span className='text-sm'>{formatCurrency(row.price)}</span>
      ),
      subtotal: (row) => (
        <span className='text-sm font-semibold'>
          {formatCurrency(calculateItemSubtotal(row))}
        </span>
      ),
    }),
    [openPreview]
  );

  const COLUMNS_WITH_RENDERERS = useMemo(
    () =>
      SALE_ITEMS_COLUMNS.map((col) => {
        const renderer = COLUMN_RENDERERS[col.key];
        return renderer ? { ...col, customCol: renderer } : col;
      }),
    [COLUMN_RENDERERS]
  );
  if (!loading && items.length === 0) {
    return (
      <div className='text-default-400 flex flex-col items-center justify-center py-12'>
        <span className='text-4xl'>📦</span>
        <p className='mt-3 text-sm'>No hay items en este pedido</p>
      </div>
    );
  }

  return (
    <>
      <DataTable<ISaleItem>
        cols={COLUMNS_WITH_RENDERERS}
        data={items}
        isLoading={loading}
      />
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </>
  );
}
