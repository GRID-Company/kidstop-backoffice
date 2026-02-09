'use client';

import { useMemo } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { TCG_TYPES, TCGType } from '@/lib/types/tcg.types';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import {
  CARD_CONDITION_OPTIONS,
  POKEMON_RARITY_OPTIONS,
  MAGIC_RARITY_OPTIONS,
} from '../../domain/constants';

interface CardSearchProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onReset: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  selectedTCG: TCGType;
}

export default function CardSearch({
  onSearchChange,
  onFilterChange,
  onReset,
  hasActiveFilters,
  resultCount,
  selectedTCG,
}: CardSearchProps) {
  const rarityOptions = useMemo(
    () =>
      selectedTCG === TCG_TYPES.POKEMON
        ? POKEMON_RARITY_OPTIONS
        : MAGIC_RARITY_OPTIONS,
    [selectedTCG]
  );

  return (
    <div className="flex flex-col gap-4">
      <TcgSegmentedSelector />

      <Search
        label="Buscar carta"
        placeholder="Nombre, set o identificador"
        onValueChange={onSearchChange}
        aria-label="Buscar carta por nombre, set o identificador"
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
      </div>

      <div className="flex items-center justify-between">
        <p className="text-content-tertiary text-sm">
          {resultCount} {resultCount === 1 ? 'carta encontrada' : 'cartas encontradas'}
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
