import { MagicCatalogSelectors } from './magic-catalog.selectors';
import { config } from '../../../support/consts/config.const';
import { BaseCatalogPage } from '../base-catalog.po';
import { TIMEOUTS } from '../../../support/consts/timeouts.const';

const { graphqlQuery } = config.params.timeouts;

export default class MagicCatalogPage extends BaseCatalogPage {
  protected selectors = {
    searchInput: MagicCatalogSelectors.searchInput,
    sortSelect: MagicCatalogSelectors.sortSelect,
    filtersButton: MagicCatalogSelectors.filtersButton,
    filterDrawerClose: MagicCatalogSelectors.filterDrawerClose,
    filterConditionSelect: MagicCatalogSelectors.filterConditionSelect,
    clearFiltersButton: MagicCatalogSelectors.clearFiltersButton,
    cardItem: MagicCatalogSelectors.magicCardItem,
    cardsGrid: MagicCatalogSelectors.magicCardsGrid,
    cardsEmpty: MagicCatalogSelectors.magicCardsEmpty,
    cardName: MagicCatalogSelectors.magicCardName,
    cardPrice: MagicCatalogSelectors.magicCardPrice,
    resultCount: MagicCatalogSelectors.resultCount,
    filterDrawer: MagicCatalogSelectors.filterDrawer,
    loadingIndicator: MagicCatalogSelectors.loadingIndicator,
  };

  protected graphqlAliases = {
    cardsQuery: '@magicCardsQuery' as const,
    cardDetailQuery: '@magicCardDetailQuery' as const,
    updatePriceMutation: '@updateMagicPriceMutation' as const,
    adjustStockMutation: '@adjustMagicStockMutation' as const,
  };

  visit() {
    cy.visit('/catalogo');
  }

  setupGraphQLIntercepts() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'MagicCardInternalList') {
        req.alias = 'magicCardsQuery';
      }
      if (req.body.operationName === 'MagicCardWithMetrics') {
        req.alias = 'magicCardDetailQuery';
      }
      if (req.body.operationName === 'UpdateMagicCardSellPrice') {
        req.alias = 'updateMagicPriceMutation';
      }
      if (req.body.operationName === 'AdjustMagicCardStock') {
        req.alias = 'adjustMagicStockMutation';
      }
    });
  }

  // TCG Selection
  selectMagic() {
    cy.get(MagicCatalogSelectors.magicOption).click();
    cy.wait('@magicCardsQuery', { timeout: graphqlQuery });
    cy.contains(MagicCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  // Magic-specific assertions
  shouldSeeMagicCatalog() {
    cy.get(MagicCatalogSelectors.magicCardsGrid, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeeMagicCards() {
    this.shouldSeeCards();
  }

  shouldSeeMagicEmptyState() {
    this.shouldSeeEmptyState();
  }

  shouldSeeMagicCardsMatching(query: string) {
    this.shouldSeeCardsMatching(query);
  }

  shouldSeeFilterBadge(count: string) {
    cy.get(MagicCatalogSelectors.filtersButton).should('contain', count);
  }

  shouldNotSeeFilterBadge() {
    cy.get(MagicCatalogSelectors.filtersButton).should('not.contain', '1');
  }
}
