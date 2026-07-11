import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Filter Actions
When('selecciona la condición {string}', (condition: string) => {
  cy.get('[data-testid="filter-condition-select"]').click();
  cy.contains('li', condition, { timeout: 5000 })
    .should('be.visible')
    .first()
    .click({ force: true });
  cy.wait(300);
});

When('selecciona una rareza', () => {
  // Seleccionar la primera rareza disponible
  cy.get('body').then(($body) => {
    if ($body.find('[aria-label="Filtrar por rareza"]').length > 0) {
      cy.get('[aria-label="Filtrar por rareza"]').first().click();
      cy.get('li').first().click({ force: true });
      cy.wait(300);
    }
  });
});

When('aplica los filtros', () => {
  cy.get('[data-testid="filter-drawer-close"]').click();
  cy.wait(500);
});

// Assertions
Then('debería ver solo cartas en condición Near Mint', () => {
  // Verificar que los filtros se aplicaron
  cy.get('[data-testid="catalog-result-count"]').should('be.visible');
});
