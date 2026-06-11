'use client';

import { ReactNode } from 'react';
import { Input, Spinner, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface CardSearchProps<T extends { guid: string }> {
  searchValue: string;
  onSearchChange: (value: string) => void;
  results: T[];
  loading: boolean;
  onCardSelect: (card: T) => void;
  placeholder: string;
  renderCard: (card: T) => ReactNode;
  minSearchLength?: number;
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
}: CardSearchProps<T>) {
  const trimmedSearch = searchValue.trim();
  const hasMinLength = trimmedSearch.length >= minSearchLength;

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder={placeholder}
        value={searchValue}
        onValueChange={onSearchChange}
        startContent={<Icon icon="lucide:search" className="text-default-400" />}
        isClearable
        onClear={() => onSearchChange('')}
        autoFocus
      />

      {loading && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}

      {!loading && hasMinLength && results.length === 0 && (
        <p className="text-center text-sm text-default-400">
          No se encontraron cartas en el catálogo
        </p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.map((result) => (
            <button
              key={result.guid}
              type="button"
              onClick={() => onCardSelect(result)}
              className="flex items-center gap-3 rounded-lg border border-default-200 p-3 text-left transition hover:bg-default-50"
            >
              {renderCard(result)}
            </button>
          ))}
        </div>
      )}

      {!hasMinLength && (
        <p className="text-center text-sm text-default-400">
          Escribe al menos {minSearchLength} caracteres para buscar
        </p>
      )}
    </div>
  );
}
