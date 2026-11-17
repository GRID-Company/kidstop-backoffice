import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PurchasePriceAdjustmentPage from './purchase-price-adjustment.po';
import { PurchasePriceAdjustmentSelectors } from './purchase-price-adjustment.selectors';
import { TIMEOUTS } from '../../support/consts/timeouts.const';

const page = new PurchasePriceAdjustmentPage();

Given('la compra cotizada responde con estado QUOTED', () => {
  page.stubAuxQueries();
  page.stubUpdateStatus();
  page.stubPurchaseSequence([
    'purchases/purchase-quoted.json',
    'purchases/purchase-quoted-accepted.json',
  ]);
  page.visitPurchase('purchase-cypress-quoted');
});

Given('la compra en espera de precio responde sin precios ni pagos', () => {
  page.stubAuxQueries();
  page.stubSellPriceMutation();
  page.stubUpdateStatus();
  page.stubPurchaseSequence([
    'purchases/purchase-waiting-price.json',
    'purchases/purchase-waiting-priced-1.json',
    'purchases/purchase-waiting-priced.json',
    'purchases/purchase-finalized.json',
  ]);
  page.visitPurchase('purchase-cypress-waiting');
});

Given('la compra en espera de precio responde con precios definidos', () => {
  page.stubAuxQueries();
  page.stubUpdateStatus();
  page.stubPurchaseSequence(['purchases/purchase-waiting-priced.json']);
  page.visitPurchase('purchase-cypress-waiting');
});

Given('la mutación de precio de venta responde con error', () => {
  page.stubAuxQueries();
  page.stubSellPriceError('No se puede actualizar el precio de venta');
  page.stubPurchaseSequence(['purchases/purchase-waiting-price.json']);
  page.visitPurchase('purchase-cypress-waiting');
});

When(
  'el usuario define el precio de venta {string} del item {string}',
  (price: string, itemGuid: string) => {
    page.setSellPrice(itemGuid, price);
  }
);

Then(
  'el precio de venta {string} se persiste para el item {string}',
  (price: string, itemGuid: string) => {
    cy.wait('@setSellPrice', { timeout: TIMEOUTS.GRAPHQL_QUERY })
      .its('request.body.variables.setPurchaseItemSellPriceInput')
      .should('deep.include', {
        purchaseItemGuid: itemGuid,
        sellPrice: Number(price),
      });
    cy.wait('@purchaseDetail', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }
);

Then(
  'el precio de venta del item {string} queda en {string}',
  (itemGuid: string, value: string) => {
    cy.get(PurchasePriceAdjustmentSelectors.sellPriceInputFor(itemGuid), {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    }).should('have.value', value);
  }
);

Then('el botón de finalizar compra está deshabilitado', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.finalizeButtonText
  ).should('be.disabled');
});

Then('el botón de finalizar compra está habilitado', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.finalizeButtonText
  ).should('not.be.disabled');
});

When('el usuario abre el registro de pago', () => {
  page.openPaymentModal();
});

When('el usuario agrega un método de pago', () => {
  page.addPaymentMethod();
});

When('el usuario asigna el monto {string} al pago', (amount: string) => {
  page.setPaymentAmount(amount);
});

Then('se muestra el error de pago {string}', (error: string) => {
  cy.contains(error, { timeout: TIMEOUTS.MODAL_OPEN }).should('be.visible');
});

Then('el botón de confirmar pago está deshabilitado', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.confirmPaymentText
  ).should('be.disabled');
});

Then('el botón de confirmar pago está habilitado', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.confirmPaymentText
  ).should('not.be.disabled');
});

When('el usuario confirma el pago', () => {
  page.confirmPayment();
});

When('el usuario acepta la cotización', () => {
  page.clickAcceptQuote();
});

Then('la mutación de estado solicitó {string}', (status: string) => {
  cy.wait('@updatePurchaseStatus', { timeout: TIMEOUTS.GRAPHQL_QUERY })
    .its('request.body.variables.updatePurchaseStatusInput.newStatus')
    .should('eq', status);
});

Then('la compra queda en estado {string}', (label: string) => {
  cy.get(PurchasePriceAdjustmentSelectors.statusBadge, {
    timeout: TIMEOUTS.GRAPHQL_QUERY,
  }).should('have.text', label);
});

When('el usuario inicia la finalización de la compra', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.finalizeButtonText
  ).click();
});

When('el usuario confirma la finalización de la compra', () => {
  page.confirmFinalize();
});

Then('se muestra el mensaje de error {string}', (message: string) => {
  cy.contains(message, { timeout: TIMEOUTS.GRAPHQL_QUERY }).should(
    'be.visible'
  );
});

When('el usuario cotiza la compra', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.quoteButtonText
  ).click();
});

When('el usuario rechaza la compra', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.rejectButtonText
  ).click();
});

When('el usuario vuelve la compra a borrador', () => {
  cy.contains(
    'button',
    PurchasePriceAdjustmentSelectors.returnToDraftText
  ).click();
});
