import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ResetPasswordForm,
  resetPasswordFormSchema,
} from './reset-password-form.schema';

export function useResetPasswordForm(defaults?: Partial<ResetPasswordForm>) {
  return useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      emailAddress: '',
      ...defaults,
    },
    mode: 'all',
  });
}
