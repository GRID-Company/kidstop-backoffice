import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD } from './constants';
import { CustomerFilters, ICustomer } from './types';

export const getCustomersVars = (
  args: IPaginatedApiArgs,
  filters: CustomerFilters
) => {
  return {
    findUsersArgs: {
      ...args,
      ...(filters.search ? { search: filters.search } : {}),
      filters: {
        role: { filterType: ':multiple_values:', values: ['CLIENT'] },
        active: true,
        ...(filters.clientStatus ? { clientStatus: filters.clientStatus } : {}),
      },
    },
  };
};

export const checkBlockThreshold = (
  customer: ICustomer,
  threshold: number = DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD
): boolean => {
  return (customer.uncompletedOrders ?? 0) >= threshold;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
