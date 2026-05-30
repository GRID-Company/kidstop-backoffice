import { z } from 'zod';
import { validatePhoneNumber } from '@/shared/utils/phone-validation';

export const customerFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
  emailAddress: z.string().trim().toLowerCase().min(1, 'El email es obligatorio').email('El email no es válido'),
  phone: z.string().refine(validatePhoneNumber, 'El teléfono debe tener al menos 10 dígitos y ser válido').optional().or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
