import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import UsersPage from './users-page.po';
import { config } from '../../../support/consts/config.const';

const usersPage = new UsersPage();

// Given steps
Given('el administrador está autenticado', () => {
  cy.login(
    config.params.logins.admin.email,
    config.params.logins.admin.password
  );
});

Given('el administrador está en la página de usuarios', () => {
  usersPage.visit();
  usersPage.shouldSeePageTitle();
});

Given('existe un usuario {string}', (userName: string) => {
  // Assumption: user exists in the system
  // In a real scenario, we might create it via API
  usersPage.shouldSeeUserInList(userName);
});

Given('existe un usuario activo {string}', (userName: string) => {
  usersPage.shouldSeeUserInList(userName);
  usersPage.shouldSeeUserAsActive(userName);
});

Given('existe un usuario inactivo {string}', (userName: string) => {
  usersPage.shouldSeeUserInList(userName);
  usersPage.shouldSeeUserAsInactive(userName);
});

Given('el administrador crea un usuario temporal', () => {
  const timestamp = Date.now();
  const tempEmail = `temp.user.${timestamp}@test.com`;

  cy.wrap(tempEmail).as('duplicateEmail');

  usersPage.clickCreateUser();
  usersPage.enterName('Temp User');
  usersPage.enterEmail(tempEmail);
  usersPage.selectRole('Comprador');
  usersPage.clickSave();
  usersPage.shouldSeeSuccessMessage();
});

// When steps - Navigation and viewing
When('el administrador busca {string}', (query: string) => {
  usersPage.searchUser(query);
});

When('el administrador filtra por rol {string}', (role: string) => {
  usersPage.filterByRole(role);
});

When('el administrador filtra por estado {string}', (status: string) => {
  usersPage.filterByStatus(status);
});

// When steps - Create user
When('el administrador hace clic en crear usuario', () => {
  usersPage.clickCreateUser();
  usersPage.shouldSeeUserForm();
});

When('ingresa nombre {string}', (name: string) => {
  usersPage.enterName(name);
});

When('ingresa email {string}', (email: string) => {
  usersPage.enterEmail(email);
});

When('ingresa email dinámico con prefijo {string}', (prefix: string) => {
  const timestamp = Date.now();
  const dynamicEmail = `${prefix}.${timestamp}@test.com`;
  cy.wrap(dynamicEmail).as('currentUserEmail');
  usersPage.enterEmail(dynamicEmail);
});

When('selecciona rol {string}', (role: string) => {
  usersPage.selectRole(role);
});

When('hace clic en guardar', () => {
  usersPage.clickSave();
});

// When steps - Edit user
When('el administrador hace clic en editar usuario', () => {
  // Assumes we're working with the first user or a specific one from context
  cy.get('@currentUser').then((userName) => {
    usersPage.clickEditUser(userName as string);
  });
});

When('cambia el nombre a {string}', (newName: string) => {
  usersPage.enterName(newName);
  cy.wrap(newName).as('updatedName');
});

// When steps - Toggle status
When('el administrador hace clic en desactivar usuario', () => {
  cy.get('@currentUser').then((userName) => {
    usersPage.clickToggleUserStatus(userName as string);
  });
});

When('confirma la desactivación', () => {
  usersPage.confirmAction();
});

When('el administrador hace clic en activar usuario', () => {
  cy.get('@currentUser').then((userName) => {
    usersPage.clickToggleUserStatus(userName as string);
  });
});

// When steps - Validation scenarios
When('el administrador intenta crear otro usuario con el mismo email', () => {
  cy.get('@duplicateEmail').then((email) => {
    usersPage.clickCreateUser();
    usersPage.enterName('Duplicate User');
    usersPage.enterEmail(email as string);
    usersPage.selectRole('Comprador');
    usersPage.clickSave();
  });
});

When('intenta guardar sin llenar campos', () => {
  // Just try to click save without filling anything
  cy.log('Attempting to save without filling fields');
});

// Then steps - List viewing
Then('el administrador debería ver la lista de usuarios', () => {
  usersPage.shouldSeeUsersList();
});

Then('debería ver columnas de nombre, email, rol y estado', () => {
  usersPage.shouldSeeColumns();
});

// Then steps - Search and filter
Then(
  'debería ver solo usuarios que coincidan con {string}',
  (query: string) => {
    usersPage.shouldSeeOnlyUsersMatching(query);
  }
);

Then('debería ver solo usuarios con rol {string}', (role: string) => {
  usersPage.shouldSeeOnlyUsersWithRole(role);
});

Then('debería ver solo usuarios activados', () => {
  usersPage.shouldSeeOnlyActiveUsers();
});

// Then steps - Success messages
Then('debería ver mensaje de éxito', () => {
  usersPage.shouldSeeSuccessMessage();
});

Then('el nuevo usuario debería aparecer en la lista', () => {
  // Assumes the name was stored in context
  cy.get('@currentUserName').then((name) => {
    usersPage.shouldSeeUserInList(name as string);
  });
});

Then('el usuario debería mostrar el nuevo nombre', () => {
  cy.get('@updatedName').then((name) => {
    usersPage.shouldSeeUserInList(name as string);
  });
});

// Then steps - Status changes
Then('el usuario debería aparecer como inactivo', () => {
  cy.get('@currentUser').then((userName) => {
    usersPage.shouldSeeUserAsInactive(userName as string);
  });
});

Then('el usuario debería aparecer como activo', () => {
  cy.get('@currentUser').then((userName) => {
    usersPage.shouldSeeUserAsActive(userName as string);
  });
});

// Then steps - Validation
Then('debería ver mensaje de error de email duplicado', () => {
  usersPage.shouldSeeErrorMessage();
});

Then('el botón de guardar debería estar deshabilitado', () => {
  usersPage.shouldSeeSaveButtonDisabled();
});

// Helper to store current user context
Given('existe un usuario {string}', (userName: string) => {
  cy.wrap(userName).as('currentUser');
  cy.wrap(userName).as('currentUserName');
  usersPage.shouldSeeUserInList(userName);
});
