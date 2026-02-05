import { UserRole } from '../auth/user-roles';

const Inventory = {
  label: 'Inventario',
  route: '/inventario',
  icon: 'solar:checklist-bold',
};
const Windows = {
  label: 'Ventanas',
  route: '/ventanas',
  icon: 'hugeicons:windows-new',
};
const Quotes = {
  label: 'Cotizaciones',
  route: '/cotizaciones',
  icon: 'material-symbols:receipt-outline-rounded',
};
const Users = {
  label: 'Usuarios',
  route: '/usuarios',
  icon: 'solar:users-group-two-rounded-linear',
};
const Account = {
  label: 'Cuenta',
  route: '/cuenta',
  icon: 'solar:user-circle-linear',
};
const ASSISTANT_ROUTES = [Inventory, Windows, Quotes, Account];
const ADMIN_ROUTES = [Inventory, Windows, Quotes, Users, Account];

export const MENU_ROUTES = {
  [UserRole.SUPERUSER]: ADMIN_ROUTES,
  [UserRole.ADMIN]: ADMIN_ROUTES,
  [UserRole.ASSISTANT]: ASSISTANT_ROUTES,
};
