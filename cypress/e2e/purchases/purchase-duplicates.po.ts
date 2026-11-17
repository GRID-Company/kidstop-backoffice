import { PurchaseDuplicatesSelectors } from './purchase-duplicates.selectors';
import { getGraphQLOperationName } from '../../support/utils/graphql.utils';
import { pickHeroUIOption } from '../../support/utils/select.utils';
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

export default class PurchaseDuplicatesPage {
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

  visitNew(tcg?: 'POKEMON' | 'MAGIC') {
    cy.visit('/compras/nueva', {
      onBeforeLoad: (win) => {
        win.localStorage.removeItem('purchaseItemsView');
        if (tcg) {
          win.localStorage.setItem(
            'tcgContext',
            JSON.stringify({ state: { selectedTCG: tcg }, version: 1 })
          );
        }
      },
    });
  }

  confirmFirstSeller() {
    cy.get(PurchaseDuplicatesSelectors.sellerInput, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    }).click();
    cy.contains('[role="option"]', 'Vendedor Cypress', {
      timeout: TIMEOUTS.DROPDOWN_OPEN,
    }).click();
    cy.contains(
      'button',
      PurchaseDuplicatesSelectors.confirmSellerText
    ).click();
  }

  searchCard(query: string) {
    cy.get(PurchaseDuplicatesSelectors.searchInput).clear().type(query);
    cy.wait('@cardSearch', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  enableAdvancedSearch() {
    cy.contains(PurchaseDuplicatesSelectors.advancedSearchText).click();
  }

  submitBulkList(text: string) {
    cy.get(PurchaseDuplicatesSelectors.bulkListInput).type(text);
    cy.contains('button', PurchaseDuplicatesSelectors.bulkSearchText).click();
    cy.wait('@cardSearch', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  confirmBulkSearch() {
    cy.contains('button', PurchaseDuplicatesSelectors.bulkConfirmText, {
      timeout: TIMEOUTS.MODAL_OPEN,
    }).click();
  }

  addSearchResult(index: number) {
    cy.get(PurchaseDuplicatesSelectors.resultItem, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    })
      .eq(index)
      .contains('button', PurchaseDuplicatesSelectors.addButtonText)
      .click();
  }

  changeResultCondition(index: number, conditionLabel: string) {
    cy.get(PurchaseDuplicatesSelectors.resultItem)
      .eq(index)
      .contains('[data-slot="label"]', 'Condición')
      .parents('[data-slot="base"]')
      .first()
      .find('[data-slot="trigger"]')
      .then(($trigger) => pickHeroUIOption($trigger, conditionLabel));
  }

  shouldSeeAlreadyAdded(index: number) {
    cy.get(PurchaseDuplicatesSelectors.resultItem)
      .eq(index)
      .contains('button', PurchaseDuplicatesSelectors.alreadyAddedText)
      .should('be.disabled');
  }

  shouldSeeAddable(index: number) {
    cy.get(PurchaseDuplicatesSelectors.resultItem)
      .eq(index)
      .contains('button', PurchaseDuplicatesSelectors.addButtonText)
      .should('not.be.disabled');
  }

  shouldSeeDuplicateModal() {
    cy.contains(PurchaseDuplicatesSelectors.duplicateModalTitle, {
      timeout: TIMEOUTS.MODAL_OPEN,
    }).should('be.visible');
  }

  confirmDuplicateModal(buttonText: string) {
    cy.get('[role="dialog"]').contains('button', buttonText).click();
  }

  cancelDuplicateModal() {
    cy.get('[role="dialog"]')
      .contains('button', PurchaseDuplicatesSelectors.cancelText)
      .click();
  }
}
