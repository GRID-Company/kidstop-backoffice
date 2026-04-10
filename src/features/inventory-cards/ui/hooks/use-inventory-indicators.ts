import { useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { IndicatorsInventoryItemsDocument } from '@/lib/api/generated/inventory.generated';

export function useInventoryIndicators(tcg: string) {
  const { data, loading, refetch } = useQuery(IndicatorsInventoryItemsDocument, {
    variables: { tcg, forceRefresh: false },
    fetchPolicy: 'network-only',
  });

  const refresh = useCallback(() => {
    void refetch({ tcg, forceRefresh: true });
  }, [refetch, tcg]);

  return {
    totalStock: data?.indicatorsInventoryItems?.totalStock ?? 0,
    lastSellDate: data?.indicatorsInventoryItems?.lastSellDate
      ? String(data.indicatorsInventoryItems.lastSellDate)
      : null,
    avgDaysInInventory: data?.indicatorsInventoryItems?.avgDaysInInventory ?? null,
    loading,
    refresh,
  };
}
