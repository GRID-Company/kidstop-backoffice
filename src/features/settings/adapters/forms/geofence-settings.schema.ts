import { z } from 'zod';
import {
  MIN_GEOFENCE_RADIUS_KM,
  MAX_GEOFENCE_RADIUS_KM,
} from '../../domain/constants';

const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const geofenceSettingsSchema = z.object({
  enabled: z.boolean(),
  center: coordinateSchema,
  radiusKm: z
    .number()
    .min(MIN_GEOFENCE_RADIUS_KM, `Mínimo ${MIN_GEOFENCE_RADIUS_KM} km`)
    .max(MAX_GEOFENCE_RADIUS_KM, `Máximo ${MAX_GEOFENCE_RADIUS_KM} km`),
});

export type GeofenceSettingsFormData = z.infer<typeof geofenceSettingsSchema>;
