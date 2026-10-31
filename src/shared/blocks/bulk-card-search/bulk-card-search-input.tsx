'use client';

import { Button, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { TCG_TYPES, TCGType } from '@/lib/types/tcg.types';
import { BulkCardSearchInputProps } from './types';

const PLACEHOLDER_BY_TCG: Record<TCGType, string> = {
  [TCG_TYPES.POKEMON]: `3 Mega Charizard Y ex ASC 22
2 Iono PAL 185
4 Rare Candy SVI 191`,
  [TCG_TYPES.MAGIC]: `1 Lightning Bolt (4ED) 208
3 Counterspell (MH2) 267
4 Island (UNF) 236`,
};

const DESCRIPTION_BY_TCG: Record<TCGType, string> = {
  [TCG_TYPES.POKEMON]: 'Formato Limitless: [cant] [nombre] [set] [núm]',
  [TCG_TYPES.MAGIC]: 'Formato Moxfield: [cant] [nombre] ([set]) [núm]',
};

const ARIA_LABEL_BY_TCG: Record<TCGType, string> = {
  [TCG_TYPES.POKEMON]: 'Lista de cartas en formato Limitless TCG',
  [TCG_TYPES.MAGIC]: 'Lista de cartas en formato Moxfield',
};

export default function BulkCardSearchInput({
  value,
  onChange,
  onSearch,
  onClear,
  isLoading,
  tcgType,
  isDisabled = false,
}: BulkCardSearchInputProps) {
  const canSearch = value.trim().length > 0 && !isLoading;

  return (
    <div className='flex flex-col gap-4'>
      <Textarea
        label='Lista de cartas'
        placeholder={PLACEHOLDER_BY_TCG[tcgType]}
        value={value}
        onValueChange={onChange}
        minRows={6}
        maxRows={16}
        description={DESCRIPTION_BY_TCG[tcgType]}
        aria-label={ARIA_LABEL_BY_TCG[tcgType]}
        isDisabled={isDisabled || isLoading}
      />

      <div className='flex gap-2'>
        <Button
          className='text-white'
          style={{ backgroundColor: 'var(--color-accent)' }}
          startContent={!isLoading && <Icon icon='lucide:search' />}
          onPress={onSearch}
          isDisabled={!canSearch || isDisabled}
          isLoading={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar cartas'}
        </Button>
        {value.trim().length > 0 && (
          <Button
            variant='flat'
            startContent={<Icon icon='lucide:trash-2' />}
            onPress={onClear}
            isDisabled={isLoading}
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
