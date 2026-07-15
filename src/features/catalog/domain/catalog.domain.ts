import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { DEFAULT_MARGIN_PERCENTAGE, MIN_PRICE } from './constants';
import { CardFilters } from './types';
import { BulkOperationType } from '@/lib/api/schema-types';

export const getCardsVars = (args: IPaginatedApiArgs, filters: CardFilters) => {
  return {
    findCardsArgs: {
      ...args,
      filters: {
        tcgType: filters.tcgType,
        setCode: filters.setCode || undefined,
        rarity: filters.rarity || undefined,
        search: filters.search || undefined,
      },
    },
  };
};

export const calculatePriceMargin = (
  buyPrice: number,
  marginPercentage: number = DEFAULT_MARGIN_PERCENTAGE
): number => {
  if (buyPrice < MIN_PRICE) return MIN_PRICE;
  if (marginPercentage < 0)
    throw new Error('Margin percentage cannot be negative');

  return Math.round(buyPrice * (1 + marginPercentage / 100) * 100) / 100;
};

/**
 * Determines if a stock adjustment operation should be disabled based on quantity and operation type.
 *
 * Business Rules:
 * - ManualEntry (add stock): Disabled when quantity = 0 (no effect)
 * - ManualExit (remove stock): Disabled when quantity = 0 (no effect)
 * - ManualSet (set absolute stock): Enabled even when quantity = 0 (valid operation to clear stock)
 *
 * @param stockAdjustment - The stock adjustment quantity
 * @param movementType - The type of bulk operation (ManualEntry, ManualExit, or ManualSet)
 * @returns true if the operation should be disabled, false otherwise
 */
export const isStockAdjustmentDisabled = (
  stockAdjustment: number,
  movementType: BulkOperationType
): boolean => {
  return stockAdjustment === 0 && movementType !== BulkOperationType.ManualSet;
};
