import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileForm, profileFormSchema } from './profile.form.schema';

export function useProfileForm(defaults?: Partial<ProfileForm>) {
  return useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      ...defaults,
    },
    mode: 'all',
  });
}
