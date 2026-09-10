import { z } from 'zod';

export const budgetFormSchema = z.object({
  buyerGuid: z.string().min(1, 'El comprador es obligatorio'),
  tcg: z.enum(['POKEMON', 'MAGIC'], { message: 'El TCG es obligatorio' }),
  assignedAmount: z.coerce
    .number()
    .min(0, 'El monto debe ser mayor o igual a 0'),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;
