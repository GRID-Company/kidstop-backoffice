import { config } from '../../support/consts/config.const';
import { TIMEOUTS } from '../../support/consts/timeouts.const';
import { parsePrice } from '../../support/utils/price.utils';

const { graphqlQuery } = config.params.timeouts;

export interface CatalogSelectors {
  searchInput: string;
  sortSelect: string;
  filtersButton: string;
  filterDrawerClose: string;
  filterConditionSelect: string;
  clearFiltersButton: string;
  cardItem: string;
  cardsGrid: string;
  cardsEmpty: string;
  cardName: string;
  cardPrice: string;
  resultCount: string;
  filterDrawer: string;
  loadingIndicator: string;
}

export interface GraphQLAliases {
  cardsQuery: `@${string}`;
  cardDetailQuery: `@${string}`;
  updatePriceMutation: `@${string}`;
  adjustStockMutation: `@${string}`;
}

export abstract class BaseCatalogPage {
  protected abstract selectors: CatalogSelectors;
  protected abstract graphqlAliases: GraphQLAliases;

  abstract visit(): void;
  abstract setupGraphQLIntercepts(): void;

  // Search
  searchCard(query: string) {
    cy.get(this.selectors.searchInput).clear().type(query);
    cy.wait(this.graphqlAliases.cardsQuery, { timeout: graphqlQuery });
    cy.contains(this.selectors.loadingIndicator).should('not.exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  clearSearch() {
    cy.get(this.selectors.searchInput).clear();
    cy.wait(this.graphqlAliases.cardsQuery, { timeout: graphqlQuery });
    cy.contains(this.selectors.loadingIndicator).should('not.exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  // Sort
  sortBy(option: string) {
    cy.get(this.selectors.sortSelect).click();
    cy.contains('li', option, { timeout: TIMEOUTS.DROPDOWN_OPEN })
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait(this.graphqlAliases.cardsQuery, { timeout: graphqlQuery });
    cy.contains(this.selectors.loadingIndicator).should('not.exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  // Filters
  openFilters() {
    cy.get(this.selectors.filtersButton).click();
    cy.wait(TIMEOUTS.ANIMATION);
  }

  closeFilters() {
    cy.get(this.selectors.filterDrawerClose).click();
    cy.wait(TIMEOUTS.ANIMATION);
  }

  selectCondition(condition: string) {
    cy.get(this.selectors.filterConditionSelect).click();
    cy.contains('li', condition, { timeout: TIMEOUTS.DROPDOWN_OPEN })
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait(TIMEOUTS.ANIMATION);
  }

  applyFilters() {
    this.closeFilters();
    cy.wait(this.graphqlAliases.cardsQuery, { timeout: graphqlQuery });
    cy.contains(this.selectors.loadingIndicator).should('not.exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  clearFilters() {
    cy.get(this.selectors.clearFiltersButton).click();
    cy.wait(this.graphqlAliases.cardsQuery, { timeout: graphqlQuery });
    cy.contains(this.selectors.loadingIndicator).should('not.exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  // Card Interaction
  clickFirstCard() {
    cy.get(this.selectors.cardItem).first().click();
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  // Assertions - Catalog
  shouldSeeCardsGrid() {
    cy.get(this.selectors.cardsGrid).should('be.visible');
  }

  shouldSeeResultCount() {
    cy.get(this.selectors.resultCount).should('be.visible');
  }

  shouldSeeCards() {
    cy.get(this.selectors.cardItem).should('have.length.at.least', 1);
  }

  shouldSeeEmptyState() {
    cy.get(this.selectors.cardsEmpty, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeeCardsMatching(query: string) {
    cy.get(this.selectors.cardsGrid)
      .find(this.selectors.cardName)
      .should('have.length.at.least', 1);

    cy.get(this.selectors.cardsGrid)
      .find(this.selectors.cardName)
      .each(($el) => {
        return expect($el.text().toLowerCase()).to.include(query.toLowerCase());
      });
  }

  // Result Count
  shouldSeeResultCountGreaterThan(count: number) {
    cy.get(this.selectors.resultCount).should(($el) => {
      const text = $el.text();
      const match = text.match(/(\d+)/);
      if (match) {
        const resultCount = parseInt(match[1], 10);
        return expect(resultCount).to.be.greaterThan(count);
      }
    });
  }

  shouldSeeResultCountEqual(count: number) {
    cy.get(this.selectors.resultCount).should('contain', String(count));
  }

  // Filter Drawer
  shouldSeeFilterDrawer() {
    cy.get(this.selectors.filterDrawer, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  // Sorting Validation
  shouldBeOrderedByPriceAsc() {
    const prices: number[] = [];
    cy.get(this.selectors.cardPrice)
      .each(($el) => {
        prices.push(parsePrice($el.text()));
      })
      .then(() => {
        for (let i = 0; i < 5; i++) {
          expect(
            prices[i],
            `Price at index ${i} ($${prices[i]}) should be <= price at ${i + 1} ($${prices[i + 1]})`
          ).to.be.at.most(prices[i + 1]);
        }
      });
  }

  shouldBeOrderedAlphabetically() {
    const names: string[] = [];
    cy.get(this.selectors.cardName)
      .each(($el) => {
        names.push($el.text().trim());
      })
      .then(() => {
        for (let i = 0; i < Math.min(5, names.length - 1); i++) {
          const comparison = names[i].localeCompare(names[i + 1], 'es', {
            sensitivity: 'base',
          });
          expect(
            comparison,
            `Name at index ${i} ("${names[i]}") should be <= name at ${i + 1} ("${names[i + 1]}")`
          ).to.be.at.most(0);
        }
      });
  }
}
