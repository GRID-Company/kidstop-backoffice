'use client';

import { useCallback, useMemo } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  parseDate,
  today,
  getLocalTimeZone,
} from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import type { DateValue } from '@internationalized/date';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import DateRangePicker from '@/shared/base/heorui-overrides/date-range-picker';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { TCG_TYPES, TCGType } from '@/lib/types/tcg.types';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import {
  CARD_CONDITION_OPTIONS,
  POKEMON_RARITY_OPTIONS,
  MAGIC_RARITY_OPTIONS,
} from '@/lib/types/card.types';
import { DateRange } from '@/lib/types/date.types';

interface InventoryFiltersProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  selectedTCG: TCGType;
  dateRange?: DateRange;
}

export default function InventoryFilters({
  onSearchChange,
  onFilterChange,
  onDateRangeChange,
  onReset,
  hasActiveFilters,
  resultCount,
  selectedTCG,
  dateRange,
}: InventoryFiltersProps) {
  const rarityOptions = useMemo(
    () =>
      selectedTCG === TCG_TYPES.POKEMON
        ? POKEMON_RARITY_OPTIONS
        : MAGIC_RARITY_OPTIONS,
    [selectedTCG]
  );

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
    <div className="flex flex-col gap-4">
      <TcgSegmentedSelector />

      <Search
        label="Buscar en inventario"
        placeholder="Nombre de carta, set o identificador"
        onValueChange={onSearchChange}
        aria-label="Buscar en inventario por nombre, set o identificador"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          placeholder="Todas las condiciones"
          label="Condición"
          items={CARD_CONDITION_OPTIONS}
          onChange={(e) => onFilterChange('condition', e.target.value)}
          aria-label="Filtrar por condición"
        />
        <Select
          placeholder="Todas las rarezas"
          label="Rareza"
          items={rarityOptions}
          onChange={(e) => onFilterChange('rarity', e.target.value)}
          aria-label="Filtrar por rareza"
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

      <div className="flex items-center justify-between">
        <p className="text-sm">
          <span className="font-semibold text-accent">{resultCount}</span>{' '}
          <span className="text-content-tertiary">
            {resultCount === 1 ? 'item encontrado' : 'items encontrados'}
          </span>
        </p>
        {hasActiveFilters && (
          <Button
            variant="light"
            size="sm"
            className="text-accent"
            startContent={<Icon icon="lucide:x" />}
            onPress={onReset}
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
