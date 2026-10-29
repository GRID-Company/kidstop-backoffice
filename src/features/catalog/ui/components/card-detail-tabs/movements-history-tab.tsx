'use client';

import { ISelectOption } from '@/shared/base/heorui-overrides/select';
import InventoryMovementsTable from '../inventory-movements-table';

interface MovementsHistoryTabProps {
  cardGuid: string;
  tcgType: 'POKEMON' | 'MAGIC';
  languageOptions: ISelectOption[];
}

export default function MovementsHistoryTab({
  cardGuid,
  tcgType,
  languageOptions,
}: MovementsHistoryTabProps) {
  return (
    <div data-testid='tab-movements'>
      <InventoryMovementsTable
        cardGuid={cardGuid}
        tcg={tcgType}
        languageOptions={languageOptions}
      />
    </div>
  );
}
