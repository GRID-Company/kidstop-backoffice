export const USER_ROLES = {
  ADMIN: 'ADMIN',
  RECEPTION: 'RECEPTION',
  BUYER: 'BUYER',
} as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.RECEPTION]: 'Recepción',
  [USER_ROLES.BUYER]: 'Comprador',
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const USER_STATUS_LABELS: Record<string, string> = {
  [USER_STATUS.ACTIVE]: 'Activo',
  [USER_STATUS.INACTIVE]: 'Inactivo',
};

export const DEFAULT_USERS_SORT = {
  column: 'createdDate',
  order: 'DESC',
};
