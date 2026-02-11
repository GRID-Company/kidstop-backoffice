'use client';

import { useMemo } from 'react';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDateTime } from '@/lib/utils/format-date';
import {
  FulfillmentStatus,
  ISale,
  SALE_STATUS,
  SaleStatus,
} from '../../domain/types';
import { calculateTotal } from '../../domain/sales.domain';
import { SALE_STATUS_LABELS } from '../../domain/constants';
import SaleCodeDisplay from './sale-code-display';
import SaleStatusBadge from './sale-status-badge';
import SaleItemsTable from './sale-items-table';
import GeneratePdfButton from './generate-pdf-button';

const NEXT_STATUS: Partial<Record<SaleStatus, SaleStatus>> = {
  [SALE_STATUS.NEW]: SALE_STATUS.IN_PROGRESS,
  [SALE_STATUS.IN_PROGRESS]: SALE_STATUS.READY_FOR_PICKUP,
  [SALE_STATUS.READY_FOR_PICKUP]: SALE_STATUS.COMPLETED,
};

const NEXT_STATUS_LABELS: Partial<Record<SaleStatus, string>> = {
  [SALE_STATUS.NEW]: 'Iniciar surtido',
  [SALE_STATUS.IN_PROGRESS]: 'Marcar listo para recolección',
  [SALE_STATUS.READY_FOR_PICKUP]: 'Completar venta',
};

const NEXT_STATUS_ICONS: Partial<Record<SaleStatus, string>> = {
  [SALE_STATUS.NEW]: 'lucide:play',
  [SALE_STATUS.IN_PROGRESS]: 'lucide:package-check',
  [SALE_STATUS.READY_FOR_PICKUP]: 'lucide:check-circle',
};

interface SaleDetailCardProps {
  sale: ISale;
  onStatusChange?: (saleId: string, newStatus: SaleStatus) => void;
  onCancel?: (saleId: string) => void;
  onFulfillmentChange?: (itemId: string, status: FulfillmentStatus) => void;
}

export default function SaleDetailCard({
  sale,
  onStatusChange,
  onCancel,
  onFulfillmentChange,
}: SaleDetailCardProps) {
  const total = useMemo(() => calculateTotal(sale.items), [sale.items]);

  const itemCount = useMemo(
    () => sale.items.reduce((sum, item) => sum + item.quantity, 0),
    [sale.items]
  );

  const isTerminal =
    sale.status === SALE_STATUS.COMPLETED ||
    sale.status === SALE_STATUS.CANCELLED;

  const nextStatus = NEXT_STATUS[sale.status];
  const nextStatusLabel = NEXT_STATUS_LABELS[sale.status];
  const nextStatusIcon = NEXT_STATUS_ICONS[sale.status];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon="lucide:receipt" width={20} className="text-accent" />
              <span className="text-lg font-semibold text-accent">
                Detalle del pedido
              </span>
            </div>
            <SaleStatusBadge status={sale.status} />
          </div>

          <Divider />

          <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-default-400">Código</span>
              <SaleCodeDisplay code={sale.code} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-default-400">Cliente</span>
              <span className="font-medium">{sale.customerName}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-default-400">Email</span>
              <span className="font-medium">{sale.customerEmail}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-default-400">TCG</span>
              <Chip size="sm" variant="flat" className="w-fit">
                {sale.tcgType}
              </Chip>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-default-400">Creado</span>
              <span className="font-medium">{formatDateTime(sale.createdAt)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-default-400">Actualizado</span>
              <span className="font-medium">{formatDateTime(sale.updatedAt)}</span>
            </div>
          </div>

          {sale.notes && (
            <>
              <Divider />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-default-400">Notas</span>
                <span className="text-sm text-default-600">{sale.notes}</span>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:list" width={18} className="text-accent" />
              <span className="text-sm font-semibold">Items del pedido</span>
              <Chip size="sm" variant="flat">
                {itemCount} {itemCount === 1 ? 'carta' : 'cartas'}
              </Chip>
            </div>
            <span className="text-lg font-bold text-accent">
              {formatCurrency(total)}
            </span>
          </div>

          <SaleItemsTable
            items={sale.items}
            onFulfillmentChange={onFulfillmentChange}
          />
        </CardBody>
      </Card>

      {!isTerminal && (
        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:zap" width={18} className="text-accent" />
              <span className="text-sm font-semibold">Acciones</span>
            </div>
            <Divider />
            <div className="flex flex-wrap gap-3">
              {nextStatus && nextStatusLabel && nextStatusIcon && (
                <Tooltip content={nextStatusLabel}>
                  <Button
                    className="bg-accent text-white"
                    startContent={<Icon icon={nextStatusIcon} width={18} />}
                    onPress={() => onStatusChange?.(sale.id, nextStatus)}
                  >
                    {nextStatusLabel}
                  </Button>
                </Tooltip>
              )}

              <GeneratePdfButton sale={sale} />

              <Button
                color="danger"
                variant="flat"
                startContent={<Icon icon="lucide:x-circle" width={18} />}
                onPress={() => onCancel?.(sale.id)}
              >
                Cancelar pedido
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {isTerminal && (
        <div className="flex items-center justify-center rounded-lg border border-default-200 bg-default-50 py-4">
          <div className="flex items-center gap-2 text-default-500">
            <Icon
              icon={
                sale.status === SALE_STATUS.COMPLETED
                  ? 'lucide:check-circle'
                  : 'lucide:x-circle'
              }
              width={18}
            />
            <span className="text-sm font-medium">
              Pedido {SALE_STATUS_LABELS[sale.status].toLowerCase()} el{' '}
              {formatDateTime(sale.updatedAt)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
