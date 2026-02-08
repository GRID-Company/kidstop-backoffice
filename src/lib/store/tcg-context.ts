'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TCG_TYPES, TCGType } from '../types/tcg.types';
import createStorage from '../utils/create-storage.util';

type TCGContextState = {
  selectedTCG: TCGType;
  setTCG: (tcg: TCGType) => void;
};

export const useTCGContextStore = create<TCGContextState>()(
  persist(
    (set) => ({
      selectedTCG: TCG_TYPES.POKEMON,
      setTCG: (tcg) => set(() => ({ selectedTCG: tcg })),
    }),
    {
      name: 'tcgContext',
      version: 1,
      storage: createStorage(),
    }
  )
);
