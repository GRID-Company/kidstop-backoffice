'use client';

import { Pagination } from '@heroui/react';
import { IMagicCard } from '../../domain/types';
import MagicCardGridItem from './magic-card-grid-item';

interface MagicCardGridProps {
  cards: IMagicCard[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCardPress: (card: IMagicCard) => void;
}

export default function MagicCardGrid({
  cards,
  loading,
  page,
  totalPages,
  onPageChange,
  onCardPress,
}: MagicCardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-lg bg-default-100" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-default-500">No se encontraron cartas</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cards.map((card) => (
          <MagicCardGridItem key={card.guid} card={card} onPress={onCardPress} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={page}
            onChange={onPageChange}
            showControls
            classNames={{
              cursor: 'bg-accent text-white',
            }}
          />
        </div>
      )}
    </div>
  );
}
