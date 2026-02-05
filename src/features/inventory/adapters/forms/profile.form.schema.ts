import { z } from 'zod';

export const profileFormSchema = z.object({
  color: z.string().trim().min(1, 'El nombre es obligatorio'),
  line: z.string().trim().min(1, 'La linea es obligatoria'),
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  price: z.coerce.number<number>().min(1, 'El precio es obligatorio'),
  size: z.coerce.number<number>().min(1, 'El tamaño es obligatorio'),
  sku: z.string().trim().min(1, 'El sku es obligatorio'),
  stock: z.coerce.number<number>(),
  supplier: z.string().trim().min(1, 'El proveedor es obligatorio'),
  minStock: z.coerce.number<number>().optional(),
});

export type ProfileForm = z.infer<typeof profileFormSchema>;
