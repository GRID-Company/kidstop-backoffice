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
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';

import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { IInventoryItem } from '../../domain/types';
import {
  MOVEMENT_TYPES,
  ADJUSTMENT_TYPE_OPTIONS,
  STOCK_STATUS_LABELS,
  STOCK_STATUS_COLORS,
} from '../../domain/constants';
import { validateStock } from '../../domain/inventory.domain';
import { useAdjustmentForm } from '../../adapters/forms/use-adjustment-form';
import { InventoryAdjustmentFormData } from '../../adapters/forms/inventory-adjustment.form.schema';
import { toAdjustmentFormDefaults } from '../../adapters/mappers/inventory.mapper';

interface AdjustmentModalProps {
  item: IInventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: InventoryAdjustmentFormData) => void;
}

export default function AdjustmentModal({
  item,
  isOpen,
  onClose,
  onSubmit,
}: AdjustmentModalProps) {
  const { control, handleSubmit, formState, reset, watch } = useAdjustmentForm();

  useEffect(() => {
    if (item) {
      reset({
        ...toAdjustmentFormDefaults(item),
        quantity: 1,
        movementType: MOVEMENT_TYPES.MANUAL_ADJUSTMENT,
        notes: '',
      });
    }
  }, [item, reset]);

  const movementType = watch('movementType');
  const quantity = watch('quantity');

  const isExit = movementType === MOVEMENT_TYPES.SALE_EXIT;

  const stockError = useMemo(() => {
    if (!item || !isExit) return null;
    if (!validateStock(item.stock, -quantity)) {
      return `Stock insuficiente. Disponible: ${item.stock}`;
    }
    return null;
  }, [item, isExit, quantity]);

  const handleFormSubmit: SubmitHandler<InventoryAdjustmentFormData> = useCallback(
    (data) => {
      if (!item || !onSubmit) return;
      if (data.movementType === MOVEMENT_TYPES.SALE_EXIT && !validateStock(item.stock, -data.quantity)) return;
      onSubmit(data);
      onClose();
    },
    [item, onSubmit, onClose]
  );

  if (!item) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">Ajuste de inventario</span>
          <span className="text-sm font-normal text-default-500">
            Registrar movimiento manual de stock
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex gap-4 rounded-lg bg-default-50 p-4">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-default-100">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-default-400">
                  <span className="text-2xl">🃏</span>
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-sm font-semibold">{item.name}</p>
              <p className="truncate text-xs text-default-500">
                {item.setName} ({item.setCode}) · #{item.number}
              </p>
              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{
                    base: 'bg-default-100',
                    content: 'text-default-600',
                  }}
                >
                  {CARD_CONDITION_SHORT_LABELS[item.condition] ?? item.condition}
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  color={STOCK_STATUS_COLORS[item.stockStatus] ?? 'default'}
                >
                  {STOCK_STATUS_LABELS[item.stockStatus]} · {item.stock}
                </Chip>
              </div>
            </div>
          </div>

          <Divider />

          <form
            id="adjustment-form"
            onSubmit={(...args) => {
              void handleSubmit(handleFormSubmit)(...args);
            }}
            className="flex flex-col gap-4"
          >
            <SelectForm
              label="Tipo de ajuste"
              placeholder="Selecciona el tipo de movimiento"
              items={ADJUSTMENT_TYPE_OPTIONS}
              controlProps={{ control, name: 'movementType' }}
              isRequired
              aria-label="Tipo de ajuste de inventario"
            />

            <InputForm
              label="Cantidad"
              type="number"
              min={1}
              controlProps={{ control, name: 'quantity' }}
              isRequired
              description={isExit ? `Stock disponible: ${item.stock}` : undefined}
              isInvalid={!!stockError}
              errorMessage={stockError ?? undefined}
              aria-label="Cantidad a ajustar"
            />

            <TextareaForm
              label="Notas / Razón"
              placeholder="Describe el motivo del ajuste"
              controlProps={{ control, name: 'notes' }}
              minRows={3}
              maxRows={5}
              aria-label="Notas del ajuste"
            />
          </form>
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="adjustment-form"
            isDisabled={!formState.isValid || !!stockError}
            startContent={<Icon icon="lucide:save" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Registrar ajuste
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
