'use client';

import { useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { FormProvider, useForm } from 'react-hook-form';
import { usePrivacyCurrency } from '@/lib/hooks/use-privacy-currency';
import { IPurchaseItem } from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';
import { useItemsReferencePrices } from '../hooks/use-items-reference-prices';
import PurchaseItemCard from './purchase-item-card';

interface PurchaseItemsListProps {
  items: IPurchaseItem[];
  onUpdateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onRefetchPrices?: (refetch: (items?: IPurchaseItem[]) => void) => void;
  isReadOnly?: boolean;
}

export default function PurchaseItemsList({
  items,
  onUpdateItem,
  onRemoveItem,
  onRefetchPrices,
  isReadOnly = false,
}: PurchaseItemsListProps) {
  const displayCurrency = usePrivacyCurrency();
  const { itemsWithPrices, refetch: refetchPrices } = useItemsReferencePrices(items);

  const form = useForm({
    defaultValues: {
      cards: items.map((item) => ({
        condition: item.condition,
        quantity: item.quantity,
        offerPrice: item.offerPrice,
      })),
    },
  });

  useEffect(() => {
    if (onRefetchPrices) {
      onRefetchPrices(refetchPrices);
    }
  }, [refetchPrices, onRefetchPrices]);

  useEffect(() => {
    form.reset({
      cards: items.map((item) => ({
        condition: item.condition,
        quantity: item.quantity,
        offerPrice: item.offerPrice,
      })),
    });
  }, [items, form]);

  useEffect(() => {
    if (!isReadOnly) {
      const subscription = form.watch((value, { name }) => {
        if (name && name.startsWith('cards.')) {
          const match = name.match(/^cards\.(\d+)\.(.+)$/);
          if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            const item = items[index];
            
            if (item) {
              const cardData = value.cards?.[index];
              if (cardData) {
                onUpdateItem(item.guid, {
                  [field]: cardData[field as keyof typeof cardData],
                });
              }
            }
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [form, items, onUpdateItem, isReadOnly]);

  const total = useMemo(() => calculateTotal(itemsWithPrices), [itemsWithPrices]);

  if (itemsWithPrices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-default-400">
        <Icon icon="lucide:package-open" width={40} className="mb-2" />
        <span className="text-sm">No hay items en la compra</span>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          {itemsWithPrices.map((item, index) => (
            <PurchaseItemCard
              key={item.guid}
              item={item}
              index={index}
              onRemove={isReadOnly ? undefined : onRemoveItem}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>

        <div className="flex justify-end border-t border-default-200 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-500">Total compra:</span>
            <span className="text-lg font-bold text-accent">
              {displayCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
