'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import type { DateValue } from '@internationalized/date';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { InventoryItemSellPriceHistoryDocument } from '@/lib/api/generated/inventory.generated';
import { CardLanguage } from '@/lib/api/schema-types';
import { formatDate } from '@/lib/utils/format-date';
import {
  CARD_CONDITION_OPTIONS,
  CARD_CONDITION_SHORT_LABELS,
} from '@/lib/types/card.types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { DateRange } from '@/lib/types/date.types';
import { DEFAULT_HISTORY_LIMIT } from '../../domain/constants';
import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';
import Select, { ISelectOption } from '@/shared/base/heorui-overrides/select';
import DateRangePicker from '@/shared/base/heorui-overrides/date-range-picker';

/**
 * Displays sell price change history for a card across all its inventory items
 * @param cardGuid - GUID of the card to show price history for
 * @param languageOptions - Selectable language options for the card
 */
interface SellPriceHistoryTableProps {
  cardGuid: string;
  languageOptions: ISelectOption[];
}

const REASON_LABELS: Record<string, string> = {
  DIRECT_UPDATE: 'Actualización directa',
  MANUAL_MOVEMENT: 'Movimiento manual',
  PURCHASE_FINALIZED: 'Compra finalizada',
};

const REASON_OPTIONS = Object.entries(REASON_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const REASON_COLORS: Record<
  string,
  'primary' | 'success' | 'warning' | 'default'
> = {
  DIRECT_UPDATE: 'primary',
  MANUAL_MOVEMENT: 'warning',
  PURCHASE_FINALIZED: 'success',
};

export default function SellPriceHistoryTable({
  cardGuid,
  languageOptions,
}: SellPriceHistoryTableProps) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<
    Partial<Record<'reason' | 'condition' | 'language', string>>
  >({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === '') {
        delete next[key as keyof typeof next];
      } else {
        next[key as keyof typeof next] = value;
      }
      return next;
    });
    setPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setDateRange(undefined);
    setPage(1);
  }, []);

  const dateRangeValue = useMemo(() => {
    if (!dateRange) return null;
    return { start: parseDate(dateRange.start), end: parseDate(dateRange.end) };
  }, [dateRange]);

  const handleDateChange = useCallback(
    (value: RangeValue<DateValue> | null) => {
      if (!value) {
        handleDateRangeChange(undefined);
        return;
      }
      handleDateRangeChange({
        start: value.start.toString(),
        end: value.end.toString(),
      });
    },
    [handleDateRangeChange]
  );

  const { data, loading, error } = useQuery(
    InventoryItemSellPriceHistoryDocument,
    {
      variables: {
        findSellPriceHistoryArgs: {
          skip: (page - 1) * DEFAULT_HISTORY_LIMIT,
          limit: DEFAULT_HISTORY_LIMIT,
          sort: { column: 'createdDate', order: 'DESC' },
          filters: {
            cardGuid,
            reason: filters.reason || undefined,
            condition: filters.condition || undefined,
            language: (filters.language as CardLanguage) || undefined,
            ...(dateRange && {
              createdDate: {
                filterType: ':daterange:' as const,
                range: { from: dateRange.start, to: dateRange.end },
              },
            }),
          },
        },
      },
      skip: !cardGuid,
    }
  );

  const priceHistory = useMemo(() => {
    return data?.inventoryItemSellPriceHistory?.data ?? [];
  }, [data]);

  const totalCount = data?.inventoryItemSellPriceHistory?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_HISTORY_LIMIT));

  const hasActiveFilters = Object.keys(filters).length > 0 || !!dateRange;

  const columns: ITableColumn[] = useMemo(
    () => [
      {
        key: 'createdDate',
        label: 'Fecha',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { createdDate: string };
          return (
            <span className='text-xs'>{formatDate(history.createdDate)}</span>
          );
        },
      },
      {
        key: 'createdBy',
        label: 'Usuario',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { createdBy?: { name: string } };
          return (
            <span className='text-default-500 text-xs'>
              {history.createdBy?.name ?? '—'}
            </span>
          );
        },
      },
      {
        key: 'reason',
        label: 'Razón',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { reason: string };
          return (
            <Chip
              size='sm'
              variant='flat'
              color={
                REASON_COLORS[history.reason as keyof typeof REASON_COLORS] ??
                'default'
              }
            >
              {REASON_LABELS[history.reason as keyof typeof REASON_LABELS] ??
                history.reason}
            </Chip>
          );
        },
      },
      {
        key: 'language',
        label: 'Idioma',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as {
            inventoryItem: { language: string };
          };
          return (
            <span className='text-xs'>
              {LANGUAGE_LABELS[
                history.inventoryItem.language as keyof typeof LANGUAGE_LABELS
              ] ?? history.inventoryItem.language}
            </span>
          );
        },
      },
      {
        key: 'condition',
        label: 'Condición',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as {
            inventoryItem: { condition: string };
          };
          return (
            <span className='bg-default-100 text-default-600 rounded-full px-2 py-0.5 text-xs'>
              {CARD_CONDITION_SHORT_LABELS[
                history.inventoryItem
                  .condition as keyof typeof CARD_CONDITION_SHORT_LABELS
              ] ?? history.inventoryItem.condition}
            </span>
          );
        },
      },
      {
        key: 'previousPrice',
        label: 'Precio anterior',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { previousPrice?: number | null };
          return (
            <span className='text-sm'>
              {history.previousPrice !== null &&
              history.previousPrice !== undefined
                ? `$${history.previousPrice.toFixed(2)}`
                : '—'}
            </span>
          );
        },
      },
      {
        key: 'newPrice',
        label: 'Precio nuevo',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { newPrice: number };
          return (
            <span className='text-accent text-sm font-medium'>
              ${history.newPrice.toFixed(2)}
            </span>
          );
        },
      },
      {
        key: 'notes',
        label: 'Notas',
        allowSorting: false,
        customCol: (item: unknown) => {
          const history = item as { notes?: string };
          return (
            <span className='text-default-500 block max-w-50 truncate text-xs'>
              {history.notes ?? '—'}
            </span>
          );
        },
      },
    ],
    []
  );

  if (error) {
    return (
      <div className='flex flex-col gap-3'>
        <h4 className='text-sm font-semibold'>Historial de precios de venta</h4>
        <p className='text-danger py-4 text-center text-sm'>
          Error al cargar historial de precios: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Select
          placeholder='Todas las razones'
          label='Razón'
          size='sm'
          items={REASON_OPTIONS}
          onChange={(e) => handleFilterChange('reason', e.target.value)}
          aria-label='Filtrar por razón del cambio'
        />
        <Select
          placeholder='Todas las condiciones'
          label='Condición'
          size='sm'
          items={CARD_CONDITION_OPTIONS}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          aria-label='Filtrar por condición'
        />
        <Select
          placeholder='Todos los idiomas'
          label='Idioma'
          size='sm'
          items={languageOptions}
          onChange={(e) => handleFilterChange('language', e.target.value)}
          aria-label='Filtrar por idioma'
        />
        <DateRangePicker
          label='Rango de fechas'
          size='sm'
          value={dateRangeValue}
          onChange={handleDateChange}
          maxValue={today(getLocalTimeZone())}
          aria-label='Filtrar por rango de fechas'
        />
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm'>
          <span className='text-accent font-semibold'>{totalCount}</span>{' '}
          <span className='text-content-tertiary'>
            {totalCount === 1
              ? 'cambio de precio encontrado'
              : 'cambios de precio encontrados'}
          </span>
        </p>
        {hasActiveFilters && (
          <Button
            variant='light'
            size='sm'
            className='text-accent'
            startContent={<Icon icon='lucide:x' />}
            onPress={resetFilters}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <DataTable
        cols={columns}
        data={priceHistory}
        isLoading={loading}
        aria-label='Historial de cambios de precio de venta'
      />
      {!loading && priceHistory.length === 0 && (
        <p className='text-default-400 py-4 text-center text-sm'>
          No hay cambios de precio registrados
        </p>
      )}

      {totalPages > 1 && (
        <div className='mt-4 flex justify-center'>
          <KidstopPagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
          />
        </div>
      )}
    </div>
  );
}
