import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { MOVEMENT_TYPES } from '../../domain/constants';
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
      movementType: MOVEMENT_TYPES.MANUAL_ADJUSTMENT,
      notes: '',
      ...defaults,
    },
    mode: 'all',
  });
}
