'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
  Input,
  Spinner,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';
import { useQuery } from '@apollo/client/react';

import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { InventoryItemsDocument } from '@/lib/api/generated/inventory.generated';
import { IInventoryItem } from '../../domain/types';
import { fromApiInventoryItem } from '../../adapters/mappers/inventory.mapper';
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
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit?: (data: InventoryAdjustmentFormData) => void | Promise<void>;
}

export default function AdjustmentModal({
  item,
  isOpen,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AdjustmentModalProps) {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [resolvedItem, setResolvedItem] = useState<IInventoryItem | null>(item);
  const [itemSearch, setItemSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setResolvedItem(item);
      setItemSearch('');
    }
  }, [isOpen, item]);

  const { data: searchData, loading: searchLoading } = useQuery(InventoryItemsDocument, {
    variables: {
      findInventoryItemsArgs: {
        skip: 0,
        limit: 6,
        search: itemSearch.trim() || undefined,
        sort: { column: 'name', order: 'ASC' },
        filters: { tcg: selectedTCG },
      },
    },
    skip: !!resolvedItem || itemSearch.trim().length < 2,
    fetchPolicy: 'network-only',
  });

  const searchResults = useMemo<IInventoryItem[]>(() => {
    const raw = searchData?.inventoryItems?.data;
    if (!raw) return [];
    return raw
      .filter((i): i is NonNullable<typeof i> => i != null)
      .map((i) => fromApiInventoryItem(i as Parameters<typeof fromApiInventoryItem>[0]));
  }, [searchData]);

  const { control, handleSubmit, formState, reset, watch } = useAdjustmentForm();

  useEffect(() => {
    if (resolvedItem) {
      reset({
        ...toAdjustmentFormDefaults(resolvedItem),
        quantity: 1,
        movementType: MOVEMENT_TYPES.MANUAL_ADJUSTMENT,
        notes: '',
      });
    }
  }, [resolvedItem, reset]);

  const movementType = watch('movementType');
  const quantity = watch('quantity');

  const isExit = movementType === MOVEMENT_TYPES.SALE_EXIT;

  const stockError = useMemo(() => {
    if (!resolvedItem || !isExit) return null;
    if (!validateStock(resolvedItem.stock, -quantity)) {
      return `Stock insuficiente. Disponible: ${resolvedItem.stock}`;
    }
    return null;
  }, [resolvedItem, isExit, quantity]);

  const handleFormSubmit: SubmitHandler<InventoryAdjustmentFormData> = useCallback(
    (data) => {
      if (!resolvedItem || !onSubmit) return;
      if (data.movementType === MOVEMENT_TYPES.SALE_EXIT && !validateStock(resolvedItem.stock, -data.quantity)) return;
      onSubmit(data);
    },
    [resolvedItem, onSubmit]
  );

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">Ajuste de inventario</span>
          <span className="text-sm font-normal text-default-500">
            Registrar movimiento manual de stock
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          {!resolvedItem ? (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Buscar carta por nombre, set o código..."
                value={itemSearch}
                onValueChange={setItemSearch}
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                isClearable
                onClear={() => setItemSearch('')}
                autoFocus
              />

              {searchLoading && (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              )}

              {!searchLoading && itemSearch.trim().length >= 2 && searchResults.length === 0 && (
                <p className="text-center text-sm text-default-400">
                  No se encontraron cartas en inventario
                </p>
              )}

              {searchResults.length > 0 && (
                <div className="flex flex-col gap-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.guid}
                      type="button"
                      onClick={() => setResolvedItem(result)}
                      className="flex items-center gap-3 rounded-lg border border-default-200 p-3 text-left transition hover:bg-default-50"
                    >
                      <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded bg-default-100">
                        {result.imageUrl ? (
                          <img
                            src={result.imageUrl}
                            alt={result.name}
                            className="absolute inset-0 h-full w-full object-contain"
                          />
                        ) : (
                          <Image
                            src={result.tcg === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder}
                            alt="Card placeholder"
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{result.name}</p>
                        <p className="truncate text-xs text-default-500">
                          {result.setName} · #{result.number} · {CARD_CONDITION_SHORT_LABELS[result.condition] ?? result.condition}
                        </p>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={STOCK_STATUS_COLORS[result.stockStatus] ?? 'default'}
                      >
                        {result.stock}
                      </Chip>
                    </button>
                  ))}
                </div>
              )}

              {itemSearch.trim().length < 2 && (
                <p className="text-center text-sm text-default-400">
                  Escribe al menos 2 caracteres para buscar
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex gap-4 rounded-lg bg-default-50 p-4">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-default-100">
                  {resolvedItem.imageUrl ? (
                    <img
                      src={resolvedItem.imageUrl}
                      alt={resolvedItem.name}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={resolvedItem.tcg === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder}
                      alt="Card placeholder"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-sm font-semibold">{resolvedItem.name}</p>
                  <p className="truncate text-xs text-default-500">
                    {resolvedItem.setName} ({resolvedItem.setCode}) · #{resolvedItem.number}
                  </p>
                  <div className="flex items-center gap-2">
                    <Chip
                      size="sm"
                      variant="flat"
                      classNames={{ base: 'bg-default-100', content: 'text-default-600' }}
                    >
                      {CARD_CONDITION_SHORT_LABELS[resolvedItem.condition] ?? resolvedItem.condition}
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={STOCK_STATUS_COLORS[resolvedItem.stockStatus] ?? 'default'}
                    >
                      {STOCK_STATUS_LABELS[resolvedItem.stockStatus]} · {resolvedItem.stock}
                    </Chip>
                  </div>
                </div>

                {!item && (
                  <button
                    type="button"
                    onClick={() => { setResolvedItem(null); setItemSearch(''); }}
                    className="self-start text-default-400 hover:text-default-700"
                    aria-label="Cambiar carta"
                  >
                    <Icon icon="lucide:x" />
                  </button>
                )}
              </div>

              <Divider />

              <form
                id="adjustment-form"
                onSubmit={(...args) => { void handleSubmit(handleFormSubmit)(...args); }}
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
                  description={isExit ? `Stock disponible: ${resolvedItem.stock}` : undefined}
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
            </>
          )}
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
          {resolvedItem && (
            <Button
              type="submit"
              form="adjustment-form"
              isDisabled={!formState.isValid || !!stockError || isSubmitting}
              isLoading={isSubmitting}
              startContent={<Icon icon="lucide:save" />}
              className="text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Registrar ajuste
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </KidstopDrawer>
  );
}
