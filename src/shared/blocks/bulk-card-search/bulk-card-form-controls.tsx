'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import InputForm from '@/shared/base/form-controls/input-form';
import { CARD_CONDITION_OPTIONS } from '@/lib/types/card.types';
import { calculateOfferPrice } from '@/features/purchases/domain/price.utils';
import { BulkCardFormControlsProps } from './types';

export default function BulkCardFormControls({
  variant,
  index,
  selectedCard,
}: BulkCardFormControlsProps) {
  const { control, setValue, watch } = useFormContext();

  const priceLabel = variant === 'purchases' ? 'Oferta' : 'Precio público';
  const priceName = variant === 'purchases' ? `cards.${index}.offerPrice` : `cards.${index}.publicPrice`;
  
  const currentPrice = watch(priceName);

  useEffect(() => {
    if (
      variant === 'purchases' &&
      selectedCard?.referencePrice &&
      selectedCard.referencePrice > 0 &&
      (currentPrice === undefined || currentPrice === null || currentPrice === 0)
    ) {
      const offerPrice = calculateOfferPrice(selectedCard.referencePrice);
      setValue(priceName, offerPrice, { shouldValidate: true });
    }
  }, [variant, selectedCard?.guid, selectedCard?.referencePrice, priceName, setValue]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <SelectForm
        controlProps={{
          name: `cards.${index}.condition`,
          control,
        }}
        label="Condición"
        size="sm"
        variant="bordered"
        classNames={{
          trigger: 'border-[1px] bg-white',
          label: 'text-xs',
        }}
        aria-label="Condición de la carta"
        items={CARD_CONDITION_OPTIONS}
      />

      <InputForm
        controlProps={{
          name: `cards.${index}.quantity`,
          control,
        }}
        type="number"
        size="sm"
        variant="bordered"
        label="Cantidad"
        min={1}
        classNames={{
          inputWrapper: 'border-[1px] bg-white',
          input: 'text-center',
          label: 'text-xs',
        }}
        aria-label="Cantidad de cartas"
      />

      <InputForm
        controlProps={{
          name: priceName,
          control,
        }}
        type="number"
        size="sm"
        variant="bordered"
        label={priceLabel}
        min={0}
        step={0.01}
        startContent={<span className="text-xs text-default-400">$</span>}
        classNames={{
          inputWrapper: 'border-[1px] bg-white',
          input: 'text-right',
          label: 'text-xs',
        }}
        aria-label={priceLabel}
      />
    </div>
  );
}
