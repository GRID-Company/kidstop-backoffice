import { useQuery } from '@apollo/client/react';
import { IndicatorsInventoryItemsDocument } from '@/lib/api/generated/inventory.generated';

export function useInventoryIndicators(tcg: string) {
  const { data, loading } = useQuery(IndicatorsInventoryItemsDocument, {
    variables: { tcg, forceRefresh: false },
    fetchPolicy: 'network-only',
  });

  return {
    totalStock: data?.indicatorsInventoryItems?.totalStock ?? 0,
    lastSellDate: data?.indicatorsInventoryItems?.lastSellDate
      ? String(data.indicatorsInventoryItems.lastSellDate)
      : null,
    avgDaysInInventory: data?.indicatorsInventoryItems?.avgDaysInInventory ?? null,
    loading,
  };
}
