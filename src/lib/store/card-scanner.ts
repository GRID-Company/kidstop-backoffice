'use client';

import { create } from 'zustand';
import type { ICardCandidate } from '@/features/card-scanner/domain/types';

export type CardScannerSource = 'fab' | 'purchase' | 'catalog';

export type CardScannerConfirmHandler = (candidate: ICardCandidate) => void;

type CardScannerState = {
  isOpen: boolean;
  source: CardScannerSource;
  onCandidateConfirm: CardScannerConfirmHandler | null;
  openScanner: (
    source?: CardScannerSource,
    onCandidateConfirm?: CardScannerConfirmHandler | null
  ) => void;
  confirmCandidate: (candidate: ICardCandidate) => void;
  closeScanner: () => void;
};

export const useCardScannerStore = create<CardScannerState>()((set, get) => ({
  isOpen: false,
  source: 'fab',
  onCandidateConfirm: null,
  openScanner: (source = 'fab', onCandidateConfirm = null) =>
    set({ isOpen: true, source, onCandidateConfirm }),
  confirmCandidate: (candidate) => get().onCandidateConfirm?.(candidate),
  closeScanner: () => set({ isOpen: false, onCandidateConfirm: null }),
}));
