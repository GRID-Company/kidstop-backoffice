'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Chip, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import CatalogFilterDrawer from './catalog-filter-drawer';
import SetCodeAutocomplete from './set-code-autocomplete';
import { TCGType, TCG_TYPES } from '@/lib/types/tcg.types';
import { CardLanguage } from '@/lib/api/schema-types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { CardCondition } from '@/lib/types/card.types';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';
import {
  POKEMON_SORT_OPTIONS,
  MAGIC_SORT_OPTIONS,
  CARD_CONDITION_LABELS,
  STOCK_STATUS_OPTIONS,
} from '../../domain/constants';
import {
  IPokemonCollection,
  IMagicCollection,
  PokemonCatalogFilters,
  MagicCatalogFilters,
} from '../../domain/types';

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
  filters?: PokemonCatalogFilters | MagicCatalogFilters;
  collections?: IPokemonCollection[] | IMagicCollection[];
  rarities?: string[];
  variants?: string[];
  genres?: string[];
  showCosts?: boolean;
  onShowCostsChange?: (show: boolean) => void;
}

const AVAILABILITY_OPTIONS = [
  { label: 'Todas', value: '' },
  { label: 'En existencia', value: 'AVAILABLE' },
  { label: 'Sin stock', value: 'UNAVAILABLE' },
];

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
  filters,
  collections,
  rarities,
  variants,
  genres,
  showCosts,
  onShowCostsChange,
}: CardSearchProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;
  const stockStatus = filters?.stockStatus ?? '';

  const collectionNameByGuid = useMemo(
    () => new Map((collections ?? []).map((c) => [c.guid, c.name])),
    [collections]
  );

  const activeFilterChips = useMemo(() => {
    if (!filters) return [];
    const labelFor = (key: string, value: unknown): string => {
      switch (key) {
        case 'set':
        case 'edition':
          return `Expansión: ${collectionNameByGuid.get(String(value)) ?? String(value)}`;
        case 'condition':
          return `Condición: ${CARD_CONDITION_LABELS[value as CardCondition] ?? String(value)}`;
        case 'language':
          return `Idioma: ${LANGUAGE_LABELS[value as CardLanguage] ?? String(value)}`;
        case 'rarity':
          return `Rareza: ${String(value)}`;
        case 'variant':
          return `Variante: ${String(value)}`;
        case 'genre':
          return `Género: ${String(value)}`;
        case 'stockStatus':
          return `Stock: ${STOCK_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? String(value)}`;
        case 'isFoil':
          return value === true || value === 'true' ? 'Foil' : 'No Foil';
        case 'sellPriceMin':
          return `Precio desde ${String(value)}`;
        case 'sellPriceMax':
          return `Precio hasta ${String(value)}`;
        default:
          return `${key}: ${String(value)}`;
      }
    };

    return Object.entries(filters)
      .filter(([key]) => key !== 'sortBy' && key !== 'sortOrder')
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => ({ key, label: labelFor(key, value) }));
  }, [filters, collectionNameByGuid]);

  return (
    <div className='flex flex-col gap-4'>
      <TcgSegmentedSelector />

      <div className='flex flex-col gap-3 md:flex-row md:items-end'>
        <div className='md:flex-1'>
          <Search
            key={resetKey}
            label='Buscar carta'
            placeholder='Nombre, set o identificador'
            onValueChange={onSearchChange}
            aria-label='Buscar carta por nombre, set o identificador'
            data-testid='catalog-search-input'
          />
        </div>
        <SetCodeAutocomplete
          collections={collections}
          selectedTCG={selectedTCG}
          label='Expansión'
          selectedValue={
            isPokemon
              ? (filters as PokemonCatalogFilters)?.set
              : (filters as MagicCatalogFilters)?.edition
          }
          onSelectionChange={(value) =>
            onFilterChange(isPokemon ? 'set' : 'edition', value)
          }
          resetKey={resetKey}
          className='md:w-56'
        />
        <div className='flex items-end gap-3'>
          <Select
            placeholder='Relevancia'
            label='Ordenar por'
            items={isPokemon ? POKEMON_SORT_OPTIONS : MAGIC_SORT_OPTIONS}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label='Ordenar resultados'
            className='flex-1 md:w-48 md:flex-none'
            data-testid='catalog-sort-select'
          />
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
              data-testid='catalog-filters-button'
            >
              Filtros
            </Button>
          </Badge>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
        <span className='text-default-500 text-xs font-medium'>
          Disponibilidad
        </span>
        <div
          className='flex items-center gap-1'
          data-testid='catalog-availability-pills'
        >
          {AVAILABILITY_OPTIONS.map((option) => {
            const active = stockStatus === option.value;
            return (
              <Button
                key={option.label}
                size='sm'
                variant='flat'
                onPress={() => onFilterChange('stockStatus', option.value)}
                className={`h-7 min-w-0 px-3 text-xs font-medium ${
                  active
                    ? 'bg-accent-soft text-accent-text'
                    : 'text-default-500'
                }`}
                data-testid={`catalog-availability-${option.value || 'all'}`}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
        {hasActiveFilters && (
          <Button
            variant='light'
            size='sm'
            startContent={<Icon icon='lucide:x' />}
            onPress={onReset}
            className='h-7 text-xs'
            data-testid='catalog-clear-filters-button'
          >
            Limpiar filtros
          </Button>
        )}

        <div className='ms-auto flex items-center gap-4'>
          {onShowCostsChange && (
            <Switch
              size='sm'
              isSelected={!!showCosts}
              onValueChange={onShowCostsChange}
              classNames={{ wrapper: 'group-data-[selected=true]:bg-accent' }}
              data-testid='catalog-show-costs-switch'
            >
              <span className='text-default-500 text-xs'>Mostrar costos</span>
            </Switch>
          )}
        </div>
      </div>

      {activeFilterChips.length > 0 && (
        <div
          className='flex flex-wrap items-center gap-1.5'
          data-testid='catalog-active-filters'
        >
          {activeFilterChips.map((chip) => (
            <Chip
              key={chip.key}
              size='sm'
              variant='flat'
              className='bg-accent-soft'
              classNames={{ content: 'text-accent-text' }}
              onClose={() => onFilterChange(chip.key, '')}
            >
              {chip.label}
            </Chip>
          ))}
        </div>
      )}

      <div className='flex items-center justify-between'>
        <p
          className='text-content-tertiary text-sm'
          data-testid='catalog-result-count'
        >
          {resultCount.toLocaleString('es-MX')}{' '}
          {resultCount === 1 ? 'carta encontrada' : 'cartas encontradas'}
        </p>
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
        variants={variants}
        genres={genres}
      />
    </div>
  );
}
