'use client';

import { Button, CardBody, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { ICustomer } from '../../domain/types';
import { CUSTOMER_STATUSES } from '../../domain/constants';
import CustomerTypeBadge from './customer-type-badge';
import CustomerStatusBadge from './customer-status-badge';

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
          <CustomerTypeBadge type={customer.type} />
        </div>

        <div className="flex items-center gap-2">
          <CustomerStatusBadge status={customer.status} />
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
