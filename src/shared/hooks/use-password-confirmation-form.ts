import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PasswordConfirmationForm,
  passwordConfirmationSchema,
} from '../schemas/password-confirmation.schema';

export function usePasswordConfirmationForm(
  defaults?: Partial<PasswordConfirmationForm>
) {
  return useForm<PasswordConfirmationForm>({
    resolver: zodResolver(passwordConfirmationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      ...defaults,
    },
    mode: 'all',
  });
}
