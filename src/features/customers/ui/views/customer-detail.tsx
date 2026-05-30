'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { formatFlexibleDate } from '@/lib/utils/format-date';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { CLIENT_STATUSES } from '../../domain/constants';
import {
  CustomerDocument,
  CustomersDocument,
  SetClientStatusDocument,
  UpdateCustomerDocument,
} from '@/lib/api/generated/customers.generated';
import { toCustomerDomain, toUpdateCustomerInput } from '../../adapters/mappers/customer.mapper';
import { useClientDetails } from '../hooks/use-client-details';
import { formatCurrency } from '@/lib/utils/format-currency';
import { BlockCustomerFormData } from '../../adapters/forms/block-customer-form.schema';
import { CustomerFormData } from '../../adapters/forms/customer-form.schema';
import CustomerTypeBadge from '../components/customer-type-badge';
import CustomerStatusBadge from '../components/customer-status-badge';
import BlockCustomerModal from '../components/block-customer-modal';
import SetVipModal from '../components/set-vip-modal';
import CustomerEditModal from '../components/customer-edit-modal';

interface CustomerDetailProps {
  customerId: string;
}

export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  const router = useRouter();

  const { data, loading } = useQuery(CustomerDocument, {
    variables: { guid: customerId },
    fetchPolicy: 'cache-and-network',
  });

  const [setClientStatus, { loading: settingStatus }] = useMutation(SetClientStatusDocument, {
    refetchQueries: [CustomerDocument, CustomersDocument],
  });

  const [updateCustomer, { loading: updating }] = useMutation(UpdateCustomerDocument, {
    refetchQueries: [CustomerDocument, CustomersDocument],
  });

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleBack = useCallback(() => {
    router.push('/clientes');
  }, [router]);

  const handleBlockConfirm = useCallback(
    async (guid: string, _data: BlockCustomerFormData) => {
      try {
        await setClientStatus({
          variables: { setClientStatusInput: { guid, clientStatus: CLIENT_STATUSES.BLOCKED } },
        });
        toast.success('Cliente bloqueado');
        setIsBlockModalOpen(false);
      } catch {
        toast.error('Error al bloquear el cliente');
      }
    },
    [setClientStatus]
  );

  const handleUnblock = useCallback(
    async (guid: string) => {
      try {
        await setClientStatus({
          variables: { setClientStatusInput: { guid, clientStatus: CLIENT_STATUSES.STANDARD } },
        });
        toast.success('Cliente desbloqueado');
        setIsBlockModalOpen(false);
      } catch {
        toast.error('Error al desbloquear el cliente');
      }
    },
    [setClientStatus]
  );

  const handleSetVip = useCallback(
    async (guid: string) => {
      try {
        await setClientStatus({
          variables: { setClientStatusInput: { guid, clientStatus: CLIENT_STATUSES.VIP } },
        });
        toast.success('Cliente promovido a VIP');
        setIsVipModalOpen(false);
      } catch {
        toast.error('Error al promover a VIP');
      }
    },
    [setClientStatus]
  );

  const handleRemoveVip = useCallback(
    async (guid: string) => {
      try {
        await setClientStatus({
          variables: { setClientStatusInput: { guid, clientStatus: CLIENT_STATUSES.STANDARD } },
        });
        toast.success('Estatus VIP removido');
        setIsVipModalOpen(false);
      } catch {
        toast.error('Error al remover estatus VIP');
      }
    },
    [setClientStatus]
  );

  const handleEditConfirm = useCallback(
    async (guid: string, formData: CustomerFormData) => {
      try {
        const { updateUserInput } = toUpdateCustomerInput(formData, guid);
        await updateCustomer({ variables: { updateUserInput } });
        toast.success('Cliente actualizado');
        setIsEditModalOpen(false);
      } catch {
        toast.error('Error al actualizar el cliente');
      }
    },
    [updateCustomer]
  );

  const { details, loading: detailsLoading } = useClientDetails(customerId);

  if (loading && !data) {
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
            <Icon icon="lucide:loader" className="animate-spin text-5xl" />
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>
    );
  }

  if (!data?.user) {
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

  const customer = toCustomerDomain(data.user);
  const isBlocked = customer.clientStatus === CLIENT_STATUSES.BLOCKED;
  const isVip = customer.clientStatus === CLIENT_STATUSES.VIP;
  const mutating = settingStatus || updating;

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
                    <span className="text-sm text-default-600">{customer.emailAddress}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:phone" className="text-sm text-default-400" />
                      <span className="text-sm text-default-600">{customer.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CustomerTypeBadge role={customer.role} clientStatus={customer.clientStatus} />
                  <CustomerStatusBadge clientStatus={customer.clientStatus} />
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Total pedidos
                  </span>
                  <span className="text-sm font-semibold">
                    {detailsLoading ? '…' : (details?.orderCount ?? '—')}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Monto total
                  </span>
                  <span className="text-sm font-semibold">
                    {detailsLoading ? '…' : details ? formatCurrency(details.totalOrdersAmount) : '—'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Monto completado
                  </span>
                  <span className="text-sm font-semibold text-success">
                    {detailsLoading ? '…' : details ? formatCurrency(details.completedOrdersAmount) : '—'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Inalcanzable
                  </span>
                  <span
                    className={`text-sm font-semibold ${(details?.unreachableCancellations ?? 0) > 0 ? 'text-danger' : ''}`}
                  >
                    {detailsLoading ? '…' : (details?.unreachableCancellations ?? '—')}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Último pedido
                  </span>
                  <span className="text-sm font-semibold">
                    {detailsLoading ? '…' : formatFlexibleDate(details?.lastOrderDate, '—')}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-default-400">
                    Cliente desde
                  </span>
                  <span className="text-sm font-semibold">
                    {formatFlexibleDate(customer.createdDate, '—')}
                  </span>
                </div>
              </div>

              {isBlocked && (
                <>
                  <Divider />
                  <div className="flex items-center gap-2 rounded-lg bg-danger-50 p-3">
                    <Icon icon="lucide:alert-triangle" className="text-lg text-danger" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-danger">
                        Cliente bloqueado
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
                isDisabled={isBlocked}
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
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <BlockCustomerModal
        customer={customer}
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleBlockConfirm}
        onUnblock={handleUnblock}
        loading={mutating}
      />

      <SetVipModal
        customer={customer}
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onSetVip={handleSetVip}
        onRemoveVip={handleRemoveVip}
        loading={mutating}
      />

      <CustomerEditModal
        customer={customer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        loading={updating}
      />
    </>
  );
}
