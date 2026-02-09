export enum UserRole {
  SUPERUSER = 'SUPERUSER',
  ADMIN = 'ADMIN',
  RECEPTION = 'RECEPTION',
  BUYER = 'BUYER',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPERUSER]: 'Superusuario',
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.RECEPTION]: 'Recepción',
  [UserRole.BUYER]: 'Comprador',
};
