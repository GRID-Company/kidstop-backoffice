import { z } from 'zod';
import { MIN_THRESHOLD_VALUE } from '../../domain/constants';

export const thresholdSettingsSchema = z.object({
  uncompletedOrdersLimit: z
    .number()
    .min(MIN_THRESHOLD_VALUE, `Mínimo ${MIN_THRESHOLD_VALUE}`),
  inventoryLimitPerCard: z
    .number()
    .min(MIN_THRESHOLD_VALUE, `Mínimo ${MIN_THRESHOLD_VALUE}`),
});

export type ThresholdSettingsFormData = z.infer<typeof thresholdSettingsSchema>;
