import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
  emailAddress: z.string().trim().toLowerCase().min(1, 'El email es obligatorio').email('El email no es válido'),
  phone: z.string().max(20, 'El teléfono no puede exceder 20 caracteres').optional().or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
