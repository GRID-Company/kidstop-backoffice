import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from './login-page.po';
import TopbarPage from '../topbar/topbar.po';
import { config } from '../../../support/consts/config.const';

const loginPage = new LoginPage();
const topbar = new TopbarPage();

// Given steps
Given('el usuario está en la página de login', () => {
  loginPage.visit();
  loginPage.shouldBeOnLoginPage();
});

Given('el usuario está autenticado', () => {
  cy.login(
    config.params.logins.admin.email,
    config.params.logins.admin.password
  );
  cy.url().should('include', '/catalogo');
});

Given('el usuario está autenticado como administrador', () => {
  cy.login(
    config.params.logins.admin.email,
    config.params.logins.admin.password
  );
  cy.url().should('include', '/catalogo');
});

// When steps - Email
When('el usuario ingresa el email de administrador', () => {
  loginPage.entersEmail(config.params.logins.admin.email);
});

When('el usuario ingresa el email {string}', (email: string) => {
  loginPage.entersEmail(email);
});

// When steps - Password
When('el usuario ingresa la contraseña de administrador', () => {
  loginPage.entersPassword(config.params.logins.admin.password);
});

When('el usuario ingresa la contraseña {string}', (password: string) => {
  loginPage.entersPassword(password);
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

Then('el usuario debería ver un mensaje de error', () => {
  loginPage.shouldSeeErrorMessage();
});

Then('el usuario debería permanecer en la página de login', () => {
  loginPage.shouldStayOnLoginPage();
});

Then('el botón de iniciar sesión debería estar deshabilitado', () => {
  loginPage.shouldSeeSubmitButtonDisabled();
});

Then('el usuario debería ver la página de login', () => {
  loginPage.shouldBeOnLoginPage();
  loginPage.shouldSeeEmailInput();
});

// Logout steps
When('el usuario hace clic en el menú de usuario', () => {
  topbar.clicksUserMenu();
});

When('el usuario hace clic en cerrar sesión', () => {
  topbar.clicksLogout();
});

// Persistencia de sesión
When('el usuario recarga la página', () => {
  cy.reload();
});

Then('el usuario debería permanecer autenticado', () => {
  cy.url().should('not.include', '/login');
});

// Sesión expirada
When('la sesión del usuario expira', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

When('el usuario intenta navegar a {string}', (path: string) => {
  cy.visit(path);
});
