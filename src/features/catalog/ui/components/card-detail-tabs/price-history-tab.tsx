'use client';

import SellPriceHistoryTable from '../sell-price-history-table';

interface PriceHistoryTabProps {
  inventoryItemGuid: string;
}

export default function PriceHistoryTab({
  inventoryItemGuid,
}: PriceHistoryTabProps) {
  return (
    <div data-testid='tab-price-history'>
      <SellPriceHistoryTable inventoryItemGuid={inventoryItemGuid} />
    </div>
  );
}
