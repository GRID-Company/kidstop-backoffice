'use client';

import { useState } from 'react';
import { Badge, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import CatalogFilterDrawer from './catalog-filter-drawer';
import { TCGType, TCG_TYPES } from '@/lib/types/tcg.types';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import { POKEMON_SORT_OPTIONS, MAGIC_SORT_OPTIONS } from '../../domain/constants';
import { IPokemonCollection } from '../../domain/types';

interface CardSearchProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onSortChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  resultCount: number;
  selectedTCG: TCGType;
  resetKey?: number;
  collections?: IPokemonCollection[];
  rarities?: string[];
  variants?: string[];
  genres?: string[];
}

export default function CardSearch({
  onSearchChange,
  onFilterChange,
  onSortChange,
  onReset,
  hasActiveFilters,
  activeFilterCount,
  resultCount,
  selectedTCG,
  resetKey,
  collections,
  rarities,
  variants,
  genres,
}: CardSearchProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  return (
    <div className="flex flex-col gap-4">
      <TcgSegmentedSelector />

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Search
            key={resetKey}
            label="Buscar carta"
            placeholder="Nombre, set o identificador"
            onValueChange={onSearchChange}
            aria-label="Buscar carta por nombre, set o identificador"
          />
        </div>
        <Select
          placeholder="Relevancia"
          label="Ordenar por"
          items={isPokemon ? POKEMON_SORT_OPTIONS : MAGIC_SORT_OPTIONS}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Ordenar resultados"
          className="w-48"
        />
        <Badge
          content={activeFilterCount > 0 ? activeFilterCount : undefined}
          color="danger"
          size="sm"
          isInvisible={activeFilterCount === 0}
        >
          <Button
            variant="bordered"
            onPress={() => setIsDrawerOpen(true)}
            startContent={<Icon icon="lucide:sliders-horizontal" />}
            aria-label="Abrir filtros avanzados"
            className="h-14"
          >
            Filtros
          </Button>
        </Badge>
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

      <CatalogFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFilterChange={onFilterChange}
        onReset={onReset}
        hasActiveFilters={hasActiveFilters}
        selectedTCG={selectedTCG}
        resetKey={resetKey}
        collections={collections}
        rarities={rarities}
        variants={variants}
        genres={genres}
      />
    </div>
  );
}
