import { MagicCatalogSelectors } from './magic-catalog.selectors';
import { config } from '../../../support/consts/config.const';
const { graphqlQuery } = config.params.timeouts;

export default class MagicCatalogPage {
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
    cy.wait(500);
  }

  // Search
  searchCard(query: string) {
    cy.get(MagicCatalogSelectors.searchInput).clear().type(query);
    cy.wait('@magicCardsQuery', { timeout: graphqlQuery });
    cy.contains(MagicCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  clearSearch() {
    cy.get(MagicCatalogSelectors.searchInput).clear();
    cy.wait('@magicCardsQuery', { timeout: graphqlQuery });
    cy.contains(MagicCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Sort
  sortBy(option: string) {
    cy.get(MagicCatalogSelectors.sortSelect).click();
    cy.contains('li', option, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait('@magicCardsQuery', { timeout: graphqlQuery });
    cy.contains(MagicCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Filters
  openFilters() {
    cy.get(MagicCatalogSelectors.filtersButton).click();
    cy.wait(300);
  }

  closeFilters() {
    cy.get(MagicCatalogSelectors.filterDrawerClose).click();
    cy.wait(300);
  }

  selectCondition(condition: string) {
    cy.get(MagicCatalogSelectors.filterConditionSelect).click();
    cy.contains('li', condition, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait(300);
  }

  applyFilters() {
    this.closeFilters();
    cy.wait('@magicCardsQuery', { timeout: graphqlQuery });
    cy.contains(MagicCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  clearFilters() {
    cy.get(MagicCatalogSelectors.clearFiltersButton).click();
    cy.wait('@magicCardsQuery', { timeout: graphqlQuery });
    cy.contains(MagicCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Card Interaction
  clickFirstCard() {
    cy.get(MagicCatalogSelectors.magicCardItem).first().click();
    cy.wait(500);
  }

  // Assertions - Catalog
  shouldSeeMagicCatalog() {
    cy.get(MagicCatalogSelectors.magicCardsGrid, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeeCardsGrid() {
    cy.get(MagicCatalogSelectors.magicCardsGrid).should('be.visible');
  }

  shouldSeeResultCount() {
    cy.get(MagicCatalogSelectors.resultCount).should('be.visible');
  }

  shouldSeeMagicCards() {
    cy.get(MagicCatalogSelectors.magicCardItem).should(
      'have.length.at.least',
      1
    );
  }

  shouldSeeMagicEmptyState() {
    cy.get(MagicCatalogSelectors.magicCardsEmpty, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeeMagicCardsMatching(query: string) {
    cy.get(MagicCatalogSelectors.magicCardsGrid)
      .find(MagicCatalogSelectors.magicCardName)
      .should('have.length.at.least', 1);

    cy.get(MagicCatalogSelectors.magicCardsGrid)
      .find(MagicCatalogSelectors.magicCardName)
      .each(($el) => {
        return expect($el.text().toLowerCase()).to.include(query.toLowerCase());
      });
  }

  // Result Count
  shouldSeeResultCountGreaterThan(count: number) {
    cy.get(MagicCatalogSelectors.resultCount).should(($el) => {
      const text = $el.text();
      const match = text.match(/(\d+)/);
      if (match) {
        const resultCount = parseInt(match[1], 10);
        return expect(resultCount).to.be.greaterThan(count);
      }
    });
  }

  shouldSeeResultCountEqual(count: number) {
    cy.get(MagicCatalogSelectors.resultCount).should('contain', String(count));
  }

  // Filter Drawer
  shouldSeeFilterDrawer() {
    cy.get(MagicCatalogSelectors.filterDrawer, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeeFilterBadge(count: string) {
    cy.get(MagicCatalogSelectors.filtersButton).should('contain', count);
  }

  shouldNotSeeFilterBadge() {
    cy.get(MagicCatalogSelectors.filtersButton).should('not.contain', '1');
  }

  // Sorting Validation
  shouldBeOrderedByPriceAsc() {
    const prices: number[] = [];
    cy.get(MagicCatalogSelectors.magicCardPrice)
      .each(($el) => {
        const priceText = $el.text().replace('$', '').replace(',', '');
        prices.push(parseFloat(priceText));
      })
      .then(() => {
        for (let i = 0; i < 5; i++) {
          expect(prices[i]).to.be.at.most(prices[i + 1]);
        }
      });
  }

  shouldBeOrderedAlphabetically() {
    const names: string[] = [];
    cy.get(MagicCatalogSelectors.magicCardName)
      .each(($el) => {
        names.push($el.text().trim());
      })
      .then(() => {
        // Verificar que al menos los primeros 5 elementos estén en orden alfabético
        for (let i = 0; i < Math.min(5, names.length - 1); i++) {
          const comparison = names[i].localeCompare(names[i + 1], 'es', {
            sensitivity: 'base',
          });
          expect(comparison).to.be.at.most(0);
        }
      });
  }
}
