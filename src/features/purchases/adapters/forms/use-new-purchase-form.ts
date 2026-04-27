import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPurchaseFormSchema, NewPurchaseFormData } from './new-purchase-form.schema';

export type { NewPurchaseFormData };

export function useNewPurchaseForm() {
  const form = useForm<NewPurchaseFormData>({
    resolver: zodResolver(newPurchaseFormSchema) as Resolver<NewPurchaseFormData>,
    defaultValues: {
      items: [],
    },
    mode: 'all',
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'items',
  });

  return { form, fieldArray };
}
