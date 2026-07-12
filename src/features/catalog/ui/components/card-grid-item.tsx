'use client';

import Image from 'next/image';
import { memo, useMemo } from 'react';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';
import { CardBody } from '@heroui/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import CardImagePreviewModal from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { ICard } from '../../domain/types';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';

interface CardGridItemProps {
  card: ICard;
  onPress?: (card: ICard) => void;
}

function CardGridItemComponent({ card, onPress }: CardGridItemProps) {
  const { totalStock, lowestSellPrice } = useMemo(() => {
    const total = card.variants.reduce((sum, v) => sum + v.stock, 0);
    const lowest = Math.min(...card.variants.map((v) => v.sellPrice));
    return { totalStock: total, lowestSellPrice: lowest };
  }, [card.variants]);

  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  return (
    <KidstopCard
      isPressable={!!onPress}
      onPress={() => onPress?.(card)}
      className='h-full'
    >
      <CardBody className='flex flex-col gap-3 !p-0'>
        <div
          className='bg-default-100 relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-t-md transition-opacity hover:opacity-80'
          onClick={(e) => {
            e.stopPropagation();
            openPreview(card.imageUrl, card.name, card.tcgType);
          }}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              openPreview(card.imageUrl, card.name, card.tcgType);
            }
          }}
          aria-label={`Ver ${card.name} en tamaño completo`}
        >
          {card.imageUrl ? (
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-contain p-2'
            />
          ) : (
            <Image
              src={
                card.tcgType === 'MAGIC'
                  ? magicCardPlaceholder
                  : pokemonCardPlaceholder
              }
              alt='Card placeholder'
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-contain p-2'
            />
          )}
        </div>

        <div className='flex flex-col gap-1.5 px-4 pb-4'>
          <p className='truncate text-sm font-semibold'>{card.name}</p>

          <p className='text-default-500 truncate text-xs'>
            {card.setName} · {card.setCode} · #{card.number}
          </p>

          <p className='text-default-400 text-xs'>{card.rarity}</p>

          <div className='mt-1 flex items-center justify-between'>
            <span className='text-success text-sm font-bold'>
              ${lowestSellPrice.toFixed(2)}
            </span>
            <span className='text-default-500 text-xs'>
              Stock: {totalStock}
            </span>
          </div>

          <div className='mt-1 flex flex-wrap gap-1'>
            {card.variants.map((v) => (
              <span
                key={v.id}
                className='bg-default-100 text-default-600 rounded-full px-2 py-0.5 text-[10px]'
              >
                {CARD_CONDITION_SHORT_LABELS[v.condition]} ({v.stock})
              </span>
            ))}
          </div>
        </div>
      </CardBody>
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </KidstopCard>
  );
}

export default memo(CardGridItemComponent);
