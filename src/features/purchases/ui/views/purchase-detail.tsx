'use client';

import { useCallback, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Tooltip,
  Switch,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import BulkCardSearch from '@/shared/blocks/bulk-card-search';
import { BulkSearchFormDataPurchases } from '@/shared/blocks/bulk-card-search/schemas';
import { BulkCardResult } from '@/shared/blocks/bulk-card-search/types';
import { usePrivacyCurrency } from '@/lib/hooks/use-privacy-currency';
import { formatDateTime } from '@/lib/utils/format-date';
import { SetPurchaseItemSellPriceDocument } from '@/lib/api/generated/purchases.generated';
import { PURCHASE_STATUS, IPaymentDetail, IPurchaseItem, IPurchase } from '../../domain/types';
import {
  PURCHASE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '../../domain/constants';
import { calculateTotal } from '../../domain/purchases.domain';
import { mapBulkSearchToPurchaseItems } from '../../adapters/mappers/bulk-search-to-purchase-items.mapper';
import { usePurchaseDetail } from '../hooks/use-purchase-detail';
import { useSellers } from '../hooks/use-sellers';
import { useSellerEditState } from '../hooks/use-seller-edit-state';
import PurchaseStatusBadge from '../components/purchase-status-badge';
import PurchaseItemsList from '../components/purchase-items-list';
import BudgetIndicator from '../components/budget-indicator';
import PrivacyModeToggle from '../components/privacy-mode-toggle';
import WhatsAppQuoteButton from '../components/whatsapp-quote-button';
import CardSearchWithMetrics from '../components/card-search-with-metrics';
import PaymentSplitModal from '../components/payment-split-modal';
import PriceAdjustmentModal from '../components/price-adjustment-modal';
import PurchaseTimeline from '../components/purchase-timeline';
import SellerEditDrawer from '../components/seller-edit-drawer';
import CompletePurchaseModal from '../components/complete-purchase-modal';

interface PurchaseDetailProps {
  purchaseId: string;
}

export default function PurchaseDetail({ purchaseId }: PurchaseDetailProps) {
  const router = useRouter();
  const displayCurrency = usePrivacyCurrency();

  const {
    purchase,
    items,
    payments,
    itemsForm,
    paymentsForm,
    isEditable,
    canSendQuote,
    canQuote,
    canResendQuote,
    canAcceptQuote,
    canRegisterPayment,
    canAdjustPrices,
    canFinalize,
    canReject,
    canReturnToDraft,
    hasItemChanges,
    total,
    mutating,
    currentBuyerSpent,
    assignedBudget,
    existingItemIds,
    loading,
    updateItem,
    removeItem,
    addItem,
    updatePayments,
    updateItems,
    updateStatus,
    updateItemsOnly,
  } = usePurchaseDetail(purchaseId);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isAdvancedSearchEnabled, setIsAdvancedSearchEnabled] = useState(false);
  const tableRefetchPricesRef = useRef<((items?: IPurchaseItem[]) => void) | null>(null);

  const { updateSeller, updating: updatingSeller } = useSellers();
  const { canEditSeller, isEditSellerDrawerOpen, setIsEditSellerDrawerOpen } = useSellerEditState(purchase?.status);

  const [setPurchaseItemSellPrice] = useMutation(SetPurchaseItemSellPriceDocument, {
    onError: (error) => {
      toast.error(`Error al actualizar precio: ${error.message}`);
    },
  });

  const handlePaymentsConfirm = useCallback(
    (newPayments: IPaymentDetail[]) => {
      updatePayments(newPayments);
    },
    [updatePayments]
  );

  const handlePriceAdjustmentConfirm = useCallback(
    async (adjustedItems: IPurchaseItem[]) => {
      try {
        const promises = adjustedItems.map((item) => {
          if (item.sellPrice !== undefined) {
            return setPurchaseItemSellPrice({
              variables: {
                setPurchaseItemSellPriceInput: {
                  purchaseItemGuid: item.guid,
                  sellPrice: item.sellPrice,
                  referencePrice: item.referencePrice,
                },
              },
            });
          }
          return Promise.resolve();
        });

        await Promise.all(promises);
        updateItems(adjustedItems);
        toast.success('Precios actualizados exitosamente');
      } catch (error) {
        // Error already handled by mutation onError callback
      }
    },
    [updateItems, setPurchaseItemSellPrice]
  );

  const handleAcceptQuote = useCallback(() => {
    updateStatus(PURCHASE_STATUS.WAITING_PRICE);
  }, [updateStatus]);

  const handleFinalize = useCallback(() => {
    setIsCompleteModalOpen(true);
  }, []);

  const handleCompleteConfirm = useCallback(async () => {
    await updateStatus(PURCHASE_STATUS.FINALIZED);
    setIsCompleteModalOpen(false);
  }, [updateStatus]);

  const handleReject = useCallback(() => {
    updateStatus(PURCHASE_STATUS.REJECTED);
  }, [updateStatus]);

  const handleReturnToDraft = useCallback(() => {
    updateStatus(PURCHASE_STATUS.DRAFT);
  }, [updateStatus]);

  const handleUpdateItemsOnly = useCallback(async () => {
    await updateItemsOnly();
    if (tableRefetchPricesRef.current) {
      tableRefetchPricesRef.current(items);
    }
  }, [updateItemsOnly, items]);

  const handleBulkSearchConfirm = useCallback(
    (data: BulkSearchFormDataPurchases, results: BulkCardResult[]) => {
      try {
        const newItems = mapBulkSearchToPurchaseItems(data, results, purchase?.tcgType || 'POKEMON');
        newItems.forEach((item) => addItem(item));
        toast.success(`${newItems.length} cartas agregadas exitosamente`);
        setIsAdvancedSearchEnabled(false);
      } catch (error) {
        toast.error('Error al agregar cartas desde búsqueda masiva');
      }
    },
    [purchase?.tcgType, addItem]
  );

  const handleBulkSearchCancel = useCallback(() => {
    setIsAdvancedSearchEnabled(false);
  }, []);

  const finalizeTooltipMessage = useMemo(() => {
    if (purchase?.status !== PURCHASE_STATUS.WAITING_PRICE) {
      return 'Finalizar la compra y registrar en inventario';
    }

    const missingPayments = payments.length === 0;
    const allPricesAdjusted = items.length > 0 && items.every((item) => (item.sellPrice ?? 0) > 0);
    const missingPrices = !allPricesAdjusted;

    if (missingPayments && missingPrices) {
      return 'Debes registrar pagos y ajustar precios de venta en todos los items';
    }
    if (missingPayments) {
      return 'Debes registrar al menos un pago';
    }
    if (missingPrices) {
      return 'Debes ajustar precios de venta en todos los items';
    }

    return 'Finalizar la compra y registrar en inventario';
  }, [purchase?.status, payments.length, items]);

  if (loading) {
    return (
      <EntitiesPage>
        <div className="flex flex-col items-center justify-center py-20 text-default-400">
          <Icon icon="lucide:loader-2" width={48} className="mb-3 animate-spin" />
          <span className="text-lg font-medium">Cargando compra...</span>
        </div>
      </EntitiesPage>
    );
  }

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

  const isTerminal = purchase.status === PURCHASE_STATUS.FINALIZED;

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="">
        <div className="flex min-w-full items-center justify-between">
          <div className="flex items-center gap-5">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.push('/compras')}
              aria-label="Volver a compras"
            >
              <Icon icon="lucide:arrow-left" width={20} />
            </Button>
            <span className="text-lg font-semibold text-accent">
              {purchase.reference}
            </span>
            <PurchaseStatusBadge status={purchase.status} />
          </div>
          <PrivacyModeToggle />
        </div>
      </EntitiesPage.Toolbar>

      <div className="flex flex-col gap-6 px-4">
        <Card className="p-4">
          <PurchaseTimeline currentStatus={purchase.status} />
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={assignedBudget > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <SellerInfoCard
              seller={purchase.seller}
              createdAt={purchase.createdDate}
              updatedAt={purchase.updatedDate}
              notes={purchase.notes}
              isEditable={canEditSeller}
              onEditClick={() => setIsEditSellerDrawerOpen(true)}
            />
          </div>
          {assignedBudget > 0 && (
            <div>
              <BudgetIndicator
                items={items}
                currentSpent={currentBuyerSpent}
                budgetLimit={assignedBudget}
              />
            </div>
          )}
        </div>

        {isEditable && (
          <EntitiesPage.CardContainer>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-accent">
                  Agregar cartas
                </span>
                <Switch
                  size="sm"
                  isSelected={isAdvancedSearchEnabled}
                  onValueChange={setIsAdvancedSearchEnabled}
                >
                  <span className="text-xs">Búsqueda avanzada</span>
                </Switch>
              </div>

              {isAdvancedSearchEnabled ? (
                <BulkCardSearch
                  variant="purchases"
                  onConfirm={handleBulkSearchConfirm}
                  onCancel={handleBulkSearchCancel}
                  isOpen={isAdvancedSearchEnabled}
                />
              ) : (
                <CardSearchWithMetrics
                  onAddItem={addItem}
                  existingItemIds={existingItemIds}
                />
              )}
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
            <PurchaseItemsList
              items={items}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              onRefetchPrices={(refetch) => {
                tableRefetchPricesRef.current = refetch;
              }}
              showRefreshButton={true}
              tcgType={purchase.tcgType}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:zap" width={18} className="text-accent" />
                  <span className="text-sm font-semibold">Acciones</span>
                </div>
                {(canSendQuote || canResendQuote) && (
                  <WhatsAppQuoteButton
                    seller={purchase.seller}
                    items={items}
                    tcgType={purchase.tcgType}
                    label={canResendQuote ? "Reenviar cotización" : undefined}
                  />
                )}
              </div>
              <Divider />
              <div className="flex flex-wrap gap-3">
                {isEditable && (
                  <Button
                    color="secondary"
                    variant="bordered"
                    startContent={<Icon icon="lucide:save" width={18} />}
                    isDisabled={!hasItemChanges || items.length === 0 || loading}
                    onPress={handleUpdateItemsOnly}
                  >
                    Actualizar compra
                  </Button>
                )}

                {canQuote && (
                  <Button
                    color="primary"
                    variant="solid"
                    startContent={<Icon icon="lucide:file-check" width={18} />}
                    onPress={() => updateStatus(PURCHASE_STATUS.QUOTED)}
                  >
                    Cotizar
                  </Button>
                )}

                {canAcceptQuote && (
                  <Button
                    className="bg-success text-white"
                    startContent={<Icon icon="lucide:check-check" width={18} />}
                    onPress={handleAcceptQuote}
                  >
                    Vendedor aceptó cotización
                  </Button>
                )}

                {canRegisterPayment && (
                  <Button
                    variant="bordered"
                    className="border-accent text-accent"
                    startContent={<Icon icon="lucide:wallet" width={18} />}
                    onPress={() => setIsPaymentModalOpen(true)}
                  >
                    {payments.length > 0 ? 'Editar pago' : 'Registrar pago'}
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

                {(canFinalize || purchase.status === PURCHASE_STATUS.WAITING_PRICE) && (
                  <Tooltip content={finalizeTooltipMessage}>
                    <span>
                      <Button
                        className="bg-accent text-white"
                        startContent={!mutating ? <Icon icon="lucide:check-circle" width={18} /> : undefined}
                        onPress={handleFinalize}
                        isDisabled={!canFinalize || mutating}
                        isLoading={mutating}
                      >
                        Finalizar compra
                      </Button>
                    </span>
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

                {canReturnToDraft && (
                  <Button
                    color="warning"
                    variant="bordered"
                    startContent={<Icon icon="lucide:rotate-ccw" width={18} />}
                    onPress={handleReturnToDraft}
                  >
                    Volver a borrador
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
                {formatDateTime(purchase.updatedDate)}
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

      <SellerEditDrawer
        isOpen={isEditSellerDrawerOpen}
        onClose={() => setIsEditSellerDrawerOpen(false)}
        onSubmit={async (data) => {
          await updateSeller(purchase.seller.guid, data);
          setIsEditSellerDrawerOpen(false);
        }}
        seller={purchase.seller}
        isLoading={updatingSeller}
      />

      <CompletePurchaseModal
        purchase={purchase}
        itemCount={items.length}
        payments={payments}
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleCompleteConfirm}
        loading={mutating}
      />
    </EntitiesPage>
  );
}

function SellerInfoCard({
  seller,
  createdAt,
  updatedAt,
  notes,
  isEditable,
  onEditClick,
}: {
  seller: IPurchase['seller'];
  createdAt: string;
  updatedAt: string;
  notes?: string;
  isEditable?: boolean;
  onEditClick?: () => void;
}) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:user" width={18} className="text-accent" />
            <span className="text-sm font-semibold">Vendedor</span>
          </div>
          {isEditable && onEditClick && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onEditClick}
              aria-label="Editar vendedor"
            >
              <Icon icon="lucide:edit-2" width={16} />
            </Button>
          )}
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
            <span className="font-medium">{formatDateTime(createdAt)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-default-400">Actualizada</span>
            <span className="font-medium">{formatDateTime(updatedAt)}</span>
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
