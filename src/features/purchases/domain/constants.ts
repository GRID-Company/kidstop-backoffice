import { ITableSort } from '@/lib/types/datatable.types';
import { PurchaseStatus, PURCHASE_STATUS, PaymentMethod, PAYMENT_METHOD } from './types';

export {
  CARD_CONDITIONS,
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
  CARD_CONDITION_OPTIONS,
} from '@/lib/types/card.types';

export const PURCHASE_STATUS_LABELS: Record<PurchaseStatus, string> = {
  [PURCHASE_STATUS.DRAFT]: 'Borrador',
  [PURCHASE_STATUS.QUOTED]: 'Cotizado',
  [PURCHASE_STATUS.WAITING_PRICE]: 'Esperando precio',
  [PURCHASE_STATUS.FINALIZED]: 'Finalizado',
  [PURCHASE_STATUS.REJECTED]: 'Rechazado',
};

export const PURCHASE_STATUS_OPTIONS = Object.values(PURCHASE_STATUS).map(
  (status) => ({
    value: status,
    label: PURCHASE_STATUS_LABELS[status],
  })
);

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.CASH]: 'Efectivo',
  [PAYMENT_METHOD.TRANSFER]: 'Transferencia',
  [PAYMENT_METHOD.STORE_CREDIT]: 'Crédito de tienda',
};

export const PAYMENT_METHOD_OPTIONS = Object.values(PAYMENT_METHOD).map(
  (method) => ({
    value: method,
    label: PAYMENT_METHOD_LABELS[method],
  })
);

export const DEFAULT_PURCHASES_SORT: ITableSort = {
  column: 'releaseDate',
  order: 'DESC',
};

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_BUDGET_LIMIT = 50000;

export const DEFAULT_INVENTORY_LIMIT = 20;
