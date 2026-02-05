import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChapeForm, chapeFormSchema } from './chape.form.schema';

export function useChapeForm(defaults?: Partial<ChapeForm>) {
  return useForm<ChapeForm>({
    resolver: zodResolver(chapeFormSchema),
    defaultValues: {
      name: '',
      ...defaults,
    },
    mode: 'onSubmit',
  });
}
