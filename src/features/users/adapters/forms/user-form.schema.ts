import { z } from 'zod';
import { USER_ROLES } from '../../domain/constants';

const userRoleValues = Object.values(USER_ROLES) as [string, ...string[]];

export const userFormSchema = (isEditing = false) =>
  z
    .object({
      name: z.string().trim().min(1, 'El nombre es obligatorio'),
      emailAddress: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, 'El email es obligatorio')
        .email('El email no es válido'),
      role: z.enum(userRoleValues, {
        message: 'El rol es obligatorio',
      }),
      password: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!isEditing && data.role === USER_ROLES.CLIENT_KIOSK) {
          return data.password && data.password.length >= 6;
        }
        return true;
      },
      {
        message: 'La contraseña es obligatoria para usuarios kiosk (mínimo 6 caracteres)',
        path: ['password'],
      }
    );

export type UserFormData = z.infer<ReturnType<typeof userFormSchema>>;
