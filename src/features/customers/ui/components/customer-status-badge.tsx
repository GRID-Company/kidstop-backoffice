import { Chip } from '@heroui/react';
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_COLORS } from '../../domain/constants';
import { CustomerStatus } from '../../domain/types';

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  className?: string;
}

export default function CustomerStatusBadge({ status, className }: CustomerStatusBadgeProps) {
  return (
    <Chip
      size="sm"
      color={CUSTOMER_STATUS_COLORS[status] ?? 'default'}
      variant="flat"
      className={className}
    >
      {CUSTOMER_STATUS_LABELS[status] ?? status}
    </Chip>
  );
}
