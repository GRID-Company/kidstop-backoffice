import { ITableSort } from '@/lib/types/datatable.types';

export const CUSTOMER_ROLES = {
  CLIENT: 'CLIENT',
  CLIENT_KIOSK: 'CLIENT_KIOSK',
} as const;

export const CUSTOMER_ROLE_LABELS: Record<string, string> = {
  [CUSTOMER_ROLES.CLIENT]: 'Cliente',
  [CUSTOMER_ROLES.CLIENT_KIOSK]: 'Kiosk',
};

export const CUSTOMER_ROLE_COLORS: Record<string, 'default' | 'secondary'> = {
  [CUSTOMER_ROLES.CLIENT]: 'default',
  [CUSTOMER_ROLES.CLIENT_KIOSK]: 'secondary',
};

export const CLIENT_STATUSES = {
  STANDARD: 'STANDARD',
  VIP: 'VIP',
  BLOCKED: 'BLOCKED',
} as const;

export const CLIENT_STATUS_TYPE_LABELS: Record<string, string> = {
  [CLIENT_STATUSES.STANDARD]: 'Cliente',
  [CLIENT_STATUSES.VIP]: 'VIP',
  [CLIENT_STATUSES.BLOCKED]: 'Cliente',
};

export const CLIENT_STATUS_TYPE_COLORS: Record<string, 'default' | 'warning'> = {
  [CLIENT_STATUSES.STANDARD]: 'default',
  [CLIENT_STATUSES.VIP]: 'warning',
  [CLIENT_STATUSES.BLOCKED]: 'default',
};

export const CLIENT_STATUS_LABELS: Record<string, string> = {
  [CLIENT_STATUSES.STANDARD]: 'Activo',
  [CLIENT_STATUSES.VIP]: 'Activo',
  [CLIENT_STATUSES.BLOCKED]: 'Bloqueado',
};

export const CLIENT_STATUS_COLORS: Record<string, 'success' | 'danger'> = {
  [CLIENT_STATUSES.STANDARD]: 'success',
  [CLIENT_STATUSES.VIP]: 'success',
  [CLIENT_STATUSES.BLOCKED]: 'danger',
};

export const CLIENT_STATUS_FILTER_OPTIONS = Object.values(CLIENT_STATUSES).map((status) => ({
  value: status,
  label: {
    [CLIENT_STATUSES.STANDARD]: 'Estándar',
    [CLIENT_STATUSES.VIP]: 'VIP',
    [CLIENT_STATUSES.BLOCKED]: 'Bloqueado',
  }[status],
}));

export const DEFAULT_CUSTOMERS_SORT: ITableSort = {
  column: 'name',
  order: 'ASC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD = 3;

export const ORDER_STATUSES = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [ORDER_STATUSES.NEW]: 'Nuevo',
  [ORDER_STATUSES.IN_PROGRESS]: 'En surtido',
  [ORDER_STATUSES.READY]: 'Listo',
  [ORDER_STATUSES.COMPLETED]: 'Completado',
  [ORDER_STATUSES.CANCELLED]: 'Cancelado',
};

export const ORDER_STATUS_COLORS: Record<string, 'default' | 'primary' | 'warning' | 'success' | 'danger'> = {
  [ORDER_STATUSES.NEW]: 'default',
  [ORDER_STATUSES.IN_PROGRESS]: 'primary',
  [ORDER_STATUSES.READY]: 'warning',
  [ORDER_STATUSES.COMPLETED]: 'success',
  [ORDER_STATUSES.CANCELLED]: 'danger',
};
