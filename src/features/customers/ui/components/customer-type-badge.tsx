import { Chip } from '@heroui/react';
import { CUSTOMER_TYPE_LABELS, CUSTOMER_TYPE_COLORS } from '../../domain/constants';
import { CustomerType } from '../../domain/types';

interface CustomerTypeBadgeProps {
  type: CustomerType;
  className?: string;
}

export default function CustomerTypeBadge({ type, className }: CustomerTypeBadgeProps) {
  return (
    <Chip
      size="sm"
      color={CUSTOMER_TYPE_COLORS[type] ?? 'default'}
      variant="flat"
      className={className}
    >
      {CUSTOMER_TYPE_LABELS[type] ?? type}
    </Chip>
  );
}
