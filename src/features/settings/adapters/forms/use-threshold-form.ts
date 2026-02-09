import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_THRESHOLDS } from '../../domain/constants';
import {
  ThresholdSettingsFormData,
  thresholdSettingsSchema,
} from './threshold-settings.schema';

export function useThresholdForm(defaults?: Partial<ThresholdSettingsFormData>) {
  return useForm<ThresholdSettingsFormData>({
    resolver: zodResolver(thresholdSettingsSchema),
    defaultValues: {
      uncompletedOrdersLimit: DEFAULT_THRESHOLDS.uncompletedOrdersLimit,
      inventoryLimitPerCard: DEFAULT_THRESHOLDS.inventoryLimitPerCard,
      ...defaults,
    },
    mode: 'all',
  });
}
