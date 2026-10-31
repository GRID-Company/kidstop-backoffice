'use client';

import { useCallback, useMemo, useState } from 'react';
import { Badge, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import type { DateValue } from '@internationalized/date';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import DateRangePicker from '@/shared/base/heorui-overrides/date-range-picker';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import { DateRange } from '@/lib/types/date.types';
import { TCGType } from '@/lib/types/tcg.types';
import CatalogFilterDrawer from '@/features/catalog/ui/components/catalog-filter-drawer';
import { MOVEMENT_TYPE_OPTIONS } from '../../domain/constants';
import { MovementFilters as IMovementFilters } from '../../domain/types';

interface MovementFiltersProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  resultCount: number;
  selectedTCG: TCGType;
  dateRange?: DateRange;
  filters?: Omit<IMovementFilters, 'search' | 'dateRange'>;
  resetKey?: number;
}

export default function MovementFilters({
  onSearchChange,
  onFilterChange,
  onDateRangeChange,
  onReset,
  hasActiveFilters,
  activeFilterCount,
  resultCount,
  selectedTCG,
  dateRange,
  filters,
  resetKey,
}: MovementFiltersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dateRangeValue = useMemo(() => {
    if (!dateRange) return null;
    return {
      start: parseDate(dateRange.start),
      end: parseDate(dateRange.end),
    };
  }, [dateRange]);

  const handleDateChange = useCallback(
    (value: RangeValue<DateValue> | null) => {
      if (!value) {
        onDateRangeChange(undefined);
        return;
      }
      onDateRangeChange({
        start: value.start.toString(),
        end: value.end.toString(),
      });
    },
    [onDateRangeChange]
  );

  return (
    <div className='flex flex-col gap-4'>
      <TcgSegmentedSelector />

      <div className='flex flex-col gap-3 md:flex-row md:items-end'>
        <div className='md:flex-1'>
          <Search
            key={resetKey}
            label='Buscar movimiento'
            placeholder='Carta, usuario o referencia'
            onValueChange={onSearchChange}
            aria-label='Buscar movimiento por carta, usuario o referencia'
          />
        </div>
        <Badge
          content={activeFilterCount > 0 ? activeFilterCount : undefined}
          color='danger'
          size='sm'
          isInvisible={activeFilterCount === 0}
        >
          <Button
            variant='bordered'
            onPress={() => setIsDrawerOpen(true)}
            startContent={<Icon icon='lucide:sliders-horizontal' />}
            aria-label='Abrir filtros avanzados'
            className='h-14'
            data-testid='movements-filters-button'
          >
            Filtros
          </Button>
        </Badge>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Select
          placeholder='Todos los tipos'
          label='Tipo de movimiento'
          items={MOVEMENT_TYPE_OPTIONS}
          selectedKeys={filters?.movementType ? [filters.movementType] : []}
          onChange={(e) => onFilterChange('movementType', e.target.value)}
          aria-label='Filtrar por tipo de movimiento'
        />
        <DateRangePicker
          label='Rango de fechas'
          value={dateRangeValue}
          onChange={handleDateChange}
          maxValue={today(getLocalTimeZone())}
          aria-label='Filtrar por rango de fechas'
        />
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm'>
          <span className='text-accent font-semibold'>{resultCount}</span>{' '}
          <span className='text-content-tertiary'>
            {resultCount === 1
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
            onPress={onReset}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <CatalogFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFilterChange={onFilterChange}
        onReset={onReset}
        hasActiveFilters={hasActiveFilters}
        selectedTCG={selectedTCG}
        resetKey={resetKey}
        filters={filters}
        visibleFilters={['condition', 'language']}
      />
    </div>
  );
}
