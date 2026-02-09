import { useCallback, useState } from 'react';
import { ISettings, IBudgetConfig, IGeofenceConfig, IOperatingHours, IThresholdConfig } from '../../domain/types';
import { MOCK_SETTINGS } from '../../adapters/api/settings.mock';

export function useSettings() {
  const [settings, setSettings] = useState<ISettings>(MOCK_SETTINGS);
  const [loading] = useState(false);

  const updateGeofence = useCallback((geofence: IGeofenceConfig) => {
    setSettings((prev) => ({
      ...prev,
      geofence,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateBudgets = useCallback((budgets: IBudgetConfig[]) => {
    setSettings((prev) => ({
      ...prev,
      budgets,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateThresholds = useCallback((thresholds: IThresholdConfig) => {
    setSettings((prev) => ({
      ...prev,
      thresholds,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateOperatingHours = useCallback((operatingHours: IOperatingHours) => {
    setSettings((prev) => ({
      ...prev,
      operatingHours,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  return {
    settings,
    loading,
    updateGeofence,
    updateBudgets,
    updateThresholds,
    updateOperatingHours,
  };
}
