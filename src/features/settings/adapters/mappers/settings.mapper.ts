import { GlobalConfigQuery } from '@/lib/api/generated/settings.generated';
import { TimePeriod } from '@/lib/api/schema-types';
import {
  DEFAULT_GEOFENCE_CONFIG,
  DEFAULT_OPERATING_HOURS,
  DEFAULT_THRESHOLDS,
} from '../../domain/constants';
import {
  IGeofenceConfig,
  IOperatingHours,
  IOperatingHoursSlot,
  ISettings,
  IThresholdConfig,
} from '../../domain/types';

type ApiTime = {
  hour: number | null;
  minute: number | null;
  period: TimePeriod | null;
} | null;

type ApiDaySchedule = {
  opening: ApiTime;
  closing: ApiTime;
} | null;

function apiTimeTo24h(time: NonNullable<ApiTime>): string {
  const h = time.hour ?? 12;
  const m = time.minute ?? 0;
  const period = time.period;
  let hour24: number;

  if (period === TimePeriod.Am) {
    hour24 = h === 12 ? 0 : h;
  } else {
    hour24 = h === 12 ? 12 : h + 12;
  }

  return `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function time24hToApiTime(time24h: string): {
  hour: number;
  minute: number;
  period: TimePeriod;
} {
  const [hStr, mStr] = time24h.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);

  if (h === 0) return { hour: 12, minute: m, period: TimePeriod.Am };
  if (h < 12) return { hour: h, minute: m, period: TimePeriod.Am };
  if (h === 12) return { hour: 12, minute: m, period: TimePeriod.Pm };
  return { hour: h - 12, minute: m, period: TimePeriod.Pm };
}

function apiDayToSlot(day: ApiDaySchedule): IOperatingHoursSlot | null {
  if (!day || !day.opening || !day.closing) return null;
  return {
    open: apiTimeTo24h(day.opening),
    close: apiTimeTo24h(day.closing),
  };
}

export function fromApiToGeofence(
  api: GlobalConfigQuery['globalConfig']['config']['geofence']
): IGeofenceConfig {
  if (!api) return DEFAULT_GEOFENCE_CONFIG;
  return {
    center: {
      lat: api.latitude ?? 0,
      lng: api.longitude ?? 0,
    },
    radiusKm: (api.radius ?? 0) / 1000,
  };
}

export function fromApiToThresholds(
  config: GlobalConfigQuery['globalConfig']['config']
): IThresholdConfig {
  return {
    uncompletedOrdersLimit: config.saleCancellationBlockThreshold ?? DEFAULT_THRESHOLDS.uncompletedOrdersLimit,
    inventoryLimitPerCard: config.inventoryLimit ?? DEFAULT_THRESHOLDS.inventoryLimitPerCard,
    purchasePercentage: config.purchasePercentage ?? DEFAULT_THRESHOLDS.purchasePercentage,
  };
}

export function fromApiToOperatingHours(
  schedule: GlobalConfigQuery['globalConfig']['config']['operationSchedule']
): IOperatingHours {
  if (!schedule) return DEFAULT_OPERATING_HOURS;
  return {
    monday: apiDayToSlot(schedule.monday),
    tuesday: apiDayToSlot(schedule.tuesday),
    wednesday: apiDayToSlot(schedule.wednesday),
    thursday: apiDayToSlot(schedule.thursday),
    friday: apiDayToSlot(schedule.friday),
    saturday: apiDayToSlot(schedule.saturday),
    sunday: apiDayToSlot(schedule.sunday),
  };
}

export function fromApiToSettings(
  api: GlobalConfigQuery['globalConfig']
): ISettings {
  return {
    guid: api.guid,
    geofence: fromApiToGeofence(api.config.geofence),
    thresholds: fromApiToThresholds(api.config),
    operatingHours: fromApiToOperatingHours(api.config.operationSchedule),
    createdDate: String(api.createdDate),
    updatedDate: String(api.updatedDate),
  };
}

export function toGeofenceMutationInput(geofence: IGeofenceConfig) {
  return {
    geofence: {
      latitude: geofence.center.lat,
      longitude: geofence.center.lng,
      radius: Math.round(geofence.radiusKm * 1000),
    },
  };
}

export function toThresholdsMutationInput(thresholds: IThresholdConfig) {
  return {
    inventoryLimit: thresholds.inventoryLimitPerCard,
    saleCancellationBlockThreshold: thresholds.uncompletedOrdersLimit,
    purchasePercentage: thresholds.purchasePercentage,
  };
}

function slotToApiDay(slot: IOperatingHoursSlot) {
  return {
    opening: time24hToApiTime(slot.open),
    closing: time24hToApiTime(slot.close),
  };
}

export function toOperatingHoursMutationInput(operatingHours: IOperatingHours) {
  return {
    operationSchedule: {
      monday: operatingHours.monday ? slotToApiDay(operatingHours.monday) : null,
      tuesday: operatingHours.tuesday ? slotToApiDay(operatingHours.tuesday) : null,
      wednesday: operatingHours.wednesday ? slotToApiDay(operatingHours.wednesday) : null,
      thursday: operatingHours.thursday ? slotToApiDay(operatingHours.thursday) : null,
      friday: operatingHours.friday ? slotToApiDay(operatingHours.friday) : null,
      saturday: operatingHours.saturday ? slotToApiDay(operatingHours.saturday) : null,
      sunday: operatingHours.sunday ? slotToApiDay(operatingHours.sunday) : null,
    },
  };
}
