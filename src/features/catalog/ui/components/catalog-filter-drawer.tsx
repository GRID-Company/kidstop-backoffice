'use client';

import { useMemo } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import Select from '@/shared/base/heorui-overrides/select';
import AutocompleteFilter from '@/shared/base/heorui-overrides/autocomplete-filter';
import { FilterFn } from '@/lib/types/paginated-datatable.types';
import { TCG_TYPES, TCGType } from '@/lib/types/tcg.types';
import { CARD_CONDITION_OPTIONS, MAGIC_RARITY_OPTIONS } from '../../domain/constants';
import { IPokemonCollection, PokemonCatalogFilters } from '../../domain/types';

interface CatalogFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: FilterFn;
  onReset: () => void;
  hasActiveFilters: boolean;
  selectedTCG: TCGType;
  resetKey?: number;
  filters?: PokemonCatalogFilters;
  collections?: IPokemonCollection[];
  rarities?: string[];
  variants?: string[];
  genres?: string[];
}

export default function CatalogFilterDrawer({
  isOpen,
  onClose,
  onFilterChange,
  onReset,
  hasActiveFilters,
  selectedTCG,
  resetKey,
  filters,
  collections,
  rarities,
  variants,
  genres,
}: CatalogFilterDrawerProps) {
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  const rarityOptions = useMemo(() => {
    if (isPokemon && rarities && rarities.length > 0) {
      return rarities.map((r) => ({ label: r, value: r }));
    }
    if (!isPokemon) return MAGIC_RARITY_OPTIONS;
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

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">Filtros avanzados</span>
          <span className="text-sm font-normal text-default-500">
            Refina los resultados del catálogo
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-4">
          <Select
            placeholder="Todas las condiciones"
            label="Condición"
            items={CARD_CONDITION_OPTIONS}
            selectedKeys={filters?.condition ? [filters.condition] : []}
            onChange={(e) => onFilterChange('condition', e.target.value)}
            aria-label="Filtrar por condición"
          />

          {rarityOptions.length > 0 &&
            (isPokemon ? (
              <AutocompleteFilter
                placeholder="Todas las rarezas"
                label="Rareza"
                items={rarityOptions}
                onSelectionChange={(value) => onFilterChange('rarity', value)}
                resetKey={resetKey}
                selectedValue={filters?.rarity}
                aria-label="Filtrar por rareza"
              />
            ) : (
              <Select
                placeholder="Todas las rarezas"
                label="Rareza"
                items={rarityOptions}
                selectedKeys={filters?.rarity ? [filters.rarity] : []}
                onChange={(e) => onFilterChange('rarity', e.target.value)}
                aria-label="Filtrar por rareza"
              />
            ))}

          {isPokemon && collectionOptions.length > 0 && (
            <AutocompleteFilter
              placeholder="Todas las colecciones"
              label="Colección"
              items={collectionOptions}
              onSelectionChange={(value) => onFilterChange('set', value)}
              resetKey={resetKey}
              selectedValue={filters?.set}
              aria-label="Filtrar por colección"
            />
          )}

          {isPokemon && variantOptions.length > 0 && (
            <AutocompleteFilter
              placeholder="Todas las variantes"
              label="Variante"
              items={variantOptions}
              onSelectionChange={(value) => onFilterChange('variant', value)}
              resetKey={resetKey}
              selectedValue={filters?.variant}
              aria-label="Filtrar por variante"
            />
          )}

          {isPokemon && genreOptions.length > 0 && (
            <AutocompleteFilter
              placeholder="Todos los géneros"
              label="Género"
              items={genreOptions}
              onSelectionChange={(value) => onFilterChange('genre', value)}
              resetKey={resetKey}
              selectedValue={filters?.genre}
              aria-label="Filtrar por género"
            />
          )}
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          {hasActiveFilters ? (
            <Button
              variant="light"
              onPress={handleReset}
              startContent={<Icon icon="lucide:x" />}
              className="text-accent"
            >
              Limpiar filtros
            </Button>
          ) : (
            <div />
          )}
          <Button
            onPress={onClose}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Ver resultados
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
