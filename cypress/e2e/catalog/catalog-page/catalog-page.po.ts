import { CatalogPageSelectors } from './catalog-page.selectors';

export default class CatalogPage {
  visit() {
    cy.visit('/catalogo');
  }

  setupGraphQLIntercepts() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'PokemonCards') {
        req.alias = 'pokemonCardsQuery';
      }
      if (req.body.operationName === 'MagicCards') {
        req.alias = 'magicCardsQuery';
      }
      if (req.body.operationName === 'PokemonCardWithMetrics') {
        req.alias = 'pokemonCardDetailQuery';
      }
      if (req.body.operationName === 'MagicCardWithMetrics') {
        req.alias = 'magicCardDetailQuery';
      }
      if (req.body.operationName === 'UpdatePokemonCardSellPrice') {
        req.alias = 'updatePokemonPriceMutation';
      }
      if (req.body.operationName === 'UpdateMagicCardSellPrice') {
        req.alias = 'updateMagicPriceMutation';
      }
      if (req.body.operationName === 'AdjustPokemonCardStock') {
        req.alias = 'adjustPokemonStockMutation';
      }
      if (req.body.operationName === 'AdjustMagicCardStock') {
        req.alias = 'adjustMagicStockMutation';
      }
    });
  }

  // TCG Selection
  selectTCG(tcg: 'Pokémon' | 'Magic') {
    const selector =
      tcg === 'Pokémon'
        ? CatalogPageSelectors.pokemonOption
        : CatalogPageSelectors.magicOption;

    cy.get(selector).click();

    if (tcg === 'Pokémon') {
      cy.wait('@pokemonCardsQuery', { timeout: 10000 });
    } else {
      cy.wait('@magicCardsQuery', { timeout: 10000 });
    }

    cy.contains(CatalogPageSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Search
  searchCard(query: string) {
    cy.get(CatalogPageSelectors.searchInput).type(query);

    cy.get('body').then(($body) => {
      if ($body.text().includes('Pokémon')) {
        cy.wait('@pokemonCardsQuery', { timeout: 10000 });
      } else {
        cy.wait('@magicCardsQuery', { timeout: 10000 });
      }
    });

    cy.contains(CatalogPageSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  clearSearch() {
    cy.get(CatalogPageSelectors.searchInput).clear();
    cy.wait(500);
  }

  // Sort
  sortBy(option: string) {
    cy.get(CatalogPageSelectors.sortSelect).click();
    cy.contains('li', option, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });

    cy.get('body').then(($body) => {
      if ($body.text().includes('Pokémon')) {
        cy.wait('@pokemonCardsQuery', { timeout: 10000 });
      } else {
        cy.wait('@magicCardsQuery', { timeout: 10000 });
      }
    });

    cy.contains(CatalogPageSelectors.loadingIndicator).should('not.exist');
    cy.wait(500);
  }

  // Filters
  openFilters() {
    cy.get(CatalogPageSelectors.filtersButton).click();
    cy.wait(300);
  }

  closeFilters() {
    cy.get(CatalogPageSelectors.filterDrawerCloseButton).click();
    cy.wait(300);
  }

  clearFilters() {
    cy.get(CatalogPageSelectors.clearFiltersButton).click();
    cy.wait(500);
  }

  // Assertions - Pokémon
  shouldSeePokemonCatalog() {
    cy.get(CatalogPageSelectors.pokemonCardsGrid, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldSeePokemonCards() {
    cy.get(CatalogPageSelectors.pokemonCardItem).should(
      'have.length.at.least',
      1
    );
  }

  shouldSeePokemonEmptyState() {
    cy.get(CatalogPageSelectors.pokemonCardsEmpty, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldSeePokemonCardsMatching(query: string) {
    cy.get(CatalogPageSelectors.pokemonCardsGrid)
      .find(CatalogPageSelectors.pokemonCardName)
      .should('have.length.at.least', 1);

    cy.get(CatalogPageSelectors.pokemonCardsGrid)
      .find(CatalogPageSelectors.pokemonCardName)
      .each(($el) => {
        expect($el.text().toLowerCase()).to.include(query.toLowerCase());
      });
  }

  // Assertions - Magic
  shouldSeeMagicCatalog() {
    cy.get(CatalogPageSelectors.magicCardsGrid, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldSeeMagicCards() {
    cy.get(CatalogPageSelectors.magicCardItem).should(
      'have.length.at.least',
      1
    );
  }

  shouldSeeMagicEmptyState() {
    cy.get(CatalogPageSelectors.magicCardsEmpty, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldSeeMagicCardsMatching(query: string) {
    cy.get(CatalogPageSelectors.magicCardsGrid)
      .find(CatalogPageSelectors.magicCardName)
      .should('have.length.at.least', 1);

    cy.get(CatalogPageSelectors.magicCardsGrid)
      .find(CatalogPageSelectors.magicCardName)
      .each(($el) => {
        expect($el.text().toLowerCase()).to.include(query.toLowerCase());
      });
  }

  // Result Count
  shouldSeeResultCount() {
    cy.get(CatalogPageSelectors.resultCount).should('be.visible');
  }

  getResultCount(): Cypress.Chainable<number> {
    return cy.get(CatalogPageSelectors.resultCount).then(($el) => {
      const text = $el.text();
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
  }

  shouldHaveResultCountGreaterThan(count: number) {
    this.getResultCount().should('be.greaterThan', count);
  }

  shouldHaveResultCount(count: number) {
    this.getResultCount().should('equal', count);
  }

  // Filter Badge
  shouldSeeFilterBadge(count: string) {
    cy.get(CatalogPageSelectors.filterBadge)
      .should('be.visible')
      .and('contain', count);
  }

  shouldNotSeeFilterBadge() {
    cy.get(CatalogPageSelectors.filterBadge).should('not.be.visible');
  }

  // Card Interaction
  clickFirstPokemonCard() {
    cy.get(CatalogPageSelectors.pokemonCardItem).first().click();
    cy.wait(500);
  }

  clickFirstMagicCard() {
    cy.get(CatalogPageSelectors.magicCardItem).first().click();
    cy.wait(500);
  }

  // Sorting Validation
  shouldBeOrderedByPriceAscending() {
    const prices: number[] = [];

    cy.get(CatalogPageSelectors.pokemonCardPrice)
      .each(($el) => {
        const priceText = $el.text().replace('$', '');
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

    cy.get(CatalogPageSelectors.pokemonCardName)
      .each(($el) => {
        names.push($el.text());
      })
      .then(() => {
        const sortedNames = [...names].sort();
        expect(names).to.deep.equal(sortedNames);
      });
  }
}
