'use client';

import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';
import GridSkeleton from '@/shared/base/skeletons/grid-skeleton';
import { IPokemonCard } from '../../domain/types';
import PokemonCardGridItem from './pokemon-card-grid-item';

interface PokemonCardGridProps {
  cards: IPokemonCard[];
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCardPress?: (card: IPokemonCard) => void;
}

export default function PokemonCardGrid({
  cards,
  loading = false,
  page,
  totalPages,
  onPageChange,
  onCardPress,
}: PokemonCardGridProps) {
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
        {cards.map((card) => (
          <PokemonCardGridItem key={card.guid} card={card} onPress={onCardPress} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
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
