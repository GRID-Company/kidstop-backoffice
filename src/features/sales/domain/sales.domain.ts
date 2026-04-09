import { formatCurrency } from '@/lib/utils/format-currency';
import { ISaleItem } from './types';

export const calculateItemSubtotal = (item: ISaleItem): number => {
  return item.price * item.quantity;
};

export const calculateTotal = (items: ISaleItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const formatSaleTotal = (items: ISaleItem[]): string => {
  return formatCurrency(calculateTotal(items));
};
