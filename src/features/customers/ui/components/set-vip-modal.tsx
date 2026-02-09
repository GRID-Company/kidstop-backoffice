'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';

import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { ICustomer } from '../../domain/types';
import {
  CUSTOMER_TYPES,
  CUSTOMER_TYPE_LABELS,
} from '../../domain/constants';
import { useSetVipForm } from '../../adapters/forms/use-set-vip-form';
import { SetVipFormData } from '../../adapters/forms/set-vip-form.schema';
import CustomerTypeBadge from './customer-type-badge';
import CustomerStatusBadge from './customer-status-badge';

interface SetVipModalProps {
  customer: ICustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onSetVip?: (customerId: string, data: SetVipFormData) => void;
  onRemoveVip?: (customerId: string, data: SetVipFormData) => void;
  loading?: boolean;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default function SetVipModal({
  customer,
  isOpen,
  onClose,
  onSetVip,
  onRemoveVip,
  loading = false,
}: SetVipModalProps) {
  const { control, handleSubmit, reset } = useSetVipForm();

  const isVip = customer?.type === CUSTOMER_TYPES.VIP;

  const targetTypeLabel = useMemo(() => {
    if (!customer) return '';
    return isVip
      ? CUSTOMER_TYPE_LABELS[CUSTOMER_TYPES.REGULAR]
      : CUSTOMER_TYPE_LABELS[CUSTOMER_TYPES.VIP];
  }, [customer, isVip]);

  useEffect(() => {
    if (isOpen) {
      reset({ notes: '' });
    }
  }, [isOpen, reset]);

  const handleConfirm: SubmitHandler<SetVipFormData> = useCallback(
    (data) => {
      if (!customer) return;
      if (isVip) {
        onRemoveVip?.(customer.id, data);
      } else {
        onSetVip?.(customer.id, data);
      }
    },
    [customer, isVip, onSetVip, onRemoveVip]
  );

  if (!customer) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            {isVip ? 'Quitar estatus VIP' : 'Promover a VIP'}
          </span>
          <span className="text-sm font-normal text-default-500">
            {isVip
              ? `Confirma que deseas regresar a este cliente a ${CUSTOMER_TYPE_LABELS[CUSTOMER_TYPES.REGULAR]}`
              : `Confirma que deseas promover a este cliente a ${CUSTOMER_TYPE_LABELS[CUSTOMER_TYPES.VIP]}`}
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-lg bg-default-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm font-semibold">{customer.name}</p>
                <p className="truncate text-xs text-default-500">{customer.email}</p>
                {customer.phone && (
                  <p className="truncate text-xs text-default-400">{customer.phone}</p>
                )}
              </div>
              <CustomerTypeBadge type={customer.type} />
            </div>

            <div className="flex items-center gap-2">
              <CustomerStatusBadge status={customer.status} />
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Resumen de pedidos</h4>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-default-50 p-4 text-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="text-default-500">Total</span>
                <span className="text-lg font-bold">{customer.totalOrders}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-default-500">Último pedido</span>
                <span className="text-sm font-bold">
                  {formatDate(customer.lastOrderDate)}
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
                {CUSTOMER_TYPE_LABELS[customer.type]} → {targetTypeLabel}
              </span>
            </div>
          </div>

          <form
            id="set-vip-form"
            onSubmit={(...args) => {
              void handleSubmit(handleConfirm)(...args);
            }}
            className="flex flex-col gap-4"
          >
            <TextareaForm
              label="Notas (opcional)"
              placeholder="Agrega notas sobre el cambio de tipo"
              controlProps={{ control, name: 'notes' }}
              minRows={3}
              maxRows={5}
              aria-label="Notas sobre el cambio de tipo de cliente"
            />
          </form>
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>

          {isVip ? (
            <Button
              type="submit"
              form="set-vip-form"
              color="default"
              isLoading={loading}
              startContent={<Icon icon="lucide:user-minus" />}
            >
              Quitar VIP
            </Button>
          ) : (
            <Button
              type="submit"
              form="set-vip-form"
              color="warning"
              isLoading={loading}
              startContent={<Icon icon="lucide:crown" />}
            >
              Promover a VIP
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
