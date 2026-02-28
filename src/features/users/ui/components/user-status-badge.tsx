import { Chip } from '@heroui/react';
import { USER_STATUS, USER_STATUS_LABELS } from '../../domain/constants';
import { UserStatus } from '../../domain/types';

interface UserStatusBadgeProps {
  active: boolean;
  className?: string;
}

const STATUS_COLOR_MAP: Record<UserStatus, 'success' | 'danger'> = {
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.INACTIVE]: 'danger',
};

export default function UserStatusBadge({
  active,
  className,
}: UserStatusBadgeProps) {
  const status = active ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;

  return (
    <Chip
      size="sm"
      color={STATUS_COLOR_MAP[status]}
      variant="flat"
      className={className}
    >
      {USER_STATUS_LABELS[status]}
    </Chip>
  );
}
