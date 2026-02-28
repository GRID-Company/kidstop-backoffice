'use client';

import { useCallback, useState } from 'react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { ICard, IPokemonCard } from '../../domain/types';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { useCardSearch } from '../hooks/use-card-search';
import { usePokemonCatalog } from '../hooks/use-pokemon-catalog';
import CardSearch from '../components/card-search';
import CardGrid from '../components/card-grid';
import PokemonCardGrid from '../components/pokemon-card-grid';
import CardDetailModal from '../components/card-detail-modal';
import PokemonCardDetailModal from '../components/pokemon-card-detail-modal';

export default function Catalog() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  const magic = useCardSearch();
  const pokemon = usePokemonCatalog();

  const [selectedMagicCard, setSelectedMagicCard] = useState<ICard | null>(null);
  const [isMagicDetailOpen, setIsMagicDetailOpen] = useState(false);

  const [selectedPokemonCard, setSelectedPokemonCard] = useState<IPokemonCard | null>(null);
  const [isPokemonDetailOpen, setIsPokemonDetailOpen] = useState(false);

  const handleMagicCardPress = useCallback((card: ICard) => {
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
                collections={pokemon.collections}
                rarities={pokemon.rarities}
                variants={pokemon.variants}
                genres={pokemon.genres}
              />
            ) : (
              <CardSearch
                onSearchChange={magic.setSearch}
                onFilterChange={magic.handleFilterChange}
                onSortChange={magic.handleSortChange}
                onReset={magic.resetFilters}
                hasActiveFilters={magic.hasActiveFilters}
                activeFilterCount={magic.activeFilterCount}
                resultCount={magic.results.length}
                selectedTCG={selectedTCG}
                resetKey={magic.resetKey}
              />
            )}
          </div>

          {isPokemon ? (
            <PokemonCardGrid
              cards={pokemon.cards}
              loading={pokemon.loading}
              page={pokemon.page}
              totalPages={pokemon.totalPages}
              onPageChange={pokemon.setPage}
              onCardPress={handlePokemonCardPress}
            />
          ) : (
            <CardGrid
              cards={magic.results}
              onCardPress={handleMagicCardPress}
            />
          )}
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <CardDetailModal
        card={selectedMagicCard}
        isOpen={isMagicDetailOpen}
        onClose={handleCloseMagicDetail}
        onUpdatePrice={handleUpdatePrice}
      />

      <PokemonCardDetailModal
        card={selectedPokemonCard}
        isOpen={isPokemonDetailOpen}
        onClose={handleClosePokemonDetail}
      />
    </>
  );
}
