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

    // Wait for debounce and GraphQL query
    cy.wait('@usersQuery', { timeout: 10000 });

    // Wait for loading to finish
    cy.contains('Cargando').should('not.exist');

    // Small wait to ensure UI is stable
    cy.wait(500);
  }

  shouldSeeOnlyUsersMatching(query: string) {
    // Wait for users to load - search within the users list table
    cy.get(UsersPageSelectors.usersList)
      .find(UsersPageSelectors.userName)
      .should('have.length.at.least', 1);

    // Verify all visible users in the table match the query
    cy.get(UsersPageSelectors.usersList)
      .find(UsersPageSelectors.userName)
      .each(($el) => {
        const userName = $el.text().toLowerCase();
        expect(userName).to.include(query.toLowerCase());
      });
  }

  // Filters
  filterByRole(role: string) {
    // Click to open dropdown
    cy.get(UsersPageSelectors.filterRoleSelect).click();

    // Wait for dropdown to be visible and click the option
    cy.contains('li', role, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });

    // Wait for GraphQL query
    cy.wait('@usersQuery', { timeout: 10000 });

    // Wait for loading to finish
    cy.contains('Cargando').should('not.exist');
    cy.wait(500);
  }

  filterByStatus(status: string) {
    // Click to open dropdown
    cy.get(UsersPageSelectors.filterStatusSelect).click();

    // Wait for dropdown to be visible and click the option
    cy.contains('li', status, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });

    // Wait for GraphQL query
    cy.wait('@usersQuery', { timeout: 10000 });

    // Wait for loading to finish
    cy.contains('Cargando').should('not.exist');
    cy.wait(500);
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
    cy.get(UsersPageSelectors.createUserButton).first().click();
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
    // Check if the role is already selected
    cy.get(UsersPageSelectors.userFormRoleSelect).then(($select) => {
      const currentValue = $select.text();

      // Only click if we need to change the value
      if (!currentValue.includes(role)) {
        cy.get(UsersPageSelectors.userFormRoleSelect).click();

        // Wait for dropdown to open and click the exact matching option
        cy.contains('li', role, { timeout: 5000 })
          .should('be.visible')
          .click({ force: true });

        // Wait for dropdown to close
        cy.wait(300);
      } else {
        cy.log(`Role "${role}" is already selected, skipping selection`);
      }
    });
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
    // Find the row containing the user name and click the actions button
    cy.contains(UsersPageSelectors.userName, userName)
      .closest('tr')
      .find('[data-testid="user-actions-button"]')
      .click();

    // Click the edit button in the dropdown
    cy.get(UsersPageSelectors.editUserButton).click();
  }

  // Toggle status
  clickToggleUserStatus(userName: string) {
    // Find the row containing the user name and click the actions button
    cy.contains(UsersPageSelectors.userName, userName)
      .closest('tr')
      .find('[data-testid="user-actions-button"]')
      .click();

    // Click the toggle status button in the dropdown
    cy.get(UsersPageSelectors.toggleUserStatusButton).click();
  }

  confirmAction() {
    // Try to find the confirm button - could be "Desactivar", "Activar", "Eliminar", etc.
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="confirm-button"]').length > 0) {
        cy.get('[data-testid="confirm-button"]').click();
      } else {
        // Fallback: look for common confirmation button texts
        cy.contains('button', /Desactivar|Activar|Eliminar|Confirmar/i)
          .filter(':visible')
          .first()
          .click();
      }
    });
  }

  shouldSeeUserAsInactive(userName: string) {
    cy.contains(UsersPageSelectors.userName, userName)
      .closest('tr')
      .find(UsersPageSelectors.userStatus)
      .should('contain', 'Inactivo');
  }

  shouldSeeUserAsActive(userName: string) {
    cy.contains(UsersPageSelectors.userName, userName)
      .closest('tr')
      .find(UsersPageSelectors.userStatus)
      .should('contain', 'Activo');
  }

  // Validations
  shouldSeeSaveButtonDisabled() {
    cy.get(UsersPageSelectors.userFormSaveButton).should('be.disabled');
  }

  shouldSeeErrorMessage() {
    // Look for error message in the UI - could be in toast, modal, or inline
    // Common error indicators: "no está disponible", "error", "inválido", etc.
    cy.get('body', { timeout: 10000 }).should(($body) => {
      const text = $body.text().toLowerCase();
      const hasError =
        text.includes('error') ||
        text.includes('no está disponible') ||
        text.includes('inválido') ||
        text.includes('requerido') ||
        text.includes('duplicado');

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(hasError, 'Should show an error message').to.be.true;
    });
  }
}
