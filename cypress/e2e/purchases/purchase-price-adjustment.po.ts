import { PurchasePriceAdjustmentSelectors } from './purchase-price-adjustment.selectors';
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

export default class PurchasePriceAdjustmentPage {
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

  stubPurchaseSequence(fixtures: string[]) {
    let callIndex = 0;
    cy.intercept('POST', '**/graphql', (req) => {
      if (getGraphQLOperationName(req) === 'Purchase') {
        req.alias = 'purchaseDetail';
        const fixture = fixtures[Math.min(callIndex, fixtures.length - 1)];
        callIndex += 1;
        req.reply({ fixture });
      }
    });
  }

  stubSellPriceMutation() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (getGraphQLOperationName(req) !== 'SetPurchaseItemSellPrice') return;
      req.alias = 'setSellPrice';
      const input = req.body?.variables?.setPurchaseItemSellPriceInput ?? {};
      req.reply({
        statusCode: 200,
        body: {
          data: {
            setPurchaseItemSellPrice: {
              guid: input.purchaseItemGuid ?? '',
              offerPrice: 0,
              referencePrice: input.referencePrice ?? 0,
              sellPrice: input.sellPrice ?? 0,
              condition: 'NEAR_MINT',
              language: 'ENGLISH',
              quantity: 1,
            },
          },
        },
      });
    });
  }

  stubSellPriceError(message: string) {
    cy.intercept('POST', '**/graphql', (req) => {
      if (getGraphQLOperationName(req) !== 'SetPurchaseItemSellPrice') return;
      req.alias = 'setSellPrice';
      req.reply({
        statusCode: 200,
        body: {
          data: null,
          errors: [{ message, extensions: { code: 'BAD_REQUEST' } }],
        },
      });
    });
  }

  stubUpdateStatus() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (getGraphQLOperationName(req) !== 'UpdatePurchaseStatus') return;
      req.alias = 'updatePurchaseStatus';
      const input = req.body?.variables?.updatePurchaseStatusInput ?? {};
      req.reply({
        statusCode: 200,
        body: {
          data: {
            updatePurchaseStatus: {
              guid: input.purchaseGuid ?? '',
              reference: 'COM-0101',
              status: input.newStatus ?? 'DRAFT',
              updatedDate: '2026-01-02T00:00:00.000Z',
            },
          },
        },
      });
    });
  }

  visitPurchase(guid: string) {
    cy.visit(`/compras/${guid}`);
    cy.wait('@purchaseDetail', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  switchToTableView() {
    cy.get(PurchasePriceAdjustmentSelectors.viewTableButton).click();
    cy.get(PurchasePriceAdjustmentSelectors.itemsTable).should('be.visible');
  }

  setSellPrice(itemGuid: string, price: string) {
    cy.get(PurchasePriceAdjustmentSelectors.sellPriceInputFor(itemGuid), {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    })
      .clear()
      .type(`${price}{enter}`);
  }

  openPaymentModal() {
    cy.contains(
      'button',
      PurchasePriceAdjustmentSelectors.registerPaymentText
    ).click();
  }

  addPaymentMethod() {
    cy.contains(
      'button',
      PurchasePriceAdjustmentSelectors.addPaymentMethodText
    ).click();
  }

  setPaymentAmount(amount: string) {
    cy.get(PurchasePriceAdjustmentSelectors.paymentAmountInput)
      .clear()
      .type(amount);
  }

  confirmPayment() {
    cy.contains(
      'button',
      PurchasePriceAdjustmentSelectors.confirmPaymentText
    ).click();
  }

  clickAcceptQuote() {
    cy.contains(
      'button',
      PurchasePriceAdjustmentSelectors.acceptQuoteText
    ).click();
  }

  confirmFinalize() {
    cy.contains(
      'button',
      PurchasePriceAdjustmentSelectors.confirmFinalizeText
    ).click();
  }
}
