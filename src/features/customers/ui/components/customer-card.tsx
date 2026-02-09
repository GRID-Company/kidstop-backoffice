'use client';

import { Button, CardBody, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { ICustomer } from '../../domain/types';
import {
  CUSTOMER_TYPE_LABELS,
  CUSTOMER_TYPE_COLORS,
  CUSTOMER_STATUS_LABELS,
  CUSTOMER_STATUS_COLORS,
  CUSTOMER_STATUSES,
} from '../../domain/constants';

interface CustomerCardProps {
  customer: ICustomer;
  onViewDetail?: (customer: ICustomer) => void;
  onToggleBlock?: (customer: ICustomer) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Sin pedidos';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default function CustomerCard({
  customer,
  onViewDetail,
  onToggleBlock,
}: CustomerCardProps) {
  const isBlocked = customer.status === CUSTOMER_STATUSES.BLOCKED;

  return (
    <KidstopCard className="h-full">
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-sm font-semibold">{customer.name}</p>
            <p className="truncate text-xs text-default-500">{customer.email}</p>
          </div>
          <Chip size="sm" variant="flat" color={CUSTOMER_TYPE_COLORS[customer.type]}>
            {CUSTOMER_TYPE_LABELS[customer.type]}
          </Chip>
        </div>

        <div className="flex items-center gap-2">
          <Chip size="sm" variant="dot" color={CUSTOMER_STATUS_COLORS[customer.status]}>
            {CUSTOMER_STATUS_LABELS[customer.status]}
          </Chip>
        </div>

        <div className="flex items-center justify-between border-t border-default-100 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wide text-default-400">
              Último pedido
            </span>
            <span className="text-xs font-medium text-default-700">
              {formatDate(customer.lastOrderDate)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] uppercase tracking-wide text-default-400">
              Pedidos
            </span>
            <span className="text-xs font-medium text-default-700">
              {customer.totalOrders}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-default-100 pt-2">
          <Tooltip content="Ver detalle">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onViewDetail?.(customer)}
              aria-label="Ver detalle del cliente"
            >
              <Icon icon="lucide:eye" className="text-base text-default-500" />
            </Button>
          </Tooltip>
          <Tooltip content={isBlocked ? 'Desbloquear' : 'Bloquear'}>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color={isBlocked ? 'success' : 'danger'}
              onPress={() => onToggleBlock?.(customer)}
              aria-label={isBlocked ? 'Desbloquear cliente' : 'Bloquear cliente'}
            >
              <Icon
                icon={isBlocked ? 'lucide:lock-open' : 'lucide:lock'}
                className="text-base"
              />
            </Button>
          </Tooltip>
        </div>
      </CardBody>
    </KidstopCard>
  );
}
