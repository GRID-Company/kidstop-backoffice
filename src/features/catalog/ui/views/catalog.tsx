'use client';

import { useCallback, useState } from 'react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { IMagicCard, IPokemonCard } from '../../domain/types';
import { useMagicCatalog } from '../hooks/use-magic-catalog';
import { usePokemonCatalog } from '../hooks/use-pokemon-catalog';
import CardSearch from '../components/card-search';
import CatalogCardGrid from '../components/catalog-card-grid';
import MagicCardGridItem from '../components/magic-card-grid-item';
import MagicCardDetailModal from '../components/magic-card-detail-modal';
import PokemonCardGridItem from '../components/pokemon-card-grid-item';
import PokemonCardDetailModal from '../components/pokemon-card-detail-modal';

export default function Catalog() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;
  const isPrivacyMode = usePrivacyModeStore((state) => state.isPrivacyMode);

  const [showCosts, setShowCosts] = useState(false);
  const revealCosts = showCosts && !isPrivacyMode;

  const magic = useMagicCatalog(isPokemon);
  const pokemon = usePokemonCatalog(!isPokemon);

  const [selectedMagicCard, setSelectedMagicCard] = useState<IMagicCard | null>(
    null
  );
  const [isMagicDetailOpen, setIsMagicDetailOpen] = useState(false);

  const [selectedPokemonCard, setSelectedPokemonCard] =
    useState<IPokemonCard | null>(null);
  const [isPokemonDetailOpen, setIsPokemonDetailOpen] = useState(false);

  const handleMagicCardPress = useCallback((card: IMagicCard) => {
    setSelectedMagicCard(card);
    setIsMagicDetailOpen(true);
  }, []);

  const handleCloseMagicDetail = useCallback(() => {
    setIsMagicDetailOpen(false);
    setSelectedMagicCard(null);
  }, []);

  const handlePokemonCardPress = useCallback((card: IPokemonCard) => {
    setSelectedPokemonCard(card);
    setIsPokemonDetailOpen(true);
  }, []);

  const handleClosePokemonDetail = useCallback(() => {
    setIsPokemonDetailOpen(false);
    setSelectedPokemonCard(null);
  }, []);

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label='Catálogo'>
          <></>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className='mb-6'>
            {isPokemon ? (
              <CardSearch
                onSearchChange={pokemon.setSearch}
                onFilterChange={pokemon.handleFilterChange}
                onSortChange={pokemon.handleSortChange}
                onReset={pokemon.resetFilters}
                hasActiveFilters={pokemon.hasActiveFilters}
                activeFilterCount={pokemon.activeFilterCount}
                resultCount={pokemon.totalCount}
                selectedTCG={selectedTCG}
                resetKey={pokemon.resetKey}
                filters={pokemon.filters}
                collections={pokemon.collections}
                rarities={pokemon.rarities}
                variants={pokemon.variants}
                genres={pokemon.genres}
                showCosts={showCosts}
                onShowCostsChange={setShowCosts}
              />
            ) : (
              <CardSearch
                onSearchChange={magic.setSearch}
                onFilterChange={magic.handleFilterChange}
                onSortChange={magic.handleSortChange}
                onReset={magic.resetFilters}
                hasActiveFilters={magic.hasActiveFilters}
                activeFilterCount={magic.activeFilterCount}
                resultCount={magic.totalCount}
                selectedTCG={selectedTCG}
                resetKey={magic.resetKey}
                filters={magic.filters}
                collections={magic.collections}
                rarities={magic.rarities}
                showCosts={showCosts}
                onShowCostsChange={setShowCosts}
              />
            )}
          </div>

          {isPokemon ? (
            <CatalogCardGrid
              cards={pokemon.cards as IPokemonCard[]}
              loading={pokemon.loading}
              error={!!pokemon.error}
              onRetry={pokemon.refetch}
              page={pokemon.page}
              totalPages={pokemon.totalPages}
              onPageChange={pokemon.setPage}
              renderItem={(card) => (
                <PokemonCardGridItem
                  key={card.guid}
                  card={card}
                  showCosts={revealCosts}
                  onPress={handlePokemonCardPress}
                />
              )}
              gridTestId='pokemon-cards-grid'
              emptyTestId='pokemon-cards-empty'
            />
          ) : (
            <CatalogCardGrid
              cards={magic.cards as IMagicCard[]}
              loading={magic.loading}
              error={!!magic.error}
              onRetry={magic.refetch}
              page={magic.page}
              totalPages={magic.totalPages}
              onPageChange={magic.setPage}
              renderItem={(card) => (
                <MagicCardGridItem
                  key={card.guid}
                  card={card}
                  showCosts={revealCosts}
                  onPress={handleMagicCardPress}
                />
              )}
              gridTestId='magic-cards-grid'
              emptyTestId='magic-cards-empty'
            />
          )}
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <MagicCardDetailModal
        card={selectedMagicCard}
        isOpen={isMagicDetailOpen}
        onClose={handleCloseMagicDetail}
      />

      <PokemonCardDetailModal
        card={selectedPokemonCard}
        isOpen={isPokemonDetailOpen}
        onClose={handleClosePokemonDetail}
      />
    </>
  );
}
