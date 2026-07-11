import { PokemonCatalogSelectors } from './pokemon-catalog.selectors';
import { config } from '../../../support/consts/config.const';

const { graphqlQuery } = config.params.timeouts;

export default class PokemonCatalogPage {
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

  // Search
  searchCard(query: string) {
    cy.get(PokemonCatalogSelectors.searchInput).clear().type(query);
    cy.wait('@pokemonCardsQuery', { timeout: graphqlQuery });
    cy.contains(PokemonCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  clearSearch() {
    cy.get(PokemonCatalogSelectors.searchInput).clear();
    cy.wait('@pokemonCardsQuery', { timeout: graphqlQuery });
    cy.contains(PokemonCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Sort
  sortBy(option: string) {
    cy.get(PokemonCatalogSelectors.sortSelect).click();
    cy.contains('li', option, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait('@pokemonCardsQuery', { timeout: graphqlQuery });
    cy.contains(PokemonCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Filters
  openFilters() {
    cy.get(PokemonCatalogSelectors.filtersButton).click();
    cy.wait(300);
  }

  closeFilters() {
    cy.get(PokemonCatalogSelectors.filterDrawerClose).click();
    cy.wait(300);
  }

  selectCondition(condition: string) {
    cy.get(PokemonCatalogSelectors.filterConditionSelect).click();
    cy.contains('li', condition, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait(300);
  }

  applyFilters() {
    this.closeFilters();
    cy.wait('@pokemonCardsQuery', { timeout: graphqlQuery });
    cy.contains(PokemonCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  clearFilters() {
    cy.get(PokemonCatalogSelectors.clearFiltersButton).click();
    cy.wait('@pokemonCardsQuery', { timeout: graphqlQuery });
    cy.contains(PokemonCatalogSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Card Interaction
  clickFirstCard() {
    cy.get(PokemonCatalogSelectors.pokemonCardItem).first().click();
    cy.wait(500);
  }

  // Assertions - Catalog
  shouldSeePokemonCatalog() {
    cy.get(PokemonCatalogSelectors.pokemonCardsGrid, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeeCardsGrid() {
    cy.get(PokemonCatalogSelectors.pokemonCardsGrid).should('be.visible');
  }

  shouldSeeResultCount() {
    cy.get(PokemonCatalogSelectors.resultCount).should('be.visible');
  }

  shouldSeePokemonCards() {
    cy.get(PokemonCatalogSelectors.pokemonCardItem).should(
      'have.length.at.least',
      1
    );
  }

  shouldSeePokemonEmptyState() {
    cy.get(PokemonCatalogSelectors.pokemonCardsEmpty, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeePokemonCardsMatching(query: string) {
    cy.get(PokemonCatalogSelectors.pokemonCardsGrid)
      .find(PokemonCatalogSelectors.pokemonCardName)
      .should('have.length.at.least', 1);

    cy.get(PokemonCatalogSelectors.pokemonCardsGrid)
      .find(PokemonCatalogSelectors.pokemonCardName)
      .each(($el) => {
        return expect($el.text().toLowerCase()).to.include(query.toLowerCase());
      });
  }

  // Result Count
  shouldSeeResultCountGreaterThan(count: number) {
    cy.get(PokemonCatalogSelectors.resultCount).should(($el) => {
      const text = $el.text();
      const match = text.match(/(\d+)/);
      if (match) {
        const resultCount = parseInt(match[1], 10);
        return expect(resultCount).to.be.greaterThan(count);
      }
    });
  }

  shouldSeeResultCountEqual(count: number) {
    cy.get(PokemonCatalogSelectors.resultCount).should(
      'contain',
      String(count)
    );
  }

  // Filter Drawer
  shouldSeeFilterDrawer() {
    cy.get(PokemonCatalogSelectors.filterDrawer, {
      timeout: graphqlQuery,
    }).should('be.visible');
  }

  shouldSeeFilterBadge(count: string) {
    // El badge está en un span dentro del componente Badge que envuelve el botón
    cy.get(PokemonCatalogSelectors.filtersButton)
      .parent()
      .find('span')
      .contains(count)
      .should('be.visible');
  }

  shouldNotSeeFilterBadge() {
    // Verificar que el botón no tiene un badge visible con número
    cy.get(PokemonCatalogSelectors.filtersButton)
      .parent()
      .find('span')
      .contains(/^\d+$/)
      .should('not.exist');
  }

  // Sorting Validation
  shouldBeOrderedByPriceAsc() {
    const prices: number[] = [];
    cy.get(PokemonCatalogSelectors.pokemonCardPrice)
      .each(($el) => {
        const priceText = $el.text().replace('$', '').replace(',', '');
        prices.push(parseFloat(priceText));
      })
      .then(() => {
        for (let i = 0; i < prices.length - 1; i++) {
          expect(prices[i]).to.be.at.most(prices[i + 1]);
        }
      });
  }

  shouldBeOrderedAlphabetically() {
    const names: string[] = [];
    cy.get(PokemonCatalogSelectors.pokemonCardName)
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
