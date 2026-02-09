'use client';

import { memo } from 'react';
import { Icon } from '@iconify/react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_TYPES, TCGType } from '@/lib/types/tcg.types';

type TCGOption = { key: TCGType; label: string; icon: string };

const TCG_OPTIONS: TCGOption[] = [
  {
    key: TCG_TYPES.POKEMON,
    label: 'Pokémon',
    icon: 'simple-icons:pokemon',
  },
  {
    key: TCG_TYPES.MAGIC,
    label: 'Magic',
    icon: 'mdi:cards-playing',
  },
];

export default memo(function TcgSelector() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const setTCG = useSelectedTCGStore((state) => state.setTCG);

  const currentOption = TCG_OPTIONS.find((opt) => opt.key === selectedTCG);

  return (
    <Dropdown>
      <DropdownTrigger>
        <KidstopButton
          variant='lightDark'
          startContent={
            currentOption && (
              <Icon icon={currentOption.icon} className='text-lg text-accent' />
            )
          }
          endContent={
            <Icon icon='solar:alt-arrow-down-outline' className='text-lg' />
          }
        >
          {currentOption?.label ?? 'Selecciona TCG'}
        </KidstopButton>
      </DropdownTrigger>

      <DropdownMenu
        aria-label='Selector de TCG'
        selectionMode='single'
        selectedKeys={new Set([selectedTCG])}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as TCGType;
          if (selected) setTCG(selected);
        }}
      >
        {TCG_OPTIONS.map((option) => (
          <DropdownItem
            key={option.key}
            startContent={<Icon icon={option.icon} className='text-lg' />}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});
