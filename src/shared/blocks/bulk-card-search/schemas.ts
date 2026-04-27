import { z } from 'zod';
import { CARD_CONDITIONS } from '@/lib/types/card.types';

const cardConditionEnum = z.enum([
  CARD_CONDITIONS.NEAR_MINT,
  CARD_CONDITIONS.LIGHTLY_PLAYED,
  CARD_CONDITIONS.MODERATELY_PLAYED,
  CARD_CONDITIONS.HEAVILY_PLAYED,
  CARD_CONDITIONS.DAMAGED,
]);

export const bulkCardFormSchemaPurchases = z.object({
  selectedCardGuid: z.string().min(1, 'Debe seleccionar una carta'),
  condition: cardConditionEnum,
  quantity: z.number().min(1, 'La cantidad debe ser al menos 1').int('La cantidad debe ser un número entero'),
  offerPrice: z.number().min(0, 'El precio de oferta debe ser mayor o igual a 0'),
});

export const bulkCardFormSchemaInventory = z.object({
  selectedCardGuid: z.string().min(1, 'Debe seleccionar una carta'),
  condition: cardConditionEnum,
  quantity: z.number().min(1, 'La cantidad debe ser al menos 1').int('La cantidad debe ser un número entero'),
  publicPrice: z.number().min(0, 'El precio público debe ser mayor o igual a 0'),
});

export const bulkSearchFormSchemaPurchases = z.object({
  searchText: z.string().min(1, 'Debe ingresar una lista de cartas'),
  cards: z.array(bulkCardFormSchemaPurchases).min(1, 'Debe configurar al menos una carta'),
});

export const bulkSearchFormSchemaInventory = z.object({
  searchText: z.string().min(1, 'Debe ingresar una lista de cartas'),
  cards: z.array(bulkCardFormSchemaInventory).min(1, 'Debe configurar al menos una carta'),
});

export type BulkCardFormDataPurchases = z.infer<typeof bulkCardFormSchemaPurchases>;
export type BulkCardFormDataInventory = z.infer<typeof bulkCardFormSchemaInventory>;
export type BulkSearchFormDataPurchases = z.infer<typeof bulkSearchFormSchemaPurchases>;
export type BulkSearchFormDataInventory = z.infer<typeof bulkSearchFormSchemaInventory>;
