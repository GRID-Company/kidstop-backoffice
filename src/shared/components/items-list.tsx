'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { FormProvider, useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Accordion, AccordionItem } from '@heroui/react';
import { formatCurrency } from '@/lib/utils/format-currency';
import ItemCard from './item-card';
import { AdaptedPurchaseItem, AdaptedSaleItem, ItemVariant } from '@/shared/utils/item-adapters';

type AdaptedItem = AdaptedPurchaseItem | AdaptedSaleItem;

interface ItemsListProps {
  items: AdaptedItem[];
  onUpdateItem: (itemId: string, updates: Record<string, unknown>) => void;
  onRemoveItem: (itemId: string) => void;
  calculateTotal: (items: AdaptedItem[]) => number;
  isReadOnly?: boolean;
  variant?: ItemVariant;
  totalLabel?: string;
  emptyMessage?: string;
}

export default function ItemsList({
  items,
  onUpdateItem,
  onRemoveItem,
  calculateTotal,
  isReadOnly = false,
  variant = 'purchase',
  totalLabel = 'Total',
  emptyMessage = 'No hay items',
}: ItemsListProps) {

  const form = useForm({
    defaultValues: {
      cards: items.map((item: AdaptedItem) => ({
        condition: item.condition,
        quantity: item.quantity,
        ...(variant === 'purchase' && 'offerPrice' in item ? { offerPrice: (item as AdaptedPurchaseItem).offerPrice } : {}),
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'cards',
  });

  const watchedCards = useWatch({
    control: form.control,
    name: 'cards',
  }) as Array<{ condition: string; quantity: number; offerPrice?: number }> | undefined;

  const prevWatchedCardsRef = useRef<typeof watchedCards>(undefined);

  useEffect(() => {
    form.reset({
      cards: items.map((item: AdaptedItem) => ({
        condition: item.condition,
        quantity: item.quantity,
        ...(variant === 'purchase' && 'offerPrice' in item ? { offerPrice: (item as AdaptedPurchaseItem).offerPrice } : {}),
      })),
    });
    prevWatchedCardsRef.current = watchedCards;
  }, [items, form, variant]);

  useEffect(() => {
    if (isReadOnly || !watchedCards || !prevWatchedCardsRef.current) {
      prevWatchedCardsRef.current = watchedCards;
      return;
    }

    watchedCards.forEach((cardData, index) => {
      const item = items[index];
      const prevCardData = prevWatchedCardsRef.current?.[index];
      if (!item || !cardData || !prevCardData) return;

      const changes: Record<string, unknown> = {};

      if (cardData.condition !== prevCardData.condition) {
        changes.condition = cardData.condition;
      }
      if (cardData.quantity !== prevCardData.quantity) {
        changes.quantity = cardData.quantity;
      }
      if (variant === 'purchase' && 'offerPrice' in cardData && 'offerPrice' in prevCardData) {
        if (cardData.offerPrice !== prevCardData.offerPrice) {
          changes.offerPrice = cardData.offerPrice;
        }
      }

      if (Object.keys(changes).length > 0) {
        onUpdateItem(item.guid, changes);
      }
    });

    prevWatchedCardsRef.current = watchedCards;
  }, [watchedCards, items, onUpdateItem, isReadOnly, variant]);

  const total = useMemo(() => calculateTotal(items), [items, calculateTotal]);
  const [isExpanded, setIsExpanded] = useState(true);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-default-400">
        <Icon icon="lucide:package-open" width={40} className="mb-2" />
        <span className="text-sm">{emptyMessage}</span>
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
            aria-label="Items"
            title={
              <div className="flex items-center justify-between w-full pr-2">
                <span className="text-sm font-medium text-default-700">
                  {items.length} {items.length === 1 ? 'carta' : 'cartas'}
                </span>
                {!isExpanded && (
                  <span className="text-sm font-semibold text-accent">
                    {formatCurrency(total)}
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
              {items.map((item: AdaptedItem, index: number) => (
                <ItemCard
                  key={item.guid}
                  item={item}
                  index={index}
                  onRemove={isReadOnly ? undefined : onRemoveItem}
                  isReadOnly={isReadOnly}
                  variant={variant}
                  allItems={items}
                />
              ))}
            </div>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end border-t border-default-200 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-500">{totalLabel}:</span>
            <span className="text-lg font-bold text-accent">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
