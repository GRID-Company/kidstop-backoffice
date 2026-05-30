'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';

import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { ICustomer } from '../../domain/types';
import {
  CLIENT_STATUSES,
  DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD,
} from '../../domain/constants';
import { checkBlockThreshold } from '../../domain/customers.domain';
import { useBlockCustomerForm } from '../../adapters/forms/use-block-customer-form';
import { BlockCustomerFormData } from '../../adapters/forms/block-customer-form.schema';
import CustomerTypeBadge from './customer-type-badge';
import CustomerStatusBadge from './customer-status-badge';

interface BlockCustomerModalProps {
  customer: ICustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (customerId: string, data: BlockCustomerFormData) => void;
  onUnblock?: (customerId: string) => void;
  threshold?: number;
  loading?: boolean;
}

export default function BlockCustomerModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
  onUnblock,
  threshold = DEFAULT_UNCOMPLETED_ORDERS_THRESHOLD,
  loading = false,
}: BlockCustomerModalProps) {
  const { control, handleSubmit, formState, reset } = useBlockCustomerForm();

  const isBlocked = customer?.clientStatus === CLIENT_STATUSES.BLOCKED;

  const exceedsThreshold = useMemo(() => {
    if (!customer) return false;
    return checkBlockThreshold(customer, threshold);
  }, [customer, threshold]);

  useEffect(() => {
    if (isOpen) {
      reset({ reason: '' });
    }
  }, [isOpen, reset]);

  const handleBlock: SubmitHandler<BlockCustomerFormData> = useCallback(
    (data) => {
      if (!customer || !onConfirm) return;
      onConfirm(customer.guid, data);
    },
    [customer, onConfirm]
  );

  const handleUnblock = useCallback(() => {
    if (!customer || !onUnblock) return;
    onUnblock(customer.guid);
  }, [customer, onUnblock]);

  if (!customer) return null;

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            {isBlocked ? 'Desbloquear cliente' : 'Bloquear cliente'}
          </span>
          <span className="text-sm font-normal text-default-500">
            {isBlocked
              ? 'Confirma que deseas reactivar a este cliente'
              : 'Confirma el bloqueo e indica la razón'}
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
            <div className="grid grid-cols-3 gap-4 rounded-lg bg-default-50 p-4 text-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="text-default-500">Total</span>
                <span className="text-lg font-bold">{customer.totalOrders ?? '—'}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-default-500">No concretados</span>
                <span
                  className={`text-lg font-bold ${exceedsThreshold ? 'text-danger' : ''}`}
                >
                  {customer.uncompletedOrders ?? '—'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-default-500">Umbral</span>
                <span className="text-lg font-bold">{threshold}</span>
              </div>
            </div>

            {!isBlocked && exceedsThreshold && (
              <Chip
                size="sm"
                color="danger"
                variant="flat"
                startContent={<Icon icon="lucide:alert-triangle" className="text-sm" />}
              >
                El cliente excede el umbral de pedidos no concretados
              </Chip>
            )}
          </div>

          {!isBlocked && (
            <>
              <Divider />

              <form
                id="block-customer-form"
                onSubmit={(...args) => {
                  void handleSubmit(handleBlock)(...args);
                }}
                className="flex flex-col gap-4"
              >
                <TextareaForm
                  label="Razón de bloqueo"
                  placeholder="Describe el motivo del bloqueo"
                  controlProps={{ control, name: 'reason' }}
                  minRows={3}
                  maxRows={5}
                  isRequired
                  aria-label="Razón de bloqueo del cliente"
                />
              </form>
            </>
          )}

        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>

          {isBlocked ? (
            <Button
              color="success"
              isLoading={loading}
              startContent={<Icon icon="lucide:lock-open" />}
              onPress={handleUnblock}
            >
              Desbloquear
            </Button>
          ) : (
            <Button
              type="submit"
              form="block-customer-form"
              color="danger"
              isLoading={loading}
              isDisabled={!formState.isValid}
              startContent={<Icon icon="lucide:lock" />}
            >
              Bloquear cliente
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </KidstopDrawer>
  );
}
