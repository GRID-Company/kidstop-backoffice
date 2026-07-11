import { config } from '../../../support/consts/config.const';
import { LoginPageSelectors } from './login-page.selectors';

export default class LoginPage {
  visit() {
    cy.visit('/login');
  }

  entersEmail(email?: string) {
    const emailToUse = email || config.params.logins.admin.email;
    cy.get(LoginPageSelectors.emailInput).type(emailToUse);
  }

  entersPassword(password?: string) {
    const passwordToUse = password || config.params.logins.admin.password;
    cy.get(LoginPageSelectors.passwordInput).type(passwordToUse);
  }

  clicksSubmitButton() {
    cy.get(LoginPageSelectors.submitButton).click();
  }

  clicksForgotPasswordLink() {
    cy.get(LoginPageSelectors.forgotPasswordLink).click();
  }

  login(email?: string, password?: string) {
    this.entersEmail(email);
    this.entersPassword(password);
    this.clicksSubmitButton();
  }

  shouldBeOnLoginPage() {
    cy.url().should('include', '/login');
  }

  shouldSeeEmailInput() {
    cy.get(LoginPageSelectors.emailInput).should('be.visible');
  }

  shouldSeePasswordInput() {
    cy.get(LoginPageSelectors.passwordInput).should('be.visible');
  }

  shouldSeeSubmitButton() {
    cy.get(LoginPageSelectors.submitButton)
      .should('be.visible')
      .should('contain', 'Iniciar sesión');
  }

  shouldBeRedirectedTo(path: string) {
    cy.url().should('include', path);
  }

  shouldSeeErrorToast() {
    cy.get(LoginPageSelectors.errorToast, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldSeeErrorMessage(message?: string) {
    const toast = cy.get(LoginPageSelectors.errorToast, { timeout: 10000 });
    toast.should('be.visible');
    if (message) {
      toast.should('contain', message);
    }
  }

  shouldStayOnLoginPage() {
    cy.url().should('include', '/login');
    this.shouldSeeEmailInput();
  }

  shouldSeeSubmitButtonDisabled() {
    cy.get(LoginPageSelectors.submitButton).should('be.disabled');
  }

  shouldSeeSubmitButtonEnabled() {
    cy.get(LoginPageSelectors.submitButton).should('not.be.disabled');
  }
}
