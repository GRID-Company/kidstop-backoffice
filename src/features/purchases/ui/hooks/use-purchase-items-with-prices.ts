import { useCallback, useRef, useEffect } from 'react';
import { IPurchaseItem } from '../../domain/types';
import { useItemsReferencePrices } from './use-items-reference-prices';

interface UsePurchaseItemsWithPricesReturn {
  itemsWithPrices: IPurchaseItem[];
  loading: boolean;
  refetchPrices: () => void;
}

export function usePurchaseItemsWithPrices(
  items: IPurchaseItem[]
): UsePurchaseItemsWithPricesReturn {
  const { itemsWithPrices, loading, refetch } = useItemsReferencePrices(items);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refetchPrices = useCallback(() => {
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
    }
    refetchTimeoutRef.current = setTimeout(() => {
      refetch();
    }, 500);
  }, [refetch]);

  useEffect(() => {
    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    itemsWithPrices,
    loading,
    refetchPrices,
  };
}
