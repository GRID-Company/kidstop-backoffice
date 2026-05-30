import { Chip } from '@heroui/react';

import { PurchaseStatus, PURCHASE_STATUS } from '../../domain/types';
import { PURCHASE_STATUS_LABELS } from '../../domain/constants';

const STATUS_COLOR_MAP: Record<
  PurchaseStatus,
  'default' | 'primary' | 'warning' | 'success' | 'danger'
> = {
  [PURCHASE_STATUS.DRAFT]: 'default',
  [PURCHASE_STATUS.QUOTED]: 'primary',
  [PURCHASE_STATUS.WAITING_PRICE]: 'warning',
  [PURCHASE_STATUS.FINALIZED]: 'success',
  [PURCHASE_STATUS.REJECTED]: 'danger',
};

interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
}

export default function PurchaseStatusBadge({ status }: PurchaseStatusBadgeProps) {
  return (
    <Chip
      size="sm"
      variant="flat"
      color={STATUS_COLOR_MAP[status]}
    >
      {PURCHASE_STATUS_LABELS[status]}
    </Chip>
  );
}
