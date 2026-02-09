import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CUSTOMER_TYPES } from '../../domain/constants';
import { CustomerFormData, customerFormSchema } from './customer-form.schema';

export function useCustomerForm(defaults?: Partial<CustomerFormData>) {
  return useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema) as Resolver<CustomerFormData>,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      type: CUSTOMER_TYPES.REGULAR,
      notes: '',
      ...defaults,
    },
    mode: 'all',
  });
}
