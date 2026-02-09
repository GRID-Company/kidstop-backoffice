import { UserRole } from '../auth/user-roles';

const Users = {
  label: 'Usuarios',
  route: '/usuarios',
  icon: 'solar:users-group-two-rounded-linear',
};
const Settings = {
  label: 'Configuración',
  route: '/configuracion',
  icon: 'lucide:settings',
};
const ClickUp = {
  label: 'ClickUp',
  route: '/clickup',
  icon: 'simple-icons:clickup',
};

const ADMIN_ROUTES = [Users, Settings, ClickUp];

export const MENU_ROUTES = {
  [UserRole.SUPERUSER]: ADMIN_ROUTES,
  [UserRole.ADMIN]: ADMIN_ROUTES,
  [UserRole.RECEPTION]: [],
  [UserRole.BUYER]: [],
};
