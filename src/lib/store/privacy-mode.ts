'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createStorage from '../utils/create-storage.util';

type PrivacyModeState = {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
};

export const usePrivacyModeStore = create<PrivacyModeState>()(
  persist(
    (set) => ({
      isPrivacyMode: false,
      togglePrivacyMode: () =>
        set((state) => ({ isPrivacyMode: !state.isPrivacyMode })),
    }),
    {
      name: 'privacyMode',
      version: 1,
      storage: createStorage('session'),
    }
  )
);
