import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CompleteSaleFormData,
  completeSaleFormSchema,
} from './complete-sale.form.schema';

export function useCompleteSaleForm(defaults?: Partial<CompleteSaleFormData>) {
  return useForm<CompleteSaleFormData>({
    resolver: zodResolver(completeSaleFormSchema) as Resolver<CompleteSaleFormData>,
    defaultValues: {
      saleId: '',
      status: '',
      verifiedItems: [],
      notes: '',
      ...defaults,
    },
    mode: 'all',
  });
}
