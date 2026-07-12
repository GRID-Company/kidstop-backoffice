'use client';

import InventoryMovementsTable from '../inventory-movements-table';

interface MovementsHistoryTabProps {
  inventoryItemGuid: string;
  tcgType: 'POKEMON' | 'MAGIC';
}

export default function MovementsHistoryTab({
  inventoryItemGuid,
  tcgType,
}: MovementsHistoryTabProps) {
  return (
    <div data-testid='tab-movements'>
      <InventoryMovementsTable
        inventoryItemGuid={inventoryItemGuid}
        tcg={tcgType}
      />
    </div>
  );
}
