import { useState, useCallback } from 'react';

interface CardImagePreviewState {
  imageUrl: string | null;
  alt: string;
  tcgType: 'POKEMON' | 'MAGIC';
}

interface UseCardImagePreviewReturn {
  isOpen: boolean;
  imageUrl: string | null;
  alt: string;
  tcgType: 'POKEMON' | 'MAGIC';
  openPreview: (
    url: string | null,
    alt: string,
    tcgType: 'POKEMON' | 'MAGIC'
  ) => void;
  closePreview: () => void;
}

export function useCardImagePreview(): UseCardImagePreviewReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<CardImagePreviewState>({
    imageUrl: null,
    alt: '',
    tcgType: 'POKEMON',
  });

  const openPreview = useCallback(
    (url: string | null, alt: string, tcgType: 'POKEMON' | 'MAGIC') => {
      setState({ imageUrl: url, alt, tcgType });
      setIsOpen(true);
    },
    []
  );

  const closePreview = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    imageUrl: state.imageUrl,
    alt: state.alt,
    tcgType: state.tcgType,
    openPreview,
    closePreview,
  };
}
