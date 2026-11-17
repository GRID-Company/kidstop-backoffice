import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PurchaseItemsViewPage from './purchase-items-view.po';
import { PurchaseItemsViewSelectors } from './purchase-items-view.selectors';

const page = new PurchaseItemsViewPage();

When('el usuario abre la compra de prueba en la vista de items', () => {
  cy.get<string>('@testPurchaseGuid').then((guid) => {
    page.visitPurchase(guid);
  });
});

When('el usuario cambia a la vista de tabla', () => {
  page.switchToTableView();
});

When('el usuario cambia a la vista de cartas', () => {
  page.switchToCardsView();
});

Then('la vista de tabla muestra {int} filas', (rows: number) => {
  cy.get(PurchaseItemsViewSelectors.tableRows).should('have.length', rows);
});

Then('la vista de cartas muestra {int} items', (count: number) => {
  cy.get(PurchaseItemsViewSelectors.itemCard).should('have.length', count);
});

When('el usuario busca el nombre del primer item en la tabla', () => {
  page.searchFirstCardName();
});

When('el usuario busca {string} en la tabla de items', (term: string) => {
  page.searchTable(term);
});

Then('todas las filas visibles coinciden con la búsqueda', () => {
  cy.get<string>('@tableSearchTerm').then((term) => {
    cy.get(PurchaseItemsViewSelectors.tableRows)
      .should('have.length.greaterThan', 0)
      .each(($row) => {
        cy.wrap($row).should('contain.text', term);
      });
  });
});

Then('la tabla muestra el estado vacío de filtros', () => {
  cy.get(PurchaseItemsViewSelectors.emptyState).should(
    'contain',
    'No se encontraron items con esos filtros'
  );
});

Then('la tabla muestra el estado vacío de items', () => {
  cy.get(PurchaseItemsViewSelectors.emptyState).should(
    'contain',
    'No hay items en la compra'
  );
});

When('el usuario filtra por condición {string}', (label: string) => {
  page.filterByOption(PurchaseItemsViewSelectors.conditionFilter, label);
});

When('el usuario filtra por idioma {string}', (label: string) => {
  page.filterByOption(PurchaseItemsViewSelectors.languageFilter, label);
});

When('el usuario limpia los filtros de la tabla', () => {
  page.clearTableFilters();
});

When('el usuario va a la página {int} de la tabla', (pageNum: number) => {
  page.goToPage(pageNum);
});

When(
  'el usuario edita la cantidad del primer item a {string}',
  (quantity: string) => {
    page.setFirstRowQuantity(quantity);
  }
);

Then('el total de compra de la tabla es {string}', (total: string) => {
  cy.get(PurchaseItemsViewSelectors.tableTotal).should('have.text', total);
});

Then('el primer item tiene cantidad {string}', (quantity: string) => {
  cy.get(PurchaseItemsViewSelectors.cardQuantityInput)
    .first()
    .should('have.value', quantity);
});

Then(
  'el primer item de la tabla tiene cantidad {string}',
  (quantity: string) => {
    cy.get(PurchaseItemsViewSelectors.quantityInput)
      .first()
      .should('have.value', quantity);
  }
);

When('el usuario guarda los cambios de la compra', () => {
  page.stubUpdatePurchaseItems();
  page.savePurchaseChanges();
});

When('el usuario elimina el primer item de la tabla', () => {
  page.removeFirstRow();
});

Then('la compra muestra {int} items en el contador', (count: number) => {
  const label = count === 1 ? 'carta' : 'cartas';
  cy.contains(`${count} ${label}`).should('be.visible');
});

When('el usuario agrega el primer resultado a la compra', () => {
  page.addFirstSearchResult();
});

Then('el precio de venta del primer item es de solo lectura', () => {
  cy.get(PurchaseItemsViewSelectors.sellPriceInput).should('not.exist');
  cy.get(PurchaseItemsViewSelectors.sellPriceText)
    .first()
    .invoke('text')
    .should('match', /\$|—/);
});
