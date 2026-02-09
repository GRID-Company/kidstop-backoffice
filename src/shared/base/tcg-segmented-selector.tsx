'use client';

import { memo } from 'react';
import { Icon } from '@iconify/react';
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

export default memo(function TcgSegmentedSelector() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const setTCG = useSelectedTCGStore((state) => state.setTCG);

  return (
    <div className='flex w-full gap-2 rounded-xl bg-neutral-subtle p-1'>
      {TCG_OPTIONS.map((option) => {
        const isActive = selectedTCG === option.key;
        return (
          <button
            key={option.key}
            type='button'
            onClick={() => setTCG(option.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-accent shadow-sm'
                : 'text-content-tertiary hover:text-content-primary'
            }`}
          >
            <Icon icon={option.icon} className={`text-lg ${isActive ? 'text-accent' : ''}`} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
});
