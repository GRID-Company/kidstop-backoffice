'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Accordion, AccordionItem } from '@heroui/react';
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
  const [isExpanded, setIsExpanded] = useState(true);

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
        <Accordion
          className="w-full"
          selectedKeys={isExpanded ? ['items'] : []}
          onSelectionChange={(keys) => {
            setIsExpanded(Array.from(keys).includes('items'));
          }}
        >
          <AccordionItem
            key="items"
            aria-label="Items de la compra"
            title={
              <div className="flex items-center justify-between w-full pr-2">
                <span className="text-sm font-medium text-default-700">
                  {itemsWithPrices.length} {itemsWithPrices.length === 1 ? 'carta' : 'cartas'}
                </span>
                {!isExpanded && (
                  <span className="text-sm font-semibold text-accent">
                    {displayCurrency(total)}
                  </span>
                )}
              </div>
            }
            classNames={{
              trigger: 'py-2 px-3 hover:bg-default-100 rounded-lg transition-colors cursor-pointer',
              content: 'pt-2',
              indicator: 'text-default-400',
            }}
          >
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
          </AccordionItem>
        </Accordion>

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
