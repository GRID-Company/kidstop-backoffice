'use client';

import { useMemo } from 'react';
import AutocompleteFilter from '@/shared/base/heorui-overrides/autocomplete-filter';
import { TCGType } from '@/lib/types/tcg.types';
import { IMagicCollection, IPokemonCollection } from '../../domain/types';
import { toSetCodeOptions } from '../../domain/catalog.domain';

interface SetCodeAutocompleteProps {
  collections?: IPokemonCollection[] | IMagicCollection[];
  selectedTCG: TCGType;
  selectedValue?: string;
  onSelectionChange: (collectionGuid: string) => void;
  resetKey?: number;
  label?: string;
  className?: string;
}

export default function SetCodeAutocomplete({
  collections,
  selectedTCG,
  selectedValue,
  onSelectionChange,
  resetKey,
  label,
  className,
}: SetCodeAutocompleteProps) {
  const items = useMemo(() => toSetCodeOptions(collections), [collections]);

  return (
    <AutocompleteFilter
      key={selectedTCG}
      label={label}
      placeholder='Código o nombre'
      items={items}
      selectedValue={selectedValue}
      onSelectionChange={onSelectionChange}
      resetKey={resetKey}
      className={className}
      aria-label='Filtrar por expansión o set code'
      data-testid='set-code-autocomplete'
    />
  );
}
