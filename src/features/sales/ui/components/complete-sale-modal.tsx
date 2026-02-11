'use client';

import { useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
  Checkbox,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Controller, useWatch } from 'react-hook-form';

import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { formatCurrency } from '@/lib/utils/format-currency';
import { FULFILLMENT_STATUS, ISale, SALE_STATUS } from '../../domain/types';
import { calculateAdjustedTotal, calculateTotal, generateSaleCode } from '../../domain/sales.domain';
import {
  CARD_CONDITION_SHORT_LABELS,
  FULFILLMENT_STATUS_COLORS,
  FULFILLMENT_STATUS_LABELS,
  SALE_STATUS_LABELS,
} from '../../domain/constants';
import { useCompleteSaleForm } from '../../adapters/forms/use-complete-sale-form';
import { CompleteSaleFormData } from '../../adapters/forms/complete-sale.form.schema';
import { toCompleteSaleFormDefaults } from '../../adapters/mappers/sale.mapper';
import SaleCodeDisplay from './sale-code-display';

interface CompleteSaleModalProps {
  sale: ISale | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (data: CompleteSaleFormData, generatedCode: string) => void;
  loading?: boolean;
}

export default function CompleteSaleModal({
  sale,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: CompleteSaleModalProps) {
  const { control, handleSubmit, formState, reset, setValue } =
    useCompleteSaleForm();

  const verifiedItems = useWatch({ control, name: 'verifiedItems' });

  const total = useMemo(
    () => (sale ? calculateTotal(sale.items) : 0),
    [sale]
  );

  const adjustedTotal = useMemo(
    () => (sale ? calculateAdjustedTotal(sale.items) : 0),
    [sale]
  );

  const itemCount = useMemo(
    () => (sale ? sale.items.reduce((sum, item) => sum + item.quantity, 0) : 0),
    [sale]
  );

  const fulfillmentSummary = useMemo(() => {
    if (!sale) return { found: 0, partial: 0, notAvailable: 0, pending: 0 };
    return sale.items.reduce(
      (acc, item) => {
        if (item.fulfillmentStatus === FULFILLMENT_STATUS.FOUND) acc.found++;
        else if (item.fulfillmentStatus === FULFILLMENT_STATUS.PARTIAL) acc.partial++;
        else if (item.fulfillmentStatus === FULFILLMENT_STATUS.NOT_AVAILABLE) acc.notAvailable++;
        else acc.pending++;
        return acc;
      },
      { found: 0, partial: 0, notAvailable: 0, pending: 0 }
    );
  }, [sale]);

  const hasIssues = fulfillmentSummary.partial > 0 || fulfillmentSummary.notAvailable > 0;

  const allVerified = useMemo(
    () => verifiedItems.length > 0 && verifiedItems.every((vi) => vi.verified),
    [verifiedItems]
  );

  const verifiedCount = useMemo(
    () => verifiedItems.filter((vi) => vi.verified).length,
    [verifiedItems]
  );

  useEffect(() => {
    if (isOpen && sale) {
      reset(toCompleteSaleFormDefaults(sale));
    }
  }, [isOpen, sale, reset]);

  const handleToggleItem = useCallback(
    (index: number, checked: boolean) => {
      setValue(`verifiedItems.${index}.verified`, checked, {
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const handleToggleAll = useCallback(() => {
    const newValue = !allVerified;
    verifiedItems.forEach((_, index) => {
      setValue(`verifiedItems.${index}.verified`, newValue, {
        shouldValidate: true,
      });
    });
  }, [allVerified, verifiedItems, setValue]);

  const handleFormSubmit = useCallback(
    (data: CompleteSaleFormData) => {
      if (!sale || !onConfirm) return;
      const code = generateSaleCode();
      onConfirm(data, code);
      onClose();
    },
    [sale, onConfirm, onClose]
  );

  if (!sale) return null;

  const isCompletable =
    sale.status !== SALE_STATUS.COMPLETED &&
    sale.status !== SALE_STATUS.CANCELLED;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            Completar venta
          </span>
          <span className="text-sm font-normal text-default-500">
            Verifica los items y confirma para completar el pedido
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-lg bg-default-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <SaleCodeDisplay code={sale.code} />
                  <Chip
                    size="sm"
                    variant="flat"
                    classNames={{
                      base: 'bg-accent/10',
                      content: 'text-accent font-medium',
                    }}
                  >
                    {sale.tcgType}
                  </Chip>
                </div>
                <p className="mt-1 text-sm font-semibold">{sale.customerName}</p>
                <p className="text-xs text-default-500">{sale.customerEmail}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-default-400">Total original</span>
                <span className={`text-sm font-semibold ${hasIssues ? 'text-default-400 line-through' : 'text-accent'}`}>
                  {formatCurrency(total)}
                </span>
                {hasIssues && (
                  <>
                    <span className="text-xs text-default-400">Total ajustado</span>
                    <span className="text-lg font-bold text-accent">
                      {formatCurrency(adjustedTotal)}
                    </span>
                  </>
                )}
                {!hasIssues && (
                  <Chip size="sm" variant="flat">
                    {itemCount} {itemCount === 1 ? 'carta' : 'cartas'}
                  </Chip>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {fulfillmentSummary.found > 0 && (
              <Chip size="sm" variant="flat" color="success" startContent={<Icon icon="lucide:check" width={12} />}>
                {fulfillmentSummary.found} encontrado{fulfillmentSummary.found !== 1 ? 's' : ''}
              </Chip>
            )}
            {fulfillmentSummary.partial > 0 && (
              <Chip size="sm" variant="flat" color="warning" startContent={<Icon icon="lucide:alert-triangle" width={12} />}>
                {fulfillmentSummary.partial} parcial{fulfillmentSummary.partial !== 1 ? 'es' : ''}
              </Chip>
            )}
            {fulfillmentSummary.notAvailable > 0 && (
              <Chip size="sm" variant="flat" color="danger" startContent={<Icon icon="lucide:x" width={12} />}>
                {fulfillmentSummary.notAvailable} no disponible{fulfillmentSummary.notAvailable !== 1 ? 's' : ''}
              </Chip>
            )}
            {fulfillmentSummary.pending > 0 && (
              <Chip size="sm" variant="flat" startContent={<Icon icon="lucide:clock" width={12} />}>
                {fulfillmentSummary.pending} pendiente{fulfillmentSummary.pending !== 1 ? 's' : ''}
              </Chip>
            )}
          </div>

          {hasIssues && (
            <Chip size="sm" color="warning" variant="flat" startContent={<Icon icon="lucide:info" width={12} />}>
              El total se ajustó según las cantidades encontradas
            </Chip>
          )}

          <Divider />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Verificación de items</h4>
              <Button
                size="sm"
                variant="light"
                className="text-accent"
                onPress={handleToggleAll}
              >
                {allVerified ? 'Desmarcar todos' : 'Marcar todos'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Chip
                size="sm"
                variant="flat"
                color={allVerified ? 'success' : 'default'}
              >
                {verifiedCount}/{verifiedItems.length} verificados
              </Chip>
            </div>

            <div className="flex flex-col gap-2">
              {sale.items.map((item, index) => (
                <Controller
                  key={item.id}
                  control={control}
                  name={`verifiedItems.${index}.verified`}
                  render={({ field }) => (
                    <div
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                        field.value
                          ? 'border-success-200 bg-success-50'
                          : 'border-default-200 bg-default-50'
                      }`}
                    >
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={(checked) =>
                          handleToggleItem(index, checked)
                        }
                        color="success"
                        aria-label={`Verificar ${item.cardName}`}
                      />

                      <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded bg-default-100">
                        {item.cardImageUrl ? (
                          <Image
                            src={item.cardImageUrl}
                            alt={item.cardName}
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-sm">
                            🃏
                          </span>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-sm font-medium">
                          {item.cardName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-default-500">
                            {item.setName} ({item.setCode})
                          </span>
                          <Chip size="sm" variant="flat" className="h-4 text-[10px]">
                            {CARD_CONDITION_SHORT_LABELS[item.condition]}
                          </Chip>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <span className="text-xs text-default-400">
                          ×{item.quantity}
                        </span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={FULFILLMENT_STATUS_COLORS[item.fulfillmentStatus]}
                          className="h-4 text-[10px]"
                        >
                          {FULFILLMENT_STATUS_LABELS[item.fulfillmentStatus]}
                        </Chip>
                      </div>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>

          <Divider />

          <form
            id="complete-sale-form"
            onSubmit={(...args) => {
              void handleSubmit(handleFormSubmit)(...args);
            }}
            className="flex flex-col gap-4"
          >
            <TextareaForm
              label="Notas (opcional)"
              placeholder="Agrega notas sobre la venta completada"
              controlProps={{ control, name: 'notes' }}
              minRows={2}
              maxRows={4}
              aria-label="Notas de la venta completada"
            />
          </form>

          {!isCompletable && (
            <Chip size="sm" color="warning" variant="flat">
              Esta venta ya fue {SALE_STATUS_LABELS[sale.status].toLowerCase()}
            </Chip>
          )}
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="complete-sale-form"
            isLoading={loading}
            isDisabled={!allVerified || !isCompletable}
            startContent={<Icon icon="lucide:check-circle" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Confirmar y completar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
