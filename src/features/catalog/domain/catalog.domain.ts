import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { ISelectOption } from '@/shared/base/heorui-overrides/select';
import {
  CARD_CONDITIONS,
  CARD_CONDITION_SHORT_LABELS,
  DEFAULT_MARGIN_PERCENTAGE,
  MIN_PRICE,
} from './constants';
import { CardCondition, CardFilters } from './types';
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

export const toSetCodeOptions = (
  collections: Array<{ guid: string; name: string; code?: string | null }> = []
): ISelectOption[] =>
  collections.map((collection) => ({
    value: collection.guid,
    label: collection.code
      ? `${collection.code.toUpperCase()} — ${collection.name}`
      : collection.name,
  }));

export const summarizeConditionStock = (
  variants: Array<{ condition: string; stock: number }>
): Array<{ label: string; stock: number }> => {
  const totals = new Map<string, number>();
  for (const variant of variants) {
    if (variant.stock <= 0) continue;
    totals.set(
      variant.condition,
      (totals.get(variant.condition) ?? 0) + variant.stock
    );
  }

  const order = Object.values(CARD_CONDITIONS) as string[];
  return [...totals.entries()]
    .sort(
      ([a], [b]) =>
        (order.includes(a) ? order.indexOf(a) : order.length) -
        (order.includes(b) ? order.indexOf(b) : order.length)
    )
    .map(([condition, stock]) => ({
      label:
        CARD_CONDITION_SHORT_LABELS[condition as CardCondition] ?? condition,
      stock,
    }));
};

export const getMinStockedPurchasePrice = (
  variants: Array<{ stock: number; purchasePrice: number | null }>
): number | null => {
  const prices = variants
    .filter((v) => v.stock > 0 && v.purchasePrice != null)
    .map((v) => v.purchasePrice as number);
  return prices.length > 0 ? Math.min(...prices) : null;
};

export const calculateGrossMarginPercent = (
  sellPrice: number | null | undefined,
  purchasePrice: number | null | undefined
): number | null => {
  if (sellPrice == null || purchasePrice == null || sellPrice <= 0) return null;
  return ((sellPrice - purchasePrice) / sellPrice) * 100;
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
