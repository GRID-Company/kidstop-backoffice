'use client';

import { useCallback, useMemo, useState } from 'react';
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

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { ICustomer } from '../../domain/types';
import { CUSTOMER_STATUSES, CUSTOMER_TYPES } from '../../domain/constants';
import { BlockCustomerFormData } from '../../adapters/forms/block-customer-form.schema';
import { SetVipFormData } from '../../adapters/forms/set-vip-form.schema';
import { getMockCustomerOrdersSummary } from '../../adapters/api/customer-orders.mock';
import { useCustomerSearch } from '../hooks/use-customer-search';
import CustomersList from '../components/customers-list';
import CustomerTypeBadge from '../components/customer-type-badge';
import CustomerStatusBadge from '../components/customer-status-badge';
import CustomerOrdersSummary from '../components/customer-orders-summary';
import BlockCustomerModal from '../components/block-customer-modal';
import SetVipModal from '../components/set-vip-modal';

export default function Customers() {
  const {
    setSearch,
    handleFilterChange,
    resetFilters,
    results,
    hasActiveFilters,
  } = useCustomerSearch();

  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  const ordersSummary = useMemo(() => {
    if (!selectedCustomer) return null;
    return getMockCustomerOrdersSummary(selectedCustomer.id);
  }, [selectedCustomer]);

  const handleCustomerPress = useCallback((customer: ICustomer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedCustomer(null);
  }, []);

  const handleOpenBlockModal = useCallback((customer: ICustomer) => {
    setSelectedCustomer(customer);
    setIsBlockModalOpen(true);
  }, []);

  const handleCloseBlockModal = useCallback(() => {
    setIsBlockModalOpen(false);
  }, []);

  const handleOpenVipModal = useCallback((customer: ICustomer) => {
    setSelectedCustomer(customer);
    setIsVipModalOpen(true);
  }, []);

  const handleCloseVipModal = useCallback(() => {
    setIsVipModalOpen(false);
  }, []);

  const handleBlockConfirm = useCallback(
    (customerId: string, data: BlockCustomerFormData) => {
      console.info(`[mock] Block customer: ${customerId}`, data);
      setIsBlockModalOpen(false);
    },
    []
  );

  const handleUnblock = useCallback((customerId: string) => {
    console.info(`[mock] Unblock customer: ${customerId}`);
    setIsBlockModalOpen(false);
  }, []);

  const handleSetVip = useCallback(
    (customerId: string, data: SetVipFormData) => {
      console.info(`[mock] Set VIP: ${customerId}`, data);
      setIsVipModalOpen(false);
    },
    []
  );

  const handleRemoveVip = useCallback(
    (customerId: string, data: SetVipFormData) => {
      console.info(`[mock] Remove VIP: ${customerId}`, data);
      setIsVipModalOpen(false);
    },
    []
  );

  const handleCreateCustomer = useCallback(() => {
    console.info('[mock] Create new customer');
  }, []);

  const handleViewOrder = useCallback((orderId: string) => {
    console.info(`[mock] View order: ${orderId}`);
  }, []);

  const isBlocked = selectedCustomer?.status === CUSTOMER_STATUSES.BLOCKED;
  const isVip = selectedCustomer?.type === CUSTOMER_TYPES.VIP;

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Clientes">
          <Button
            color="primary"
            startContent={<Icon icon="lucide:user-plus" />}
            onPress={handleCreateCustomer}
          >
            Nuevo cliente
          </Button>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <CustomersList
            customers={results}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearch}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            onCustomerPress={handleCustomerPress}
          />
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <Drawer isOpen={isDetailOpen} onClose={handleCloseDetail} size="lg">
        <DrawerContent>
          {selectedCustomer && (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-accent">
                  Detalle del cliente
                </span>
                <span className="text-sm font-normal text-default-500">
                  {selectedCustomer.name}
                </span>
              </DrawerHeader>

              <DrawerBody className="flex flex-col gap-6">
                <div className="flex flex-col gap-3 rounded-lg bg-default-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate text-sm font-semibold">
                        {selectedCustomer.name}
                      </p>
                      <p className="truncate text-xs text-default-500">
                        {selectedCustomer.email}
                      </p>
                      {selectedCustomer.phone && (
                        <p className="truncate text-xs text-default-400">
                          {selectedCustomer.phone}
                        </p>
                      )}
                    </div>
                    <CustomerTypeBadge type={selectedCustomer.type} />
                  </div>

                  <div className="flex items-center gap-2">
                    <CustomerStatusBadge status={selectedCustomer.status} />
                  </div>
                </div>

                <Divider />

                {ordersSummary && (
                  <CustomerOrdersSummary
                    summary={ordersSummary}
                    onViewOrder={handleViewOrder}
                  />
                )}
              </DrawerBody>

              <DrawerFooter className="flex justify-between">
                <Button
                  variant="light"
                  onPress={handleCloseDetail}
                  className="text-accent"
                >
                  Cerrar
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="flat"
                    color={isVip ? 'default' : 'warning'}
                    startContent={
                      <Icon icon={isVip ? 'lucide:user-minus' : 'lucide:crown'} />
                    }
                    onPress={() => {
                      setIsDetailOpen(false);
                      handleOpenVipModal(selectedCustomer);
                    }}
                  >
                    {isVip ? 'Quitar VIP' : 'Promover VIP'}
                  </Button>

                  <Button
                    variant="flat"
                    color={isBlocked ? 'success' : 'danger'}
                    startContent={
                      <Icon
                        icon={isBlocked ? 'lucide:lock-open' : 'lucide:lock'}
                      />
                    }
                    onPress={() => {
                      setIsDetailOpen(false);
                      handleOpenBlockModal(selectedCustomer);
                    }}
                  >
                    {isBlocked ? 'Desbloquear' : 'Bloquear'}
                  </Button>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <BlockCustomerModal
        customer={selectedCustomer}
        isOpen={isBlockModalOpen}
        onClose={handleCloseBlockModal}
        onConfirm={handleBlockConfirm}
        onUnblock={handleUnblock}
      />

      <SetVipModal
        customer={selectedCustomer}
        isOpen={isVipModalOpen}
        onClose={handleCloseVipModal}
        onSetVip={handleSetVip}
        onRemoveVip={handleRemoveVip}
      />
    </>
  );
}
