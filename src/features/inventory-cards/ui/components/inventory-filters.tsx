'use client';

import { useCallback, useMemo, useState } from 'react';
import { Badge, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { parseDate } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import type { DateValue } from '@internationalized/date';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { TCG_TYPES, TCGType } from '@/lib/types/tcg.types';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import {
  CARD_CONDITION_OPTIONS,
  POKEMON_RARITY_OPTIONS,
  MAGIC_RARITY_OPTIONS,
} from '@/lib/types/card.types';
import { DateRange } from '@/lib/types/date.types';
import CatalogFilterDrawer from '@/features/catalog/ui/components/catalog-filter-drawer';
import { InventoryFilters as IInventoryFilters } from '../../domain/types';
import { useInventoryFilterOptions } from '../hooks/use-inventory-filter-options';

interface InventoryFiltersProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  resultCount: number;
  selectedTCG: TCGType;
  dateRange?: DateRange;
  filters?: Omit<IInventoryFilters, 'search' | 'dateRange'>;
  resetKey?: number;
}

export default function InventoryFilters({
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
}: InventoryFiltersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { collections, rarities } = useInventoryFilterOptions();

  const rarityOptions = useMemo(
    () =>
      selectedTCG === TCG_TYPES.POKEMON
        ? POKEMON_RARITY_OPTIONS
        : MAGIC_RARITY_OPTIONS,
    [selectedTCG]
  );

  const _dateRangeValue = useMemo(() => {
    if (!dateRange) return null;
    return {
      start: parseDate(dateRange.start),
      end: parseDate(dateRange.end),
    };
  }, [dateRange]);

  const _handleDateChange = useCallback(
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
            label='Buscar en inventario'
            placeholder='Nombre de carta, set o identificador'
            onValueChange={onSearchChange}
            aria-label='Buscar en inventario por nombre, set o identificador'
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
            data-testid='inventory-filters-button'
          >
            Filtros
          </Button>
        </Badge>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Select
          placeholder='Todas las condiciones'
          label='Condición'
          items={CARD_CONDITION_OPTIONS}
          selectedKeys={filters?.condition ? [filters.condition] : []}
          onChange={(e) => onFilterChange('condition', e.target.value)}
          aria-label='Filtrar por condición'
        />
        <Select
          placeholder='Todas las rarezas'
          label='Rareza'
          items={rarityOptions}
          selectedKeys={filters?.rarity ? [filters.rarity] : []}
          onChange={(e) => onFilterChange('rarity', e.target.value)}
          aria-label='Filtrar por rareza'
        />
        {/* TODO: Oculto temporalmente - Backend no soporta filtro lastSellDate como DateRangeFilter */}
        {/* <DateRangePicker
          label="Última venta"
          value={dateRangeValue}
          onChange={handleDateChange}
          maxValue={today(getLocalTimeZone())}
          aria-label="Filtrar por rango de fecha de última venta"
        /> */}
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm'>
          <span className='text-accent font-semibold'>{resultCount}</span>{' '}
          <span className='text-content-tertiary'>
            {resultCount === 1 ? 'item encontrado' : 'items encontrados'}
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
        collections={collections}
        rarities={rarities}
      />
    </div>
  );
}
