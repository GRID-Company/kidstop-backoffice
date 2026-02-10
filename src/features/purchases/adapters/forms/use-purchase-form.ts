import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PurchaseFormData, purchaseFormSchema } from './purchase-form.schema';

export function usePurchaseForm(defaults?: Partial<PurchaseFormData>) {
  return useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema) as Resolver<PurchaseFormData>,
    defaultValues: {
      sellerId: '',
      items: [],
      payments: [],
      notes: '',
      ...defaults,
    },
    mode: 'all',
  });
}
