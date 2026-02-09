import { ISettings } from '../../domain/types';
import {
  DEFAULT_GEOFENCE_CONFIG,
  DEFAULT_OPERATING_HOURS,
  DEFAULT_THRESHOLDS,
} from '../../domain/constants';

export const MOCK_SETTINGS: ISettings = {
  id: 'settings-001',
  geofence: {
    ...DEFAULT_GEOFENCE_CONFIG,
    enabled: true,
    center: { lat: 20.6597, lng: -103.3496 },
    radiusKm: 10,
    polygon: [
      { lat: 20.7097, lng: -103.3996 },
      { lat: 20.7097, lng: -103.2996 },
      { lat: 20.6097, lng: -103.2996 },
      { lat: 20.6097, lng: -103.3996 },
    ],
  },
  budgets: [
    {
      buyerGuid: '1a2b3c4d-0003',
      buyerName: 'Juan Hernández',
      dailyLimit: 5000,
      weeklyLimit: 25000,
      monthlyLimit: 80000,
    },
    {
      buyerGuid: '1a2b3c4d-0006',
      buyerName: 'Laura Torres',
      dailyLimit: 3000,
      weeklyLimit: 15000,
      monthlyLimit: 50000,
    },
  ],
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    uncompletedOrdersLimit: 3,
    inventoryLimitPerCard: 20,
  },
  operatingHours: {
    ...DEFAULT_OPERATING_HOURS,
  },
  updatedAt: new Date().toISOString(),
};
