'use client';

import { useMemo } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import AutocompleteFilter from '@/shared/base/heorui-overrides/autocomplete-filter';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { TCG_TYPES, TCGType } from '@/lib/types/tcg.types';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import {
  CARD_CONDITION_OPTIONS,
  MAGIC_RARITY_OPTIONS,
} from '../../domain/constants';
import { IPokemonCollection } from '../../domain/types';

interface CardSearchProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
  onReset: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  selectedTCG: TCGType;
  collections?: IPokemonCollection[];
  rarities?: string[];
  variants?: string[];
  genres?: string[];
}

export default function CardSearch({
  onSearchChange,
  onFilterChange,
  onReset,
  hasActiveFilters,
  resultCount,
  selectedTCG,
  collections,
  rarities,
  variants,
  genres,
}: CardSearchProps) {
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  const rarityOptions = useMemo(() => {
    if (isPokemon && rarities && rarities.length > 0) {
      return rarities.map((r) => ({ label: r, value: r }));
    }
    if (!isPokemon) {
      return MAGIC_RARITY_OPTIONS;
    }
    return [];
  }, [isPokemon, rarities]);

  const variantOptions = useMemo(
    () => (variants ?? []).map((v) => ({ label: v, value: v })),
    [variants]
  );

  const genreOptions = useMemo(
    () => (genres ?? []).map((g) => ({ label: g, value: g })),
    [genres]
  );

  const collectionOptions = useMemo(() => {
    if (!collections) return [];
    return collections.map((c) => ({ label: c.name, value: c.guid }));
  }, [collections]);

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
        {isPokemon ? (
          <AutocompleteFilter
            placeholder="Todas las rarezas"
            label="Rareza"
            items={rarityOptions}
            onSelectionChange={(value) => onFilterChange('rarity', value)}
            aria-label="Filtrar por rareza"
          />
        ) : (
          <Select
            placeholder="Todas las rarezas"
            label="Rareza"
            items={rarityOptions}
            onChange={(e) => onFilterChange('rarity', e.target.value)}
            aria-label="Filtrar por rareza"
          />
        )}
      </div>

      {isPokemon && collectionOptions.length > 0 && (
        <AutocompleteFilter
          placeholder="Todas las colecciones"
          label="Colección"
          items={collectionOptions}
          onSelectionChange={(value) => onFilterChange('set', value)}
          aria-label="Filtrar por colección"
        />
      )}

      {isPokemon && variantOptions.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AutocompleteFilter
            placeholder="Todas las variantes"
            label="Variante"
            items={variantOptions}
            onSelectionChange={(value) => onFilterChange('variant', value)}
            aria-label="Filtrar por variante"
          />
          {genreOptions.length > 0 && (
            <AutocompleteFilter
              placeholder="Todos los géneros"
              label="Género"
              items={genreOptions}
              onSelectionChange={(value) => onFilterChange('genre', value)}
              aria-label="Filtrar por género"
            />
          )}
        </div>
      )}

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
