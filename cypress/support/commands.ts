/// <reference types="cypress" />

import { config, type CypressRole } from './consts/config.const';
import { LOGIN_MUTATION } from './utils/graphql.utils';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAs(role: CypressRole): Chainable<void>;
      apiLoginAs(role: CypressRole): Chainable<string>;
      gql<T = unknown>(
        query: string,
        variables?: Record<string, unknown>
      ): Chainable<T>;
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

Cypress.Commands.add('loginAs', (role: CypressRole) => {
  const credentials = config.params.logins[role];
  cy.login(credentials.email, credentials.password);
});

Cypress.Commands.add('apiLoginAs', (role: CypressRole) => {
  const credentials = config.params.logins[role];
  return cy
    .request<{ data: { login: { access_token: string } } }>({
      method: 'POST',
      url: Cypress.env('API_ENDPOINT') || config.params.api_endpoint,
      body: {
        operationName: 'Login',
        query: LOGIN_MUTATION,
        variables: {
          loginUserInput: {
            emailAddress: credentials.email,
            password: credentials.password,
          },
        },
      },
    })
    .then((response) => {
      const token = response.body.data.login.access_token;
      Cypress.env('__apiToken', token);
      return token;
    });
});

Cypress.Commands.add(
  'gql',
  <T = unknown>(query: string, variables: Record<string, unknown> = {}) => {
    const token = Cypress.env('__apiToken') as string;
    return cy
      .request<{ data: T; errors?: { message: string }[] }>({
        method: 'POST',
        url: Cypress.env('API_ENDPOINT') || config.params.api_endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { query, variables },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.body.errors?.length) {
          throw new Error(
            `GraphQL error: ${response.body.errors.map((e) => e.message).join(', ')}`
          );
        }
        return response.body.data as T;
      });
  }
);

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
