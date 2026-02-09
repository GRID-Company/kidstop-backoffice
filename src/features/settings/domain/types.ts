export interface IGeofenceCoordinate {
  lat: number;
  lng: number;
}

export interface IGeofenceConfig {
  enabled: boolean;
  center: IGeofenceCoordinate;
  radiusKm: number;
  polygon: IGeofenceCoordinate[];
}

export interface IBudgetConfig {
  buyerGuid: string;
  buyerName: string;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
}

export interface IThresholdConfig {
  uncompletedOrdersLimit: number;
  inventoryLimitPerCard: number;
}

export interface IOperatingHoursSlot {
  open: string;
  close: string;
}

export interface IOperatingHours {
  monday: IOperatingHoursSlot | null;
  tuesday: IOperatingHoursSlot | null;
  wednesday: IOperatingHoursSlot | null;
  thursday: IOperatingHoursSlot | null;
  friday: IOperatingHoursSlot | null;
  saturday: IOperatingHoursSlot | null;
  sunday: IOperatingHoursSlot | null;
}

export type DayOfWeek = keyof IOperatingHours;

export interface ISettings {
  id: string;
  geofence: IGeofenceConfig;
  budgets: IBudgetConfig[];
  thresholds: IThresholdConfig;
  operatingHours: IOperatingHours;
  updatedAt: string;
}

export interface ISettingsFilters {
  section?: SettingsSection;
}

export type SettingsSection =
  | 'geofence'
  | 'budgets'
  | 'thresholds'
  | 'operating-hours';
