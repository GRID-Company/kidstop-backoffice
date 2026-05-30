import { z } from 'zod';

export const resetPasswordFormSchema = z.object({
  emailAddress: z.string().trim().toLowerCase().min(1, 'El correo es obligatorio').email('Correo inválido'),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
