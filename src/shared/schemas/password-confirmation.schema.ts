import { z } from 'zod';
import { SHARED_VALIDATION_MESSAGES } from '@/lib/consts/validation-messages';

export const passwordConfirmationSchema = z
  .object({
    password: z.string().min(1, SHARED_VALIDATION_MESSAGES.REQUIRED_PASSWORD),
    confirmPassword: z
      .string()
      .min(1, SHARED_VALIDATION_MESSAGES.REQUIRED_CONFIRM_PASSWORD),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: SHARED_VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH,
    path: ['confirmPassword'],
  });

export type PasswordConfirmationForm = z.infer<
  typeof passwordConfirmationSchema
>;
