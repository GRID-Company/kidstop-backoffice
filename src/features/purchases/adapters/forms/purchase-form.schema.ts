import { z } from 'zod';
import { CARD_CONDITIONS } from '../../domain/constants';
import { PURCHASE_STATUS, PAYMENT_METHOD } from '../../domain/types';

const cardConditionValues = Object.values(CARD_CONDITIONS) as [string, ...string[]];
const paymentMethodValues = Object.values(PAYMENT_METHOD) as [string, ...string[]];

const purchaseItemSchema = z.object({
  cardId: z.string().min(1, 'La carta es obligatoria'),
  cardName: z.string().min(1, 'El nombre es obligatorio'),
  cardImageUrl: z.string(),
  setName: z.string(),
  setCode: z.string(),
  condition: z.enum(cardConditionValues, {
    message: 'La condición es obligatoria',
  }),
  quantity: z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
  unitBuyPrice: z.coerce.number().min(0, 'El precio de compra debe ser mayor o igual a 0'),
  unitSellPrice: z.coerce.number().min(0, 'El precio de venta debe ser mayor o igual a 0'),
});

const paymentDetailSchema = z.object({
  method: z.enum(paymentMethodValues, {
    message: 'El método de pago es obligatorio',
  }),
  amount: z.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
});

export const purchaseFormSchema = z.object({
  sellerId: z.string().min(1, 'El vendedor es obligatorio'),
  items: z.array(purchaseItemSchema).min(1, 'Debe agregar al menos una carta'),
  payments: z.array(paymentDetailSchema),
  notes: z.string().optional(),
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
export type PurchaseItemFormData = z.infer<typeof purchaseItemSchema>;
export type PaymentDetailFormData = z.infer<typeof paymentDetailSchema>;
