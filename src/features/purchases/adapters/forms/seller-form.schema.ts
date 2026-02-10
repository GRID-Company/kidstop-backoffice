import { z } from 'zod';

export const sellerFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .regex(/^\+?[0-9\s-]+$/, 'Formato de teléfono inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

export type SellerFormData = z.infer<typeof sellerFormSchema>;
