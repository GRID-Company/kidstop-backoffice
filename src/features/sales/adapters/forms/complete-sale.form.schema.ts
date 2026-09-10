import { z } from 'zod';

export const completeSaleFormSchema = z.object({
  notes: z.string().optional(),
});

export type CompleteSaleFormData = z.infer<typeof completeSaleFormSchema>;
