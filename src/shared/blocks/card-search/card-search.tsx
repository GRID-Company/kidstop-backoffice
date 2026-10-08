'use client';

import { ReactNode } from 'react';
import { Input, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import AutocompleteFilter from '@/shared/base/heorui-overrides/autocomplete-filter';
import { ISelectOption } from '@/shared/base/heorui-overrides/select';

interface CardSearchProps<T extends { guid: string }> {
  searchValue: string;
  onSearchChange: (value: string) => void;
  results: T[];
  loading: boolean;
  onCardSelect: (card: T) => void;
  placeholder: string;
  renderCard: (card: T) => ReactNode;
  minSearchLength?: number;
  setItems?: ISelectOption[];
  selectedSet?: string;
  onSetChange?: (value: string) => void;
  setResetKey?: number;
}

export default function CardSearch<T extends { guid: string }>({
  searchValue,
  onSearchChange,
  results,
  loading,
  onCardSelect,
  placeholder,
  renderCard,
  minSearchLength = 2,
  setItems,
  selectedSet,
  onSetChange,
  setResetKey,
}: CardSearchProps<T>) {
  const trimmedSearch = searchValue.trim();
  const hasMinLength = trimmedSearch.length >= minSearchLength;
  const hasSearchCriteria = hasMinLength || !!selectedSet;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start'>
        <Input
          className='sm:flex-1'
          placeholder={placeholder}
          value={searchValue}
          onValueChange={onSearchChange}
          startContent={
            <Icon icon='lucide:search' className='text-default-400' />
          }
          isClearable
          onClear={() => onSearchChange('')}
          autoFocus
        />
        {setItems && (
          <AutocompleteFilter
            placeholder='Expansión'
            items={setItems}
            selectedValue={selectedSet}
            onSelectionChange={(value) => onSetChange?.(value)}
            resetKey={setResetKey}
            className='w-full shrink-0 sm:w-56'
            aria-label='Filtrar por expansión o set code'
          />
        )}
      </div>

      {loading && (
        <div className='flex justify-center py-4'>
          <Spinner size='sm' />
        </div>
      )}

      {!loading && hasSearchCriteria && results.length === 0 && (
        <p className='text-default-400 text-center text-sm'>
          No se encontraron cartas en el catálogo
        </p>
      )}

      {results.length > 0 && (
        <div className='flex flex-col gap-2'>
          {results.map((result) => (
            <button
              key={result.guid}
              type='button'
              onClick={() => onCardSelect(result)}
              className='border-default-200 hover:bg-default-50 flex items-center gap-3 rounded-lg border p-3 text-left transition'
            >
              {renderCard(result)}
            </button>
          ))}
        </div>
      )}

      {!hasSearchCriteria && (
        <p className='text-default-400 text-center text-sm'>
          Escribe al menos {minSearchLength} caracteres para buscar
        </p>
      )}
    </div>
  );
}
