import { TIMEOUTS } from '../../support/consts/timeouts.const';

const THUMB = '[aria-label*="tamaño completo"]';
const PREVIEW_CLOSE = 'button[aria-label="Cerrar previsualizador"]';
const SELLER_INPUT = 'input[aria-label="Selector de vendedor"]';

const MAX_CARD_THUMB_WIDTH = 140;

export default class CardDisplayPage {
  visitPurchaseNew() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'Sellers') req.alias = 'sellersRequest';
    });
    cy.visit('/compras/nueva');
    cy.get(SELLER_INPUT, { timeout: 15000 }).should('be.visible');
    cy.wait('@sellersRequest', { timeout: 20000 });
    this.ensureSellerConfirmed();
    cy.get('input[aria-label="Buscar carta para agregar a compra"]', {
      timeout: 15000,
    }).should('be.visible');
  }

  private ensureSellerConfirmed() {
    cy.get(SELLER_INPUT).click();
    cy.wait(TIMEOUTS.DEBOUNCE);
    cy.document().then((doc) => {
      if (doc.querySelector('[role="option"]')) {
        cy.get('[role="option"]').first().click();
        cy.contains('button', 'Confirmar vendedor').click();
      } else {
        cy.contains('button', 'Nuevo').click();
        cy.get('input[aria-label="Nombre del vendedor"]', { timeout: 10000 })
          .should('be.visible')
          .type('Vendedor E2E');
        cy.get('input[aria-label="Celular del vendedor"]').type('5512345678');
        cy.contains('button', 'Crear vendedor').click();
        cy.contains('button', 'Crear vendedor').should('not.exist');
      }
    });
  }

  visitInventory() {
    cy.visit('/inventario-cartas');
    cy.get('table', { timeout: 15000 }).should('exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  visitSales() {
    cy.visit('/ventas');
    cy.get('table', { timeout: 15000 }).should('exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  visitMostWanted() {
    cy.visit('/most-wanted');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  searchCardToBuy() {
    cy.get('input[aria-label="Buscar carta para agregar a compra"]')
      .clear()
      .type('Charizard');
    cy.get(THUMB, { timeout: 20000 }).first().should('be.visible');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  clickResultThumbnail() {
    cy.get(THUMB).first().click();
    cy.wait(TIMEOUTS.ANIMATION);
  }

  addFirstResultToPurchase() {
    cy.contains('button', 'Agregar a compra').first().click();
    cy.contains('No hay items en la compra').should('not.exist');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  thumbShouldHaveCardWidth(scope?: string) {
    const chain = scope ? cy.get(scope) : cy.get('body');
    chain
      .find(THUMB)
      .first()
      .should('be.visible')
      .invoke('outerWidth')
      .should('be.lessThan', MAX_CARD_THUMB_WIDTH);
  }

  resultContentShouldBeVisible() {
    cy.contains('Precio por carta').should('be.visible');
    cy.contains('button', 'Agregar a compra').should('be.visible');
  }

  shouldSeePreviewModal() {
    cy.get(PREVIEW_CLOSE, { timeout: 10000 }).should('be.visible');
  }

  shouldNotSeePreviewModal() {
    cy.get(PREVIEW_CLOSE).should('not.exist');
  }

  shouldSeeSinglePreviewModal() {
    cy.get(PREVIEW_CLOSE).should('have.length', 1);
  }

  closePreviewModal() {
    cy.get(PREVIEW_CLOSE).click();
    cy.wait(TIMEOUTS.ANIMATION);
  }

  purchaseListShouldBeEmpty() {
    cy.contains('No hay items en la compra').should('be.visible');
  }

  itemCardThumbShouldHaveCardWidth() {
    this.withinFirstItemCard(() => {
      cy.get(THUMB)
        .first()
        .should('be.visible')
        .invoke('outerWidth')
        .should('be.lessThan', MAX_CARD_THUMB_WIDTH);
    });
  }

  itemNumberShouldHaveHash() {
    this.withinFirstItemCard(() => {
      cy.contains(/^#\S+$/).should('exist');
    });
  }

  private withinFirstItemCard(fn: () => void) {
    cy.get('button[aria-label^="Eliminar "]')
      .first()
      .parents()
      .filter((_, el) => el.querySelector(THUMB) !== null)
      .first()
      .should('exist')
      .within(fn);
  }

  openMovementsTab() {
    cy.contains('button', 'Movimientos', { timeout: 10000 }).click();
    cy.get('table[aria-label="Historial de movimientos"]', {
      timeout: 15000,
    }).should('be.visible');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  openFirstMovement() {
    cy.get('table[aria-label="Historial de movimientos"] tbody tr')
      .first()
      .click();
    cy.wait(TIMEOUTS.ANIMATION);
  }

  clickMovementThumbnail() {
    cy.get('[role="dialog"]', { timeout: 10000 })
      .find(THUMB)
      .first()
      .should('be.visible')
      .click();
  }

  openFirstSale() {
    cy.get('button[aria-label^="Ver pedido"]', { timeout: 15000 })
      .first()
      .click();
    cy.url().should('include', '/ventas/');
    cy.wait(TIMEOUTS.DEBOUNCE);
  }
}
