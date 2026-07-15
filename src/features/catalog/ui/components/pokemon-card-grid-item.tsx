'use client';

import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import { CardBody, Chip } from '@heroui/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import FoilChip from '@/shared/components/foil-chip';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import { formatReleaseDate } from '@/lib/utils/format-date';
import { IPokemonCard, CardCondition } from '../../domain/types';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';

interface PokemonCardGridItemProps {
  card: IPokemonCard;
  onPress?: (card: IPokemonCard) => void;
}

export default function PokemonCardGridItem({
  card,
  onPress,
}: PokemonCardGridItemProps) {
  const sellPrice = card.sellPrice ?? 0;

  return (
    <KidstopCard
      isPressable={!!onPress}
      onPress={() => onPress?.(card)}
      className='h-full'
      data-testid='pokemon-card-item'
    >
      <CardBody className='flex flex-col gap-3 !p-0'>
        <div className='bg-default-100 relative aspect-[3/4] w-full overflow-hidden rounded-t-md'>
          {card.imageUri ? (
            <Image
              src={card.imageUri}
              alt={card.name}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-contain p-2'
            />
          ) : (
            <Image
              src={pokemonCardPlaceholder}
              alt='Pokemon card placeholder'
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-contain p-2'
            />
          )}

          {card.variant &&
            (card.variant.toLowerCase().includes('holo') ||
              card.variant.toLowerCase().includes('foil')) && (
              <div className='absolute top-2 right-2'>
                <FoilChip label={card.variant} />
              </div>
            )}
        </div>

        <div className='flex flex-col gap-1.5 px-4 pb-4'>
          <p
            className='truncate text-sm font-semibold'
            data-testid='pokemon-card-name'
          >
            {card.name}
          </p>

          <div className='flex flex-wrap items-center gap-1.5'>
            {card.type && (
              <div className='flex items-center gap-0.5'>
                <PokemonTypeIcon type={card.type} size='sm' />
              </div>
            )}
            {card.hp && (
              <Chip size='sm' variant='flat' className='h-5 px-1.5 text-[10px]'>
                {card.hp} HP
              </Chip>
            )}
            {card.variant && !card.variant.toLowerCase().includes('normal') && (
              <Chip
                size='sm'
                variant='flat'
                color='secondary'
                className='h-5 px-1.5 text-[10px]'
              >
                {card.variant}
              </Chip>
            )}
          </div>

          <p className='text-default-500 truncate text-xs'>
            {card.setName} {card.setCode ? `· ${card.setCode}` : ''}{' '}
            {card.cardNumber ? `· #${card.cardNumber}` : ''}
          </p>

          {card.releaseDate && (
            <p className='text-default-400 text-[10px]'>
              {formatReleaseDate(card.releaseDate)}
            </p>
          )}

          <div className='mt-1 flex items-center justify-between'>
            <span
              className='text-success text-sm font-bold'
              data-testid='pokemon-card-price'
            >
              ${sellPrice.toFixed(2)}
            </span>
            <span
              className='text-default-500 text-xs'
              data-testid='pokemon-card-stock'
            >
              Stock: {card.totalStock}
            </span>
          </div>

          {card.variants.length > 0 && (
            <div className='mt-1 flex flex-wrap gap-1'>
              {card.variants.map((v, idx) => (
                <span
                  key={idx}
                  className='bg-default-100 text-default-600 rounded-full px-2 py-0.5 text-[10px]'
                >
                  {CARD_CONDITION_SHORT_LABELS[v.condition as CardCondition] ??
                    v.condition}{' '}
                  ({v.stock})
                </span>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </KidstopCard>
  );
}
