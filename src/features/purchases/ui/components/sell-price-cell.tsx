'use client';

import { useCallback, useState } from 'react';

import OverrideInput from '@/shared/base/heorui-overrides/input';
import { IPurchaseItem } from '../../domain/types';
import { validateSellPrice } from '../../adapters/forms/price-schemas';

interface SellPriceCellProps {
  item: IPurchaseItem;
  onSave: (item: IPurchaseItem, sellPrice: number) => void;
}

export default function SellPriceCell({ item, onSave }: SellPriceCellProps) {
  const [draft, setDraft] = useState(
    item.sellPrice !== undefined ? String(item.sellPrice) : ''
  );

  const resetDraft = useCallback(() => {
    setDraft(item.sellPrice !== undefined ? String(item.sellPrice) : '');
  }, [item.sellPrice]);

  const commit = useCallback(() => {
    const { isValid, price } = validateSellPrice(draft);
    if (!isValid || price === item.sellPrice) {
      resetDraft();
      return;
    }
    void Promise.resolve(onSave(item, price)).catch(resetDraft);
  }, [draft, item, onSave, resetDraft]);

  return (
    <OverrideInput
      aria-label='Precio de venta'
      data-testid='purchase-item-sell-price-input'
      data-item-guid={item.guid}
      type='number'
      size='sm'
      variant='bordered'
      min={0}
      step={0.01}
      value={draft}
      onValueChange={setDraft}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          commit();
        } else if (event.key === 'Escape') {
          resetDraft();
        }
      }}
      startContent={<span className='text-default-400 text-xs'>$</span>}
      classNames={{
        inputWrapper: 'border-[1px] bg-white w-full pr-1',
        input: 'text-right pr-6',
      }}
    />
  );
}
