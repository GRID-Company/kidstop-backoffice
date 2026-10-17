'use client';

import { useCallback, useState } from 'react';
import { Badge, Button, Chip, Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';

import Search from '@/shared/base/heorui-overrides/search';
import CatalogFilterDrawer from '@/features/catalog/ui/components/catalog-filter-drawer';
import SetCodeAutocomplete from '@/features/catalog/ui/components/set-code-autocomplete';
import { IPurchaseItem } from '../../domain/types';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { useCardSearch } from '../hooks/use-card-search';
import PurchaseCardResultItem from './purchase-card-result-item';

interface CardSearchWithMetricsProps {
  onAddItem: (item: IPurchaseItem) => void;
  existingItemIds: Set<string>;
}

export default function CardSearchWithMetrics({
  onAddItem,
  existingItemIds,
}: CardSearchWithMetricsProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const {
    search,
    setSearch,
    results,
    resetSearch,
    loading,
    selectedTCG,
    filters,
    selectedSet,
    handleFilterChange,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    resetKey,
    collections,
    rarities,
    variants,
    genres,
  } = useCardSearch();

  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  const handleAddCard = useCallback(
    (item: IPurchaseItem) => {
      onAddItem(item);
      resetSearch();
    },
    [onAddItem, resetSearch]
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center'>
        <div className='md:flex-1'>
          <Search
            label='Buscar carta'
            placeholder='Nombre, set o identificador...'
            value={search}
            onValueChange={setSearch}
            aria-label='Buscar carta para agregar a compra'
            isClearable
            onClear={resetSearch}
          />
        </div>
        <div className='flex items-center gap-3'>
          <SetCodeAutocomplete
            collections={collections}
            selectedTCG={selectedTCG}
            label='Expansión'
            selectedValue={selectedSet}
            onSelectionChange={(value) =>
              handleFilterChange(isPokemon ? 'set' : 'edition', value)
            }
            resetKey={resetKey}
            className='flex-1 md:w-56 md:flex-none'
          />
          <Badge
            content={
              activeFilterCount > 0 ? String(activeFilterCount) : undefined
            }
            color='primary'
            size='sm'
            isInvisible={activeFilterCount === 0}
            className='shrink-0'
          >
            <Button
              isIconOnly
              variant='bordered'
              aria-label='Filtros avanzados'
              onPress={() => setIsFilterDrawerOpen(true)}
              className={hasActiveFilters ? 'border-primary text-primary' : ''}
            >
              <Icon icon='lucide:sliders-horizontal' width={18} />
            </Button>
          </Badge>
          {(search || selectedSet) && (
            <Chip size='sm' variant='flat' className='shrink-0'>
              {results.length}{' '}
              {results.length === 1 ? 'resultado' : 'resultados'}
            </Chip>
          )}
        </div>
      </div>

      <CatalogFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        selectedTCG={selectedTCG}
        resetKey={resetKey}
        filters={filters}
        collections={collections}
        rarities={rarities}
        variants={variants}
        genres={genres}
      />

      {loading ? (
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='border-default-200 flex gap-3 rounded-xl border p-3 xl:p-4'
            >
              <Skeleton className='h-[90px] w-[65px] shrink-0 rounded-md xl:h-[100px] xl:w-[72px]' />
              <div className='flex flex-1 flex-col justify-center gap-2'>
                <Skeleton className='h-4 w-2/3 rounded-md' />
                <Skeleton className='h-3 w-1/2 rounded-md' />
                <div className='flex gap-4 pt-1'>
                  <Skeleton className='h-3 w-16 rounded-md' />
                  <Skeleton className='h-3 w-16 rounded-md' />
                  <Skeleton className='h-3 w-16 rounded-md' />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className='flex flex-col gap-3'>
          {results.map((card) => (
            <PurchaseCardResultItem
              key={card.guid}
              card={card}
              onAdd={handleAddCard}
              existingItemIds={existingItemIds}
            />
          ))}
        </div>
      ) : (
        <div className='text-default-400 flex flex-col items-center justify-center py-12'>
          <Icon icon='lucide:search-x' width={40} className='mb-2' />
          <span className='text-sm'>
            {search || selectedSet
              ? 'No se encontraron cartas con ese criterio'
              : 'Busca una carta para ver sus métricas'}
          </span>
        </div>
      )}
    </div>
  );
}
