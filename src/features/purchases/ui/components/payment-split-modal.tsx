'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Divider,
  Chip,
  Progress,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';

import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import { usePrivacyCurrency } from '@/lib/hooks/use-privacy-currency';
import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { formatCurrency } from '@/lib/utils/format-currency';
import { IPurchaseItem, IPaymentDetail, PaymentMethod } from '../../domain/types';
import { PAYMENT_METHOD_OPTIONS } from '../../domain/constants';
import {
  calculateTotal,
  validatePaymentSplit,
} from '../../domain/purchases.domain';
import { usePaymentSplitForm, PaymentSplitFormData } from '../../adapters/forms/use-payment-split-form';

interface PaymentSplitModalProps {
  items: IPurchaseItem[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (payments: IPaymentDetail[]) => void;
  defaultPayments?: IPaymentDetail[];
}

export default function PaymentSplitModal({
  items,
  isOpen,
  onClose,
  onConfirm,
  defaultPayments = [],
}: PaymentSplitModalProps) {
  const displayCurrency = usePrivacyCurrency();
  const { isPrivacyMode } = usePrivacyModeStore();

  const { control, handleSubmit, watch, reset, fieldArray } =
    usePaymentSplitForm();

  const { fields, append, remove } = fieldArray;

  const watchedPayments = watch('payments');

  const total = useMemo(() => calculateTotal(items), [items]);

  const serializedPayments = JSON.stringify(watchedPayments);

  const validation = useMemo(
    () =>
      validatePaymentSplit(
        items,
        watchedPayments.map((p) => ({
          method: p.method as PaymentMethod,
          amount: Number(p.amount) || 0,
        }))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, serializedPayments]
  );

  const assignedPercentage = useMemo(() => {
    if (total <= 0) return 0;
    return Math.min((validation.totalAssigned / total) * 100, 100);
  }, [total, validation.totalAssigned]);

  const usedMethods = useMemo(
    () => new Set(watchedPayments.map((p) => p.method)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serializedPayments]
  );

  const availableMethods = useMemo(
    () => PAYMENT_METHOD_OPTIONS.filter((opt) => !usedMethods.has(opt.value)),
    [usedMethods]
  );

  const canAddMore = availableMethods.length > 0;

  useEffect(() => {
    if (isOpen) {
      reset({
        payments: defaultPayments.length > 0
          ? defaultPayments.map((p) => ({ method: p.method, amount: p.amount }))
          : [],
      });
    }
  }, [isOpen, defaultPayments, reset]);

  const handleAddPayment = useCallback(() => {
    if (availableMethods.length === 0) return;
    const remaining = Math.max(total - validation.totalAssigned, 0);
    append({
      method: availableMethods[0].value,
      amount: Math.round(remaining * 100) / 100,
    });
  }, [availableMethods, total, validation.totalAssigned, append]);

  const handleFormSubmit = useCallback(
    (data: PaymentSplitFormData) => {
      if (!onConfirm) return;
      const payments: IPaymentDetail[] = data.payments.map((p) => ({
        method: p.method as PaymentMethod,
        amount: Number(p.amount),
      }));
      onConfirm(payments);
      onClose();
    },
    [onConfirm, onClose]
  );

  const progressColor = useMemo(() => {
    if (Math.abs(validation.difference) <= 0.01) return 'success';
    if (validation.totalAssigned > total) return 'danger';
    return 'warning';
  }, [validation, total]);

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            División de pago
          </span>
          <span className="text-sm font-normal text-default-500">
            Divide el total de la compra entre diferentes métodos de pago
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-lg bg-default-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">Total de compra</span>
              <span className="text-lg font-bold text-accent">
                {displayCurrency(total)}
              </span>
            </div>

            <Progress
              value={assignedPercentage}
              color={progressColor}
              size="md"
              className="w-full"
              aria-label={`Asignado: ${Math.round(assignedPercentage)}%`}
            />

            <div className="flex items-center justify-between text-sm">
              <span className="text-default-500">Asignado</span>
              <span className="font-medium">
                {displayCurrency(validation.totalAssigned)}
              </span>
            </div>

            {!isPrivacyMode && Math.abs(validation.difference) > 0.01 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-default-500">
                  {validation.difference > 0 ? 'Restante' : 'Excedente'}
                </span>
                <span
                  className={`font-semibold ${
                    validation.difference > 0 ? 'text-warning' : 'text-danger'
                  }`}
                >
                  {formatCurrency(Math.abs(validation.difference))}
                </span>
              </div>
            )}
          </div>

          <Divider />

          <form
            id="payment-split-form"
            onSubmit={(...args) => {
              void handleSubmit(handleFormSubmit)(...args);
            }}
            className="flex flex-col gap-4"
          >
            {fields.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-default-400">
                <Icon icon="lucide:wallet" width={36} className="mb-2" />
                <span className="text-sm">No hay métodos de pago agregados</span>
              </div>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-3 rounded-lg border border-default-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <Chip
                    size="sm"
                    variant="flat"
                    classNames={{
                      base: 'bg-accent/10',
                      content: 'text-accent font-medium',
                    }}
                  >
                    Pago {index + 1}
                  </Chip>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => remove(index)}
                    aria-label={`Eliminar pago ${index + 1}`}
                  >
                    <Icon icon="lucide:trash-2" width={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SelectForm
                    label="Método"
                    placeholder="Selecciona método"
                    items={PAYMENT_METHOD_OPTIONS.filter(
                      (opt) =>
                        opt.value === watchedPayments[index]?.method ||
                        !usedMethods.has(opt.value) ||
                        opt.value === field.method
                    )}
                    controlProps={{ control, name: `payments.${index}.method` }}
                    isRequired
                    aria-label={`Método de pago ${index + 1}`}
                  />

                  <InputForm
                    label="Monto"
                    type="number"
                    placeholder="0.00"
                    controlProps={{ control, name: `payments.${index}.amount` }}
                    isRequired
                    startContent={
                      <span className="text-sm text-default-400">$</span>
                    }
                    aria-label={`Monto del pago ${index + 1}`}
                  />
                </div>
              </div>
            ))}

            {canAddMore && (
              <Button
                variant="bordered"
                size="sm"
                startContent={<Icon icon="lucide:plus" />}
                onPress={handleAddPayment}
                className="border-accent text-accent"
              >
                Agregar método de pago
              </Button>
            )}
          </form>

          {validation.errors.length > 0 && fields.length > 0 && (
            <>
              <Divider />
              <div className="flex flex-col gap-1">
                {validation.errors.map((error, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-danger">
                    <Icon icon="lucide:alert-circle" width={14} />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="payment-split-form"
            isDisabled={!validation.valid}
            startContent={<Icon icon="lucide:check" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Confirmar pago
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </KidstopDrawer>
  );
}
