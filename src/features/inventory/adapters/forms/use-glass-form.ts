import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlassForm, glassFormSchema } from './glass.form.schema';

export function useGlassForm(defaults?: Partial<GlassForm>) {
  return useForm<GlassForm>({
    resolver: zodResolver(glassFormSchema),
    defaultValues: {
      name: '',
      ...defaults,
    },
    mode: 'onSubmit',
  });
}
