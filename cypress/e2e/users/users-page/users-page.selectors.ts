export const UsersPageSelectors = {
  // Page elements
  pageTitle: '[data-testid="users-page-title"]',
  usersList: '[data-testid="users-list"]',
  emptyState: '[data-testid="users-empty-state"]',

  // Actions
  createUserButton: '[data-testid="create-user-button"]',
  searchInput: '[data-testid="users-search-input"]',
  filterRoleSelect: '[data-testid="users-filter-role"]',
  filterStatusSelect: '[data-testid="users-filter-status"]',

  // User card/row
  userCard: '[data-testid="user-card"]',
  userName: '[data-testid="user-name"]',
  userEmail: '[data-testid="user-email"]',
  userRole: '[data-testid="user-role"]',
  userStatus: '[data-testid="user-status"]',
  editUserButton: '[data-testid="edit-user-button"]',
  toggleUserStatusButton: '[data-testid="toggle-user-status-button"]',

  // User form modal
  userFormModal: '[data-testid="user-form-modal"]',
  userFormNameInput: '[data-testid="user-form-name-input"]',
  userFormEmailInput: '[data-testid="user-form-email-input"]',
  userFormRoleSelect: '[data-testid="user-form-role-select"]',
  userFormSaveButton: '[data-testid="user-form-save-button"]',
  userFormCancelButton: '[data-testid="user-form-cancel-button"]',

  // Confirmation modal
  confirmationModal: '[data-testid="confirmation-modal"]',
  confirmButton: '[data-testid="confirm-button"]',
  cancelButton: '[data-testid="cancel-button"]',

  // Messages
  successToast: '[role="status"]',
  errorToast: '[role="alert"]',
};
