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
import { InventoryMovementsDocument } from '@/lib/api/generated/inventory.generated';
import { CardLanguage } from '@/lib/api/schema-types';
import { formatDate } from '@/lib/utils/format-date';
import {
  CARD_CONDITION_OPTIONS,
  CARD_CONDITION_SHORT_LABELS,
} from '@/lib/types/card.types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { DateRange } from '@/lib/types/date.types';
import {
  MOVEMENT_TYPE_LABELS,
  MOVEMENT_TYPE_COLORS,
  MOVEMENT_TYPE_OPTIONS,
} from '@/features/inventory-cards/domain/constants';
import { DEFAULT_HISTORY_LIMIT } from '../../domain/constants';
import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';
import Search from '@/shared/base/heorui-overrides/search';
import Select, { ISelectOption } from '@/shared/base/heorui-overrides/select';
import DateRangePicker from '@/shared/base/heorui-overrides/date-range-picker';

/**
 * Displays inventory movement history for a card across all its inventory items
 * @param cardGuid - GUID of the card to show movements for
 * @param tcg - TCG type (POKEMON or MAGIC)
 * @param languageOptions - Selectable language options for the card
 */
interface InventoryMovementsTableProps {
  cardGuid: string;
  tcg: 'POKEMON' | 'MAGIC';
  languageOptions: ISelectOption[];
}

export default function InventoryMovementsTable({
  cardGuid,
  tcg,
  languageOptions,
}: InventoryMovementsTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<
    Partial<Record<'movementType' | 'condition' | 'language', string>>
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

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
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

  const { data, loading, error } = useQuery(InventoryMovementsDocument, {
    variables: {
      findInventoryMovementsArgs: {
        skip: (page - 1) * DEFAULT_HISTORY_LIMIT,
        limit: DEFAULT_HISTORY_LIMIT,
        sort: { column: 'createdDate', order: 'DESC' },
        search: search.trim() || undefined,
        filters: {
          tcg,
          cardGuid,
          movementType: filters.movementType || undefined,
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
  });

  const movements = useMemo(() => {
    return data?.inventoryMovements?.data ?? [];
  }, [data]);

  const totalCount = data?.inventoryMovements?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_HISTORY_LIMIT));

  const hasActiveFilters =
    search.trim() !== '' || Object.keys(filters).length > 0 || !!dateRange;

  const columns: ITableColumn[] = useMemo(
    () => [
      {
        key: 'createdDate',
        label: 'Fecha',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { createdDate: string };
          return (
            <span className='text-xs'>{formatDate(movement.createdDate)}</span>
          );
        },
      },
      {
        key: 'createdBy',
        label: 'Usuario',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { createdBy?: { name: string } };
          return (
            <span className='text-default-500 text-xs'>
              {movement.createdBy?.name ?? '—'}
            </span>
          );
        },
      },
      {
        key: 'reference',
        label: 'Referencia',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { reference?: string };
          return (
            <span className='text-default-500 text-xs'>
              {movement.reference ?? '—'}
            </span>
          );
        },
      },
      {
        key: 'movementType',
        label: 'Tipo',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { movementType: string };
          return (
            <Chip
              size='sm'
              variant='flat'
              color={
                MOVEMENT_TYPE_COLORS[
                  movement.movementType as keyof typeof MOVEMENT_TYPE_COLORS
                ] ?? 'default'
              }
            >
              {MOVEMENT_TYPE_LABELS[
                movement.movementType as keyof typeof MOVEMENT_TYPE_LABELS
              ] ?? movement.movementType}
            </Chip>
          );
        },
      },
      {
        key: 'language',
        label: 'Idioma',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as {
            inventoryItem: { language: string };
          };
          return (
            <span className='text-xs'>
              {LANGUAGE_LABELS[
                movement.inventoryItem.language as keyof typeof LANGUAGE_LABELS
              ] ?? movement.inventoryItem.language}
            </span>
          );
        },
      },
      {
        key: 'condition',
        label: 'Condición',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as {
            inventoryItem: { condition: string };
          };
          return (
            <span className='bg-default-100 text-default-600 rounded-full px-2 py-0.5 text-xs'>
              {CARD_CONDITION_SHORT_LABELS[
                movement.inventoryItem
                  .condition as keyof typeof CARD_CONDITION_SHORT_LABELS
              ] ?? movement.inventoryItem.condition}
            </span>
          );
        },
      },
      {
        key: 'quantity',
        label: 'Cantidad',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { quantity: number };
          return <span className='font-medium'>{movement.quantity}</span>;
        },
      },
      {
        key: 'notes',
        label: 'Notas',
        allowSorting: false,
        customCol: (item: unknown) => {
          const movement = item as { notes?: string };
          return (
            <span className='text-default-500 block max-w-50 truncate text-xs'>
              {movement.notes ?? '—'}
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
        <h4 className='text-sm font-semibold'>Historial de movimientos</h4>
        <p className='text-danger py-4 text-center text-sm'>
          Error al cargar movimientos: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <Search
        label='Buscar movimiento'
        placeholder='Usuario o referencia'
        size='sm'
        value={search}
        onValueChange={handleSearchChange}
        aria-label='Buscar movimiento por usuario o referencia'
      />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Select
          placeholder='Todos los tipos'
          label='Tipo de movimiento'
          size='sm'
          items={MOVEMENT_TYPE_OPTIONS}
          onChange={(e) => handleFilterChange('movementType', e.target.value)}
          aria-label='Filtrar por tipo de movimiento'
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
              ? 'movimiento encontrado'
              : 'movimientos encontrados'}
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
        data={movements}
        isLoading={loading}
        aria-label='Historial de movimientos de inventario'
      />
      {!loading && movements.length === 0 && (
        <p className='text-default-400 py-4 text-center text-sm'>
          No hay movimientos registrados
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
