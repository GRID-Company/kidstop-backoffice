import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { USER_ROLES } from '../../domain/constants';
import { UserFormData, userFormSchema } from './user-form.schema';

export function useUserForm(defaults?: Partial<UserFormData>) {
  return useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      emailAddress: '',
      role: USER_ROLES.RECEPTION,
      activated: true,
      ...defaults,
    },
    mode: 'all',
  });
}
