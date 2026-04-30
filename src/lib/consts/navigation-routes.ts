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
const Catalog = {
  label: 'Catálogo',
  route: '/catalogo',
  icon: 'lucide:library',
};
const InventoryCards = {
  label: 'Inventario de Cartas',
  route: '/inventario-cartas',
  icon: 'lucide:package',
};
const Purchases = {
  label: 'Compras',
  route: '/compras',
  icon: 'lucide:shopping-cart',
};
const Sales = {
  label: 'Ventas',
  route: '/ventas',
  icon: 'lucide:receipt',
};
const Customers = {
  label: 'Clientes',
  route: '/clientes',
  icon: 'lucide:users',
};
const MostWanted = {
  label: 'Most Wanted',
  route: '/most-wanted',
  icon: 'lucide:star',
};
// const DeckBuilder = {
//   label: 'Buscador Avanzado',
//   route: '/deck-builder',
//   icon: 'lucide:file-search',
// };

const ADMIN_ROUTES = [Catalog, InventoryCards, Purchases, Sales, Customers, MostWanted, Users, Settings];

const RECEPTION_ROUTES = [Catalog, InventoryCards, Purchases, Sales, Customers, MostWanted];

const BUYER_ROUTES = [Catalog, InventoryCards, Purchases];

export const MENU_ROUTES: Partial<Record<UserRole, { label: string; route: string; icon: string }[]>> = {
  [UserRole.SUPERUSER]: ADMIN_ROUTES,
  [UserRole.ADMIN]: ADMIN_ROUTES,
  [UserRole.RECEPTION]: RECEPTION_ROUTES,
  [UserRole.BUYER]: BUYER_ROUTES,
};
