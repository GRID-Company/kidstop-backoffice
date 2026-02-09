import { User } from '@/lib/api/schema-types';
import { USER_ROLES } from '../../domain/constants';

const now = Date.now();

export const MOCK_USERS: User[] = [
  {
    guid: '1a2b3c4d-0001',
    name: 'Carlos García',
    emailAddress: 'carlos.garcia@kidstop.com',
    role: USER_ROLES.ADMIN,
    activated: true,
    createdDate: now - 86400000 * 30,
    updatedDate: now - 86400000 * 2,
  },
  {
    guid: '1a2b3c4d-0002',
    name: 'María López',
    emailAddress: 'maria.lopez@kidstop.com',
    role: USER_ROLES.RECEPTION,
    activated: true,
    createdDate: now - 86400000 * 25,
    updatedDate: now - 86400000 * 5,
  },
  {
    guid: '1a2b3c4d-0003',
    name: 'Juan Hernández',
    emailAddress: 'juan.hernandez@kidstop.com',
    role: USER_ROLES.BUYER,
    activated: false,
    createdDate: now - 86400000 * 20,
    updatedDate: now - 86400000 * 1,
  },
  {
    guid: '1a2b3c4d-0004',
    name: 'Ana Martínez',
    emailAddress: 'ana.martinez@kidstop.com',
    role: USER_ROLES.RECEPTION,
    activated: true,
    createdDate: now - 86400000 * 15,
    updatedDate: now - 86400000 * 3,
  },
  {
    guid: '1a2b3c4d-0005',
    name: 'Roberto Sánchez',
    emailAddress: 'roberto.sanchez@kidstop.com',
    role: USER_ROLES.ADMIN,
    activated: true,
    createdDate: now - 86400000 * 10,
    updatedDate: now,
  },
  {
    guid: '1a2b3c4d-0006',
    name: 'Laura Torres',
    emailAddress: 'laura.torres@kidstop.com',
    role: USER_ROLES.BUYER,
    activated: true,
    createdDate: now - 86400000 * 8,
    updatedDate: now - 86400000 * 1,
  },
  {
    guid: '1a2b3c4d-0007',
    name: 'Pedro Ramírez',
    emailAddress: 'pedro.ramirez@kidstop.com',
    role: USER_ROLES.RECEPTION,
    activated: false,
    createdDate: now - 86400000 * 5,
    updatedDate: now,
  },
  {
    guid: '1a2b3c4d-0008',
    name: 'Sofía Díaz',
    emailAddress: 'sofia.diaz@kidstop.com',
    role: USER_ROLES.ADMIN,
    activated: true,
    createdDate: now - 86400000 * 3,
    updatedDate: now,
  },
];
