import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { DEFAULT_BUDGET_LIMIT, DEFAULT_INVENTORY_LIMIT } from './constants';
import { IPurchaseItem, PurchaseFilters } from './types';

export const getPurchasesVars = (
  args: IPaginatedApiArgs,
  filters: PurchaseFilters
) => {
  return {
    findPurchasesArgs: {
      ...args,
      filters: {
        tcgType: filters.tcgType,
        status: filters.status || undefined,
        sellerId: filters.sellerId || undefined,
        buyerId: filters.buyerId || undefined,
        search: filters.search || undefined,
      },
    },
  };
};

export const calculateItemSubtotal = (item: IPurchaseItem): number => {
  return item.unitBuyPrice * item.quantity;
};

export const calculateTotal = (items: IPurchaseItem[]): number => {
  return items.reduce(
    (total, item) => total + item.unitBuyPrice * item.quantity,
    0
  );
};

export const calculateSellTotal = (items: IPurchaseItem[]): number => {
  return items.reduce(
    (total, item) => total + item.unitSellPrice * item.quantity,
    0
  );
};

export interface BudgetCheckResult {
  withinBudget: boolean;
  currentSpent: number;
  purchaseTotal: number;
  budgetLimit: number;
  remaining: number;
}

export const checkBudget = (
  items: IPurchaseItem[],
  currentSpent: number,
  budgetLimit: number = DEFAULT_BUDGET_LIMIT
): BudgetCheckResult => {
  const purchaseTotal = calculateTotal(items);
  const remaining = budgetLimit - currentSpent - purchaseTotal;

  return {
    withinBudget: remaining >= 0,
    currentSpent,
    purchaseTotal,
    budgetLimit,
    remaining,
  };
};

export interface InventoryLimitCheckResult {
  withinLimit: boolean;
  cardId: string;
  cardName: string;
  currentStock: number;
  purchaseQuantity: number;
  inventoryLimit: number;
}

export const checkInventoryLimit = (
  item: IPurchaseItem,
  currentStock: number,
  inventoryLimit: number = DEFAULT_INVENTORY_LIMIT
): InventoryLimitCheckResult => {
  const totalAfterPurchase = currentStock + item.quantity;

  return {
    withinLimit: totalAfterPurchase <= inventoryLimit,
    cardId: item.cardId,
    cardName: item.cardName,
    currentStock,
    purchaseQuantity: item.quantity,
    inventoryLimit,
  };
};
