import { Chip } from '@heroui/react';
import { USER_ROLES, USER_ROLE_LABELS } from '../../domain/constants';
import { UserRole } from '../../domain/types';

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

const ROLE_COLOR_MAP: Record<UserRole, 'primary' | 'secondary' | 'warning'> = {
  [USER_ROLES.ADMIN]: 'primary',
  [USER_ROLES.RECEPTION]: 'secondary',
  [USER_ROLES.BUYER]: 'warning',
};

export default function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <Chip
      size="sm"
      color={ROLE_COLOR_MAP[role] ?? 'default'}
      variant="flat"
      className={className}
    >
      {USER_ROLE_LABELS[role] ?? role}
    </Chip>
  );
}
