import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginForm, loginFormSchema } from './login-form.schema';

export function useLoginForm(defaults?: Partial<LoginForm>) {
  return useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
      ...defaults,
    },
    mode: 'all',
  });
}
