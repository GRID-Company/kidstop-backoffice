import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import InputForm from '@/shared/base/form-controls/input-form';
import { useThresholdForm } from '../../adapters/forms/use-threshold-form';
import { ThresholdSettingsFormData } from '../../adapters/forms/threshold-settings.schema';
import { IThresholdConfig } from '../../domain/types';
import SettingsSection from './settings-section';

interface ThresholdSectionProps {
  thresholds: IThresholdConfig;
  onSave: (thresholds: IThresholdConfig) => void;
}

export function ThresholdContent({ thresholds, onSave }: ThresholdSectionProps) {
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
      <div className="flex items-center gap-2">
        <Icon icon="lucide:gauge" className="text-lg text-accent" />
        <h4 className="text-base font-semibold">Umbrales</h4>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
        <InputForm
          label="Porcentaje de compra (0–1)"
          placeholder="0.5"
          type="number"
          controlProps={{ control, name: 'purchasePercentage' }}
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

export default function ThresholdSection(props: ThresholdSectionProps) {
  return (
    <SettingsSection title="Umbrales" icon="lucide:gauge">
      <ThresholdContent {...props} />
    </SettingsSection>
  );
}
