'use client';

import { useMemo } from 'react';
import ItemsList from '@/shared/components/items-list';
import { ISaleItem } from '../../domain/types';
import { calculateTotal } from '../../domain/sales.domain';
import { adaptSaleItem } from '@/shared/utils/item-adapters';

interface SaleItemsListProps {
  items: ISaleItem[];
  onUpdateItem?: (itemId: string, updates: Partial<ISaleItem>) => void;
  onRemoveItem?: (itemId: string) => void;
  isReadOnly?: boolean;
}

export default function SaleItemsList({
  items,
  onUpdateItem,
  onRemoveItem,
  isReadOnly = true,
}: SaleItemsListProps) {
  const adaptedItems = useMemo(
    () => items.map(adaptSaleItem),
    [items]
  );

  const calculateTotalWrapper = useMemo(
    () => () => calculateTotal(items),
    [items]
  );

  const handleUpdateItem = (itemId: string, updates: any) => {
    if (onUpdateItem) {
      onUpdateItem(itemId, updates);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
  };

  return (
    <ItemsList
      items={adaptedItems}
      onUpdateItem={handleUpdateItem}
      onRemoveItem={handleRemoveItem}
      calculateTotal={calculateTotalWrapper}
      isReadOnly={isReadOnly}
      variant="sale"
      totalLabel="Total pedido"
      emptyMessage="No hay items en el pedido"
    />
  );
}
