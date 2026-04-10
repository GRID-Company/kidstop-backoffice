export enum UserRole {
  SUPERUSER = 'SUPERUSER',
  ADMIN = 'ADMIN',
  RECEPTION = 'RECEPTION',
  BUYER = 'BUYER',
  CLIENT_KIOSK = 'CLIENT_KIOSK',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPERUSER]: 'Superusuario',
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.RECEPTION]: 'Recepción',
  [UserRole.BUYER]: 'Comprador',
  [UserRole.CLIENT_KIOSK]: 'Kiosk',
};
