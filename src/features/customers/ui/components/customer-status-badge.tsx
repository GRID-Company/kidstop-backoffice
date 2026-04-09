import { Chip } from '@heroui/react';
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_COLORS } from '../../domain/constants';
import { ClientStatus } from '../../domain/types';

interface CustomerStatusBadgeProps {
  clientStatus: ClientStatus;
  className?: string;
}

export default function CustomerStatusBadge({ clientStatus, className }: CustomerStatusBadgeProps) {
  return (
    <Chip
      size="sm"
      color={CLIENT_STATUS_COLORS[clientStatus] ?? 'default'}
      variant="flat"
      className={className}
    >
      {CLIENT_STATUS_LABELS[clientStatus] ?? clientStatus}
    </Chip>
  );
}
