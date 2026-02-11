import { ITableSort } from '@/lib/types/datatable.types';
import { MOST_WANTED_PRIORITIES, MostWantedPriority } from './types';

export { MOST_WANTED_PRIORITIES };

export const MOST_WANTED_PRIORITY_LABELS: Record<MostWantedPriority, string> = {
  [MOST_WANTED_PRIORITIES.HIGH]: 'Alta',
  [MOST_WANTED_PRIORITIES.MEDIUM]: 'Media',
  [MOST_WANTED_PRIORITIES.LOW]: 'Baja',
};

export const MOST_WANTED_PRIORITY_OPTIONS = Object.values(MOST_WANTED_PRIORITIES).map(
  (priority) => ({
    value: priority,
    label: MOST_WANTED_PRIORITY_LABELS[priority],
  })
);

export const DEFAULT_MOST_WANTED_SORT: ITableSort = {
  column: 'order',
  order: 'ASC',
};

export const DEFAULT_PAGE_SIZE = 20;
