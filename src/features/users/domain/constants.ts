import { UserRole, USER_ROLE_LABELS } from '@/lib/auth/user-roles';

export { USER_ROLE_LABELS };

export const USER_ROLES = {
  ADMIN: UserRole.ADMIN,
  RECEPTION: UserRole.RECEPTION,
  BUYER: UserRole.BUYER,
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const USER_STATUS_LABELS: Record<string, string> = {
  [USER_STATUS.ACTIVE]: 'Activo',
  [USER_STATUS.INACTIVE]: 'Inactivo',
};

export const USER_ROLE_OPTIONS = Object.values(USER_ROLES).map((role) => ({
  value: role,
  label: USER_ROLE_LABELS[role],
}));

export const USER_STATUS_OPTIONS = [
  { value: 'true', label: USER_STATUS_LABELS[USER_STATUS.ACTIVE] },
  { value: 'false', label: USER_STATUS_LABELS[USER_STATUS.INACTIVE] },
];

export const DEFAULT_USERS_SORT = {
  column: 'createdDate',
  order: 'DESC',
};

export const DEFAULT_PAGE_SIZE = 10;
