import { z } from 'zod';
import { BulkOperationType } from '@/lib/api/schema-types';

export const stockAdjustmentFormSchema = z.object({
  movementType: z.nativeEnum(BulkOperationType),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  notes: z.string().optional(),
});

export type StockAdjustmentFormData = z.infer<typeof stockAdjustmentFormSchema>;
