import { z } from 'zod';

export const loginFormSchema = z.object({
  emailAddress: z.string().min(1, 'El correo es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
