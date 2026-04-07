export interface IGeofenceCoordinate {
  lat: number;
  lng: number;
}

export interface IGeofenceConfig {
  center: IGeofenceCoordinate;
  radiusKm: number;
}

export interface IThresholdConfig {
  uncompletedOrdersLimit: number;
  inventoryLimitPerCard: number;
  purchasePercentage: number;
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

export interface IBudgetBuyer {
  guid: string;
  name: string;
  emailAddress: string;
}

export interface IBudgetConfig {
  guid: string;
  tcg: string;
  assignedAmount: number;
  usedAmount: number;
  utilization: number;
  buyer: IBudgetBuyer;
}

export interface ISettings {
  guid: string;
  geofence: IGeofenceConfig | null;
  thresholds: IThresholdConfig;
  operatingHours: IOperatingHours | null;
  createdDate: string;
  updatedDate: string;
}

export type SettingsSection =
  | 'general'
  | 'budgets';
