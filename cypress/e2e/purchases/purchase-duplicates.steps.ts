import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PurchaseDuplicatesPage from './purchase-duplicates.po';

const page = new PurchaseDuplicatesPage();

Given('la compra nueva de Magic tiene búsqueda simple y masiva', () => {
  page.stubAuxQueries();
  page.stubCardSearch(
    'MagicCardInternalList',
    'purchases/magic-internal-list-foil-pair.json'
  );
  page.stubCardSearch(
    'MagicBatchCardSearch',
    'purchases/magic-batch-search-mixed.json'
  );
  page.visitNew('MAGIC');
});

Given('la compra nueva de Magic tiene búsqueda masiva', () => {
  page.stubAuxQueries();
  page.stubCardSearch(
    'MagicBatchCardSearch',
    'purchases/magic-batch-search-foil.json'
  );
  page.visitNew('MAGIC');
});

When('el usuario agrega el resultado {int} a la compra', (index: number) => {
  page.addSearchResult(index - 1);
});

When(
  'el usuario cambia la condición del resultado {int} a {string}',
  (index: number, condition: string) => {
    page.changeResultCondition(index - 1, condition);
  }
);

When('el usuario confirma la búsqueda masiva', () => {
  page.confirmBulkSearch();
});

Then('el resultado {int} está marcado como ya agregada', (index: number) => {
  page.shouldSeeAlreadyAdded(index - 1);
});

Then('el resultado {int} permite agregarse', (index: number) => {
  page.shouldSeeAddable(index - 1);
});

Then(
  'se muestra el modal de cartas duplicadas con {string} y {string}',
  (first: string, second: string) => {
    page.shouldSeeDuplicateModal();
    cy.contains(first).should('be.visible');
    cy.contains(second).should('be.visible');
  }
);

Then(
  'se muestra el modal de cartas duplicadas con {string}',
  (text: string) => {
    page.shouldSeeDuplicateModal();
    cy.contains(text).should('be.visible');
  }
);

When(
  'el usuario confirma agregar {string} del modal de duplicados',
  (buttonText: string) => {
    page.confirmDuplicateModal(buttonText);
  }
);

When('el usuario cancela el modal de duplicados', () => {
  page.cancelDuplicateModal();
});
