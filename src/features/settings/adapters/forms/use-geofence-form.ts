import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_GEOFENCE_CONFIG } from '../../domain/constants';
import {
  GeofenceSettingsFormData,
  geofenceSettingsSchema,
} from './geofence-settings.schema';

export function useGeofenceForm(defaults?: Partial<GeofenceSettingsFormData>) {
  return useForm<GeofenceSettingsFormData>({
    resolver: zodResolver(geofenceSettingsSchema),
    defaultValues: {
      enabled: DEFAULT_GEOFENCE_CONFIG.enabled,
      center: DEFAULT_GEOFENCE_CONFIG.center,
      radiusKm: DEFAULT_GEOFENCE_CONFIG.radiusKm,
      ...defaults,
    },
    mode: 'all',
  });
}
