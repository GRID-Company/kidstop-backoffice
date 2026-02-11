import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { FulfillmentStatus, FULFILLMENT_STATUS, ISaleItem, SaleCode, SaleFilters } from './types';

export const getSalesVars = (
  args: IPaginatedApiArgs,
  filters: SaleFilters
) => {
  return {
    findSalesArgs: {
      ...args,
      filters: {
        tcgType: filters.tcgType,
        status: filters.status || undefined,
        customerId: filters.customerId || undefined,
        search: filters.search || undefined,
      },
    },
  };
};

const SALE_CODE_PREFIX = 'KSP';
const SALE_CODE_LENGTH = 6;

export const generateSaleCode = (): SaleCode => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < SALE_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${SALE_CODE_PREFIX}-${code}`;
};

export const calculateItemSubtotal = (item: ISaleItem): number => {
  return item.unitPrice * item.quantity;
};

export const calculateTotal = (items: ISaleItem[]): number => {
  return items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
};

export const formatSaleTotal = (items: ISaleItem[]): string => {
  return formatCurrency(calculateTotal(items));
};

export const deriveFulfillmentStatus = (
  foundQuantity: number,
  requestedQuantity: number
): FulfillmentStatus => {
  if (foundQuantity <= 0) return FULFILLMENT_STATUS.PENDING;
  if (foundQuantity >= requestedQuantity) return FULFILLMENT_STATUS.FOUND;
  return FULFILLMENT_STATUS.PARTIAL;
};

export const calculateAdjustedTotal = (items: ISaleItem[]): number => {
  return items.reduce(
    (total, item) => total + Math.min(item.foundQuantity, item.quantity) * item.unitPrice,
    0
  );
};
