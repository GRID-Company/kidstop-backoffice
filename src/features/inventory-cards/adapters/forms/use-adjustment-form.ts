import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { BulkOperationType } from '@/lib/api/schema-types';
import {
  InventoryAdjustmentFormData,
  inventoryAdjustmentFormSchema,
} from './inventory-adjustment.form.schema';

export function useAdjustmentForm(defaults?: Partial<InventoryAdjustmentFormData>) {
  return useForm<InventoryAdjustmentFormData>({
    resolver: zodResolver(inventoryAdjustmentFormSchema) as Resolver<InventoryAdjustmentFormData>,
    defaultValues: {
      cardGuid: '',
      condition: CARD_CONDITIONS.NEAR_MINT,
      quantity: 1,
      bulkOperationType: BulkOperationType.ManualEntry,
      notes: '',
      ...defaults,
    },
    mode: 'all',
  });
}
