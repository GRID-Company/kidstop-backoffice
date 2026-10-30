import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { DEFAULT_INVENTORY_LIMIT, MOVEMENT_TYPES } from './constants';
import { IInventoryItem, InventoryFilters, MovementType } from './types';

export const getInventoryVars = (
  args: IPaginatedApiArgs,
  filters: InventoryFilters
) => {
  return {
    findInventoryItemsArgs: {
      ...args,
      filters: {
        condition: filters.condition || undefined,
        search: filters.search || undefined,
      },
    },
  };
};

export const calculateMargin = (
  purchasePrice: number,
  sellPrice: number
): number => {
  if (purchasePrice <= 0) return 0;
  return (
    Math.round(((sellPrice - purchasePrice) / purchasePrice) * 100 * 100) / 100
  );
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

export const getMovementReferenceHref = (
  movementType: MovementType | string,
  reference?: string | null
): string | null => {
  if (!reference) return null;
  if (movementType === MOVEMENT_TYPES.PURCHASE_ENTRY) {
    return `/compras?search=${encodeURIComponent(reference)}`;
  }
  if (movementType === MOVEMENT_TYPES.SALE_EXIT) {
    return `/ventas?search=${encodeURIComponent(reference)}`;
  }
  return null;
};
