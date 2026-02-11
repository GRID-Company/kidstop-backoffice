import { useState, useMemo, useCallback } from 'react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { MOCK_CARDS } from '@/features/catalog/adapters/api/catalog.mock';
import { ICard } from '@/features/catalog/domain/types';
import { MOCK_MOST_WANTED } from '../../adapters/api/most-wanted.mock';
import { useMostWantedForm } from '../../adapters/forms/use-most-wanted-form';
import { MostWantedCardFormData } from '../../adapters/forms/most-wanted-card.schema';
import { toAddMostWantedPayload } from '../../adapters/mappers/most-wanted.mapper';

export function useAddCardModal() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);

  const form = useMostWantedForm();

  const existingCardIds = useMemo(
    () =>
      new Set(
        MOCK_MOST_WANTED.filter((mw) => mw.tcgType === selectedTCG).map(
          (mw) => mw.card.id
        )
      ),
    [selectedTCG]
  );

  const searchResults = useMemo(() => {
    let cards = MOCK_CARDS.filter((c) => c.tcgType === selectedTCG);

    cards = cards.filter((c) => !existingCardIds.has(c.id));

    if (search.trim()) {
      const term = search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.setName.toLowerCase().includes(term) ||
          c.setCode.toLowerCase().includes(term) ||
          c.number.toLowerCase().includes(term)
      );
    }

    return cards;
  }, [selectedTCG, search, existingCardIds]);

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
    (card: ICard) => {
      setSelectedCard(card);
      form.setValue('cardId', card.id, { shouldValidate: true });
    },
    [form]
  );

  const handleSubmit = useCallback(
    (onSuccess?: (payload: ReturnType<typeof toAddMostWantedPayload>) => void) => {
      return form.handleSubmit((data: MostWantedCardFormData) => {
        const payload = toAddMostWantedPayload(data, selectedTCG);
        onSuccess?.(payload);
        closeModal();
      });
    },
    [form, selectedTCG, closeModal]
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
  };
}
