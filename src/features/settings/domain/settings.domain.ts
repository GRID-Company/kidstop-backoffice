import {
  MIN_GEOFENCE_RADIUS_KM,
  MAX_GEOFENCE_RADIUS_KM,
  MIN_THRESHOLD_VALUE,
} from './constants';
import {
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

  return (
    config.radiusKm >= MIN_GEOFENCE_RADIUS_KM &&
    config.radiusKm <= MAX_GEOFENCE_RADIUS_KM
  );
};

export const isValidThresholdConfig = (config: IThresholdConfig): boolean => {
  return (
    config.uncompletedOrdersLimit >= MIN_THRESHOLD_VALUE &&
    config.inventoryLimitPerCard >= MIN_THRESHOLD_VALUE &&
    config.purchasePercentage >= 0 &&
    config.purchasePercentage <= 1
  );
};

export const isValidTimeSlot = (slot: IOperatingHoursSlot): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(slot.open) || !timeRegex.test(slot.close)) return false;
  return slot.open < slot.close;
};
