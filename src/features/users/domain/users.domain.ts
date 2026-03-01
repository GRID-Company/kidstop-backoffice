import { FindUsersArgs } from '@/lib/api/schema-types';
import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { USER_ROLES } from './constants';
import { UserFilters, UserRole } from './types';

export const getUsersVars = (
  args: IPaginatedApiArgs,
  filters?: UserFilters
): { findUsersArgs: FindUsersArgs } => {
  return {
    findUsersArgs: {
      skip: args.skip,
      limit: args.limit,
      sort: {
        column: args.sort.column,
        order: args.sort.order,
      },
      search: args.search,
      filters: {
        role: filters?.role,
        active: filters?.active,
      },
    },
  };
};

export const validateUserRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole);
};
