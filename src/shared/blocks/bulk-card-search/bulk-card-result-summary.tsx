'use client';

import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import PriceMetricsSkeleton from './components/price-metrics-skeleton';
import { BulkCardData } from './types';
import { TCGType } from '@/lib/types/tcg.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';

interface BulkCardResultSummaryProps {
  card: BulkCardData;
  tcgType: TCGType;
  loadingMetrics?: boolean;
}

export default function BulkCardResultSummary({
  card,
  tcgType,
  loadingMetrics = false,
}: BulkCardResultSummaryProps) {
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  return (
    <>
      <div className='flex min-w-0 flex-1 items-center gap-3'>
        <div
          className='bg-default-100 relative h-[90px] w-[65px] shrink-0 cursor-pointer overflow-hidden rounded-md transition-opacity hover:opacity-80'
          onClick={(e) => {
            e.stopPropagation();
            openPreview(
              card.imageUri ?? null,
              card.name,
              tcgType as 'POKEMON' | 'MAGIC'
            );
          }}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              openPreview(
                card.imageUri ?? null,
                card.name,
                tcgType as 'POKEMON' | 'MAGIC'
              );
            }
          }}
          aria-label={`Ver ${card.name} en tamaño completo`}
        >
          {card.imageUri ? (
            <img
              src={card.imageUri}
              alt={card.name}
              className='absolute inset-0 h-full w-full object-contain p-1'
            />
          ) : (
            <Image
              src={
                tcgType === 'MAGIC'
                  ? magicCardPlaceholder
                  : pokemonCardPlaceholder
              }
              alt={`${tcgType} card placeholder`}
              fill
              sizes='65px'
              className='object-contain p-1'
            />
          )}
        </div>
        <div className='flex flex-1 flex-col gap-1'>
          <p className='text-sm leading-tight font-semibold'>{card.name}</p>
          <div className='flex flex-wrap items-center gap-1.5'>
            {tcgType === 'POKEMON' && card.type && (
              <PokemonTypeIcon type={card.type} size='sm' />
            )}
            {tcgType === 'POKEMON' && card.hp && (
              <Chip size='sm' variant='flat' className='h-4 px-1 text-[9px]'>
                {card.hp} HP
              </Chip>
            )}
            {card.variant && !card.variant.toLowerCase().includes('normal') && (
              <Chip
                size='sm'
                variant='flat'
                color='secondary'
                className='h-4 px-1 text-[9px]'
              >
                {card.variant}
              </Chip>
            )}
          </div>
          <p className='text-default-500 text-xs'>
            {card.edition} · #{card.collectorNumber}
          </p>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1'>
              <Icon
                icon='lucide:package'
                width={12}
                className={card.totalStock > 0 ? 'text-success' : 'text-danger'}
              />
              <span className='text-default-500 text-xs'>
                {card.totalStock > 0
                  ? `${card.totalStock} en stock`
                  : 'Sin stock'}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <Icon icon='lucide:tag' width={12} className='text-default-400' />
              <span
                className={`text-xs ${card.sellPrice && card.sellPrice > 0 ? 'text-accent font-semibold' : 'text-default-400'}`}
              >
                {card.sellPrice && card.sellPrice > 0
                  ? formatCurrency(card.sellPrice)
                  : 'Sin precio de venta'}
              </span>
            </div>
          </div>
          {loadingMetrics ? (
            <PriceMetricsSkeleton />
          ) : (
            card.cardMetrics &&
            (card.cardMetrics.ungradedPrice ||
              card.cardMetrics.gradedPriceSeven ||
              card.cardMetrics.gradedPriceEightOrAbove) && (
              <div className='mt-1 flex flex-wrap items-center gap-2 text-xs'>
                {card.cardMetrics.ungradedPrice &&
                  card.cardMetrics.ungradedPrice > 0 && (
                    <div className='flex items-center gap-0.5'>
                      <Icon
                        icon='lucide:trending-up'
                        width={12}
                        className='text-default-400'
                      />
                      <span className='text-default-500'>
                        Market: {formatCurrency(card.cardMetrics.ungradedPrice)}
                      </span>
                    </div>
                  )}
                {card.cardMetrics.gradedPriceSeven &&
                  card.cardMetrics.gradedPriceSeven > 0 && (
                    <div className='flex items-center gap-0.5'>
                      <Icon
                        icon='lucide:award'
                        width={12}
                        className='text-warning'
                      />
                      <span className='text-default-500'>
                        PSA 7:{' '}
                        {formatCurrency(card.cardMetrics.gradedPriceSeven)}
                      </span>
                    </div>
                  )}
                {card.cardMetrics.gradedPriceEightOrAbove &&
                  card.cardMetrics.gradedPriceEightOrAbove > 0 && (
                    <div className='flex items-center gap-0.5'>
                      <Icon
                        icon='lucide:star'
                        width={12}
                        className='text-success'
                      />
                      <span className='text-default-500'>
                        PSA 8+:{' '}
                        {formatCurrency(
                          card.cardMetrics.gradedPriceEightOrAbove
                        )}
                      </span>
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      </div>
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
