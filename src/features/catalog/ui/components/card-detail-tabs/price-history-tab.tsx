'use client';

import { ISelectOption } from '@/shared/base/heorui-overrides/select';
import SellPriceHistoryTable from '../sell-price-history-table';

interface PriceHistoryTabProps {
  cardGuid: string;
  languageOptions: ISelectOption[];
}

export default function PriceHistoryTab({
  cardGuid,
  languageOptions,
}: PriceHistoryTabProps) {
  return (
    <div data-testid='tab-price-history'>
      <SellPriceHistoryTable
        cardGuid={cardGuid}
        languageOptions={languageOptions}
      />
    </div>
  );
}
