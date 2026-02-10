import { z } from 'zod';

const priceAdjustmentItemSchema = z.object({
  itemId: z.string(),
  publicPrice: z.coerce
    .number()
    .min(0.01, 'El precio público debe ser mayor a 0'),
});

export const priceAdjustmentFormSchema = z.object({
  items: z
    .array(priceAdjustmentItemSchema)
    .min(1, 'Debe haber al menos un item'),
});

export type PriceAdjustmentFormData = z.infer<typeof priceAdjustmentFormSchema>;
export type PriceAdjustmentItemFormData = z.infer<typeof priceAdjustmentItemSchema>;
