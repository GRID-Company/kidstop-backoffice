import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import InputForm from '@/shared/base/form-controls/input-form';
import { useGeofenceForm } from '../../adapters/forms/use-geofence-form';
import { GeofenceSettingsFormData } from '../../adapters/forms/geofence-settings.schema';
import { IGeofenceConfig } from '../../domain/types';
import SettingsSection from './settings-section';

interface GeofenceSectionProps {
  geofence: IGeofenceConfig;
  isLoading?: boolean;
  onSave: (geofence: IGeofenceConfig) => void;
}

export function GeofenceContent({ geofence, isLoading, onSave }: GeofenceSectionProps) {
  const { control, handleSubmit, formState, reset } = useGeofenceForm({
    center: geofence.center,
    radiusKm: geofence.radiusKm,
  });

  useEffect(() => {
    reset({
      center: geofence.center,
      radiusKm: geofence.radiusKm,
    });
  }, [geofence, reset]);

  const onSubmit = (data: GeofenceSettingsFormData) => {
    onSave({
      center: data.center,
      radiusKm: data.radiusKm,
    });
  };

  return (
    <form
      onSubmit={(...args) => {
        void handleSubmit(onSubmit)(...args);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <Icon icon="lucide:map-pin" className="text-lg text-accent" />
        <h4 className="text-base font-semibold">Geofence</h4>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InputForm
          label="Latitud (centro)"
          placeholder="20.6597"
          type="number"
          controlProps={{ control, name: 'center.lat' }}
        />
        <InputForm
          label="Longitud (centro)"
          placeholder="-103.3496"
          type="number"
          controlProps={{ control, name: 'center.lng' }}
        />
        <InputForm
          label="Radio (km)"
          placeholder="10"
          type="number"
          controlProps={{ control, name: 'radiusKm' }}
        />
      </div>

      <div className="flex justify-end">
        <KidstopButton
          variant="accent"
          type="submit"
          isDisabled={!formState.isDirty || !formState.isValid}
          isLoading={isLoading}
        >
          Guardar Geofence
        </KidstopButton>
      </div>
    </form>
  );
}

export default function GeofenceSection(props: GeofenceSectionProps) {
  return (
    <SettingsSection title="Geofence" icon="lucide:map-pin">
      <GeofenceContent {...props} />
    </SettingsSection>
  );
}
