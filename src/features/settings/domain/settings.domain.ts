import {
  MIN_GEOFENCE_RADIUS_KM,
  MAX_GEOFENCE_RADIUS_KM,
  MIN_BUDGET_LIMIT,
  MIN_THRESHOLD_VALUE,
} from './constants';
import {
  IBudgetConfig,
  IGeofenceConfig,
  IGeofenceCoordinate,
  IOperatingHoursSlot,
  IThresholdConfig,
} from './types';

export const isValidCoordinate = (coord: IGeofenceCoordinate): boolean => {
  return (
    coord.lat >= -90 &&
    coord.lat <= 90 &&
    coord.lng >= -180 &&
    coord.lng <= 180
  );
};

export const isValidGeofenceConfig = (config: IGeofenceConfig): boolean => {
  if (!isValidCoordinate(config.center)) return false;

  if (
    config.radiusKm < MIN_GEOFENCE_RADIUS_KM ||
    config.radiusKm > MAX_GEOFENCE_RADIUS_KM
  ) {
    return false;
  }

  if (config.polygon.length > 0 && config.polygon.length < 3) return false;

  return config.polygon.every(isValidCoordinate);
};

export const isValidBudgetConfig = (config: IBudgetConfig): boolean => {
  return (
    config.dailyLimit >= MIN_BUDGET_LIMIT &&
    config.weeklyLimit >= config.dailyLimit &&
    config.monthlyLimit >= config.weeklyLimit
  );
};

export const isValidThresholdConfig = (config: IThresholdConfig): boolean => {
  return (
    config.uncompletedOrdersLimit >= MIN_THRESHOLD_VALUE &&
    config.inventoryLimitPerCard >= MIN_THRESHOLD_VALUE
  );
};

export const isValidTimeSlot = (slot: IOperatingHoursSlot): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(slot.open) || !timeRegex.test(slot.close)) return false;
  return slot.open < slot.close;
};
