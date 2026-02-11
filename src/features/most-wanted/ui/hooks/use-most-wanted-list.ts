import { useState, useMemo, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { MOCK_MOST_WANTED } from '../../adapters/api/most-wanted.mock';
import { IMostWantedCard, MostWantedPriority } from '../../domain/types';

export function useMostWantedList() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [items, setItems] = useState<IMostWantedCard[]>(MOCK_MOST_WANTED);

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => item.tcgType === selectedTCG)
        .sort((a, b) => a.order - b.order),
    [items, selectedTCG]
  );

  const reorder = useCallback(
    (activeId: string, overId: string) => {
      setItems((prev) => {
        const tcgItems = prev
          .filter((i) => i.tcgType === selectedTCG)
          .sort((a, b) => a.order - b.order);
        const otherItems = prev.filter((i) => i.tcgType !== selectedTCG);

        const oldIndex = tcgItems.findIndex((i) => i.id === activeId);
        const newIndex = tcgItems.findIndex((i) => i.id === overId);

        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(tcgItems, oldIndex, newIndex).map(
          (item, index) => ({ ...item, order: index + 1 })
        );

        return [...otherItems, ...reordered];
      });
    },
    [selectedTCG]
  );

  const toggleActive = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  }, []);

  const updateCard = useCallback(
    (id: string, updates: { priority?: MostWantedPriority; notes?: string }) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        )
      );
    },
    []
  );

  const removeCard = useCallback(
    (id: string) => {
      setItems((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        const tcgItems = filtered
          .filter((i) => i.tcgType === selectedTCG)
          .sort((a, b) => a.order - b.order)
          .map((item, index) => ({ ...item, order: index + 1 }));
        const otherItems = filtered.filter((i) => i.tcgType !== selectedTCG);
        return [...otherItems, ...tcgItems];
      });
    },
    [selectedTCG]
  );

  const addCard = useCallback(
    (card: IMostWantedCard) => {
      setItems((prev) => {
        const tcgCount = prev.filter((i) => i.tcgType === selectedTCG).length;
        return [...prev, { ...card, order: tcgCount + 1 }];
      });
    },
    [selectedTCG]
  );

  return {
    items: filteredItems,
    reorder,
    toggleActive,
    updateCard,
    removeCard,
    addCard,
    selectedTCG,
  };
}
