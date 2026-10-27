import { z } from 'zod';
import { USER_ROLES } from '../../domain/constants';
import { passwordSchema } from '@/shared/schemas/password-confirmation.schema';
import { SHARED_VALIDATION_MESSAGES } from '@/lib/consts/validation-messages';

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
    .superRefine((data, ctx) => {
      if (isEditing || data.role !== USER_ROLES.CLIENT_KIOSK) return;

      if (!data.password) {
        ctx.addIssue({
          code: 'custom',
          message: SHARED_VALIDATION_MESSAGES.REQUIRED_PASSWORD,
          path: ['password'],
        });
        return;
      }

      for (const issue of passwordSchema.safeParse(data.password).error
        ?.issues ?? []) {
        ctx.addIssue({ ...issue, path: ['password'] });
      }
    });

export type UserFormData = z.infer<ReturnType<typeof userFormSchema>>;
