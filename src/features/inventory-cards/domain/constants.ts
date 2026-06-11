import { ITableSort } from '@/lib/types/datatable.types';
import { BulkOperationType } from '@/lib/api/schema-types';

export const MOVEMENT_TYPES = {
  PURCHASE_ENTRY: 'PURCHASE_ENTRY',
  SALE_EXIT: 'SALE_EXIT',
  MANUAL_SET: 'MANUAL_SET',
  MANUAL_ENTRY: 'MANUAL_ENTRY',
  MANUAL_EXIT: 'MANUAL_EXIT',
} as const;

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  [MOVEMENT_TYPES.PURCHASE_ENTRY]: 'Entrada por compra',
  [MOVEMENT_TYPES.SALE_EXIT]: 'Salida por venta',
  [MOVEMENT_TYPES.MANUAL_SET]: 'Ajuste manual',
  [MOVEMENT_TYPES.MANUAL_ENTRY]: 'Entrada manual',
  [MOVEMENT_TYPES.MANUAL_EXIT]: 'Salida manual',
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

export const MOVEMENT_TYPE_OPTIONS = Object.values(MOVEMENT_TYPES).map((type) => ({
  value: type,
  label: MOVEMENT_TYPE_LABELS[type],
}));

export const BULK_ADJUSTMENT_OPTIONS = [
  {
    key: BulkOperationType.ManualEntry,
    value: BulkOperationType.ManualEntry,
    label: 'Entrada Manual',
    description: 'Suma la cantidad al stock existente',
  },
  {
    key: BulkOperationType.ManualExit,
    value: BulkOperationType.ManualExit,
    label: 'Salida Manual',
    description: 'Resta la cantidad del stock existente',
  },
  {
    key: BulkOperationType.ManualSet,
    value: BulkOperationType.ManualSet,
    label: 'Establecer Stock',
    description: 'Establece el stock al valor absoluto especificado',
  },
];

export const MOVEMENT_TYPE_COLORS: Record<string, 'success' | 'warning' | 'primary'> = {
  [MOVEMENT_TYPES.PURCHASE_ENTRY]: 'success',
  [MOVEMENT_TYPES.SALE_EXIT]: 'warning',
  [MOVEMENT_TYPES.MANUAL_SET]: 'primary',
};

export const DEFAULT_INVENTORY_SORT: ITableSort = {
  column: 'name',
  order: 'ASC',
};

export const DEFAULT_MOVEMENTS_SORT: ITableSort = {
  column: 'createdAt',
  order: 'DESC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_INVENTORY_LIMIT = 20;

export const MOVEMENT_TYPE_ICONS: Record<string, string> = {
  [MOVEMENT_TYPES.PURCHASE_ENTRY]: 'lucide:arrow-down-circle',
  [MOVEMENT_TYPES.SALE_EXIT]: 'lucide:arrow-up-circle',
  [MOVEMENT_TYPES.MANUAL_SET]: 'lucide:settings-2',
};

export function formatMovementQuantity(movement: { movementType: string; quantity: number }): {
  text: string;
  className: string;
} {
  const isPositive =
    movement.movementType === MOVEMENT_TYPES.PURCHASE_ENTRY ||
    (movement.movementType === MOVEMENT_TYPES.MANUAL_SET && movement.quantity > 0);
  return {
    text: isPositive ? `+${movement.quantity}` : `${movement.quantity}`,
    className: isPositive ? 'text-success' : 'text-danger',
  };
}
