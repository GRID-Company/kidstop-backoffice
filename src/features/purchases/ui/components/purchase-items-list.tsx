'use client';

import { useEffect, useMemo } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
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
  showRefreshButton?: boolean;
  isReadOnly?: boolean;
}

export default function PurchaseItemsList({
  items,
  onUpdateItem,
  onRemoveItem,
  onRefetchPrices,
  showRefreshButton = false,
  isReadOnly = false,
}: PurchaseItemsListProps) {
  const { itemsWithPrices, loading, refetch: refetchPrices } = useItemsReferencePrices(items);

  useEffect(() => {
    if (onRefetchPrices) {
      onRefetchPrices(refetchPrices);
    }
  }, [refetchPrices, onRefetchPrices]);

  const adaptedItems = useMemo(
    () => itemsWithPrices.map(adaptPurchaseItem),
    [itemsWithPrices]
  );

  const calculateTotalWrapper = useMemo(
    () => () => calculateTotal(itemsWithPrices),
    [itemsWithPrices]
  );

  return (
    <div className="flex flex-col gap-3">
      {showRefreshButton && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={
              loading ? (
                <Icon icon="lucide:loader-2" width={16} className="animate-spin" />
              ) : (
                <Icon icon="lucide:refresh-cw" width={16} />
              )
            }
            onPress={() => refetchPrices(items)}
            isDisabled={loading || items.length === 0}
          >
            {loading ? 'Actualizando...' : 'Actualizar precios de referencia'}
          </Button>
        </div>
      )}
      <ItemsList
        items={adaptedItems}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
        calculateTotal={calculateTotalWrapper}
        isReadOnly={isReadOnly}
        variant="purchase"
        totalLabel="Total compra"
        emptyMessage="No hay items en la compra"
      />
    </div>
  );
}
