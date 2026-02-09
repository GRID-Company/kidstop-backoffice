import { z } from 'zod';
import { CUSTOMER_TYPES } from '../../domain/constants';

const customerTypeValues = Object.values(CUSTOMER_TYPES) as [string, ...string[]];

export const customerFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().min(1, 'El email es obligatorio').email('El email no es válido'),
  phone: z.string().max(20, 'El teléfono no puede exceder 20 caracteres').optional().or(z.literal('')),
  type: z.enum(customerTypeValues, {
    message: 'El tipo de cliente es obligatorio',
  }),
  notes: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional().or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
