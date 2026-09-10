import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SellerFormData, sellerFormSchema } from './seller-form.schema';

export function useSellerForm(defaults?: Partial<SellerFormData>) {
  return useForm<SellerFormData>({
    resolver: zodResolver(sellerFormSchema) as Resolver<SellerFormData>,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      notes: '',
      ...defaults,
    },
    mode: 'all',
  });
}
