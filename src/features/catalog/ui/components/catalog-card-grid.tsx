'use client';

import { ReactNode } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';
import GridSkeleton from '@/shared/base/skeletons/grid-skeleton';

interface CatalogCardGridProps<T> {
  cards: T[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  renderItem: (card: T) => ReactNode;
  gridTestId: string;
  emptyTestId: string;
}

export default function CatalogCardGrid<T>({
  cards,
  loading = false,
  error = false,
  onRetry,
  page,
  totalPages,
  onPageChange,
  renderItem,
  gridTestId,
  emptyTestId,
}: CatalogCardGridProps<T>) {
  if (loading) {
    return <GridSkeleton count={10} />;
  }

  if (error) {
    return (
      <div
        className='text-default-400 flex min-h-[400px] flex-col items-center justify-center gap-3'
        data-testid={`${gridTestId}-error`}
      >
        <Icon icon='lucide:cloud-off' width={40} />
        <p className='text-lg font-medium'>No se pudo cargar el catálogo</p>
        {onRetry && (
          <Button
            size='sm'
            variant='bordered'
            onPress={onRetry}
            startContent={<Icon icon='lucide:refresh-cw' width={14} />}
          >
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div
        className='text-default-400 flex flex-col items-center justify-center py-16'
        data-testid={emptyTestId}
      >
        <span className='text-5xl'>🔍</span>
        <p className='mt-4 text-lg font-medium'>No se encontraron cartas</p>
        <p className='text-sm'>Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div
        className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'
        data-testid={gridTestId}
      >
        {cards.map(renderItem)}
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center'>
          <KidstopPagination
            total={totalPages}
            page={page}
            onChange={onPageChange}
            showControls
          />
        </div>
      )}
    </div>
  );
}
