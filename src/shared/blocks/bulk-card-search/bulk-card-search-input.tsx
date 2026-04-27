'use client';

import { Button, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { BulkCardSearchInputProps } from './types';

const PLACEHOLDER_TEXT = `Pokémon (Limitless):
3 Mega Charizard Y ex ASC 22
2 Iono PAL 185

Magic (Moxfield):
1 Lightning Bolt (4ED) 208
3 Counterspell (MH2) 267`;

export default function BulkCardSearchInput({
  value,
  onChange,
  onSearch,
  onClear,
  isLoading,
  isDisabled = false,
}: BulkCardSearchInputProps) {
  const canSearch = value.trim().length > 0 && !isLoading;

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        label="Lista de cartas"
        placeholder={PLACEHOLDER_TEXT}
        value={value}
        onValueChange={onChange}
        minRows={6}
        maxRows={16}
        description="Pokémon (Limitless): [cant] [nombre] [set] [núm] — Magic (Moxfield): [cant] [nombre] ([set]) [núm]"
        aria-label="Lista de cartas en formato Limitless TCG o Moxfield"
        isDisabled={isDisabled || isLoading}
      />

      <div className="flex gap-2">
        <Button
          className="text-white"
          style={{ backgroundColor: 'var(--color-accent)' }}
          startContent={!isLoading && <Icon icon="lucide:search" />}
          onPress={onSearch}
          isDisabled={!canSearch || isDisabled}
          isLoading={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar cartas'}
        </Button>
        {value.trim().length > 0 && (
          <Button
            variant="flat"
            startContent={<Icon icon="lucide:trash-2" />}
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
