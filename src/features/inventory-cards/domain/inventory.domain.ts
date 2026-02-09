import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { DEFAULT_INVENTORY_LIMIT } from './constants';
import { IInventoryItem, IInventoryMovement, InventoryFilters } from './types';

export const getInventoryVars = (
  args: IPaginatedApiArgs,
  filters: InventoryFilters
) => {
  return {
    findInventoryArgs: {
      ...args,
      filters: {
        tcgType: filters.tcgType,
        condition: filters.condition || undefined,
        stockStatus: filters.stockStatus || undefined,
        search: filters.search || undefined,
      },
    },
  };
};

export const calculateMargin = (buyPrice: number, sellPrice: number): number => {
  if (buyPrice <= 0) return 0;
  return Math.round(((sellPrice - buyPrice) / buyPrice) * 100 * 100) / 100;
};

export const calculateAvgDaysInInventory = (
  movements: IInventoryMovement[]
): number | null => {
  const entries = movements.filter((m) => m.type === 'PURCHASE_ENTRY');
  const exits = movements.filter((m) => m.type === 'SALE_EXIT');

  if (entries.length === 0 || exits.length === 0) return null;

  const totalDays = exits.reduce((sum, exit) => {
    const exitDate = new Date(exit.createdAt);
    const matchingEntry = entries.find(
      (e) => e.inventoryItemId === exit.inventoryItemId && new Date(e.createdAt) <= exitDate
    );
    if (!matchingEntry) return sum;
    const entryDate = new Date(matchingEntry.createdAt);
    const diffDays = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
    return sum + diffDays;
  }, 0);

  return Math.round((totalDays / exits.length) * 100) / 100;
};

export const validateStock = (
  currentStock: number,
  quantityChange: number
): boolean => {
  return currentStock + quantityChange >= 0;
};

export const isOverInventoryLimit = (
  item: IInventoryItem,
  limit: number = DEFAULT_INVENTORY_LIMIT
): boolean => {
  return item.stock >= limit;
};

export interface InventoryMetrics {
  totalStock: number;
  lastSoldAt: string | null;
  avgDaysInInventory: number | null;
}

export const calculateInventoryMetrics = (
  items: IInventoryItem[]
): InventoryMetrics => {
  if (items.length === 0) {
    return { totalStock: 0, lastSoldAt: null, avgDaysInInventory: null };
  }

  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

  const lastSoldAt = items.reduce<string | null>((latest, item) => {
    if (!item.lastSoldAt) return latest;
    if (!latest) return item.lastSoldAt;
    return new Date(item.lastSoldAt) > new Date(latest) ? item.lastSoldAt : latest;
  }, null);

  const itemsWithDays = items.filter((i) => i.avgDaysInInventory != null);
  const avgDaysInInventory =
    itemsWithDays.length > 0
      ? Math.round(
          (itemsWithDays.reduce((sum, i) => sum + i.avgDaysInInventory!, 0) /
            itemsWithDays.length) *
            100
        ) / 100
      : null;

  return { totalStock, lastSoldAt, avgDaysInInventory };
};
