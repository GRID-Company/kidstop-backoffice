import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_OPERATING_HOURS } from '../../domain/constants';
import {
  OperatingHoursSettingsFormData,
  operatingHoursSettingsSchema,
} from './operating-hours-settings.schema';

export function useOperatingHoursForm(
  defaults?: Partial<OperatingHoursSettingsFormData>
) {
  return useForm<OperatingHoursSettingsFormData>({
    resolver: zodResolver(operatingHoursSettingsSchema),
    defaultValues: {
      ...DEFAULT_OPERATING_HOURS,
      ...defaults,
    },
    mode: 'all',
  });
}
