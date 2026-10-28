import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import CardDisplayPage from './card-display.po';

const page = new CardDisplayPage();

// Given — navegación
Given('el usuario está en la página de nueva compra', () => {
  page.visitPurchaseNew();
});

Given('el usuario está en la página de inventario', () => {
  page.visitInventory();
});

Given('el usuario está en la página de ventas', () => {
  page.visitSales();
});

Given('el usuario está en la página de most wanted', () => {
  page.visitMostWanted();
});

Given('el usuario buscó una carta para comprar', () => {
  page.searchCardToBuy();
});

Given('el usuario agregó una carta a la compra', () => {
  page.searchCardToBuy();
  page.addFirstResultToPurchase();
});

Given('el usuario abre la pestaña de movimientos', () => {
  page.openMovementsTab();
});

// When — búsqueda / interacción
When('el usuario busca una carta para comprar', () => {
  page.searchCardToBuy();
});

When('el usuario hace clic en la imagen del resultado', () => {
  page.clickResultThumbnail();
});

When('el usuario hace clic en la imagen del item de most wanted', () => {
  cy.get('[aria-label*="tamaño completo"]').first().click();
});

When('el usuario hace clic en la imagen del movimiento', () => {
  page.clickMovementThumbnail();
});

When('el usuario cierra el preview de imagen', () => {
  page.closePreviewModal();
});

When('el usuario abre el detalle del primer movimiento', () => {
  page.openFirstMovement();
});

When('el usuario abre el primer pedido', () => {
  page.openFirstSale();
});

// Then — layout del thumbnail (regresión: w-full colapsaba la fila)
Then('el thumbnail del resultado debería tener el ancho de una carta', () => {
  page.thumbShouldHaveCardWidth();
});

Then(
  'el thumbnail del item de compra debería tener el ancho de una carta',
  () => {
    page.itemCardThumbShouldHaveCardWidth();
  }
);

Then(
  'el thumbnail de la primera fila debería tener el ancho de una carta',
  () => {
    page.thumbShouldHaveCardWidth('tbody tr');
  }
);

Then('el thumbnail del movimiento debería tener el ancho de una carta', () => {
  page.thumbShouldHaveCardWidth('[role="dialog"]');
});

Then(
  'el thumbnail del item de venta debería tener el ancho de una carta',
  () => {
    page.thumbShouldHaveCardWidth('[aria-label="Items"]');
  }
);

Then(
  'el thumbnail del item de most wanted debería tener el ancho de una carta',
  () => {
    page.thumbShouldHaveCardWidth();
  }
);

// Then — contenido / número
Then('el contenido del resultado debería ser visible', () => {
  page.resultContentShouldBeVisible();
});

Then('el número del item debería mostrarse en formato #N', () => {
  page.itemNumberShouldHaveHash();
});

// Then — preview modal
Then('debería ver el modal de preview de imagen', () => {
  page.shouldSeePreviewModal();
});

Then('no debería ver el modal de preview de imagen', () => {
  page.shouldNotSeePreviewModal();
});

Then('debería existir un único modal de preview de imagen', () => {
  page.shouldSeeSinglePreviewModal();
});

Then('no debería agregarse ninguna carta a la compra', () => {
  page.purchaseListShouldBeEmpty();
});
