'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '@heroui/react';
import { ICard } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';
import CardGridItem from './card-grid-item';
import GridSkeleton from '@/shared/base/skeletons/grid-skeleton';

interface CardGridProps {
  cards: ICard[];
  loading?: boolean;
  pageSize?: number;
  onCardPress?: (card: ICard) => void;
}

export default function CardGrid({
  cards,
  loading = false,
  pageSize = DEFAULT_PAGE_SIZE,
  onCardPress,
}: CardGridProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(cards.length / pageSize));

  const paginatedCards = useMemo(() => {
    const start = (page - 1) * pageSize;
    return cards.slice(start, start + pageSize);
  }, [cards, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  if (loading) {
    return <GridSkeleton count={8} />;
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-default-400">
        <span className="text-5xl">🔍</span>
        <p className="mt-4 text-lg font-medium">No se encontraron cartas</p>
        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {paginatedCards.map((card) => (
          <CardGridItem key={card.id} card={card} onPress={onCardPress} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
          />
        </div>
      )}
    </div>
  );
}
