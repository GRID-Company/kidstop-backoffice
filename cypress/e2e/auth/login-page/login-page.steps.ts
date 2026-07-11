import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from './login-page.po';
import { config } from '../../../support/consts/config.const';

const loginPage = new LoginPage();

Given('el usuario está en la página de login', () => {
  loginPage.visit();
  loginPage.shouldBeOnLoginPage();
});

When('el usuario ingresa el email de administrador', () => {
  loginPage.entersEmail(config.params.logins.admin.email);
});

When('el usuario ingresa la contraseña de administrador', () => {
  loginPage.entersPassword(config.params.logins.admin.password);
});

When('el usuario hace clic en el botón de iniciar sesión', () => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'Login') {
      req.alias = 'loginRequest';
    }
  });

  loginPage.clicksSubmitButton();

  cy.wait('@loginRequest', { timeout: 30000 });
});

Then('el usuario debería ser redirigido a {string}', (path: string) => {
  loginPage.shouldBeRedirectedTo(path);
});

Then('el usuario debería ver la página del catálogo', () => {
  cy.url().should('include', '/catalogo');
  cy.get('h1, [data-testid="catalog-title"], main', { timeout: 10000 }).should(
    'be.visible'
  );
});
