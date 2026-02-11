import { ITableSort } from '@/lib/types/datatable.types';
import { FulfillmentStatus, FULFILLMENT_STATUS, SaleStatus, SALE_STATUS } from './types';

export {
  CARD_CONDITIONS,
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
  CARD_CONDITION_OPTIONS,
} from '@/lib/types/card.types';

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  [SALE_STATUS.NEW]: 'Nuevo',
  [SALE_STATUS.IN_PROGRESS]: 'En surtido',
  [SALE_STATUS.READY_FOR_PICKUP]: 'Listo para recolección',
  [SALE_STATUS.COMPLETED]: 'Completado',
  [SALE_STATUS.CANCELLED]: 'Cancelado',
};

export const SALE_STATUS_COLORS: Record<
  SaleStatus,
  'primary' | 'warning' | 'secondary' | 'success' | 'danger'
> = {
  [SALE_STATUS.NEW]: 'primary',
  [SALE_STATUS.IN_PROGRESS]: 'warning',
  [SALE_STATUS.READY_FOR_PICKUP]: 'secondary',
  [SALE_STATUS.COMPLETED]: 'success',
  [SALE_STATUS.CANCELLED]: 'danger',
};

export const SALE_STATUS_OPTIONS = Object.values(SALE_STATUS).map(
  (status) => ({
    value: status,
    label: SALE_STATUS_LABELS[status],
  })
);

export const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  [FULFILLMENT_STATUS.PENDING]: 'Pendiente',
  [FULFILLMENT_STATUS.FOUND]: 'Encontrado',
  [FULFILLMENT_STATUS.PARTIAL]: 'Parcial',
  [FULFILLMENT_STATUS.NOT_AVAILABLE]: 'No disponible',
};

export const FULFILLMENT_STATUS_COLORS: Record<
  FulfillmentStatus,
  'default' | 'success' | 'warning' | 'danger'
> = {
  [FULFILLMENT_STATUS.PENDING]: 'default',
  [FULFILLMENT_STATUS.FOUND]: 'success',
  [FULFILLMENT_STATUS.PARTIAL]: 'warning',
  [FULFILLMENT_STATUS.NOT_AVAILABLE]: 'danger',
};

export const DEFAULT_SALES_SORT: ITableSort = {
  column: 'createdAt',
  order: 'DESC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const NEXT_STATUS: Partial<Record<SaleStatus, SaleStatus>> = {
  [SALE_STATUS.NEW]: SALE_STATUS.IN_PROGRESS,
  [SALE_STATUS.IN_PROGRESS]: SALE_STATUS.READY_FOR_PICKUP,
  [SALE_STATUS.READY_FOR_PICKUP]: SALE_STATUS.COMPLETED,
};

export const NEXT_STATUS_LABELS: Partial<Record<SaleStatus, string>> = {
  [SALE_STATUS.NEW]: 'Iniciar surtido',
  [SALE_STATUS.IN_PROGRESS]: 'Marcar listo para recolección',
  [SALE_STATUS.READY_FOR_PICKUP]: 'Completar venta',
};

export const NEXT_STATUS_ICONS: Partial<Record<SaleStatus, string>> = {
  [SALE_STATUS.NEW]: 'lucide:play',
  [SALE_STATUS.IN_PROGRESS]: 'lucide:package-check',
  [SALE_STATUS.READY_FOR_PICKUP]: 'lucide:check-circle',
};
