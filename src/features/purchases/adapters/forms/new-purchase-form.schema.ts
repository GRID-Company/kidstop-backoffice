import { z } from 'zod';
import { CardCondition } from '../../domain/types';

const newPurchaseItemSchema = z.object({
  guid: z.string(),
  cardGuid: z.string(),
  cardName: z.string(),
  cardImageUrl: z.string(),
  setName: z.string(),
  setCode: z.string(),
  tcgType: z.enum(['POKEMON', 'MAGIC']),
  condition: z.enum(['NEAR_MINT', 'LIGHTLY_PLAYED', 'MODERATELY_PLAYED', 'HEAVILY_PLAYED', 'DAMAGED'] as const),
  quantity: z.number().int().min(1, 'Cantidad debe ser mayor a 0'),
  offerPrice: z.number().min(0, 'Precio debe ser mayor o igual a 0'),
  referencePrice: z.number().optional(),
  currentReferencePrice: z.number().optional(),
  sellPrice: z.number().optional(),
});

export const newPurchaseFormSchema = z.object({
  items: z.array(newPurchaseItemSchema).min(1, 'Debe agregar al menos una carta'),
});

export type NewPurchaseFormData = z.infer<typeof newPurchaseFormSchema>;
export type NewPurchaseItemData = z.infer<typeof newPurchaseItemSchema>;
