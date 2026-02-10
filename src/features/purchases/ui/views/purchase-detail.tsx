'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { formatCurrency } from '@/lib/utils/format-currency';
import { PURCHASE_STATUS, IPaymentDetail, IPurchaseItem, IPurchase } from '../../domain/types';
import {
  PURCHASE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '../../domain/constants';
import { calculateTotal } from '../../domain/purchases.domain';
import { usePurchaseDetail } from '../hooks/use-purchase-detail';
import PurchaseStatusBadge from '../components/purchase-status-badge';
import PurchaseItemsTable from '../components/purchase-items-table';
import BudgetIndicator from '../components/budget-indicator';
import PrivacyModeToggle from '../components/privacy-mode-toggle';
import WhatsAppQuoteButton from '../components/whatsapp-quote-button';
import CardSearchWithMetrics from '../components/card-search-with-metrics';
import PaymentSplitModal from '../components/payment-split-modal';
import PriceAdjustmentModal from '../components/price-adjustment-modal';

const REDACTED_VALUE = '$••••••';

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

interface PurchaseDetailProps {
  purchaseId: string;
}

export default function PurchaseDetail({ purchaseId }: PurchaseDetailProps) {
  const router = useRouter();
  const { isPrivacyMode } = usePrivacyModeStore();

  const {
    purchase,
    items,
    payments,
    isEditable,
    canSendQuote,
    canRegisterPayment,
    canAdjustPrices,
    canFinalize,
    canReject,
    total,
    currentBuyerSpent,
    updateItem,
    removeItem,
    addItem,
    updatePayments,
    updateItems,
    updateStatus,
  } = usePurchaseDetail(purchaseId);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const existingItemIds = useMemo(
    () => new Set(items.map((i) => i.cardId)),
    [items]
  );

  const displayCurrency = useCallback(
    (value: number): string =>
      isPrivacyMode ? REDACTED_VALUE : formatCurrency(value),
    [isPrivacyMode]
  );

  const handleQuoteSent = useCallback(() => {
    updateStatus(PURCHASE_STATUS.QUOTED);
  }, [updateStatus]);

  const handlePaymentsConfirm = useCallback(
    (newPayments: IPaymentDetail[]) => {
      updatePayments(newPayments);
    },
    [updatePayments]
  );

  const handlePriceAdjustmentConfirm = useCallback(
    (adjustedItems: IPurchaseItem[]) => {
      updateItems(adjustedItems);
    },
    [updateItems]
  );

  const handleFinalize = useCallback(() => {
    updateStatus(PURCHASE_STATUS.FINALIZED);
  }, [updateStatus]);

  const handleReject = useCallback(() => {
    updateStatus(PURCHASE_STATUS.REJECTED);
  }, [updateStatus]);

  if (!purchase) {
    return (
      <EntitiesPage>
        <div className="flex flex-col items-center justify-center py-20 text-default-400">
          <Icon icon="lucide:search-x" width={48} className="mb-3" />
          <span className="text-lg font-medium">Compra no encontrada</span>
          <Button
            variant="light"
            className="mt-4 text-accent"
            onPress={() => router.push('/compras')}
            startContent={<Icon icon="lucide:arrow-left" width={16} />}
          >
            Volver a compras
          </Button>
        </div>
      </EntitiesPage>
    );
  }

  const isTerminal =
    purchase.status === PURCHASE_STATUS.FINALIZED ||
    purchase.status === PURCHASE_STATUS.REJECTED;

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.push('/compras')}
              aria-label="Volver a compras"
            >
              <Icon icon="lucide:arrow-left" width={20} />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-accent">
                {purchase.code}
              </span>
              <PurchaseStatusBadge status={purchase.status} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PrivacyModeToggle />
          </div>
        </div>
      </EntitiesPage.Toolbar>

      <div className="flex flex-col gap-6 px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SellerInfoCard
              seller={purchase.seller}
              createdAt={purchase.createdAt}
              updatedAt={purchase.updatedAt}
              notes={purchase.notes}
            />
          </div>
          <div>
            <BudgetIndicator
              items={items}
              currentSpent={currentBuyerSpent}
            />
          </div>
        </div>

        {isEditable && (
          <EntitiesPage.CardContainer>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-accent">
                Agregar cartas
              </span>
              <CardSearchWithMetrics
                onAddItem={addItem}
                existingItemIds={existingItemIds}
              />
            </div>
          </EntitiesPage.CardContainer>
        )}

        <EntitiesPage.CardContainer>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:list" width={18} className="text-accent" />
                <span className="text-sm font-semibold">
                  Items de la compra
                </span>
                <Chip size="sm" variant="flat">
                  {items.length} {items.length === 1 ? 'carta' : 'cartas'}
                </Chip>
              </div>
            </div>
            <PurchaseItemsTable
              items={items}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              isReadOnly={!isEditable}
            />
          </div>
        </EntitiesPage.CardContainer>

        {payments.length > 0 && (
          <EntitiesPage.CardContainer>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:wallet" width={18} className="text-accent" />
                <span className="text-sm font-semibold">Pagos registrados</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {payments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-default-200 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={
                          payment.method === 'CASH'
                            ? 'lucide:banknote'
                            : payment.method === 'TRANSFER'
                              ? 'lucide:arrow-right-left'
                              : 'lucide:store'
                        }
                        width={16}
                        className="text-accent"
                      />
                      <span className="text-sm">
                        {PAYMENT_METHOD_LABELS[payment.method]}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {displayCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end border-t border-default-200 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-default-500">Total pagado:</span>
                  <span className="text-lg font-bold text-accent">
                    {displayCurrency(
                      payments.reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </EntitiesPage.CardContainer>
        )}

        {!isTerminal && (
          <EntitiesPage.CardContainer>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:zap" width={18} className="text-accent" />
                <span className="text-sm font-semibold">Acciones</span>
              </div>
              <Divider />
              <div className="flex flex-wrap gap-3">
                {canSendQuote && (
                  <WhatsAppQuoteButton
                    seller={purchase.seller}
                    items={items}
                    tcgType={purchase.tcgType}
                    onQuoteSent={handleQuoteSent}
                  />
                )}

                {canRegisterPayment && (
                  <Button
                    variant="bordered"
                    className="border-accent text-accent"
                    startContent={<Icon icon="lucide:wallet" width={18} />}
                    onPress={() => setIsPaymentModalOpen(true)}
                  >
                    Registrar pago
                  </Button>
                )}

                {canAdjustPrices && (
                  <Button
                    variant="bordered"
                    className="border-accent text-accent"
                    startContent={<Icon icon="lucide:tag" width={18} />}
                    onPress={() => setIsPriceModalOpen(true)}
                  >
                    Ajustar precios
                  </Button>
                )}

                {canFinalize && (
                  <Tooltip content="Finalizar la compra y registrar en inventario">
                    <Button
                      className="bg-accent text-white"
                      startContent={<Icon icon="lucide:check-circle" width={18} />}
                      onPress={handleFinalize}
                    >
                      Finalizar compra
                    </Button>
                  </Tooltip>
                )}

                {canReject && (
                  <Button
                    color="danger"
                    variant="flat"
                    startContent={<Icon icon="lucide:x-circle" width={18} />}
                    onPress={handleReject}
                  >
                    Rechazar
                  </Button>
                )}
              </div>
            </div>
          </EntitiesPage.CardContainer>
        )}

        {isTerminal && (
          <div className="flex items-center justify-center rounded-lg border border-default-200 bg-default-50 py-4">
            <div className="flex items-center gap-2 text-default-500">
              <Icon
                icon={
                  purchase.status === PURCHASE_STATUS.FINALIZED
                    ? 'lucide:check-circle'
                    : 'lucide:x-circle'
                }
                width={18}
              />
              <span className="text-sm font-medium">
                Compra {PURCHASE_STATUS_LABELS[purchase.status].toLowerCase()} el{' '}
                {formatDate(purchase.updatedAt)}
              </span>
            </div>
          </div>
        )}
      </div>

      <PaymentSplitModal
        items={items}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentsConfirm}
        defaultPayments={payments}
      />

      <PriceAdjustmentModal
        items={items}
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onConfirm={handlePriceAdjustmentConfirm}
      />
    </EntitiesPage>
  );
}

function SellerInfoCard({
  seller,
  createdAt,
  updatedAt,
  notes,
}: {
  seller: IPurchase['seller'];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:user" width={18} className="text-accent" />
          <span className="text-sm font-semibold">Vendedor</span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Nombre</span>
            <span className="font-medium">{seller.name}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Teléfono</span>
            <span className="font-medium">{seller.phone}</span>
          </div>
          {seller.email && (
            <div className="flex flex-col gap-0.5">
              <span className="text-default-400">Email</span>
              <span className="font-medium">{seller.email}</span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Creada</span>
            <span className="font-medium">{formatDate(createdAt)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Actualizada</span>
            <span className="font-medium">{formatDate(updatedAt)}</span>
          </div>
        </div>

        {notes && (
          <>
            <Divider />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-400">Notas</span>
              <span className="text-sm text-default-600">{notes}</span>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
