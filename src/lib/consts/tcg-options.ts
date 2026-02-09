import { TCG_TYPES, TCGType } from '../types/tcg.types';

export type TCGOption = { key: TCGType; label: string; icon: string };

export const TCG_OPTIONS: TCGOption[] = [
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
