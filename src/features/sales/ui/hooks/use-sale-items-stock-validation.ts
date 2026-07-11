import { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { InventoryItemsDocument } from '@/lib/api/generated/inventory.generated';
import { ISaleItem } from '../../domain/types';
import { StockValidation } from '@/shared/types/stock.types';

const MAX_INVENTORY_ITEMS_FOR_VALIDATION = 1000;

export interface UseSaleItemsStockValidationReturn {
  stockValidationMap: Map<string, StockValidation>;
  hasAnyStockIssue: boolean;
  loading: boolean;
  error: Error | undefined;
}

export function useSaleItemsStockValidation(
  items: ISaleItem[]
): UseSaleItemsStockValidationReturn {
  const primaryTcg = useMemo(() => items[0]?.tcg || 'POKEMON', [items]);

  // NOTE: Backend doesn't support filtering by specific card GUIDs.
  // FindInventoryItemsFilter only supports: tcg, condition, language, search,
  // pokemonFilters.rarity, and magicFilters.edition/isFoil/rarity.
  // This query fetches more data than needed (up to 1000 items vs ~5-20 typically needed).
  // Ideal solution would be a dedicated validateSaleItemsStock endpoint that accepts
  // an array of items and returns only stock validation results.
  const { data, loading, error } = useQuery(InventoryItemsDocument, {
    variables: {
      findInventoryItemsArgs: {
        filters: {
          tcg: primaryTcg,
        },
        limit: MAX_INVENTORY_ITEMS_FOR_VALIDATION,
        skip: 0,
        sort: {
          column: 'createdDate',
          order: 'ASC',
        },
      },
    },
    skip: items.length === 0,
  });

  useEffect(() => {
    if (error) {
      console.error('Stock validation error:', error);
      toast.error('Error al validar stock disponible');
    }
  }, [error]);

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
    error: error as Error | undefined,
  };
}
