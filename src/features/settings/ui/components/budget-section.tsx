import { Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import InputForm from '@/shared/base/form-controls/input-form';
import { Controller } from 'react-hook-form';
import { IBudgetConfig } from '../../domain/types';
import { BudgetFormData } from '../../adapters/forms/budget-settings.schema';
import { useBudgetForm } from '../../adapters/forms/use-budget-form';
import SettingsSection from './settings-section';

interface BudgetSectionProps {
  budgets: IBudgetConfig[];
  buyers: { guid: string; name: string | null }[];
  loading: boolean;
  onSave: (form: BudgetFormData) => Promise<void>;
}

function UtilizationBadge({ utilization }: { utilization: number }) {
  const pct = Math.round(utilization * 100);
  const color =
    pct >= 90 ? 'text-danger' : pct >= 70 ? 'text-warning' : 'text-success';
  return <span className={`text-sm font-medium ${color}`}>{pct}%</span>;
}

function BudgetFormModal({
  isOpen,
  onClose,
  buyers,
  defaults,
  loading,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  buyers: { guid: string; name: string | null }[];
  defaults?: Partial<BudgetFormData>;
  loading: boolean;
  onSave: (form: BudgetFormData) => Promise<void>;
}) {
  const { control, handleSubmit, formState, reset } = useBudgetForm();

  useEffect(() => {
    if (isOpen) {
      reset(defaults ?? { buyerGuid: '', tcg: 'POKEMON', assignedAmount: 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    reset({ buyerGuid: '', tcg: 'POKEMON', assignedAmount: 0 });
    onClose();
  };

  const onSubmit = async (data: BudgetFormData) => {
    await onSave(data);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <ModalContent>
        <ModalHeader>
          {defaults?.buyerGuid ? 'Editar presupuesto' : 'Asignar presupuesto'}
        </ModalHeader>
        <ModalBody>
          <form
            id="budget-form"
            onSubmit={(...args) => { void handleSubmit(onSubmit)(...args); }}
            className="flex flex-col gap-4"
          >
            <Controller
              control={control}
              name="buyerGuid"
              render={({ field, fieldState }) => (
                <Select
                  label="Comprador"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => field.onChange([...keys][0] ?? '')}
                  isDisabled={!!defaults?.buyerGuid}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {buyers.map((b) => (
                    <SelectItem key={b.guid}>{b.name ?? b.guid}</SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              control={control}
              name="tcg"
              render={({ field, fieldState }) => (
                <Select
                  label="TCG"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => field.onChange([...keys][0] ?? '')}
                  isDisabled={!!defaults?.tcg}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  <SelectItem key="POKEMON">Pokémon</SelectItem>
                  <SelectItem key="MAGIC">Magic</SelectItem>
                </Select>
              )}
            />
            <InputForm
              label="Monto mensual asignado"
              placeholder="0"
              type="number"
              controlProps={{ control, name: 'assignedAmount' }}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <KidstopButton variant="bordered" onPress={handleClose}>
            Cancelar
          </KidstopButton>
          <KidstopButton
            variant="accent"
            type="submit"
            form="budget-form"
            isDisabled={!formState.isValid}
            isLoading={loading}
          >
            Guardar
          </KidstopButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function BudgetSection({ budgets, buyers, loading, onSave }: BudgetSectionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingBudget, setEditingBudget] = useState<IBudgetConfig | null>(null);

  const handleEdit = (budget: IBudgetConfig) => {
    setEditingBudget(budget);
    onOpen();
  };

  const handleAdd = () => {
    setEditingBudget(null);
    onOpen();
  };

  const handleClose = () => {
    setEditingBudget(null);
    onClose();
  };

  return (
    <SettingsSection title="Presupuestos por Comprador" icon="lucide:wallet">
      <div className="flex flex-col gap-4">
        {budgets.length === 0 && !loading && (
          <p className="text-sm text-default-400">
            No hay presupuestos asignados.
          </p>
        )}

        {budgets.map((budget) => (
          <div
            key={budget.guid}
            className="flex items-center justify-between rounded-lg border border-default-200 px-4 py-3"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{budget.buyer.name}</span>
              <span className="text-xs text-default-400">{budget.tcg}</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex flex-col items-end">
                <span className="text-xs text-default-400">Asignado</span>
                <span className="font-medium">
                  ${budget.assignedAmount.toLocaleString('es-MX')}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-default-400">Usado</span>
                <span className="font-medium">
                  ${budget.usedAmount.toLocaleString('es-MX')}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-default-400">Uso</span>
                <UtilizationBadge utilization={budget.utilization} />
              </div>
              <KidstopButton
                isIconOnly
                variant="bordered"
                size="sm"
                onPress={() => handleEdit(budget)}
              >
                <Icon icon="lucide:pencil" className="text-sm" />
              </KidstopButton>
            </div>
          </div>
        ))}

        <div className="flex justify-start">
          <KidstopButton
            variant="accent"
            startContent={<Icon icon="lucide:plus" />}
            onPress={handleAdd}
          >
            Asignar presupuesto
          </KidstopButton>
        </div>
      </div>

      <BudgetFormModal
        isOpen={isOpen}
        onClose={handleClose}
        buyers={buyers}
        loading={loading}
        onSave={onSave}
        defaults={
          editingBudget
            ? {
                buyerGuid: editingBudget.buyer.guid,
                tcg: editingBudget.tcg as 'POKEMON' | 'MAGIC',
                assignedAmount: editingBudget.assignedAmount,
              }
            : undefined
        }
      />
    </SettingsSection>
  );
}
