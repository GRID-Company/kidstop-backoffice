'use client';

import { useEffect, useMemo } from 'react';
import ItemsList from '@/shared/components/items-list';
import { IPurchaseItem } from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';
import { useItemsReferencePrices } from '../hooks/use-items-reference-prices';
import { adaptPurchaseItem } from '@/shared/utils/item-adapters';

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
  const { itemsWithPrices, refetch: refetchPrices } = useItemsReferencePrices(items);

  useEffect(() => {
    if (onRefetchPrices) {
      onRefetchPrices(refetchPrices);
    }
  }, [refetchPrices, onRefetchPrices]);

  const adaptedItems = useMemo(
    () => itemsWithPrices.map(adaptPurchaseItem),
    [itemsWithPrices]
  );

  return (
    <ItemsList
      items={adaptedItems}
      onUpdateItem={onUpdateItem}
      onRemoveItem={onRemoveItem}
      calculateTotal={calculateTotal}
      isReadOnly={isReadOnly}
      variant="purchase"
      totalLabel="Total compra"
      emptyMessage="No hay items en la compra"
    />
  );
}
