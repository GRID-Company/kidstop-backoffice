import { TopbarSelectors } from './topbar.selectors';

export default class TopbarPage {
  clicksUserMenu() {
    cy.get(TopbarSelectors.userMenuButton).click();
  }

  clicksLogout() {
    cy.get(TopbarSelectors.logoutButton).click();
  }

  shouldSeeUserName(name?: string) {
    const userNameElement = cy.get(TopbarSelectors.userName);
    userNameElement.should('be.visible');
    if (name) {
      userNameElement.should('contain', name);
    }
  }

  shouldSeeUserMenu() {
    cy.get(TopbarSelectors.userMenu).should('be.visible');
  }
}
