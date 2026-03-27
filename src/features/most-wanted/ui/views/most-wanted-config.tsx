'use client';

import { useCallback, useMemo } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { useAddCardModal } from '../hooks/use-add-card-modal';
import { useMostWantedList } from '../hooks/use-most-wanted-list';
import { MostWantedCardFormData } from '../../adapters/forms/most-wanted-card.schema';
import AddCardModal from '../components/add-card-modal';
import MostWantedList from '../components/most-wanted-list';
import MostWantedPreview from '../components/most-wanted-preview';

export default function MostWantedConfig() {
  const {
    items,
    loading,
    reorder,
    toggleActive,
    updateCard,
    removeCard,
    addCard,
    selectedTCG,
  } = useMostWantedList();

  const existingCards = useMemo(
    () =>
      items.map((item) => ({
        guid: item.pokemonCardSummary?.guid || item.magicCardSummary?.guid || '',
      })),
    [items]
  );

  const addCardModal = useAddCardModal({ existingCards });

  const handleAddCard = useCallback(
    async (data: MostWantedCardFormData) => {
      await addCard(data);
    },
    [addCard]
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

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="flex flex-col gap-2">
              <MostWantedList
                items={items}
                onReorder={reorder}
                onToggleActive={toggleActive}
                onUpdateCard={updateCard}
                onRemoveCard={removeCard}
              />
            </div>

            <div className="xl:sticky xl:top-4 xl:self-start">
              <MostWantedPreview items={items} selectedTCG={selectedTCG} />
            </div>
          </div>
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
        loading={addCardModal.loading}
      />
    </>
  );
}
