import { UsersPageSelectors } from './users-page.selectors';

export default class UsersPage {
  visit() {
    cy.visit('/usuarios');
  }

  // Assertions
  shouldSeeUsersList() {
    cy.get(UsersPageSelectors.usersList).should('be.visible');
  }

  shouldSeePageTitle() {
    cy.get(UsersPageSelectors.pageTitle).should('be.visible');
  }

  shouldSeeColumns() {
    cy.get(UsersPageSelectors.userName).should('exist');
    cy.get(UsersPageSelectors.userEmail).should('exist');
    cy.get(UsersPageSelectors.userRole).should('exist');
    cy.get(UsersPageSelectors.userStatus).should('exist');
  }

  // Search
  searchUser(query: string) {
    cy.get(UsersPageSelectors.searchInput).clear().type(query);
  }

  shouldSeeOnlyUsersMatching(query: string) {
    cy.get(UsersPageSelectors.userName).each(($el) => {
      expect($el.text().toLowerCase()).to.include(query.toLowerCase());
    });
  }

  // Filters
  filterByRole(role: string) {
    cy.get(UsersPageSelectors.filterRoleSelect).click();
    cy.contains(role).click();
  }

  filterByStatus(status: string) {
    cy.get(UsersPageSelectors.filterStatusSelect).click();
    cy.contains(status).click();
  }

  shouldSeeOnlyUsersWithRole(role: string) {
    cy.get(UsersPageSelectors.userRole).each(($el) => {
      expect($el.text()).to.include(role);
    });
  }

  shouldSeeOnlyActiveUsers() {
    cy.get(UsersPageSelectors.userStatus).each(($el) => {
      expect($el.text()).to.include('Activo');
    });
  }

  // Create user
  clickCreateUser() {
    cy.get(UsersPageSelectors.createUserButton).click();
  }

  shouldSeeUserForm() {
    cy.get(UsersPageSelectors.userFormModal).should('be.visible');
  }

  enterName(name: string) {
    cy.get(UsersPageSelectors.userFormNameInput).clear().type(name);
  }

  enterEmail(email: string) {
    cy.get(UsersPageSelectors.userFormEmailInput).clear().type(email);
  }

  selectRole(role: string) {
    cy.get(UsersPageSelectors.userFormRoleSelect).click();
    cy.contains(role).click();
  }

  clickSave() {
    cy.intercept('POST', '**/graphql', (req) => {
      if (
        req.body.operationName === 'CreateUser' ||
        req.body.operationName === 'UpdateUser'
      ) {
        req.alias = 'saveUser';
      }
    });

    cy.get(UsersPageSelectors.userFormSaveButton).click();
    cy.wait('@saveUser', { timeout: 30000 });
  }

  shouldSeeSuccessMessage() {
    cy.get(UsersPageSelectors.successToast, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldSeeUserInList(name: string) {
    cy.contains(UsersPageSelectors.userName, name).should('be.visible');
  }

  // Edit user
  clickEditUser(userName: string) {
    cy.contains(UsersPageSelectors.userName, userName)
      .closest(UsersPageSelectors.userCard)
      .find(UsersPageSelectors.editUserButton)
      .click();
  }

  // Toggle status
  clickToggleUserStatus(userName: string) {
    cy.contains(UsersPageSelectors.userName, userName)
      .closest(UsersPageSelectors.userCard)
      .find(UsersPageSelectors.toggleUserStatusButton)
      .click();
  }

  confirmAction() {
    cy.get(UsersPageSelectors.confirmButton).click();
  }

  shouldSeeUserAsInactive(userName: string) {
    cy.contains(UsersPageSelectors.userName, userName)
      .closest(UsersPageSelectors.userCard)
      .find(UsersPageSelectors.userStatus)
      .should('contain', 'Inactivo');
  }

  shouldSeeUserAsActive(userName: string) {
    cy.contains(UsersPageSelectors.userName, userName)
      .closest(UsersPageSelectors.userCard)
      .find(UsersPageSelectors.userStatus)
      .should('contain', 'Activo');
  }

  // Validations
  shouldSeeSaveButtonDisabled() {
    cy.get(UsersPageSelectors.userFormSaveButton).should('be.disabled');
  }

  shouldSeeErrorMessage() {
    cy.get(UsersPageSelectors.errorToast, { timeout: 10000 }).should(
      'be.visible'
    );
  }
}
