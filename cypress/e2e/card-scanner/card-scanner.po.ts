import { CardScannerSelectors } from './card-scanner.selectors';
import { getGraphQLOperationName } from '../../support/utils/graphql.utils';
import { TIMEOUTS } from '../../support/consts/timeouts.const';

export default class CardScannerPage {
  stubScanResults(operationName: string, fixture: string) {
    cy.intercept('POST', '**/graphql', (req) => {
      const parsedOperation = getGraphQLOperationName(req);
      const isMultipart = String(req.headers['content-type'] ?? '').includes(
        'multipart/form-data'
      );
      if (
        parsedOperation === operationName ||
        (parsedOperation === null && isMultipart)
      ) {
        req.alias = 'cardScanSearch';
        req.reply({ fixture });
      }
    });
  }

  stubAuxQueries() {
    cy.intercept('POST', '**/graphql', (req) => {
      const operationName = getGraphQLOperationName(req);
      if (operationName === 'Sellers') {
        req.reply({ fixture: 'purchases/sellers.json' });
        return;
      }
      if (
        operationName === 'BuyerBudget' ||
        operationName === 'MagicCardWithMetrics' ||
        operationName === 'PokemonCardWithMetrics'
      ) {
        req.reply({ fixture: 'purchases/empty-aux-queries.json' });
      }
    });
  }

  visitWithTcg(path: string, tcg: 'POKEMON' | 'MAGIC') {
    cy.visit(path, {
      onBeforeLoad: (win) => {
        win.localStorage.setItem(
          'tcgContext',
          JSON.stringify({ state: { selectedTCG: tcg }, version: 1 })
        );
      },
    });
  }

  openFromFab() {
    cy.get(CardScannerSelectors.fab).click();
    cy.contains(CardScannerSelectors.drawerTitle).should('be.visible');
  }

  openFromPurchase() {
    cy.contains('button', CardScannerSelectors.scanButtonText).click();
    cy.contains(CardScannerSelectors.drawerTitle).should('be.visible');
  }

  enableAiMode() {
    cy.get(CardScannerSelectors.effortButton).then(($button) => {
      if ($button.attr('aria-label')?.includes('Normal')) {
        cy.wrap($button).click();
      }
    });
    cy.get(CardScannerSelectors.effortButton)
      .invoke('attr', 'aria-label')
      .should('not.include', 'Normal');
  }

  ensureCameraActive() {
    cy.get('body').then(($body) => {
      if (
        $body.find(
          `button:contains("${CardScannerSelectors.activateCameraText}")`
        ).length > 0
      ) {
        cy.contains('button', CardScannerSelectors.activateCameraText).click();
      }
    });
    cy.get(CardScannerSelectors.captureButton, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    }).should('be.enabled');
    cy.get('video', { timeout: TIMEOUTS.GRAPHQL_QUERY }).should(($video) => {
      expect(($video[0] as HTMLVideoElement).videoWidth).to.be.greaterThan(0);
    });
  }

  capture() {
    this.ensureCameraActive();
    cy.get(CardScannerSelectors.captureButton).click();
    cy.wait('@cardScanSearch', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  addResultToPurchase(index: number) {
    cy.get(CardScannerSelectors.resultItem)
      .eq(index)
      .within(() => {
        cy.contains('button', 'Agregar a compra').click();
      });
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

  shouldSeePurchaseItemChips(chipTestIds: string[]) {
    cy.get(CardScannerSelectors.purchaseItemCard, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    })
      .first()
      .within(() => {
        chipTestIds.forEach((chipTestId) => {
          cy.get(chipTestId).should('be.visible');
        });
      });
  }
}
