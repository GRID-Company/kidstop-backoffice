import { z } from 'zod';
import { MIN_BUDGET_LIMIT } from '../../domain/constants';

export const budgetItemSchema = z
  .object({
    buyerGuid: z.string().min(1, 'El comprador es obligatorio'),
    buyerName: z.string().min(1, 'El nombre es obligatorio'),
    dailyLimit: z.number().min(MIN_BUDGET_LIMIT, 'Debe ser mayor o igual a 0'),
    weeklyLimit: z.number().min(MIN_BUDGET_LIMIT, 'Debe ser mayor o igual a 0'),
    monthlyLimit: z.number().min(MIN_BUDGET_LIMIT, 'Debe ser mayor o igual a 0'),
  })
  .refine((data) => data.weeklyLimit >= data.dailyLimit, {
    message: 'El límite semanal debe ser mayor o igual al diario',
    path: ['weeklyLimit'],
  })
  .refine((data) => data.monthlyLimit >= data.weeklyLimit, {
    message: 'El límite mensual debe ser mayor o igual al semanal',
    path: ['monthlyLimit'],
  });

export const budgetSettingsSchema = z.object({
  budgets: z.array(budgetItemSchema),
});

export type BudgetItemFormData = z.infer<typeof budgetItemSchema>;
export type BudgetSettingsFormData = z.infer<typeof budgetSettingsSchema>;
