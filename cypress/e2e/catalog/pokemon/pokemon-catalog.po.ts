import { PokemonCatalogSelectors } from './pokemon-catalog.selectors';
import { config } from '../../../support/consts/config.const';
import { BaseCatalogPage } from '../base-catalog.po';

const { graphqlQuery } = config.params.timeouts;

export default class PokemonCatalogPage extends BaseCatalogPage {
  protected selectors = {
    searchInput: PokemonCatalogSelectors.searchInput,
    sortSelect: PokemonCatalogSelectors.sortSelect,
    filtersButton: PokemonCatalogSelectors.filtersButton,
    filterDrawerClose: PokemonCatalogSelectors.filterDrawerClose,
    filterConditionSelect: PokemonCatalogSelectors.filterConditionSelect,
    clearFiltersButton: PokemonCatalogSelectors.clearFiltersButton,
    cardItem: PokemonCatalogSelectors.pokemonCardItem,
    cardsGrid: PokemonCatalogSelectors.pokemonCardsGrid,
    cardsEmpty: PokemonCatalogSelectors.pokemonCardsEmpty,
    cardName: PokemonCatalogSelectors.pokemonCardName,
    cardPrice: PokemonCatalogSelectors.pokemonCardPrice,
    resultCount: PokemonCatalogSelectors.resultCount,
    filterDrawer: PokemonCatalogSelectors.filterDrawer,
    loadingIndicator: PokemonCatalogSelectors.loadingIndicator,
  };

  protected graphqlAliases = {
    cardsQuery: '@pokemonCardsQuery' as const,
    cardDetailQuery: '@pokemonCardDetailQuery' as const,
    updatePriceMutation: '@updatePokemonPriceMutation' as const,
    adjustStockMutation: '@adjustPokemonStockMutation' as const,
  };

  visit() {
    cy.visit('/catalogo');
  }

  setupGraphQLIntercepts() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'PokemonCardInternalList') {
        req.alias = 'pokemonCardsQuery';
      }
      if (req.body.operationName === 'PokemonCardWithMetrics') {
        req.alias = 'pokemonCardDetailQuery';
      }
      if (req.body.operationName === 'UpdateInventoryItemPrices') {
        req.alias = 'updatePokemonPriceMutation';
      }
      if (req.body.operationName === 'AdjustPokemonCardStock') {
        req.alias = 'adjustPokemonStockMutation';
      }
    });
  }

  // Pokemon-specific assertions
  shouldSeePokemonCatalog() {
    cy.get(PokemonCatalogSelectors.pokemonCardsGrid, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeePokemonCards() {
    this.shouldSeeCards();
  }

  shouldSeePokemonEmptyState() {
    this.shouldSeeEmptyState();
  }

  shouldSeePokemonCardsMatching(query: string) {
    this.shouldSeeCardsMatching(query);
  }

  shouldSeeFilterBadge(count: string) {
    cy.get(PokemonCatalogSelectors.filtersButton)
      .parent()
      .find('span')
      .contains(count)
      .should('be.visible');
  }

  shouldNotSeeFilterBadge() {
    cy.get(PokemonCatalogSelectors.filtersButton)
      .parent()
      .find('span')
      .contains(/^\d+$/)
      .should('not.exist');
  }
}
