import { z } from 'zod';
import { SHARED_VALIDATION_MESSAGES } from '@/lib/consts/validation-messages';
import { PASSWORD_VALIDATION } from '@/lib/consts/password-validation';

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_VALIDATION.MIN_LENGTH,
    PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_LENGTH
  )
  .max(
    PASSWORD_VALIDATION.MAX_LENGTH,
    PASSWORD_VALIDATION.ERROR_MESSAGES.MAX_LENGTH
  )
  .regex(PASSWORD_VALIDATION.REGEX, PASSWORD_VALIDATION.ERROR_MESSAGES.PATTERN);

export const passwordConfirmationSchema = z
  .object({
    password: passwordSchema,
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
