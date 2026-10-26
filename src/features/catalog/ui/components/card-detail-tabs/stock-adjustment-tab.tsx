'use client';

import { Control } from 'react-hook-form';
import { SelectItem } from '@heroui/react';
import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { BULK_ADJUSTMENT_OPTIONS } from '@/features/inventory-cards/domain/constants';
import { StockAdjustmentFormData } from '../../../adapters/forms/stock-adjustment.form.schema';

interface StockAdjustmentTabProps {
  control: Control<StockAdjustmentFormData>;
}

export default function StockAdjustmentTab({
  control,
}: StockAdjustmentTabProps) {
  return (
    <div className='flex w-full flex-col gap-4' data-testid='tab-stock'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <SelectForm
          controlProps={{ control, name: 'movementType' }}
          label='Tipo de operación'
          placeholder='Selecciona el tipo de operación'
          size='sm'
          items={BULK_ADJUSTMENT_OPTIONS}
          data-testid='stock-movement-type-select'
        >
          {(option) => (
            <SelectItem
              key={
                (option as { key: string; label: string; description: string })
                  .key
              }
              description={
                (option as { key: string; label: string; description: string })
                  .description
              }
            >
              {
                (option as { key: string; label: string; description: string })
                  .label
              }
            </SelectItem>
          )}
        </SelectForm>

        <InputForm
          controlProps={{ control, name: 'quantity' }}
          label='Cantidad'
          type='number'
          size='sm'
          data-testid='stock-adjustment-input'
        />
      </div>

      <TextareaForm
        controlProps={{ control, name: 'notes' }}
        label='Notas (opcional)'
        placeholder='Ej: Recibido de proveedor, Daño en transporte, etc.'
        size='sm'
        maxRows={3}
        data-testid='stock-notes-textarea'
      />
    </div>
  );
}
