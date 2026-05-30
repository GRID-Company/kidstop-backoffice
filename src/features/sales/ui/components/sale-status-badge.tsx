import { Chip } from '@heroui/react';

import { SaleStatus } from '../../domain/types';
import { SALE_STATUS_LABELS, SALE_STATUS_COLORS } from '../../domain/constants';

interface SaleStatusBadgeProps {
  status: SaleStatus;
  className?: string;
}

export default function SaleStatusBadge({ status, className }: SaleStatusBadgeProps) {
  return (
    <Chip
      size="sm"
      variant="flat"
      color={SALE_STATUS_COLORS[status]}
      className={className}
    >
      {SALE_STATUS_LABELS[status]}
    </Chip>
  );
}
