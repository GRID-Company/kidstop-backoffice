import { Button, Divider } from '@heroui/react';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import OverrideInput from '@/shared/base/heorui-overrides/input';
import { IBudgetConfig } from '../../domain/types';
import { budgetSettingsSchema } from '../../adapters/forms/budget-settings.schema';
import SettingsSection from './settings-section';

interface BudgetSectionProps {
  budgets: IBudgetConfig[];
  onSave: (budgets: IBudgetConfig[]) => void;
}

export default function BudgetSection({ budgets, onSave }: BudgetSectionProps) {
  const [localBudgets, setLocalBudgets] = useState<IBudgetConfig[]>(budgets);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalBudgets(budgets);
    setIsDirty(false);
    setErrors({});
  }, [budgets]);

  const handleFieldChange = useCallback(
    (index: number, field: keyof IBudgetConfig, value: string | number) => {
      setLocalBudgets((prev) =>
        prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
      );
      setIsDirty(true);
    },
    []
  );

  const handleRemove = useCallback((index: number) => {
    setLocalBudgets((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  }, []);

  const handleAdd = useCallback(() => {
    setLocalBudgets((prev) => [
      ...prev,
      {
        buyerGuid: crypto.randomUUID(),
        buyerName: '',
        dailyLimit: 0,
        weeklyLimit: 0,
        monthlyLimit: 0,
      },
    ]);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    const result = budgetSettingsSchema.safeParse({ budgets: localBudgets });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSave(localBudgets);
    setIsDirty(false);
  }, [localBudgets, onSave]);

  return (
    <SettingsSection title="Presupuestos por Comprador" icon="lucide:wallet">
      <div className="flex flex-col gap-4">
        {localBudgets.map((budget, index) => (
          <div key={budget.buyerGuid}>
            {index > 0 && <Divider className="mb-4" />}
            <div className="flex items-start gap-4">
              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4">
                <OverrideInput
                  label="Comprador"
                  placeholder="Nombre del comprador"
                  value={budget.buyerName}
                  isInvalid={!!errors[`budgets.${index}.buyerName`]}
                  errorMessage={errors[`budgets.${index}.buyerName`]}
                  onChange={(e) =>
                    handleFieldChange(index, 'buyerName', e.target.value)
                  }
                />
                <OverrideInput
                  label="Límite diario"
                  placeholder="0"
                  type="number"
                  value={String(budget.dailyLimit)}
                  isInvalid={!!errors[`budgets.${index}.dailyLimit`]}
                  errorMessage={errors[`budgets.${index}.dailyLimit`]}
                  onChange={(e) =>
                    handleFieldChange(index, 'dailyLimit', Number(e.target.value))
                  }
                />
                <OverrideInput
                  label="Límite semanal"
                  placeholder="0"
                  type="number"
                  value={String(budget.weeklyLimit)}
                  isInvalid={!!errors[`budgets.${index}.weeklyLimit`]}
                  errorMessage={errors[`budgets.${index}.weeklyLimit`]}
                  onChange={(e) =>
                    handleFieldChange(index, 'weeklyLimit', Number(e.target.value))
                  }
                />
                <OverrideInput
                  label="Límite mensual"
                  placeholder="0"
                  type="number"
                  value={String(budget.monthlyLimit)}
                  isInvalid={!!errors[`budgets.${index}.monthlyLimit`]}
                  errorMessage={errors[`budgets.${index}.monthlyLimit`]}
                  onChange={(e) =>
                    handleFieldChange(index, 'monthlyLimit', Number(e.target.value))
                  }
                />
              </div>
              <Button
                isIconOnly
                variant="light"
                color="danger"
                className="mt-6"
                onPress={() => handleRemove(index)}
              >
                <Icon icon="lucide:trash-2" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <KidstopButton
            variant="accent"
            startContent={<Icon icon="lucide:plus" />}
            onPress={handleAdd}
          >
            Agregar comprador
          </KidstopButton>
          <KidstopButton variant="accent" isDisabled={!isDirty} onPress={handleSave}>
            Guardar Presupuestos
          </KidstopButton>
        </div>
      </div>
    </SettingsSection>
  );
}
