import { z } from 'zod';
import { PAYMENT_METHOD } from '../../domain/types';

const paymentMethodValues = Object.values(PAYMENT_METHOD) as [string, ...string[]];

export const paymentFormSchema = z.object({
  method: z.enum(paymentMethodValues, {
    message: 'El método de pago es obligatorio',
  }),
  amount: z.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
