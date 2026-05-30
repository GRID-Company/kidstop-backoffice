import { z } from 'zod';
import { CARD_CONDITIONS, MIN_PRICE } from '../../domain/constants';

const cardConditionValues = Object.values(CARD_CONDITIONS) as [string, ...string[]];

export const cardPriceFormSchema = z
  .object({
    condition: z.enum(cardConditionValues, {
      message: 'La condición es obligatoria',
    }),
    buyPrice: z.coerce
      .number()
      .refine(val => val === 0 || val >= MIN_PRICE, {
        message: 'El precio de compra debe ser mayor o igual a 0',
      }),
    sellPrice: z.coerce
      .number()
      .refine(val => val === 0 || val >= MIN_PRICE, {
        message: 'El precio de venta debe ser mayor o igual a 0',
      }),
  })
  .refine((data) => data.sellPrice >= data.buyPrice, {
    message: 'El precio de venta debe ser mayor o igual al precio de compra',
    path: ['sellPrice'],
  });

export type CardPriceFormData = z.infer<typeof cardPriceFormSchema>;
