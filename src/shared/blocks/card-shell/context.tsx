'use client';

import {
  createContext,
  useContext,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import { TCGType } from '@/lib/types/tcg.types';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';

interface CardShellContextValue {
  tcgType: TCGType;
  imageSrc: string | null;
  alt: string;
  available: boolean;
  compact: boolean;
  showCosts: boolean;
  openPreview: () => void;
}

const CardShellContext = createContext<CardShellContextValue | undefined>(
  undefined
);

interface CardShellProviderProps extends PropsWithChildren {
  tcgType: TCGType;
  imageSrc: string | null;
  alt: string;
  available?: boolean;
  compact?: boolean;
  showCosts?: boolean;
}

export function CardShellProvider({
  tcgType,
  imageSrc,
  alt,
  available = true,
  compact = false,
  showCosts = false,
  children,
}: CardShellProviderProps) {
  const preview = useCardImagePreview();

  const openPreview = useCallback(() => {
    preview.openPreview(imageSrc, alt, tcgType);
  }, [preview, imageSrc, alt, tcgType]);

  const value = useMemo(
    () => ({
      tcgType,
      imageSrc,
      alt,
      available,
      compact,
      showCosts,
      openPreview,
    }),
    [tcgType, imageSrc, alt, available, compact, showCosts, openPreview]
  );

  return (
    <CardShellContext.Provider value={value}>
      {children}
      <CardImagePreviewModal
        isOpen={preview.isOpen}
        onClose={preview.closePreview}
        imageUrl={preview.imageUrl}
        alt={preview.alt}
        tcgType={preview.tcgType}
      />
    </CardShellContext.Provider>
  );
}

export function useCardShell() {
  const context = useContext(CardShellContext);
  if (!context) {
    throw new Error('useCardShell must be used within CardShellProvider');
  }
  return context;
}
