import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { ISaleItem, SaleFilters } from './types';

export const getSalesVars = (
  args: IPaginatedApiArgs,
  filters: SaleFilters
) => {
  return {
    findSalesArgs: {
      ...args,
      filters: {
        tcg: filters.tcg,
        status: filters.status || undefined,
        customer: filters.customer || undefined,
        search: filters.search || undefined,
        ...(filters.dateFrom || filters.dateTo
          ? {
              createdDate: {
                filterType: ':daterange:',
                range: {
                  from: filters.dateFrom,
                  to: filters.dateTo,
                },
              },
            }
          : {}),
      },
    },
  };
};

export const calculateItemSubtotal = (item: ISaleItem): number => {
  return item.price * item.quantity;
};

export const calculateTotal = (items: ISaleItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const formatSaleTotal = (items: ISaleItem[]): string => {
  return formatCurrency(calculateTotal(items));
};
