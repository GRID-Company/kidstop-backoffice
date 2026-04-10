import { FindUsersArgs } from '@/lib/api/schema-types';
import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { USER_ROLES } from './constants';
import { UserFilters, UserRole } from './types';

/** Roles que se muestran en el listado de usuarios (excluye CLIENT regular) */
const VISIBLE_USER_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.RECEPTION,
  USER_ROLES.BUYER,
  USER_ROLES.CLIENT_KIOSK,
];

export const getUsersVars = (
  args: IPaginatedApiArgs,
  filters?: UserFilters
): { findUsersArgs: FindUsersArgs } => {
  const roleFilter = filters?.role
    ? { filterType: ':multiple_values:' as const, values: [filters.role] }
    : { filterType: ':multiple_values:' as const, values: VISIBLE_USER_ROLES };

  return {
    findUsersArgs: {
      ...args,
      search: args.search,
      filters: {
        role: roleFilter,
        active: filters?.active,
      },
    },
  };
};

export const validateUserRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole);
};
