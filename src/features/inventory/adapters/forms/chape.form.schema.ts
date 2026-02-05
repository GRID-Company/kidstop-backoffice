import { z } from 'zod';

export const chapeFormSchema = z.object({
  color: z.string().trim().min(1, 'El nombre es obligatorio'),
  line: z.string().trim().min(1, 'La linea es obligatoria'),
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  price: z.coerce.number<number>().min(1, 'El precio es obligatorio'),
  sku: z.string().trim().min(1, 'El sku es obligatorio'),
  stock: z.coerce.number<number>(),
  supplier: z.string().trim().min(1, 'El proveedor es obligatorio'),
  minStock: z.coerce.number<number>().optional(),
  unitMeasure: z.string().trim().min(1, 'La unidad de medida es obligatoria'),
});

export type ChapeForm = z.infer<typeof chapeFormSchema>;
