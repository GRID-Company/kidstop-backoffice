import { ITableSort } from '@/lib/types/datatable.types';

export const CUSTOMER_TYPES = {
  REGULAR: 'REGULAR',
  VIP: 'VIP',
} as const;

export const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  [CUSTOMER_TYPES.REGULAR]: 'Cliente',
  [CUSTOMER_TYPES.VIP]: 'Cliente VIP',
};

export const CUSTOMER_TYPE_COLORS: Record<string, 'default' | 'warning'> = {
  [CUSTOMER_TYPES.REGULAR]: 'default',
  [CUSTOMER_TYPES.VIP]: 'warning',
};

export const CUSTOMER_TYPE_OPTIONS = Object.values(CUSTOMER_TYPES).map((type) => ({
  value: type,
  label: CUSTOMER_TYPE_LABELS[type],
}));

export const CUSTOMER_STATUSES = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
} as const;

export const CUSTOMER_STATUS_LABELS: Record<string, string> = {
  [CUSTOMER_STATUSES.ACTIVE]: 'Activo',
  [CUSTOMER_STATUSES.BLOCKED]: 'Bloqueado',
};

export const CUSTOMER_STATUS_COLORS: Record<string, 'success' | 'danger'> = {
  [CUSTOMER_STATUSES.ACTIVE]: 'success',
  [CUSTOMER_STATUSES.BLOCKED]: 'danger',
};

export const CUSTOMER_STATUS_OPTIONS = Object.values(CUSTOMER_STATUSES).map((status) => ({
  value: status,
  label: CUSTOMER_STATUS_LABELS[status],
}));

export const DEFAULT_CUSTOMERS_SORT: ITableSort = {
  column: 'name',
  order: 'ASC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD = 3;
