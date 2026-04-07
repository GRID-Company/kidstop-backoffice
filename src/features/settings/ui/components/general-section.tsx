import { Divider } from '@heroui/react';
import { IGeofenceConfig, IThresholdConfig, IOperatingHours } from '../../domain/types';
import SettingsSection from './settings-section';
import { GeofenceContent } from './geofence-section';
import { ThresholdContent } from './threshold-section';
import { OperatingHoursContent } from './operating-hours-section';

interface GeneralSectionProps {
  geofence: IGeofenceConfig;
  thresholds: IThresholdConfig;
  operatingHours: IOperatingHours;
  isLoading?: boolean;
  onSaveGeofence: (geofence: IGeofenceConfig) => void;
  onSaveThresholds: (thresholds: IThresholdConfig) => void;
  onSaveOperatingHours: (operatingHours: IOperatingHours) => void;
}

export default function GeneralSection({
  geofence,
  thresholds,
  operatingHours,
  isLoading,
  onSaveGeofence,
  onSaveThresholds,
  onSaveOperatingHours,
}: GeneralSectionProps) {
  return (
    <SettingsSection title="General" icon="lucide:settings">
      <div className="flex flex-col gap-6">
        <GeofenceContent geofence={geofence} isLoading={isLoading} onSave={onSaveGeofence} />
        <Divider />
        <ThresholdContent thresholds={thresholds} isLoading={isLoading} onSave={onSaveThresholds} />
        <Divider />
        <OperatingHoursContent
          operatingHours={operatingHours}
          isLoading={isLoading}
          onSave={onSaveOperatingHours}
        />
      </div>
    </SettingsSection>
  );
}
