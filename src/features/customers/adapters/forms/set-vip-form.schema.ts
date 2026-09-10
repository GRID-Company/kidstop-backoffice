import { z } from 'zod';

export const setVipFormSchema = z.object({
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional()
    .default(''),
});

export type SetVipFormData = z.infer<typeof setVipFormSchema>;
