'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Divider,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';

import { usePrivacyCurrency } from '@/lib/hooks/use-privacy-currency';
import { IPurchaseItem } from '../../domain/types';
import {
  calculateTotal,
  validatePriceAdjustment,
} from '../../domain/purchases.domain';
import { calculatePublicPrice } from '@/lib/utils/price.utils';
import {
  usePriceAdjustmentForm,
  PriceAdjustmentFormData,
} from '../../adapters/forms/use-price-adjustment-form';
import PriceAdjustmentItemsList from './price-adjustment-items-list';
import { PriceAdjustmentItemsListHandle } from './price-adjustment-types';

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
  const displayCurrency = usePrivacyCurrency();
  const [autoCalculatedItems, setAutoCalculatedItems] = useState<Set<string>>(
    new Set()
  );
  const itemsListRef = useRef<PriceAdjustmentItemsListHandle>(null);

  const { control, handleSubmit, reset, fieldArray } = usePriceAdjustmentForm();
  const { fields: _fields } = fieldArray;

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

  const profitTotal = useMemo(
    () => sellTotal - buyTotal,
    [sellTotal, buyTotal]
  );
  const profitMargin = useMemo(
    () => (buyTotal > 0 ? (profitTotal / buyTotal) * 100 : 0),
    [profitTotal, buyTotal]
  );

  useEffect(() => {
    if (isOpen) {
      const autoCalcSet = new Set<string>();

      const formItems = items.map((item) => {
        let publicPrice = item.sellPrice;

        if (!publicPrice || publicPrice === 0) {
          const refPrice =
            item.currentReferencePrice || item.referencePrice || 0;
          if (refPrice > 0) {
            publicPrice = calculatePublicPrice(refPrice);
            autoCalcSet.add(item.guid);
          } else {
            publicPrice = 0;
          }
        }

        return {
          itemId: item.guid,
          publicPrice,
        };
      });

      setAutoCalculatedItems(autoCalcSet);
      reset({ items: formItems });
    }
  }, [isOpen, items, reset]);

  useEffect(() => {
    watchedItems.forEach((watchedItem, index) => {
      const item = items[index];
      if (!item) return;

      const currentPrice = Number(watchedItem.publicPrice);
      const refPrice = item.currentReferencePrice || item.referencePrice || 0;
      const calculatedPrice = refPrice > 0 ? calculatePublicPrice(refPrice) : 0;

      if (
        autoCalculatedItems.has(item.guid) &&
        currentPrice !== calculatedPrice
      ) {
        setAutoCalculatedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.guid);
          return newSet;
        });
      }
    });
  }, [watchedItems, items, autoCalculatedItems]);

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

  const handleScrollToInvalid = () => {
    itemsListRef.current?.scrollToFirstInvalid();
  };

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size='xl'>
      <DrawerContent>
        <DrawerHeader className='flex flex-col gap-1'>
          <span className='text-accent text-lg font-semibold'>
            Ajuste de precios públicos
          </span>
          <span className='text-default-500 text-sm font-normal'>
            Define el precio de venta al público para cada carta antes de
            finalizar
          </span>
        </DrawerHeader>

        <DrawerBody className='flex flex-col gap-6'>
          <div className='flex gap-4'>
            <div className='bg-default-50 flex flex-1 flex-col gap-1 rounded-lg p-4'>
              <span className='text-default-500 text-xs'>Total compra</span>
              <span className='text-accent text-lg font-bold'>
                {displayCurrency(buyTotal)}
              </span>
            </div>
            <div className='bg-default-50 flex flex-1 flex-col gap-1 rounded-lg p-4'>
              <span className='text-default-500 text-xs'>
                Total venta (ajustado)
              </span>
              <span className='text-success text-lg font-bold'>
                {displayCurrency(sellTotal)}
              </span>
            </div>
            <div className='bg-default-50 flex flex-1 flex-col gap-1 rounded-lg p-4'>
              <span className='text-default-500 text-xs'>
                Proyección ganancia
              </span>
              <div className='flex items-center gap-2'>
                <span
                  className={`text-lg font-bold ${
                    profitTotal >= 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  {profitTotal >= 0 ? '+' : '-'}
                  {displayCurrency(Math.abs(profitTotal))}
                </span>
                <span
                  className={`text-xs ${
                    profitTotal >= 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  ({profitMargin.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          <Divider />

          <form
            id='price-adjustment-form'
            onSubmit={(...args) => {
              void handleSubmit(handleFormSubmit)(...args);
            }}
            className='flex flex-col gap-4'
          >
            <PriceAdjustmentItemsList
              ref={itemsListRef}
              items={items}
              control={control}
              displayCurrency={displayCurrency}
              itemsWithoutPrice={validation.itemsWithoutPrice}
              autoCalculatedItems={autoCalculatedItems}
            />
          </form>
        </DrawerBody>

        <DrawerFooter className='flex items-center justify-between'>
          <Button variant='light' onPress={onClose} className='text-accent'>
            Cancelar
          </Button>
          <div className='flex items-center gap-3'>
            {validation.itemsWithoutPrice.length > 0 && (
              <button
                type='button'
                onClick={handleScrollToInvalid}
                className='text-danger hover:text-danger-600 cursor-pointer text-xs underline decoration-dotted underline-offset-2 transition-colors'
              >
                {validation.itemsWithoutPrice.length} item(s) sin precio de
                venta definido
              </button>
            )}
            <Button
              type='submit'
              form='price-adjustment-form'
              isDisabled={!validation.valid}
              startContent={<Icon icon='lucide:check' />}
              className='text-white'
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Confirmar precios
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </KidstopDrawer>
  );
}
