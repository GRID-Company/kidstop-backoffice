import {
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  startOfYear,
  today,
} from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

export type ExportQuickAction = 'all' | 'week' | 'month' | 'year' | 'custom';

export interface ExportDateRange {
  from: string;
  to: string;
}

export const EXPORT_QUICK_ACTION_OPTIONS: {
  value: ExportQuickAction;
  label: string;
}[] = [
  { value: 'all', label: 'Todo' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'year', label: 'Este año' },
  { value: 'custom', label: 'Personalizado' },
];

export const getQuickActionRange = (
  action: ExportQuickAction
): RangeValue<DateValue> | null => {
  const now = today(getLocalTimeZone());

  switch (action) {
    case 'week':
      return { start: startOfWeek(now, 'es-MX', 'mon'), end: now };
    case 'month':
      return { start: startOfMonth(now), end: now };
    case 'year':
      return { start: startOfYear(now), end: now };
    default:
      return null;
  }
};

export const toExportDateRange = (
  range: RangeValue<DateValue>
): ExportDateRange => {
  const timeZone = getLocalTimeZone();
  const from = range.start.toDate(timeZone);
  const to = range.end.toDate(timeZone);

  to.setHours(23, 59, 59, 999);

  return { from: from.toISOString(), to: to.toISOString() };
};
