'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Spinner,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDateTime } from '@/lib/utils/format-date';
import { TCG_ALERT_COLORS } from '@/lib/consts/tcg-themes';
import {
  CancelReason,
  ISale,
  SALE_STATUS,
} from '../../domain/types';
import {
  CANCEL_REASON_LABELS,
  NEXT_STATUS,
  NEXT_STATUS_ICONS,
  NEXT_STATUS_LABELS,
  SALE_STATUS_LABELS,
} from '../../domain/constants';
import { getCustomerDisplayName, getCustomerDisplayEmail } from '../../adapters/mappers/sale.mapper';
import { useSaleDetail } from '../hooks/use-sale-detail';
import SaleStatusBadge from '../components/sale-status-badge';
import SaleCodeDisplay from '../components/sale-code-display';
import SaleItemsList from '../components/sale-items-list';
import GeneratePdfButton from '../components/generate-pdf-button';
import SendReadyWhatsAppButton from '../components/send-ready-whatsapp-button';
import CompleteSaleModal from '../components/complete-sale-modal';
import CancelSaleModal from '../components/cancel-sale-modal';
import SaleTimeline from '../components/sale-timeline';

interface SaleDetailProps {
  saleId: string;
}

export default function SaleDetail({ saleId }: SaleDetailProps) {
  const router = useRouter();
  const {
    sale,
    items,
    total,
    itemCount,
    isTerminal,
    loading,
    mutating,
    hasChanges,
    updateStatus,
    cancelSale,
    updateItem,
    removeItem,
    saveChanges,
    discardChanges,
  } = useSaleDetail(saleId);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const isEditable = !isTerminal;

  const nextStatus = sale ? NEXT_STATUS[sale.status] : undefined;
  const nextStatusLabel = sale ? NEXT_STATUS_LABELS[sale.status] : undefined;
  const nextStatusIcon = sale ? NEXT_STATUS_ICONS[sale.status] : undefined;

  const handleNextStatusPress = useCallback(() => {
    if (!sale) return;
    if (sale.status === SALE_STATUS.READY) {
      setIsCompleteModalOpen(true);
      return;
    }
    if (nextStatus) {
      void updateStatus(nextStatus);
    }
  }, [sale, nextStatus, updateStatus]);

  const handleCompleteConfirm = useCallback(async () => {
    await updateStatus(SALE_STATUS.COMPLETED);
    setIsCompleteModalOpen(false);
  }, [updateStatus]);

  const handleCancelConfirm = useCallback(
    async (reason: CancelReason) => {
      await cancelSale(reason);
      setIsCancelModalOpen(false);
    },
    [cancelSale]
  );

  if (loading) {
    return (
      <EntitiesPage>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      </EntitiesPage>
    );
  }

  if (!sale) {
    return (
      <EntitiesPage>
        <div className="flex flex-col items-center justify-center py-20 text-default-400">
          <Icon icon="lucide:search-x" width={48} className="mb-3" />
          <span className="text-lg font-medium">Pedido no encontrado</span>
          <Button
            variant="light"
            className="mt-4 text-accent"
            onPress={() => router.push('/ventas')}
            startContent={<Icon icon="lucide:arrow-left" width={16} />}
          >
            Volver a ventas
          </Button>
        </div>
      </EntitiesPage>
    );
  }

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.push('/ventas')}
              aria-label="Volver a ventas"
            >
              <Icon icon="lucide:arrow-left" width={20} />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-accent">
                {sale.saleCode}
              </span>
              <SaleStatusBadge status={sale.status} />
            </div>
          </div>
        </div>
      </EntitiesPage.Toolbar>

      <div className="flex flex-col gap-6 px-4">
        <SaleInfoCard sale={sale} />

        <EntitiesPage.CardContainer>
          <SaleTimeline currentStatus={sale.status} />
        </EntitiesPage.CardContainer>

        <EntitiesPage.CardContainer>
          <div className="flex flex-col gap-4">
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
            <SaleItemsList
              items={items}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              isReadOnly={!isEditable}
            />
          </div>
        </EntitiesPage.CardContainer>

        {!isTerminal && (
          <EntitiesPage.CardContainer>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:zap" width={18} className="text-accent" />
                <span className="text-sm font-semibold">Acciones</span>
              </div>
              <Divider />
              
              {hasChanges && (() => {
                const alertColors = TCG_ALERT_COLORS[sale.tcg];
                return (
                  <div 
                    className="flex items-center justify-between rounded-lg p-3 border"
                    style={{
                      backgroundColor: alertColors.bg,
                      borderColor: alertColors.border,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon 
                        icon="lucide:alert-circle" 
                        width={18} 
                        style={{ color: alertColors.icon }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: alertColors.text }}
                      >
                        Tienes cambios sin guardar
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={discardChanges}
                        aria-label="Descartar cambios sin guardar"
                        startContent={<Icon icon="lucide:x" width={16} />}
                      >
                        Descartar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-accent text-white"
                        isLoading={mutating}
                        onPress={saveChanges}
                        aria-label="Guardar cambios en items"
                        startContent={<Icon icon="lucide:save" width={16} />}
                      >
                        Guardar cambios
                      </Button>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  {nextStatus && nextStatusLabel && nextStatusIcon && (
                    <Tooltip content={nextStatusLabel}>
                      <Button
                        className="bg-accent text-white"
                        isLoading={mutating}
                        isDisabled={hasChanges}
                        startContent={<Icon icon={nextStatusIcon} width={18} />}
                        onPress={handleNextStatusPress}
                      >
                        {nextStatusLabel}
                      </Button>
                    </Tooltip>
                  )}

                  <GeneratePdfButton sale={sale} />

                  <SendReadyWhatsAppButton sale={sale} />
                </div>

                <Button
                  color="danger"
                  variant="flat"
                  isDisabled={mutating || hasChanges}
                  startContent={<Icon icon="lucide:x-circle" width={18} />}
                  onPress={() => setIsCancelModalOpen(true)}
                >
                  Cancelar pedido
                </Button>
              </div>
            </div>
          </EntitiesPage.CardContainer>
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
                {formatDateTime(sale.updatedDate)}
              </span>
            </div>
          </div>
        )}
      </div>

      <CompleteSaleModal
        sale={sale}
        itemCount={itemCount}
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleCompleteConfirm}
        loading={mutating}
      />

      <CancelSaleModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        loading={mutating}
      />
    </EntitiesPage>
  );
}

function SaleInfoCard({ sale }: { sale: ISale }) {
  const customerName = getCustomerDisplayName(
    sale.customer?.name,
    sale.kioskCustomerName
  );
  const customerEmail = getCustomerDisplayEmail(
    sale.customer?.emailAddress,
    sale.kioskCustomerEmail
  );

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:receipt" width={18} className="text-accent" />
          <span className="text-sm font-semibold">Información del pedido</span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Código</span>
            <SaleCodeDisplay code={sale.saleCode} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Cliente</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Email</span>
            <span className="font-medium">{customerEmail ?? '—'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">TCG</span>
            <Chip size="sm" variant="flat" className="w-fit">
              {sale.tcg}
            </Chip>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Creado</span>
            <span className="font-medium">
              {formatDateTime(sale.createdDate)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Actualizado</span>
            <span className="font-medium">
              {formatDateTime(sale.updatedDate)}
            </span>
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

        {sale.cancelReason && (
          <>
            <Divider />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-400">Motivo de cancelación</span>
              <span className="text-sm font-medium text-danger">
                {CANCEL_REASON_LABELS[sale.cancelReason]}
              </span>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
