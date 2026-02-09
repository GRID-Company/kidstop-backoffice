import { Switch } from '@heroui/react';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useCallback, useEffect, useState } from 'react';
import OverrideInput from '@/shared/base/heorui-overrides/input';
import { IOperatingHours, IOperatingHoursSlot, DayOfWeek } from '../../domain/types';
import { DAYS_OF_WEEK, DAYS_OF_WEEK_LABELS } from '../../domain/constants';
import SettingsSection from './settings-section';

interface OperatingHoursSectionProps {
  operatingHours: IOperatingHours;
  onSave: (operatingHours: IOperatingHours) => void;
}

export default function OperatingHoursSection({
  operatingHours,
  onSave,
}: OperatingHoursSectionProps) {
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
        return {
          ...prev,
          [day]: { ...current, [field]: value },
        };
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
    <SettingsSection title="Horarios de Operación" icon="lucide:clock">
      <div className="flex flex-col gap-4">
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
                    onChange={(e) =>
                      handleTimeChange(day, 'close', e.target.value)
                    }
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
    </SettingsSection>
  );
}
