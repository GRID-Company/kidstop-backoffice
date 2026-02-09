import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD } from './constants';
import { CustomerFilters, ICustomer } from './types';

export const getCustomersVars = (
  args: IPaginatedApiArgs,
  filters: CustomerFilters
) => {
  return {
    findCustomersArgs: {
      ...args,
      filters: {
        type: filters.type || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      },
    },
  };
};

export const checkBlockThreshold = (
  customer: ICustomer,
  threshold: number = DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD
): boolean => {
  return customer.uncompletedOrders >= threshold;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
