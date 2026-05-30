'use client';

import { useCallback } from 'react';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Divider,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';

import { formatDate } from '@/lib/utils/format-date';
import { ICustomer } from '../../domain/types';
import { CLIENT_STATUSES } from '../../domain/constants';
import CustomerTypeBadge from './customer-type-badge';
import CustomerStatusBadge from './customer-status-badge';

interface SetVipModalProps {
  customer: ICustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onSetVip?: (customerId: string) => void;
  onRemoveVip?: (customerId: string) => void;
  loading?: boolean;
}

export default function SetVipModal({
  customer,
  isOpen,
  onClose,
  onSetVip,
  onRemoveVip,
  loading = false,
}: SetVipModalProps) {
  const isVip = customer?.clientStatus === CLIENT_STATUSES.VIP;

  const handleConfirm = useCallback(() => {
    if (!customer) return;
    if (isVip) {
      onRemoveVip?.(customer.guid);
    } else {
      onSetVip?.(customer.guid);
    }
  }, [customer, isVip, onSetVip, onRemoveVip]);

  if (!customer) return null;

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            {isVip ? 'Quitar estatus VIP' : 'Promover a VIP'}
          </span>
          <span className="text-sm font-normal text-default-500">
            {isVip
              ? 'Confirma que deseas regresar a este cliente a estado Estándar'
              : 'Confirma que deseas promover a este cliente a VIP'}
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-lg bg-default-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm font-semibold">{customer.name}</p>
                <p className="truncate text-xs text-default-500">{customer.emailAddress}</p>
                {customer.phone && (
                  <p className="truncate text-xs text-default-400">{customer.phone}</p>
                )}
              </div>
              <CustomerTypeBadge role={customer.role} clientStatus={customer.clientStatus} />
            </div>

            <div className="flex items-center gap-2">
              <CustomerStatusBadge clientStatus={customer.clientStatus} />
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Resumen de pedidos</h4>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-default-50 p-4 text-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="text-default-500">Total</span>
                <span className="text-lg font-bold">{customer.totalOrders ?? '—'}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-default-500">Último pedido</span>
                <span className="text-sm font-bold">
                  {formatDate(customer.lastOrderDate, '—')}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex items-center gap-3 rounded-lg bg-default-50 p-4">
            <Icon
              icon={isVip ? 'lucide:arrow-down-circle' : 'lucide:arrow-up-circle'}
              className={`text-2xl ${isVip ? 'text-default-500' : 'text-warning'}`}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">
                Cambio de tipo
              </span>
              <span className="text-xs text-default-500">
                {isVip ? 'VIP → Estándar' : 'Estándar → VIP'}
              </span>
            </div>
          </div>

        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>

          {isVip ? (
            <Button
              color="default"
              isLoading={loading}
              startContent={<Icon icon="lucide:user-minus" />}
              onPress={handleConfirm}
            >
              Quitar VIP
            </Button>
          ) : (
            <Button
              color="warning"
              isLoading={loading}
              startContent={<Icon icon="lucide:crown" />}
              onPress={handleConfirm}
            >
              Promover a VIP
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </KidstopDrawer>
  );
}
