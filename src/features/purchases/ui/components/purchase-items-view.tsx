'use client';

import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { TCGType } from '@/lib/types/tcg.types';
import { usePurchaseItemsViewStore } from '@/lib/store/purchase-items-view';
import { IPurchaseItem } from '../../domain/types';
import PurchaseItemsList from './purchase-items-list';
import PurchaseItemsTable from './purchase-items-table';
import PurchaseItemsViewToggle from './purchase-items-view-toggle';

interface PurchaseItemsViewProps {
  items: IPurchaseItem[];
  onUpdateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onRefetchPrices?: (refetch: (items?: IPurchaseItem[]) => void) => void;
  showRefreshButton?: boolean;
  tcgType?: TCGType;
  isReadOnly?: boolean;
  canEditSellPrice?: boolean;
  onSellPriceSave?: (
    item: IPurchaseItem,
    sellPrice: number
  ) => void | Promise<void>;
}

export default function PurchaseItemsView({
  items,
  onUpdateItem,
  onRemoveItem,
  onRefetchPrices,
  showRefreshButton = false,
  tcgType,
  isReadOnly = false,
  canEditSellPrice = false,
  onSellPriceSave,
}: PurchaseItemsViewProps) {
  const view = usePurchaseItemsViewStore((state) => state.view);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Icon icon='lucide:list' width={18} className='text-accent' />
          <span className='text-sm font-semibold'>Items de la compra</span>
          <Chip size='sm' variant='flat'>
            {items.length} {items.length === 1 ? 'carta' : 'cartas'}
          </Chip>
        </div>
        <PurchaseItemsViewToggle />
      </div>
      {view === 'table' ? (
        <PurchaseItemsTable
          items={items}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          onRefetchPrices={onRefetchPrices}
          showRefreshButton={showRefreshButton}
          tcgType={tcgType}
          isReadOnly={isReadOnly}
          canEditSellPrice={canEditSellPrice}
          onSellPriceSave={onSellPriceSave}
        />
      ) : (
        <PurchaseItemsList
          items={items}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          onRefetchPrices={onRefetchPrices}
          showRefreshButton={showRefreshButton}
          tcgType={tcgType}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
}
