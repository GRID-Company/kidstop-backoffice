'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { ICustomer } from '../../domain/types';
import { CUSTOMER_STATUSES, CUSTOMER_TYPES } from '../../domain/constants';
import { MOCK_CUSTOMERS } from '../../adapters/api/customers.mock';
import { getMockCustomerOrdersSummary } from '../../adapters/api/customer-orders.mock';
import { BlockCustomerFormData } from '../../adapters/forms/block-customer-form.schema';
import { SetVipFormData } from '../../adapters/forms/set-vip-form.schema';
import { CustomerFormData } from '../../adapters/forms/customer-form.schema';
import CustomerTypeBadge from '../components/customer-type-badge';
import CustomerStatusBadge from '../components/customer-status-badge';
import CustomerOrdersSummary from '../components/customer-orders-summary';
import BlockCustomerModal from '../components/block-customer-modal';
import SetVipModal from '../components/set-vip-modal';
import CustomerEditModal from '../components/customer-edit-modal';

interface CustomerDetailProps {
  customerId: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  const router = useRouter();

  const customer = useMemo<ICustomer | null>(
    () => MOCK_CUSTOMERS.find((c) => c.id === customerId) ?? null,
    [customerId]
  );

  const ordersSummary = useMemo(() => {
    if (!customer) return null;
    return getMockCustomerOrdersSummary(customer.id);
  }, [customer]);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleBack = useCallback(() => {
    router.push('/clientes');
  }, [router]);

  const handleBlockConfirm = useCallback(
    (id: string, data: BlockCustomerFormData) => {
      console.info(`[mock] Block customer: ${id}`, data);
      setIsBlockModalOpen(false);
    },
    []
  );

  const handleUnblock = useCallback((id: string) => {
    console.info(`[mock] Unblock customer: ${id}`);
    setIsBlockModalOpen(false);
  }, []);

  const handleSetVip = useCallback((id: string, data: SetVipFormData) => {
    console.info(`[mock] Set VIP: ${id}`, data);
    setIsVipModalOpen(false);
  }, []);

  const handleRemoveVip = useCallback((id: string, data: SetVipFormData) => {
    console.info(`[mock] Remove VIP: ${id}`, data);
    setIsVipModalOpen(false);
  }, []);

  const handleEditConfirm = useCallback(
    (id: string, data: CustomerFormData) => {
      console.info(`[mock] Edit customer: ${id}`, data);
      setIsEditModalOpen(false);
    },
    []
  );

  const handleViewOrder = useCallback((orderId: string) => {
    console.info(`[mock] View order: ${orderId}`);
  }, []);

  if (!customer) {
    return (
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Detalle del cliente">
          <Button
            variant="light"
            startContent={<Icon icon="lucide:arrow-left" />}
            onPress={handleBack}
            className="text-accent"
          >
            Volver
          </Button>
        </EntitiesPage.Toolbar>
        <EntitiesPage.CardContainer>
          <div className="flex flex-col items-center justify-center py-16 text-default-400">
            <Icon icon="lucide:user-x" className="text-5xl" />
            <p className="mt-4 text-lg font-medium">Cliente no encontrado</p>
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>
    );
  }

  const isBlocked = customer.status === CUSTOMER_STATUSES.BLOCKED;
  const isVip = customer.type === CUSTOMER_TYPES.VIP;

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Detalle del cliente">
          <div className="flex items-center gap-2">
            <Button
              variant="light"
              startContent={<Icon icon="lucide:arrow-left" />}
              onPress={handleBack}
              className="text-accent"
            >
              Volver
            </Button>
          </div>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className="flex flex-col gap-6 px-4">
            <div className="flex flex-col gap-4 rounded-xl bg-default-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="text-xl font-bold">{customer.name}</h2>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:mail" className="text-sm text-default-400" />
                    <span className="text-sm text-default-600">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:phone" className="text-sm text-default-400" />
                      <span className="text-sm text-default-600">{customer.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CustomerTypeBadge type={customer.type} />
                  <CustomerStatusBadge status={customer.status} />
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Total pedidos
                  </span>
                  <span className="text-sm font-semibold">{customer.totalOrders}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    No concretados
                  </span>
                  <span
                    className={`text-sm font-semibold ${customer.uncompletedOrders > 0 ? 'text-danger' : ''}`}
                  >
                    {customer.uncompletedOrders}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Último pedido
                  </span>
                  <span className="text-sm font-semibold">
                    {formatDate(customer.lastOrderDate)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Cliente desde
                  </span>
                  <span className="text-sm font-semibold">
                    {formatDate(customer.createdAt)}
                  </span>
                </div>
              </div>

              {isBlocked && customer.blockedAt && (
                <>
                  <Divider />
                  <div className="flex items-center gap-2 rounded-lg bg-danger-50 p-3">
                    <Icon icon="lucide:alert-triangle" className="text-lg text-danger" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-danger">
                        Cliente bloqueado
                      </span>
                      <span className="text-xs text-danger-600">
                        Desde {formatDate(customer.blockedAt)}
                        {customer.notes && ` — ${customer.notes}`}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="flat"
                startContent={<Icon icon="lucide:pencil" />}
                onPress={() => setIsEditModalOpen(true)}
              >
                Editar
              </Button>
              <Button
                variant="flat"
                color={isVip ? 'default' : 'warning'}
                startContent={
                  <Icon icon={isVip ? 'lucide:user-minus' : 'lucide:crown'} />
                }
                onPress={() => setIsVipModalOpen(true)}
              >
                {isVip ? 'Quitar VIP' : 'Promover VIP'}
              </Button>
              <Button
                variant="flat"
                color={isBlocked ? 'success' : 'danger'}
                startContent={
                  <Icon icon={isBlocked ? 'lucide:lock-open' : 'lucide:lock'} />
                }
                onPress={() => setIsBlockModalOpen(true)}
              >
                {isBlocked ? 'Desbloquear' : 'Bloquear'}
              </Button>
            </div>

            <Divider />

            {ordersSummary && (
              <CustomerOrdersSummary
                summary={ordersSummary}
                onViewOrder={handleViewOrder}
              />
            )}
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <BlockCustomerModal
        customer={customer}
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleBlockConfirm}
        onUnblock={handleUnblock}
      />

      <SetVipModal
        customer={customer}
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onSetVip={handleSetVip}
        onRemoveVip={handleRemoveVip}
      />

      <CustomerEditModal
        customer={customer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
      />
    </>
  );
}
