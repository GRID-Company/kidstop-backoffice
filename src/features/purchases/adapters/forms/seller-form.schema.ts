import { z } from 'zod';
import { validatePhoneNumber } from '@/shared/utils/phone-validation';

export const sellerFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z
    .string()
    .refine(validatePhoneNumber, 'El teléfono debe tener al menos 10 dígitos y ser válido'),
  email: z.string().trim().toLowerCase().email('Email inválido').optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export type SellerFormData = z.infer<typeof sellerFormSchema>;
