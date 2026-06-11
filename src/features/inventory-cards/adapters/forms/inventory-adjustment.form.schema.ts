import { z } from 'zod';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { BulkOperationType } from '@/lib/api/schema-types';

const cardConditionValues = Object.values(CARD_CONDITIONS) as [string, ...string[]];
const bulkOperationTypeValues = Object.values(BulkOperationType) as [string, ...string[]];

export const inventoryAdjustmentFormSchema = z.object({
  cardGuid: z.string().min(1, 'La carta es obligatoria'),
  tcg: z.string().min(1, 'El TCG es obligatorio'),
  condition: z.enum(cardConditionValues, {
    message: 'La condición es obligatoria',
  }),
  quantity: z.coerce
    .number()
    .int('La cantidad debe ser un número entero'),
  bulkOperationType: z.enum(bulkOperationTypeValues, {
    message: 'El tipo de operación es obligatorio',
  }),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.bulkOperationType === BulkOperationType.ManualSet) {
    if (data.quantity < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La cantidad debe ser mayor o igual a 0 para MANUAL_SET',
        path: ['quantity'],
      });
    }
  } else {
    if (data.quantity < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La cantidad debe ser al menos 1',
        path: ['quantity'],
      });
    }
  }
});

export type InventoryAdjustmentFormData = z.infer<typeof inventoryAdjustmentFormSchema>;
