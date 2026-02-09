import { Divider, Switch } from '@heroui/react';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Icon } from '@iconify/react';
import InputForm from '@/shared/base/form-controls/input-form';
import OverrideInput from '@/shared/base/heorui-overrides/input';
import { useGeofenceForm } from '../../adapters/forms/use-geofence-form';
import { GeofenceSettingsFormData } from '../../adapters/forms/geofence-settings.schema';
import { useThresholdForm } from '../../adapters/forms/use-threshold-form';
import { ThresholdSettingsFormData } from '../../adapters/forms/threshold-settings.schema';
import {
  IGeofenceConfig,
  IThresholdConfig,
  IOperatingHours,
  IOperatingHoursSlot,
  DayOfWeek,
} from '../../domain/types';
import { DAYS_OF_WEEK, DAYS_OF_WEEK_LABELS } from '../../domain/constants';
import SettingsSection from './settings-section';

interface GeneralSectionProps {
  geofence: IGeofenceConfig;
  thresholds: IThresholdConfig;
  operatingHours: IOperatingHours;
  onSaveGeofence: (geofence: IGeofenceConfig) => void;
  onSaveThresholds: (thresholds: IThresholdConfig) => void;
  onSaveOperatingHours: (operatingHours: IOperatingHours) => void;
}

function SubSectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon icon={icon} className="text-lg text-accent" />
      <h4 className="text-base font-semibold">{label}</h4>
    </div>
  );
}

function GeofenceSubSection({
  geofence,
  onSave,
}: {
  geofence: IGeofenceConfig;
  onSave: (g: IGeofenceConfig) => void;
}) {
  const { control, handleSubmit, formState, reset } = useGeofenceForm({
    enabled: geofence.enabled,
    center: geofence.center,
    radiusKm: geofence.radiusKm,
  });

  useEffect(() => {
    reset({
      enabled: geofence.enabled,
      center: geofence.center,
      radiusKm: geofence.radiusKm,
    });
  }, [geofence, reset]);

  const onSubmit = (data: GeofenceSettingsFormData) => {
    onSave({ ...geofence, enabled: data.enabled, center: data.center, radiusKm: data.radiusKm });
  };

  return (
    <form
      onSubmit={(...args) => {
        void handleSubmit(onSubmit)(...args);
      }}
      className="flex flex-col gap-4"
    >
      <SubSectionTitle icon="lucide:map-pin" label="Geofence" />

      <Controller
        control={control}
        name="enabled"
        render={({ field }) => (
          <Switch
            isSelected={field.value}
            onValueChange={field.onChange}
            classNames={{ wrapper: 'group-data-[selected=true]:bg-accent' }}
          >
            {field.value ? 'Habilitado' : 'Deshabilitado'}
          </Switch>
        )}
      />

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
        >
          Guardar Geofence
        </KidstopButton>
      </div>
    </form>
  );
}

function ThresholdSubSection({
  thresholds,
  onSave,
}: {
  thresholds: IThresholdConfig;
  onSave: (t: IThresholdConfig) => void;
}) {
  const { control, handleSubmit, formState, reset } = useThresholdForm(thresholds);

  useEffect(() => {
    reset(thresholds);
  }, [thresholds, reset]);

  const onSubmit = (data: ThresholdSettingsFormData) => {
    onSave(data);
  };

  return (
    <form
      onSubmit={(...args) => {
        void handleSubmit(onSubmit)(...args);
      }}
      className="flex flex-col gap-4"
    >
      <SubSectionTitle icon="lucide:gauge" label="Umbrales" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputForm
          label="Límite de pedidos no concretados"
          placeholder="3"
          type="number"
          controlProps={{ control, name: 'uncompletedOrdersLimit' }}
        />
        <InputForm
          label="Límite de inventario por carta"
          placeholder="20"
          type="number"
          controlProps={{ control, name: 'inventoryLimitPerCard' }}
        />
      </div>

      <div className="flex justify-end">
        <KidstopButton
          variant="accent"
          type="submit"
          isDisabled={!formState.isDirty || !formState.isValid}
        >
          Guardar Umbrales
        </KidstopButton>
      </div>
    </form>
  );
}

function OperatingHoursSubSection({
  operatingHours,
  onSave,
}: {
  operatingHours: IOperatingHours;
  onSave: (h: IOperatingHours) => void;
}) {
  const [localHours, setLocalHours] = useState<IOperatingHours>(operatingHours);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalHours(operatingHours);
  }, [operatingHours]);

  const handleToggleDay = useCallback((day: DayOfWeek) => {
    setLocalHours((prev) => ({
      ...prev,
      [day]: prev[day] ? null : { open: '10:00', close: '20:00' },
    }));
    setIsDirty(true);
  }, []);

  const handleTimeChange = useCallback(
    (day: DayOfWeek, field: keyof IOperatingHoursSlot, value: string) => {
      setLocalHours((prev) => {
        const current = prev[day];
        if (!current) return prev;
        return { ...prev, [day]: { ...current, [field]: value } };
      });
      setIsDirty(true);
    },
    []
  );

  const handleSave = useCallback(() => {
    onSave(localHours);
    setIsDirty(false);
  }, [localHours, onSave]);

  return (
    <div className="flex flex-col gap-4">
      <SubSectionTitle icon="lucide:clock" label="Horarios de Operación" />

      {DAYS_OF_WEEK.map((day) => {
        const slot = localHours[day];
        const isOpen = slot !== null;

        return (
          <div key={day} className="flex items-center gap-4">
            <div className="w-28">
              <Switch
                size="sm"
                isSelected={isOpen}
                onValueChange={() => handleToggleDay(day)}
                classNames={{ wrapper: 'group-data-[selected=true]:bg-accent' }}
              >
                <span className="text-sm font-medium">
                  {DAYS_OF_WEEK_LABELS[day]}
                </span>
              </Switch>
            </div>
            {isOpen ? (
              <div className="flex items-center gap-2">
                <OverrideInput
                  type="time"
                  size="sm"
                  className="w-36"
                  value={slot.open}
                  onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                />
                <span className="text-sm text-default-500">a</span>
                <OverrideInput
                  type="time"
                  size="sm"
                  className="w-36"
                  value={slot.close}
                  onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                />
              </div>
            ) : (
              <span className="text-sm text-default-400">Cerrado</span>
            )}
          </div>
        );
      })}

      <div className="flex justify-end">
        <KidstopButton variant="accent" isDisabled={!isDirty} onPress={handleSave}>
          Guardar Horarios
        </KidstopButton>
      </div>
    </div>
  );
}

export default function GeneralSection({
  geofence,
  thresholds,
  operatingHours,
  onSaveGeofence,
  onSaveThresholds,
  onSaveOperatingHours,
}: GeneralSectionProps) {
  return (
    <SettingsSection title="General" icon="lucide:settings">
      <div className="flex flex-col gap-6">
        <GeofenceSubSection geofence={geofence} onSave={onSaveGeofence} />
        <Divider />
        <ThresholdSubSection thresholds={thresholds} onSave={onSaveThresholds} />
        <Divider />
        <OperatingHoursSubSection
          operatingHours={operatingHours}
          onSave={onSaveOperatingHours}
        />
      </div>
    </SettingsSection>
  );
}
