import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { USER_ROLES } from '../../domain/constants';
import { UserFormData, userFormSchema } from './user-form.schema';

export function useUserForm(defaults?: Partial<UserFormData>, isEditing = false) {
  return useForm<UserFormData>({
    resolver: zodResolver(userFormSchema(isEditing)),
    defaultValues: {
      name: '',
      emailAddress: '',
      role: USER_ROLES.RECEPTION,
      password: '',
      ...defaults,
    },
    mode: 'all',
  });
}
