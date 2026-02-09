import { ITableSort } from '@/lib/types/datatable.types';

export const MOVEMENT_TYPES = {
  PURCHASE_ENTRY: 'PURCHASE_ENTRY',
  SALE_EXIT: 'SALE_EXIT',
  MANUAL_ADJUSTMENT: 'MANUAL_ADJUSTMENT',
} as const;

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  [MOVEMENT_TYPES.PURCHASE_ENTRY]: 'Entrada por compra',
  [MOVEMENT_TYPES.SALE_EXIT]: 'Salida por venta',
  [MOVEMENT_TYPES.MANUAL_ADJUSTMENT]: 'Ajuste manual',
};

export const STOCK_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  AWAITING_PICKUP: 'AWAITING_PICKUP',
  UNAVAILABLE: 'UNAVAILABLE',
} as const;

export const STOCK_STATUS_LABELS: Record<string, string> = {
  [STOCK_STATUSES.AVAILABLE]: 'Disponible',
  [STOCK_STATUSES.AWAITING_PICKUP]: 'Esperando recolección',
  [STOCK_STATUSES.UNAVAILABLE]: 'No disponible',
};

export const STOCK_STATUS_COLORS: Record<string, 'success' | 'warning' | 'danger'> = {
  [STOCK_STATUSES.AVAILABLE]: 'success',
  [STOCK_STATUSES.AWAITING_PICKUP]: 'warning',
  [STOCK_STATUSES.UNAVAILABLE]: 'danger',
};

export const STOCK_STATUS_OPTIONS = Object.values(STOCK_STATUSES).map((status) => ({
  value: status,
  label: STOCK_STATUS_LABELS[status],
}));

export const ADJUSTMENT_TYPE_OPTIONS = Object.values(MOVEMENT_TYPES).map((type) => ({
  value: type,
  label: MOVEMENT_TYPE_LABELS[type],
}));

export const DEFAULT_INVENTORY_SORT: ITableSort = {
  column: 'name',
  order: 'ASC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_INVENTORY_LIMIT = 20;
