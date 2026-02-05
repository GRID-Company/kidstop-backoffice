import { z } from 'zod';

export const glassFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  price: z.coerce.number<number>().min(1, 'El precio es obligatorio'),
  sku: z.string().trim().min(1, 'El sku es obligatorio'),
  stock: z.coerce.number<number>(),
  minStock: z.coerce.number<number>().optional(),
  thickness: z.coerce.number<number>().min(1, 'La espesor es obligatorio'),
});

export type GlassForm = z.infer<typeof glassFormSchema>;
