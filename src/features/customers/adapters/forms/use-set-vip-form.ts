import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SetVipFormData, setVipFormSchema } from './set-vip-form.schema';

export function useSetVipForm(defaults?: Partial<SetVipFormData>) {
  return useForm<SetVipFormData>({
    resolver: zodResolver(setVipFormSchema) as Resolver<SetVipFormData>,
    defaultValues: {
      notes: '',
      ...defaults,
    },
    mode: 'all',
  });
}
