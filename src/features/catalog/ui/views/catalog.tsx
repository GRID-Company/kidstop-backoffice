'use client';

import { useCallback, useState } from 'react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { ICard } from '../../domain/types';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { useCardSearch } from '../hooks/use-card-search';
import CardSearch from '../components/card-search';
import CardGrid from '../components/card-grid';
import CardDetailModal from '../components/card-detail-modal';

export default function Catalog() {
  const {
    setSearch,
    handleFilterChange,
    resetFilters,
    results,
    hasActiveFilters,
    selectedTCG,
  } = useCardSearch();

  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleCardPress = useCallback((card: ICard) => {
    setSelectedCard(card);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedCard(null);
  }, []);

  const handleSyncProvider = useCallback((cardId: string) => {
    console.info(`[mock] Sync provider for card: ${cardId}`);
  }, []);

  const handleUpdatePrice = useCallback(
    (variantId: string, data: CardPriceFormData) => {
      console.info(`[mock] Update price for variant: ${variantId}`, data);
    },
    []
  );

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Catálogo">
          <></>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className="mb-6">
            <CardSearch
              onSearchChange={setSearch}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
              resultCount={results.length}
              selectedTCG={selectedTCG}
            />
          </div>

          <CardGrid
            cards={results}
            onCardPress={handleCardPress}
          />
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <CardDetailModal
        card={selectedCard}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onSyncProvider={handleSyncProvider}
        onUpdatePrice={handleUpdatePrice}
      />
    </>
  );
}
