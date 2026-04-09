import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CompleteSaleFormData,
  completeSaleFormSchema,
} from './complete-sale.form.schema';

export function useCompleteSaleForm() {
  return useForm<CompleteSaleFormData>({
    resolver: zodResolver(completeSaleFormSchema),
    defaultValues: {
      notes: '',
    },
    mode: 'all',
  });
}
