import { IGeofenceConfig, IOperatingHours, IThresholdConfig, SettingsSection } from './types';

export const SETTINGS_SECTIONS: Record<SettingsSection, string> = {
  general: 'General',
  budgets: 'Presupuestos',
};

export const DEFAULT_GEOFENCE_CONFIG: IGeofenceConfig = {
  enabled: false,
  center: { lat: 0, lng: 0 },
  radiusKm: 5,
  polygon: [],
};

export const DEFAULT_THRESHOLDS: IThresholdConfig = {
  uncompletedOrdersLimit: 3,
  inventoryLimitPerCard: 20,
};

export const DEFAULT_OPERATING_HOURS: IOperatingHours = {
  monday: { open: '10:00', close: '20:00' },
  tuesday: { open: '10:00', close: '20:00' },
  wednesday: { open: '10:00', close: '20:00' },
  thursday: { open: '10:00', close: '20:00' },
  friday: { open: '10:00', close: '20:00' },
  saturday: { open: '10:00', close: '20:00' },
  sunday: null,
};

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DAYS_OF_WEEK_LABELS: Record<(typeof DAYS_OF_WEEK)[number], string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const MIN_GEOFENCE_RADIUS_KM = 0.1;
export const MAX_GEOFENCE_RADIUS_KM = 50;
export const MIN_BUDGET_LIMIT = 0;
export const MIN_THRESHOLD_VALUE = 1;
