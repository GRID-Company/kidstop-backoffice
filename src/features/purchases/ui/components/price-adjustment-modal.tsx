'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Divider,
  Image,
  Chip,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import InputForm from '@/shared/base/form-controls/input-form';
import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { formatCurrency } from '@/lib/utils/format-currency';
import { IPurchaseItem } from '../../domain/types';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import {
  calculateTotal,
  validatePriceAdjustment,
} from '../../domain/purchases.domain';
import {
  usePriceAdjustmentForm,
  PriceAdjustmentFormData,
} from '../../adapters/forms/use-price-adjustment-form';

const REDACTED_VALUE = '$••••••';

interface PriceAdjustmentModalProps {
  items: IPurchaseItem[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (adjustedItems: IPurchaseItem[]) => void;
}

export default function PriceAdjustmentModal({
  items,
  isOpen,
  onClose,
  onConfirm,
}: PriceAdjustmentModalProps) {
  const { isPrivacyMode } = usePrivacyModeStore();

  const { control, handleSubmit, reset, fieldArray } = usePriceAdjustmentForm();
  const { fields } = fieldArray;

  const watchedItems = useWatch({
    control,
    name: 'items',
    defaultValue: [],
  });

  const buyTotal = useMemo(() => calculateTotal(items), [items]);

  const adjustedPrices = useMemo(() => {
    const map: Record<string, number> = {};
    watchedItems.forEach((wi) => {
      const price = Number(wi.publicPrice);
      map[wi.itemId] = isNaN(price) || price < 0 ? 0 : price;
    });
    return map;
  }, [watchedItems]);

  const validation = useMemo(
    () => validatePriceAdjustment(items, adjustedPrices),
    [items, adjustedPrices]
  );

  const sellTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (adjustedPrices[item.guid] || 0) * item.quantity,
        0
      ),
    [items, adjustedPrices]
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        items: items.map((item) => ({
          itemId: item.guid,
          publicPrice: item.sellPrice || 0,
        })),
      });
    }
  }, [isOpen, items, reset]);

  const displayCurrency = useCallback(
    (value: number): string =>
      isPrivacyMode ? REDACTED_VALUE : formatCurrency(value),
    [isPrivacyMode]
  );

  const handleFormSubmit = useCallback(
    (data: PriceAdjustmentFormData) => {
      if (!onConfirm) return;
      const priceMap = new Map(
        data.items.map((i) => [i.itemId, Number(i.publicPrice)])
      );
      const adjustedItems = items.map((item) => ({
        ...item,
        sellPrice: priceMap.get(item.guid) ?? item.sellPrice,
      }));
      onConfirm(adjustedItems);
      onClose();
    },
    [onConfirm, onClose, items]
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            Ajuste de precios públicos
          </span>
          <span className="text-sm font-normal text-default-500">
            Define el precio de venta al público para cada carta antes de
            finalizar
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1 rounded-lg bg-default-50 p-4">
              <span className="text-xs text-default-500">Total compra</span>
              <span className="text-lg font-bold text-accent">
                {displayCurrency(buyTotal)}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1 rounded-lg bg-default-50 p-4">
              <span className="text-xs text-default-500">
                Total venta (ajustado)
              </span>
              <span className="text-lg font-bold text-success">
                {displayCurrency(sellTotal)}
              </span>
            </div>
          </div>

          <Divider />

          <form
            id="price-adjustment-form"
            onSubmit={(...args) => {
              void handleSubmit(handleFormSubmit)(...args);
            }}
            className="flex flex-col gap-4"
          >
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-default-400">
                <Icon icon="lucide:package-open" width={36} className="mb-2" />
                <span className="text-sm">No hay items para ajustar</span>
              </div>
            )}

            {items.map((item, index) => {
              const hasError = validation.itemsWithoutPrice.includes(item.guid);

              return (
                <div
                  key={item.guid}
                  className={`flex flex-col gap-3 rounded-lg border p-4 ${
                    hasError
                      ? 'border-danger/50 bg-danger-50/30'
                      : 'border-default-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.cardImageUrl}
                      alt={item.cardName}
                      className="h-16 w-12 rounded object-cover"
                      fallbackSrc="https://placehold.co/48x64?text=Card"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {item.cardName}
                        </span>
                        <Chip
                          size="sm"
                          variant="flat"
                          classNames={{
                            base: 'bg-accent/10',
                            content: 'text-accent text-xs font-medium',
                          }}
                        >
                          {CARD_CONDITION_SHORT_LABELS[item.condition]}
                        </Chip>
                      </div>
                      <span className="text-xs text-default-400">
                        {item.setName} · {item.setCode}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-default-500">
                        <span>
                          Cant: <strong>{item.quantity}</strong>
                        </span>
                        <span>
                          Precio compra:{' '}
                          <strong>{displayCurrency(item.offerPrice)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-default-400">
                        Precio referencia
                      </span>
                      <span className="text-sm font-medium text-default-600">
                        {displayCurrency(item.sellPrice || 0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <InputForm
                        label="Precio público"
                        type="number"
                        placeholder="0.00"
                        controlProps={{
                          control,
                          name: `items.${index}.publicPrice`,
                        }}
                        isRequired
                        startContent={
                          <span className="text-sm text-default-400">$</span>
                        }
                        size="sm"
                        aria-label={`Precio público de ${item.cardName}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </form>

          {validation.errors.length > 0 && items.length > 0 && (
            <>
              <Divider />
              <div className="flex flex-col gap-1">
                {validation.errors.map((error, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-danger"
                  >
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
            form="price-adjustment-form"
            isDisabled={!validation.valid}
            startContent={<Icon icon="lucide:check" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Confirmar precios
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
