import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { usePokemonCatalog } from '@/features/catalog/ui/hooks/use-pokemon-catalog';
import { IPokemonCard } from '@/features/catalog/domain/types';
import { useMostWantedForm } from '../../adapters/forms/use-most-wanted-form';
import { MostWantedCardFormData } from '../../adapters/forms/most-wanted-card.schema';

interface UseAddCardModalProps {
  existingCards: Array<{ guid: string }>;
}

export function useAddCardModal({ existingCards }: UseAddCardModalProps) {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<IPokemonCard | null>(null);

  const form = useMostWantedForm();

  const { cards, loading, setSearch: setPokemonSearch } = usePokemonCatalog(
    selectedTCG !== 'POKEMON'
  );

  useEffect(() => {
    if (selectedTCG === 'POKEMON') {
      setPokemonSearch(search);
    }
  }, [search, setPokemonSearch, selectedTCG]);

  const existingCardGuids = useMemo(
    () => new Set(existingCards.map((card) => card.guid)),
    [existingCards]
  );

  const searchResults = useMemo(() => {
    if (selectedTCG !== 'POKEMON') return [];
    return cards.filter((card) => !existingCardGuids.has(card.guid));
  }, [cards, existingCardGuids, selectedTCG]);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setSearch('');
    setSelectedCard(null);
    form.reset();
  }, [form]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedCard(null);
    setSearch('');
    form.reset();
  }, [form]);

  const selectCard = useCallback(
    (card: IPokemonCard | null) => {
      setSelectedCard(card);
      if (card) {
        form.setValue('cardId', card.guid, { shouldValidate: true });
      }
    },
    [form]
  );

  const handleSubmit = useCallback(
    (onSuccess?: (data: MostWantedCardFormData) => void | Promise<void>) => {
      return form.handleSubmit(async (data: MostWantedCardFormData) => {
        await onSuccess?.(data);
        closeModal();
      });
    },
    [form, closeModal]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    search,
    setSearch,
    searchResults,
    selectedCard,
    selectCard,
    form,
    handleSubmit,
    selectedTCG,
    loading,
  };
}
