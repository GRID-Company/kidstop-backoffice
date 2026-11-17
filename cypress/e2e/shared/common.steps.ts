import {
  Before,
  BeforeAll,
  AfterAll,
  When,
  Then,
} from '@badeball/cypress-cucumber-preprocessor';
import {
  createTestPurchase,
  createTestSeller,
  quoteTestPurchase,
} from '../../support/utils/api.utils';
import {
  drainCreatedEntities,
  installCreateSniffer,
  resetCreatedRegistry,
} from '../../support/utils/cleanup.utils';
import { TIMEOUTS } from '../../support/consts/timeouts.const';

BeforeAll(() => {
  resetCreatedRegistry();
});

Before(() => {
  installCreateSniffer();
});

Before({ tags: '@seedSeller' }, () => {
  createTestSeller().then((seller) => {
    cy.wrap(seller.guid).as('testSellerGuid');
    cy.wrap(seller.phone).as('testSellerPhone');
  });
});

Before({ tags: '@seedPurchase' }, () => {
  createTestPurchase().then((purchase) => {
    cy.wrap(purchase.guid).as('testPurchaseGuid');
    cy.wrap(purchase.reference).as('testPurchaseReference');
    cy.wrap(purchase.seller.guid).as('testSellerGuid');
    cy.wrap(purchase.seller.phone).as('testSellerPhone');
  });
});

Before({ tags: '@seedQuotedPurchase' }, () => {
  createTestPurchase().then((purchase) => {
    cy.wrap(purchase.guid).as('testPurchaseGuid');
    cy.wrap(purchase.reference).as('testPurchaseReference');
    cy.wrap(purchase.seller.guid).as('testSellerGuid');
    cy.wrap(purchase.seller.phone).as('testSellerPhone');
    return quoteTestPurchase(purchase.guid);
  });
});

Before({ tags: '@seedMultiItemPurchase' }, () => {
  createTestPurchase({ tcg: 'MAGIC', itemCount: 12 }).then((purchase) => {
    cy.wrap(purchase.guid).as('testPurchaseGuid');
    cy.wrap(purchase.reference).as('testPurchaseReference');
    cy.wrap(purchase.seller.guid).as('testSellerGuid');
    cy.wrap(purchase.seller.phone).as('testSellerPhone');
  });
});

AfterAll(() => {
  drainCreatedEntities();
});

When('el usuario abre la compra de prueba', () => {
  cy.get<string>('@testPurchaseGuid').then((guid) => {
    cy.visit(`/compras/${guid}`);
  });
});

When('el usuario abre la compra {string}', (guid: string) => {
  cy.visit(`/compras/${guid}`);
});

Then('la página debería terminar de cargar', () => {
  cy.contains('Cargando compra', { timeout: TIMEOUTS.GRAPHQL_QUERY }).should(
    'not.exist'
  );
});
