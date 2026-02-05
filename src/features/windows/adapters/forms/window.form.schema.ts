import { z } from 'zod';

export const windowFormSchema = z.object({
  categoryType: z.string().trim().min(1, 'El tipo de categoria es obligatorio'),
  windowComplexity: z.string().min(1, 'El tipo de categoria es obligatorio'),
  description: z.string().trim().min(1, 'La descripcion es obligatoria'),
  hasMosquitoNet: z.boolean(),
  glassInventoryItemGuid: z
    .string()
    .trim()
    .min(1, 'El guid del inventario es obligatorio'),
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  sampleImages: z.array(
    z.object({
      path: z.string(),
      guid: z.string(),
      name: z.string(),
    })
  ),
  technicalImage: z
    .object({
      path: z.string(),
      guid: z.string(),
      name: z.string(),
    })
    .nullable(),
  subWindows: z.array(
    z.object({
      projectionQuantity: z.coerce.number<number>().optional(),
      windowType: z.string(),
    })
  ),
  horizontalProfiles: z.array(
    z.object({
      inventoryItemSKU: z.string(),
      quantity: z.coerce.number<number>(),
      size: z.coerce.number<number>(),
      subWindow: z.string(),
    })
  ),
  verticalProfiles: z.array(
    z.object({
      inventoryItemSKU: z.string(),
      quantity: z.coerce.number<number>(),
      size: z.coerce.number<number>(),
      subWindow: z.string(),
    })
  ),
  chapeWindows: z.array(
    z.object({
      chapeInventoryItemGuid: z.string(),
      quantity: z.coerce.number<number>(),
      subWindow: z.string(),
    })
  ),
});

export type WindowForm = z.infer<typeof windowFormSchema>;
