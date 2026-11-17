'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createStorage from '../utils/create-storage.util';

export type PurchaseItemsView = 'cards' | 'table';

type PurchaseItemsViewState = {
  view: PurchaseItemsView;
  setView: (view: PurchaseItemsView) => void;
};

export const usePurchaseItemsViewStore = create<PurchaseItemsViewState>()(
  persist(
    (set) => ({
      view: 'cards',
      setView: (view) => set({ view }),
    }),
    {
      name: 'purchaseItemsView',
      version: 1,
      storage: createStorage(),
    }
  )
);
