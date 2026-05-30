import { Chip } from '@heroui/react';
import {
  CUSTOMER_ROLE_LABELS,
  CUSTOMER_ROLE_COLORS,
  CUSTOMER_ROLES,
  CLIENT_STATUSES,
} from '../../domain/constants';
import { ClientStatus, CustomerRole } from '../../domain/types';

interface CustomerTypeBadgeProps {
  role: CustomerRole;
  clientStatus: ClientStatus;
  className?: string;
}

export default function CustomerTypeBadge({ role, clientStatus, className }: CustomerTypeBadgeProps) {
  if (role === CUSTOMER_ROLES.CLIENT_KIOSK) {
    return (
      <Chip size="sm" color={CUSTOMER_ROLE_COLORS[role]} variant="flat" className={className}>
        {CUSTOMER_ROLE_LABELS[role]}
      </Chip>
    );
  }

  if (clientStatus === CLIENT_STATUSES.VIP) {
    return (
      <Chip size="sm" color="warning" variant="flat" className={className}>
        VIP
      </Chip>
    );
  }

  return null;
}
