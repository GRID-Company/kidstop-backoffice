'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import { CARD_CONDITION_OPTIONS } from '@/features/catalog/domain/constants';
import { STOCK_STATUS_OPTIONS } from '../../domain/constants';

interface InventoryFiltersProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onReset: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export default function InventoryFilters({
  onSearchChange,
  onFilterChange,
  onReset,
  hasActiveFilters,
  resultCount,
}: InventoryFiltersProps) {
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
          placeholder="Todos los estados"
          label="Estado de stock"
          items={STOCK_STATUS_OPTIONS}
          onChange={(e) => onFilterChange('stockStatus', e.target.value)}
          aria-label="Filtrar por estado de stock"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-content-tertiary text-sm">
          {resultCount} {resultCount === 1 ? 'item encontrado' : 'items encontrados'}
        </p>
        {hasActiveFilters && (
          <Button
            variant="light"
            size="sm"
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
