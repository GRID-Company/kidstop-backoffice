import { Chip } from '@heroui/react';
import { StockStatus } from '../../domain/types';
import {
  STOCK_STATUS_LABELS,
  STOCK_STATUS_COLORS,
} from '../../domain/constants';

interface StockIndicatorProps {
  stockStatus: StockStatus;
  stock: number;
  className?: string;
}

export default function StockIndicator({
  stockStatus,
  stock,
  className,
}: StockIndicatorProps) {
  return (
    <Chip
      size="sm"
      color={STOCK_STATUS_COLORS[stockStatus] ?? 'default'}
      variant="flat"
      className={className}
    >
      {STOCK_STATUS_LABELS[stockStatus] ?? stockStatus} · {stock}
    </Chip>
  );
}
