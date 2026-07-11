import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { InventoryItemsDocument } from '@/lib/api/generated/inventory.generated';
import { ISaleItem } from '../../domain/types';

export interface StockValidation {
  available: number;
  requested: number;
  hasStock: boolean;
}

export interface UseSaleItemsStockValidationReturn {
  stockValidationMap: Map<string, StockValidation>;
  hasAnyStockIssue: boolean;
  loading: boolean;
}

export function useSaleItemsStockValidation(
  items: ISaleItem[]
): UseSaleItemsStockValidationReturn {
  const primaryTcg = useMemo(() => items[0]?.tcg || 'POKEMON', [items]);

  const { data, loading } = useQuery(InventoryItemsDocument, {
    variables: {
      findInventoryItemsArgs: {
        filters: {
          tcg: primaryTcg,
        },
        limit: 10000,
        skip: 0,
        sort: {
          column: 'createdDate',
          order: 'ASC',
        },
      },
    },
    skip: items.length === 0,
  });

  const stockValidationMap = useMemo(() => {
    const map = new Map<string, StockValidation>();

    if (loading || items.length === 0) {
      return map;
    }

    const inventoryItems = data?.inventoryItems?.data || [];

    items.forEach((item) => {
      const cardGuid =
        item.pokemonCardSummary?.guid || item.magicCardSummary?.guid;

      if (!cardGuid) {
        map.set(item.guid, {
          available: 0,
          requested: item.quantity,
          hasStock: false,
        });
        return;
      }

      const matchingInventoryItem = inventoryItems.find((invItem) => {
        const invCardGuid =
          invItem.pokemonCardSummary?.guid || invItem.magicCardSummary?.guid;
        return (
          invCardGuid === cardGuid &&
          invItem.condition === item.condition &&
          invItem.language === item.language
        );
      });

      const availableStock = matchingInventoryItem?.stock || 0;

      map.set(item.guid, {
        available: availableStock,
        requested: item.quantity,
        hasStock: availableStock >= item.quantity,
      });
    });

    return map;
  }, [items, data, loading]);

  const hasAnyStockIssue = useMemo(() => {
    return Array.from(stockValidationMap.values()).some(
      (validation) => !validation.hasStock
    );
  }, [stockValidationMap]);

  return {
    stockValidationMap,
    hasAnyStockIssue,
    loading,
  };
}
