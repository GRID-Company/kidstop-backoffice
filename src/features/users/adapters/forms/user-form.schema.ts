import { z } from 'zod';
import { USER_ROLES } from '../../domain/constants';

const userRoleValues = Object.values(USER_ROLES) as [string, ...string[]];

export const userFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  emailAddress: z
    .string()
    .trim()
    .min(1, 'El email es obligatorio')
    .email('El email no es válido'),
  role: z.enum(userRoleValues, {
    message: 'El rol es obligatorio',
  }),
});

export type UserFormData = z.infer<typeof userFormSchema>;
