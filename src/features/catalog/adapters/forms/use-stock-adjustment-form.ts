import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BulkOperationType } from '@/lib/api/schema-types';
import {
  StockAdjustmentFormData,
  stockAdjustmentFormSchema,
} from './stock-adjustment.form.schema';

export function useStockAdjustmentForm(
  defaults?: Partial<StockAdjustmentFormData>
) {
  return useForm<StockAdjustmentFormData>({
    resolver: zodResolver(
      stockAdjustmentFormSchema
    ) as Resolver<StockAdjustmentFormData>,
    defaultValues: {
      movementType: BulkOperationType.ManualEntry,
      quantity: 0,
      notes: undefined,
      ...defaults,
    },
    mode: 'all',
  });
}
