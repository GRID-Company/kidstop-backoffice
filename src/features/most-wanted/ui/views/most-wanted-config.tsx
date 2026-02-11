'use client';

import { useCallback } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { toAddMostWantedPayload } from '../../adapters/mappers/most-wanted.mapper';
import { MOCK_CARDS } from '@/features/catalog/adapters/api/catalog.mock';
import { IMostWantedCard, MOST_WANTED_PRIORITIES } from '../../domain/types';
import { useAddCardModal } from '../hooks/use-add-card-modal';
import { useMostWantedList } from '../hooks/use-most-wanted-list';
import AddCardModal from '../components/add-card-modal';
import MostWantedList from '../components/most-wanted-list';

export default function MostWantedConfig() {
  const {
    items,
    reorder,
    toggleActive,
    updateCard,
    removeCard,
    addCard,
    selectedTCG,
  } = useMostWantedList();

  const addCardModal = useAddCardModal();

  const handleAddCard = useCallback(
    (payload: ReturnType<typeof toAddMostWantedPayload>) => {
      const input = payload.addMostWantedInput;
      const catalogCard = MOCK_CARDS.find((c) => c.id === input.cardId);
      if (!catalogCard) return;

      const newItem: IMostWantedCard = {
        id: `mw-${Date.now()}`,
        card: catalogCard,
        tcgType: selectedTCG,
        priority: (input.priority as IMostWantedCard['priority']) ?? MOST_WANTED_PRIORITIES.MEDIUM,
        notes: input.notes ?? '',
        isActive: input.isActive ?? true,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addCard(newItem);
    },
    [selectedTCG, addCard]
  );

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Most Wanted">
          <Button
            startContent={<Icon icon="lucide:plus" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
            onPress={addCardModal.openModal}
          >
            Agregar carta
          </Button>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className="mb-6">
            <TcgSegmentedSelector />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-default-500">
              {items.length} {items.length === 1 ? 'carta' : 'cartas'} en la lista
            </p>
            <p className="text-xs text-default-400">
              Arrastra para reordenar
            </p>
          </div>

          <MostWantedList
            items={items}
            onReorder={reorder}
            onToggleActive={toggleActive}
            onUpdateCard={updateCard}
            onRemoveCard={removeCard}
          />
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <AddCardModal
        isOpen={addCardModal.isOpen}
        onClose={addCardModal.closeModal}
        onAdd={handleAddCard}
        search={addCardModal.search}
        onSearchChange={addCardModal.setSearch}
        searchResults={addCardModal.searchResults}
        selectedCard={addCardModal.selectedCard}
        onSelectCard={addCardModal.selectCard}
        form={addCardModal.form}
        onSubmit={addCardModal.handleSubmit}
      />
    </>
  );
}
