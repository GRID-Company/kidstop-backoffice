import { z } from 'zod';

const MIN_PRICE = 0;
const MIN_QUANTITY = 1;

export const offerPriceSchema = z.coerce
  .number()
  .refine(val => val === 0 || val >= MIN_PRICE, {
    message: 'El precio de oferta debe ser mayor o igual a 0',
  });

export const quantitySchema = z.coerce
  .number()
  .int()
  .refine(val => val >= 0, {
    message: 'La cantidad debe ser mayor o igual a 0',
  });

export type OfferPriceValue = z.infer<typeof offerPriceSchema>;
export type QuantityValue = z.infer<typeof quantitySchema>;

export function validateOfferPrice(value: string): { isValid: boolean; price: number } {
  try {
    const result = offerPriceSchema.parse(value);
    return { isValid: true, price: result };
  } catch {
    return { isValid: false, price: 0 };
  }
}

export function validateQuantity(value: string): { isValid: boolean; quantity: number } {
  try {
    const result = quantitySchema.parse(value);
    return { isValid: true, quantity: result };
  } catch {
    return { isValid: false, quantity: 0 };
  }
}
