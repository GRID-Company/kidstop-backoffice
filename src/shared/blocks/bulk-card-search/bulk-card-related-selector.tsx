'use client';

import { RadioGroup, Radio } from '@heroui/react';
import { Icon } from '@iconify/react';
import CardAttributeChips from '@/shared/components/card-attribute-chips';
import { CardImage } from '@/shared/components/card-image';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { formatCardNumber } from '@/lib/utils/format-card-number';
import { BulkCardRelatedSelectorProps } from './types';

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
            <div
              className='flex items-center gap-2'
              data-testid='bulk-card-related-option'
            >
              <div className='bg-default-100 relative h-15 w-10.75 shrink-0 overflow-hidden rounded-md'>
                <CardImage
                  src={card.imageUri}
                  alt={card.name}
                  tcgType={tcgType}
                  containerClassName='absolute inset-0'
                  className='object-contain p-0.5'
                  fill
                  sizes='43px'
                  enablePreview
                  onImageClick={() =>
                    openPreview(
                      card.imageUri ?? null,
                      card.name,
                      tcgType as 'POKEMON' | 'MAGIC'
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='line-clamp-2 text-xs leading-tight font-semibold'>
                  {card.name}
                </p>
                <CardAttributeChips
                  tcgType={tcgType}
                  isFoil={card.isFoil}
                  variant={card.variant}
                  language={card.language}
                  type={card.type}
                  hp={card.hp}
                  stage={card.stage}
                  rarity={card.rarity}
                />
                <p className='text-default-500 text-[10px]'>
                  {card.edition} · {formatCardNumber(card.collectorNumber)}
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
