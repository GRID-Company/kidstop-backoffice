'use client';

import Image from 'next/image';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';
import { Card, CardBody, CardFooter } from '@heroui/react';
import FoilChip from '@/shared/components/foil-chip';
import { IMagicCard } from '../../domain/types';

interface MagicCardGridItemProps {
  card: IMagicCard;
  onPress: (card: IMagicCard) => void;
}

export default function MagicCardGridItem({
  card,
  onPress,
}: MagicCardGridItemProps) {
  const _hasStock = card.totalStock > 0;

  return (
    <Card
      isPressable
      onPress={() => onPress(card)}
      className='group relative overflow-hidden transition-all hover:scale-[1.02]'
      data-testid='magic-card-item'
    >
      <CardBody className='p-0'>
        <div className='bg-default-100 relative aspect-[3/4] w-full overflow-hidden'>
          {card.imageUri ? (
            <img
              src={card.imageUri}
              alt={card.name}
              className='absolute inset-0 h-full w-full object-contain p-2'
            />
          ) : (
            <Image
              src={magicCardPlaceholder}
              alt='Magic card placeholder'
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-contain p-2'
            />
          )}

          {card.isFoil && (
            <div className='absolute top-2 right-2'>
              <FoilChip label='Foil' />
            </div>
          )}
        </div>
      </CardBody>

      <CardFooter className='flex flex-col items-start gap-2 p-3'>
        <div className='flex w-full items-start justify-between gap-2'>
          <h4
            className='text-foreground line-clamp-2 text-sm font-semibold'
            data-testid='magic-card-name'
          >
            {card.name}
          </h4>
          {card.sellPrice !== null && (
            <span
              className='text-accent shrink-0 text-sm font-bold'
              data-testid='magic-card-price'
            >
              ${card.sellPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className='text-default-500 flex w-full flex-wrap items-center gap-1 text-xs'>
          {card.edition && <span>{card.edition}</span>}
          {card.collectorNumber && (
            <>
              <span>·</span>
              <span>#{card.collectorNumber}</span>
            </>
          )}
        </div>

        <div className='flex w-full items-center justify-between text-xs'>
          <span className='text-default-500' data-testid='magic-card-stock'>
            Stock:{' '}
            <span className='text-foreground font-semibold'>
              {card.totalStock}
            </span>
          </span>
          {card.variants.length > 0 && (
            <span className='text-default-400'>
              {card.variants.length} variantes
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
