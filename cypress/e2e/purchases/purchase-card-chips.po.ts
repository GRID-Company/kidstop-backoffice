import { PurchaseCardChipsSelectors } from './purchase-card-chips.selectors';
import { getGraphQLOperationName } from '../../support/utils/graphql.utils';
import { TIMEOUTS } from '../../support/consts/timeouts.const';

const AUX_OPERATIONS = [
  'BuyerBudget',
  'MagicCardWithMetrics',
  'PokemonCardWithMetrics',
  'MagicCardCollections',
  'MagicCardRarities',
  'PokemonCardCollections',
  'PokemonCardRarities',
  'PokemonCardVariants',
  'PokemonCardGenres',
];

export default class PurchaseCardChipsPage {
  stubAuxQueries() {
    cy.intercept('POST', '**/graphql', (req) => {
      const operationName = getGraphQLOperationName(req);
      if (operationName === 'Sellers') {
        req.reply({ fixture: 'purchases/sellers.json' });
        return;
      }
      if (operationName && AUX_OPERATIONS.includes(operationName)) {
        req.reply({ fixture: 'purchases/empty-aux-queries.json' });
      }
    });
  }

  stubCardSearch(operationName: string, fixture: string) {
    cy.intercept('POST', '**/graphql', (req) => {
      if (getGraphQLOperationName(req) === operationName) {
        req.alias = 'cardSearch';
        req.reply({ fixture });
      }
    });
  }

  stubPurchaseDetail(fixture: string) {
    cy.intercept('POST', '**/graphql', (req) => {
      if (getGraphQLOperationName(req) === 'Purchase') {
        req.alias = 'purchaseDetail';
        req.reply({ fixture });
      }
    });
  }

  visitNew(tcg?: 'POKEMON' | 'MAGIC') {
    cy.visit('/compras/nueva', {
      onBeforeLoad: tcg
        ? (win) => {
            win.localStorage.setItem(
              'tcgContext',
              JSON.stringify({ state: { selectedTCG: tcg }, version: 1 })
            );
          }
        : undefined,
    });
  }

  visitSavedPurchase(guid: string) {
    cy.visit(`/compras/${guid}`);
    cy.wait('@purchaseDetail', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  confirmFirstSeller() {
    cy.get(PurchaseCardChipsSelectors.sellerInput, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    }).click();
    cy.contains('[role="option"]', 'Vendedor Cypress', {
      timeout: TIMEOUTS.DROPDOWN_OPEN,
    }).click();
    cy.contains('button', PurchaseCardChipsSelectors.confirmSellerText).click();
  }

  searchCard(query: string) {
    cy.get(PurchaseCardChipsSelectors.searchInput).type(query);
    cy.wait('@cardSearch', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  enableAdvancedSearch() {
    cy.contains(PurchaseCardChipsSelectors.advancedSearchText).click();
  }

  submitBulkList(text: string) {
    cy.get(PurchaseCardChipsSelectors.bulkListInput).type(text);
    cy.contains('button', PurchaseCardChipsSelectors.bulkSearchText).click();
    cy.wait('@cardSearch', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  expandResult(index: number) {
    cy.get(PurchaseCardChipsSelectors.bulkResultSummary)
      .eq(index)
      .click({ force: true });
  }

  shouldSeeResultChips(
    resultSelector: string,
    index: number,
    chipTestIds: string[]
  ) {
    cy.get(resultSelector, { timeout: TIMEOUTS.GRAPHQL_QUERY })
      .eq(index)
      .within(() => {
        chipTestIds.forEach((chipTestId) => {
          cy.get(chipTestId).should('be.visible');
        });
      });
  }
}
