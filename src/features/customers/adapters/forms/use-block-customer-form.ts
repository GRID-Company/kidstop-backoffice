import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BlockCustomerFormData,
  blockCustomerFormSchema,
} from './block-customer-form.schema';

export function useBlockCustomerForm(defaults?: Partial<BlockCustomerFormData>) {
  return useForm<BlockCustomerFormData>({
    resolver: zodResolver(blockCustomerFormSchema) as Resolver<BlockCustomerFormData>,
    defaultValues: {
      reason: '',
      ...defaults,
    },
    mode: 'all',
  });
}
