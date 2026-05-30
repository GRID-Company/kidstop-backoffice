import { z } from 'zod';
import { MIN_THRESHOLD_VALUE } from '../../domain/constants';

export const thresholdSettingsSchema = z.object({
  uncompletedOrdersLimit: z
    .coerce.number()
    .min(MIN_THRESHOLD_VALUE, `Mínimo ${MIN_THRESHOLD_VALUE}`),
  inventoryLimitPerCard: z
    .coerce.number()
    .min(MIN_THRESHOLD_VALUE, `Mínimo ${MIN_THRESHOLD_VALUE}`),
  purchasePercentage: z
    .coerce.number()
    .min(0, 'Mínimo 0')
    .max(1, 'Máximo 1'),
});

export type ThresholdSettingsFormData = z.infer<typeof thresholdSettingsSchema>;
