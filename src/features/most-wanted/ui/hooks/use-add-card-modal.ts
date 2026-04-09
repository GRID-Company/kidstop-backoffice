import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { usePokemonCatalog } from '@/features/catalog/ui/hooks/use-pokemon-catalog';
import { useMagicCatalog } from '@/features/catalog/ui/hooks/use-magic-catalog';
import { IPokemonCard, IMagicCard } from '@/features/catalog/domain/types';
import { useMostWantedForm } from '../../adapters/forms/use-most-wanted-form';
import { MostWantedCardFormData } from '../../adapters/forms/most-wanted-card.schema';

interface UseAddCardModalProps {
  existingCards: Array<{ guid: string }>;
}

export function useAddCardModal({ existingCards }: UseAddCardModalProps) {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<IPokemonCard | IMagicCard | null>(null);

  const form = useMostWantedForm();

  const { cards: pokemonCards, loading: pokemonLoading, setSearch: setPokemonSearch } = usePokemonCatalog(
    selectedTCG !== 'POKEMON'
  );

  const { cards: magicCards, loading: magicLoading, setSearch: setMagicSearch } = useMagicCatalog(
    selectedTCG !== 'MAGIC'
  );

  useEffect(() => {
    if (selectedTCG === 'POKEMON') {
      setPokemonSearch(search);
    } else if (selectedTCG === 'MAGIC') {
      setMagicSearch(search);
    }
  }, [search, setPokemonSearch, setMagicSearch, selectedTCG]);

  const existingCardGuids = useMemo(
    () => new Set(existingCards.map((card) => card.guid)),
    [existingCards]
  );

  const searchResults = useMemo(() => {
    if (selectedTCG === 'POKEMON') {
      return pokemonCards.filter((card) => !existingCardGuids.has(card.guid));
    } else if (selectedTCG === 'MAGIC') {
      return magicCards.filter((card) => !existingCardGuids.has(card.guid));
    }
    return [];
  }, [pokemonCards, magicCards, existingCardGuids, selectedTCG]);

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
    (card: IPokemonCard | IMagicCard | null) => {
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

  const loading = selectedTCG === 'POKEMON' ? pokemonLoading : magicLoading;

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
