import { ITableSort } from '@/lib/types/datatable.types';
import { CancelReason, CANCEL_REASON, SaleStatus, SALE_STATUS } from './types';

export {
  CARD_CONDITIONS,
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
  CARD_CONDITION_OPTIONS,
} from '@/lib/types/card.types';

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  [SALE_STATUS.NEW]: 'Nuevo',
  [SALE_STATUS.IN_PROGRESS]: 'En surtido',
  [SALE_STATUS.READY]: 'Listo para recolección',
  [SALE_STATUS.COMPLETED]: 'Completado',
  [SALE_STATUS.CANCELLED]: 'Cancelado',
};

export const SALE_STATUS_COLORS: Record<
  SaleStatus,
  'primary' | 'warning' | 'secondary' | 'success' | 'danger'
> = {
  [SALE_STATUS.NEW]: 'primary',
  [SALE_STATUS.IN_PROGRESS]: 'warning',
  [SALE_STATUS.READY]: 'secondary',
  [SALE_STATUS.COMPLETED]: 'success',
  [SALE_STATUS.CANCELLED]: 'danger',
};

export const SALE_STATUS_OPTIONS = Object.values(SALE_STATUS).map(
  (status) => ({
    value: status,
    label: SALE_STATUS_LABELS[status],
  })
);

export const CANCEL_REASON_LABELS: Record<CancelReason, string> = {
  [CANCEL_REASON.CLIENT_UNREACHABLE]: 'Cliente no localizable',
  [CANCEL_REASON.NO_STOCK]: 'Sin inventario',
  [CANCEL_REASON.OTHER]: 'Otro motivo',
};

export const CANCEL_REASON_OPTIONS = Object.values(CANCEL_REASON).map(
  (reason) => ({
    value: reason,
    label: CANCEL_REASON_LABELS[reason],
  })
);

export const DEFAULT_SALES_SORT: ITableSort = {
  column: 'createdDate',
  order: 'DESC',
};

export const DEFAULT_PAGE_SIZE = 10;

export const NEXT_STATUS: Partial<Record<SaleStatus, SaleStatus>> = {
  [SALE_STATUS.NEW]: SALE_STATUS.IN_PROGRESS,
  [SALE_STATUS.IN_PROGRESS]: SALE_STATUS.READY,
  [SALE_STATUS.READY]: SALE_STATUS.COMPLETED,
};

export const NEXT_STATUS_LABELS: Partial<Record<SaleStatus, string>> = {
  [SALE_STATUS.NEW]: 'Iniciar surtido',
  [SALE_STATUS.IN_PROGRESS]: 'Marcar listo para recolección',
  [SALE_STATUS.READY]: 'Completar venta',
};

export const NEXT_STATUS_ICONS: Partial<Record<SaleStatus, string>> = {
  [SALE_STATUS.NEW]: 'lucide:play',
  [SALE_STATUS.IN_PROGRESS]: 'lucide:package-check',
  [SALE_STATUS.READY]: 'lucide:check-circle',
};
