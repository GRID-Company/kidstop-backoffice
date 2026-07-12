import { forwardRef } from 'react';
import { Chip } from '@heroui/react';
import InputForm from '@/shared/base/form-controls/input-form';
import { CardImage } from '@/shared/components/card-image';
import CardImagePreviewModal from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { PriceAdjustmentItemProps } from './price-adjustment-types';

const PriceAdjustmentItem = forwardRef<
  HTMLDivElement,
  PriceAdjustmentItemProps
>(function PriceAdjustmentItem(
  { item, index, control, displayCurrency, hasError, autoCalculatedItems },
  ref
) {
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 rounded-lg border p-4 ${
        hasError ? 'border-danger/50 bg-danger-50/30' : 'border-default-200'
      }`}
    >
      <div className='flex items-center gap-3'>
        <CardImage
          src={item.cardImageUrl}
          alt={item.cardName}
          tcgType={item.tcgType}
          containerClassName='relative h-16 w-12 rounded overflow-hidden bg-default-100 flex-shrink-0'
          className='object-cover'
          fill
          sizes='48px'
          enablePreview
          onImageClick={() =>
            openPreview(item.cardImageUrl, item.cardName, item.tcgType)
          }
        />
        <div className='flex flex-1 flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-semibold'>{item.cardName}</span>
            <Chip
              size='sm'
              variant='flat'
              classNames={{
                base: 'bg-accent/10',
                content: 'text-accent text-xs font-medium',
              }}
            >
              {CARD_CONDITION_SHORT_LABELS[item.condition]}
            </Chip>
            <Chip size='sm' variant='flat' className='text-xs'>
              {LANGUAGE_LABELS[item.language]}
            </Chip>
          </div>
          <span className='text-default-400 text-xs'>
            {item.setName} · {item.setCode}
          </span>
          <div className='text-default-500 flex items-center gap-4 text-xs'>
            <span>
              Cant: <strong>{item.quantity}</strong>
            </span>
            <span>
              Precio compra: <strong>{displayCurrency(item.offerPrice)}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className='flex items-end gap-3'>
        <div className='flex flex-col gap-1'>
          <span className='text-default-400 text-xs'>Precio referencia</span>
          <span className='text-default-600 text-sm font-medium'>
            {displayCurrency(item.referencePrice || 0)}
          </span>
        </div>

        <div className='flex flex-1 flex-col gap-1'>
          <InputForm
            label='Precio de venta'
            type='number'
            placeholder='0.00'
            controlProps={{
              control,
              name: `items.${index}.publicPrice`,
            }}
            isRequired
            startContent={<span className='text-default-400 text-sm'>$</span>}
            size='sm'
            aria-label={`Precio de venta de ${item.cardName}`}
          />
          {autoCalculatedItems.has(item.guid) && (
            <p className='text-default-500 text-xs'>
              Precio sugerido: Ref. + 20%
            </p>
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
    </div>
  );
});

export default PriceAdjustmentItem;
