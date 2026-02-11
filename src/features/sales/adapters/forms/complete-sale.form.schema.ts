import { z } from 'zod';
import { SALE_STATUS } from '../../domain/types';

const completableStatuses = [
  SALE_STATUS.NEW,
  SALE_STATUS.IN_PROGRESS,
  SALE_STATUS.READY_FOR_PICKUP,
] as const;

const saleItemVerificationSchema = z.object({
  itemId: z.string().min(1),
  verified: z.boolean(),
});

export const completeSaleFormSchema = z.object({
  saleId: z.string().min(1, 'El ID de la venta es obligatorio'),
  status: z.enum(
    completableStatuses.map((s) => s) as [string, ...string[]],
    { message: 'El estado no permite completar la venta' }
  ),
  verifiedItems: z
    .array(saleItemVerificationSchema)
    .min(1, 'Debe verificar al menos un item'),
  notes: z.string().optional(),
});

export type CompleteSaleFormData = z.infer<typeof completeSaleFormSchema>;
export type SaleItemVerificationData = z.infer<typeof saleItemVerificationSchema>;
