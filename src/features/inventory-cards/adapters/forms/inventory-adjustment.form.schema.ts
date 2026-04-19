import { z } from 'zod';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { MOVEMENT_TYPES } from '../../domain/constants';

const cardConditionValues = Object.values(CARD_CONDITIONS) as [string, ...string[]];
const movementTypeValues = Object.values(MOVEMENT_TYPES) as [string, ...string[]];

export const inventoryAdjustmentFormSchema = z.object({
  cardGuid: z.string().min(1, 'La carta es obligatoria'),
  tcg: z.string().min(1, 'El TCG es obligatorio'),
  condition: z.enum(cardConditionValues, {
    message: 'La condición es obligatoria',
  }),
  quantity: z.coerce
    .number()
    .int('La cantidad debe ser un número entero')
    .refine(val => val === 0 || val >= 1, {
      message: 'La cantidad debe ser al menos 1',
    }),
  movementType: z.enum(movementTypeValues, {
    message: 'El tipo de movimiento es obligatorio',
  }),
  notes: z.string().min(1, 'Las notas son obligatorias'),
});

export type InventoryAdjustmentFormData = z.infer<typeof inventoryAdjustmentFormSchema>;
