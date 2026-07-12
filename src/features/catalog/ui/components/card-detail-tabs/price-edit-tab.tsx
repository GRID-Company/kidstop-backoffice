'use client';

import { Control, FormState, UseFormWatch } from 'react-hook-form';
import InputForm from '@/shared/base/form-controls/input-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { CardPriceFormData } from '../../../adapters/forms/card-price.form.schema';

interface PriceEditTabProps {
  control: Control<CardPriceFormData>;
  formState: FormState<CardPriceFormData>;
  watch?: UseFormWatch<CardPriceFormData>;
}

export default function PriceEditTab({ control, watch }: PriceEditTabProps) {
  const showWarning = watch && watch('sellPrice') < watch('buyPrice');

  return (
    <div
      className='mx-auto flex max-w-4xl flex-col gap-4'
      data-testid='tab-price'
    >
      <div className='grid grid-cols-2 gap-4'>
        <InputForm
          label='Precio de compra'
          type='number'
          controlProps={{ control, name: 'buyPrice' }}
        />
        <InputForm
          label='Precio de venta'
          type='number'
          controlProps={{ control, name: 'sellPrice' }}
        />
      </div>

      {showWarning && (
        <div className='bg-warning-50 text-warning-700 rounded-md p-3 text-sm'>
          El precio de venta es menor al precio de compra
        </div>
      )}

      <TextareaForm
        controlProps={{ control, name: 'notes' }}
        label='Notas (opcional)'
        placeholder='Agregar notas sobre el cambio de precio...'
        size='sm'
        minRows={2}
        data-testid='price-notes-textarea'
      />
    </div>
  );
}
