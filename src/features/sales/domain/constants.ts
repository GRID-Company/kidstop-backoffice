import { ITableSort } from '@/lib/types/datatable.types';
import { SaleStatus, SALE_STATUS } from './types';

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

export const SALE_STATUS_OPTIONS = Object.values(SALE_STATUS).map(
  (status) => ({
    value: status,
    label: SALE_STATUS_LABELS[status],
  })
);

export const DEFAULT_SALES_SORT: ITableSort = {
  column: 'createdAt',
  order: 'DESC',
};

export const DEFAULT_PAGE_SIZE = 20;
