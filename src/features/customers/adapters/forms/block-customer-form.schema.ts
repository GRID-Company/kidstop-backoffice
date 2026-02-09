import { z } from 'zod';

export const blockCustomerFormSchema = z.object({
  reason: z
    .string()
    .min(1, 'La razón de bloqueo es obligatoria')
    .max(500, 'La razón no puede exceder 500 caracteres'),
});

export type BlockCustomerFormData = z.infer<typeof blockCustomerFormSchema>;
