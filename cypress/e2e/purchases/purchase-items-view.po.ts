import { PurchaseItemsViewSelectors } from './purchase-items-view.selectors';
import { getGraphQLOperationName } from '../../support/utils/graphql.utils';
import { selectHeroUIOption } from '../../support/utils/select.utils';
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

export default class PurchaseItemsViewPage {
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

  stubUpdatePurchaseItems() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (getGraphQLOperationName(req) === 'UpdatePurchaseItems') {
        req.alias = 'updatePurchaseItems';
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

  visitPurchase(guid: string) {
    cy.visit(`/compras/${guid}`, {
      onBeforeLoad: (win) => {
        win.localStorage.removeItem('purchaseItemsView');
      },
    });
  }

  confirmFirstSeller() {
    cy.get(PurchaseItemsViewSelectors.sellerInput, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    }).click();
    cy.contains('[role="option"]', 'Vendedor Cypress', {
      timeout: TIMEOUTS.DROPDOWN_OPEN,
    }).click();
    cy.contains('button', 'Confirmar vendedor').click();
  }

  searchCard(query: string) {
    cy.get('input[aria-label="Buscar carta para agregar a compra"]').type(
      query
    );
    cy.wait('@cardSearch', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  addFirstSearchResult() {
    cy.get(PurchaseItemsViewSelectors.resultItem, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    })
      .first()
      .contains('button', 'Agregar a compra')
      .click();
  }

  switchToTableView() {
    cy.get(PurchaseItemsViewSelectors.viewTableButton).click();
    cy.get(PurchaseItemsViewSelectors.itemsTable).should('be.visible');
  }

  switchToCardsView() {
    cy.get(PurchaseItemsViewSelectors.viewCardsButton).click();
    cy.get(PurchaseItemsViewSelectors.itemsTable).should('not.exist');
  }

  searchTable(text: string) {
    cy.get(PurchaseItemsViewSelectors.tableSearchInput).clear().type(text);
  }

  searchFirstCardName() {
    cy.get(PurchaseItemsViewSelectors.cardName)
      .first()
      .invoke('text')
      .then((name) => {
        const term = name.trim().split(/\s+/)[0];
        cy.wrap(term).as('tableSearchTerm');
        this.searchTable(term);
      });
  }

  filterByOption(selectSelector: string, optionLabel: string) {
    selectHeroUIOption(selectSelector, optionLabel);
  }

  clearTableFilters() {
    cy.get(PurchaseItemsViewSelectors.clearFiltersButton).click();
  }

  goToPage(page: number) {
    cy.get(PurchaseItemsViewSelectors.pagination)
      .contains('li[role="button"]', String(page))
      .click();
  }

  setFirstRowQuantity(quantity: string) {
    cy.get(PurchaseItemsViewSelectors.quantityInput)
      .first()
      .type(`{selectall}${quantity}`);
  }

  removeFirstRow() {
    cy.get(PurchaseItemsViewSelectors.removeItemButton).first().click();
  }

  savePurchaseChanges() {
    cy.contains(
      'button',
      PurchaseItemsViewSelectors.updatePurchaseText
    ).click();
    cy.wait('@updatePurchaseItems', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }
}
