'use client';

import { BranchOffice } from '@/lib/api/schema-types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createStorage from '../utils/create-storage.util';

export type SelectedBranch = Pick<BranchOffice, 'guid' | 'name'>;

type SelectedBranchState = {
  selectedBranch: SelectedBranch | null;
  setSelectedBranch: (selectedBranch: SelectedBranch | null) => void;
  clearSelectedBranch: () => void;
};

export const useSelectedBranchStore = create<SelectedBranchState>()(
  persist(
    (set, get) => ({
      selectedBranch: null,
      setSelectedBranch: (selectedBranch) => set(() => ({ selectedBranch })),
      clearSelectedBranch: () => set(() => ({ selectedBranch: null })),
    }),
    {
      name: 'selectedBranch',
      version: 1,
      storage: createStorage(),
    }
  )
);
