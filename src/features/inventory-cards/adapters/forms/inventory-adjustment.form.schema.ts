import { z } from 'zod';
import { CARD_CONDITIONS } from '@/features/catalog/domain/constants';
import { MOVEMENT_TYPES } from '../../domain/constants';

const cardConditionValues = Object.values(CARD_CONDITIONS) as [string, ...string[]];
const movementTypeValues = Object.values(MOVEMENT_TYPES) as [string, ...string[]];

export const inventoryAdjustmentFormSchema = z.object({
  inventoryItemId: z.string().min(1, 'El item de inventario es obligatorio'),
  condition: z.enum(cardConditionValues, {
    message: 'La condición es obligatoria',
  }),
  quantity: z.coerce.number().int('La cantidad debe ser un número entero').min(1, 'La cantidad debe ser al menos 1'),
  movementType: z.enum(movementTypeValues, {
    message: 'El tipo de movimiento es obligatorio',
  }),
  notes: z.string().optional(),
});

export type InventoryAdjustmentFormData = z.infer<typeof inventoryAdjustmentFormSchema>;
