'use client';

import { create } from 'zustand';
import type { IPurchaseItem } from '@/features/purchases/domain/types';

export type CardScannerSource = 'fab' | 'purchase' | 'catalog';

export type CardScannerConfirmHandler = (item: IPurchaseItem) => void;

type CardScannerState = {
  isOpen: boolean;
  source: CardScannerSource;
  existingItemIds: Set<string>;
  onPurchaseItemConfirm: CardScannerConfirmHandler | null;
  openScanner: (
    source?: CardScannerSource,
    onPurchaseItemConfirm?: CardScannerConfirmHandler | null,
    existingItemIds?: Set<string>
  ) => void;
  confirmPurchaseItem: (item: IPurchaseItem) => void;
  closeScanner: () => void;
};

export const useCardScannerStore = create<CardScannerState>()((set, get) => ({
  isOpen: false,
  source: 'fab',
  existingItemIds: new Set<string>(),
  onPurchaseItemConfirm: null,
  openScanner: (
    source = 'fab',
    onPurchaseItemConfirm = null,
    existingItemIds = new Set<string>()
  ) => set({ isOpen: true, source, onPurchaseItemConfirm, existingItemIds }),
  confirmPurchaseItem: (item) => get().onPurchaseItemConfirm?.(item),
  closeScanner: () =>
    set({
      isOpen: false,
      onPurchaseItemConfirm: null,
      existingItemIds: new Set<string>(),
    }),
}));
