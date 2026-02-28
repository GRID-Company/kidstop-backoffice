import { z } from 'zod';

export const resetPasswordFormSchema = z.object({
  emailAddress: z.string().min(1, 'El correo es obligatorio'),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
