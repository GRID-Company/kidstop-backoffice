import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormData, budgetFormSchema } from './budget-settings.schema';

export function useBudgetForm(defaults?: Partial<BudgetFormData>) {
  return useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema) as Resolver<BudgetFormData>,
    defaultValues: {
      buyerGuid: '',
      tcg: 'POKEMON',
      assignedAmount: 0,
      ...defaults,
    },
    mode: 'all',
  });
}
