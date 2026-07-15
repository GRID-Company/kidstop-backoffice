'use client';

import { RadioGroup, Radio, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { BulkCardRelatedSelectorProps } from './types';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';

export default function BulkCardRelatedSelector({
  relatedCards,
  selectedCardGuid,
  onSelect,
  tcgType,
}: BulkCardRelatedSelectorProps) {
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  if (relatedCards.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-default-600 text-xs font-semibold'>
        Cartas relacionadas:
      </p>
      <RadioGroup
        value={selectedCardGuid}
        onValueChange={onSelect}
        orientation='horizontal'
        classNames={{
          wrapper: 'gap-2',
        }}
      >
        {relatedCards.map((card) => (
          <Radio
            key={card.guid}
            value={card.guid}
            classNames={{
              base: 'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent data-[selected=true]:border-primary',
              wrapper: 'hidden',
            }}
          >
            <div className='flex items-center gap-2'>
              <div
                className='bg-default-100 relative h-[60px] w-[43px] shrink-0 cursor-pointer overflow-hidden rounded-md transition-opacity hover:opacity-80'
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
                    className='absolute inset-0 h-full w-full object-contain p-0.5'
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
                    sizes='43px'
                    className='object-contain p-0.5'
                  />
                )}
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='line-clamp-2 text-xs leading-tight font-semibold'>
                  {card.name}
                </p>
                <div className='flex flex-wrap items-center gap-1'>
                  {tcgType === 'POKEMON' && card.type && (
                    <PokemonTypeIcon type={card.type} size='sm' />
                  )}
                  {card.variant &&
                    !card.variant.toLowerCase().includes('normal') && (
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
                <p className='text-default-500 text-[10px]'>
                  {card.edition} · {card.collectorNumber}
                </p>
                <div className='flex items-center gap-1'>
                  <Icon
                    icon='lucide:package'
                    width={10}
                    className={
                      card.totalStock > 0 ? 'text-success' : 'text-danger'
                    }
                  />
                  <span className='text-default-400 text-[10px]'>
                    {card.totalStock > 0
                      ? `${card.totalStock} en stock`
                      : 'Sin stock'}
                  </span>
                </div>
              </div>
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </div>
  );
}
