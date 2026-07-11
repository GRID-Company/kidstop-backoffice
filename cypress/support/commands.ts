/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      navigateTo(route: string): Chainable<void>;
      checkNewUrl(path: string): Chainable<void>;
      waitForGraphQL(operationName: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'Login') {
      req.alias = 'loginRequest';
    }
  });

  cy.visit('/login');
  cy.get('[data-testid="login-email-input"]').type(email);
  cy.get('[data-testid="login-password-input"]').type(password);
  cy.get('[data-testid="login-submit-button"]').click();

  cy.wait('@loginRequest', { timeout: 30000 });
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('navigateTo', (route: string) => {
  cy.visit(`/${route}`);
});

Cypress.Commands.add('checkNewUrl', (path: string) => {
  cy.url().should('include', path);
});

Cypress.Commands.add('waitForGraphQL', (operationName: string) => {
  cy.wait(`@${operationName}`);
});

export {};
