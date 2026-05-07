import { useCallback, useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/lib/store/auth';

import { 
  PurchaseDocument,
  UpdatePurchaseStatusDocument,
  UpdatePurchaseItemsDocument,
} from '@/lib/api/generated/purchases.generated';
import { BuyerBudgetDocument } from '@/lib/api/generated/buyer-budgets.generated';
import {
  IPurchase,
  IPurchaseItem,
  IPaymentDetail,
  PurchaseStatus,
  PURCHASE_STATUS,
  ISeller,
  CardCondition,
} from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';
import { usePurchaseItemsForm, PurchaseItemsFormData } from '../../adapters/forms/use-purchase-items-form';
import { usePaymentSplitForm, PaymentSplitFormData } from '../../adapters/forms/use-payment-split-form';
import { mapFormItemToPurchaseItem } from '../../adapters/mappers/item-mapper';

interface UsePurchaseDetailReturn {
  purchase: IPurchase | null;
  items: IPurchaseItem[];
  payments: IPaymentDetail[];
  itemsForm: ReturnType<typeof usePurchaseItemsForm>;
  paymentsForm: ReturnType<typeof usePaymentSplitForm>;
  isEditable: boolean;
  canSendQuote: boolean;
  canQuote: boolean;
  canResendQuote: boolean;
  canAcceptQuote: boolean;
  canRegisterPayment: boolean;
  canAdjustPrices: boolean;
  canFinalize: boolean;
  canReject: boolean;
  canReturnToDraft: boolean;
  hasItemChanges: boolean;
  total: number;
  currentBuyerSpent: number;
  assignedBudget: number;
  budgetUtilization: number;
  loading: boolean;
  error: Error | undefined;
  updateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  removeItem: (itemId: string) => void;
  addItem: (item: IPurchaseItem) => void;
  updatePayments: (payments: IPaymentDetail[]) => void;
  updateItems: (items: IPurchaseItem[]) => void;
  updateStatus: (status: PurchaseStatus) => void;
  updateItemsOnly: () => Promise<void>;
}

export function usePurchaseDetail(purchaseId: string): UsePurchaseDetailReturn {
  const { data, loading, error, refetch } = useQuery(PurchaseDocument, {
    variables: { guid: purchaseId },
    skip: !purchaseId,
  });

  const [updatePurchaseStatusMutation] = useMutation(UpdatePurchaseStatusDocument, {
    onCompleted: () => {
      toast.success('Estado de compra actualizado');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error al actualizar estado: ${error.message}`);
    },
  });

  const [updatePurchaseItemsMutation] = useMutation(UpdatePurchaseItemsDocument, {
    onError: (error) => {
      toast.error(`Error al guardar items: ${error.message}`);
    },
  });

  const basePurchase = useMemo<IPurchase | null>(() => {
    if (!data?.purchase) return null;

    const p = data.purchase;
    const seller: ISeller | undefined = p.seller
      ? {
          guid: p.seller.guid,
          name: p.seller.name,
          phone: p.seller.phone || '',
          email: p.seller.email || undefined,
          notes: p.seller.notes || undefined,
        }
      : undefined;

    return {
      guid: p.guid,
      reference: p.reference,
      status: p.status as PurchaseStatus,
      seller: seller!,
      tcgType: p.tcg === 'POKEMON' ? 'POKEMON' : 'MAGIC',
      buyer: p.buyer
        ? {
            guid: p.buyer.guid,
            name: p.buyer.name || '',
          }
        : undefined,
      items: (p.items || []).map((item) => ({
        guid: item.guid,
        cardGuid: item.pokemonCardSummary?.guid || item.magicCardSummary?.guid || '',
        cardName: item.pokemonCardSummary?.name || item.magicCardSummary?.name || '',
        cardImageUrl: item.pokemonCardSummary?.imageUri || item.magicCardSummary?.imageUri || '',
        setName: item.pokemonCardSummary?.setName || item.magicCardSummary?.edition || '',
        setCode: item.pokemonCardSummary?.setCode || item.magicCardSummary?.collectorNumber || '',
        cardNumber: item.pokemonCardSummary?.cardNumber || undefined,
        variant: item.pokemonCardSummary?.variant || undefined,
        type: item.pokemonCardSummary?.type || undefined,
        hp: item.pokemonCardSummary?.hp || undefined,
        stage: item.pokemonCardSummary?.stage || undefined,
        tcgType: p.tcg === 'POKEMON' ? 'POKEMON' : 'MAGIC',
        condition: item.condition as CardCondition,
        quantity: item.quantity,
        offerPrice: item.offerPrice,
        referencePrice: item.referencePrice || undefined,
        currentReferencePrice: item.referencePrice || undefined,
        sellPrice: item.sellPrice || undefined,
      })),
      payments: (p.payments || []).map((payment) => ({
        method: payment.method as any,
        amount: payment.amount,
      })),
      notes: p.notes || undefined,
      createdDate: (p.createdDate as string) || '',
      updatedDate: (p.updatedDate as string) || '',
    };
  }, [data]);

  const itemsForm = usePurchaseItemsForm({ initialItems: basePurchase?.items || [] });
  const paymentsForm = usePaymentSplitForm();
  const [status, setStatus] = useState<PurchaseStatus>(PURCHASE_STATUS.DRAFT);

  useEffect(() => {
    if (basePurchase) {
      itemsForm.form.reset({
        items: basePurchase.items.map((item) => ({
          cardGuid: item.cardGuid,
          condition: item.condition,
          quantity: item.quantity,
          offerPrice: item.offerPrice,
          referencePrice: item.referencePrice,
        })),
      });
      paymentsForm.reset({
        payments: basePurchase.payments,
      });
      setStatus(basePurchase.status);
    }
  }, [basePurchase?.guid]);

  const formValues = itemsForm.form.getValues('items');
  const items = useMemo(() => {
    if (!basePurchase) return [];
    return basePurchase.items.map((originalItem, index) => {
      const formItem = formValues[index];
      if (!formItem) return originalItem;
      return {
        ...originalItem,
        condition: formItem.condition,
        quantity: formItem.quantity,
        offerPrice: formItem.offerPrice,
        referencePrice: formItem.referencePrice,
      };
    });
  }, [basePurchase, formValues]);

  const payments = paymentsForm.getValues('payments') as IPaymentDetail[];

  const purchase = useMemo(() => {
    if (!basePurchase) return null;
    return { ...basePurchase, items, payments, status };
  }, [basePurchase, items, payments, status]);

  const total = useMemo(() => calculateTotal(items), [items]);

  const currentUser = useAuthStore((state) => state.user);
  const buyerGuid = currentUser?.guid;
  const tcg = basePurchase?.tcgType;

  const { data: budgetData, refetch: refetchBudget } = useQuery(BuyerBudgetDocument, {
    variables: {
      buyerGuid: buyerGuid || '',
      tcg: tcg || '',
    },
    skip: !buyerGuid || !tcg,
  });

  const currentBuyerSpent = budgetData?.buyerBudget?.usedAmount || 0;
  const assignedBudget = budgetData?.buyerBudget?.assignedAmount || 0;
  const budgetUtilization = budgetData?.buyerBudget?.utilization || 0;

  const isEditable = status === PURCHASE_STATUS.DRAFT || status === PURCHASE_STATUS.QUOTED;

  const canSendQuote =
    status === PURCHASE_STATUS.DRAFT && items.length > 0;

  const canQuote = status === PURCHASE_STATUS.DRAFT && items.length > 0;

  const canResendQuote =
    (status === PURCHASE_STATUS.QUOTED || status === PURCHASE_STATUS.WAITING_PRICE) && items.length > 0;

  const canAcceptQuote = status === PURCHASE_STATUS.QUOTED;

  const canRegisterPayment = status === PURCHASE_STATUS.WAITING_PRICE;

  const canAdjustPrices = status === PURCHASE_STATUS.WAITING_PRICE;

  const allPricesAdjusted = items.length > 0 && items.every((item) => (item.sellPrice ?? 0) > 0);

  const canFinalize =
    status === PURCHASE_STATUS.WAITING_PRICE && payments.length > 0 && allPricesAdjusted;

  const canReject =
    status === PURCHASE_STATUS.DRAFT || status === PURCHASE_STATUS.QUOTED;

  const canReturnToDraft = status === PURCHASE_STATUS.REJECTED;

  const existingItemIds = useMemo(
    () => new Set(items.map((i) => i.cardGuid)),
    [items]
  );

  const addItem = useCallback((item: IPurchaseItem) => {
    itemsForm.fieldArray.append({
      cardGuid: item.cardGuid,
      condition: item.condition,
      quantity: item.quantity,
      offerPrice: item.offerPrice,
      referencePrice: item.referencePrice,
    } as any);
  }, [itemsForm.fieldArray]);

  const updateItem = useCallback(
    (itemId: string, updates: Partial<IPurchaseItem>) => {
      const index = items.findIndex((item) => item.guid === itemId);
      if (index !== -1) {
        itemsForm.fieldArray.update(index, { ...items[index], ...updates } as any);
      }
    },
    [items, itemsForm.fieldArray]
  );

  const removeItem = useCallback((itemId: string) => {
    const index = items.findIndex((item) => item.guid === itemId);
    if (index !== -1) {
      itemsForm.fieldArray.remove(index);
    }
  }, [items, itemsForm.fieldArray]);

  const updatePayments = useCallback((newPayments: IPaymentDetail[]) => {
    paymentsForm.reset({ payments: newPayments });
  }, [paymentsForm]);

  const updateItems = useCallback((newItems: IPurchaseItem[]) => {
    itemsForm.form.reset({
      items: newItems.map((item) => ({
        cardGuid: item.cardGuid,
        condition: item.condition,
        quantity: item.quantity,
        offerPrice: item.offerPrice,
        referencePrice: item.referencePrice,
      })),
    });
    if (basePurchase) {
      void refetch();
    }
  }, [itemsForm.form, basePurchase, refetch]);

  const hasItemChanges = useMemo(() => {
    if (!basePurchase) return false;

    const serverItemGuids = new Set(basePurchase.items.map((i) => i.guid));
    const currentItemGuids = new Set(items.map((i) => i.guid));

    // Check if length changed
    if (items.length !== basePurchase.items.length) {
      return true;
    }

    // Check if any item was added or removed
    for (const guid of currentItemGuids) {
      if (!serverItemGuids.has(guid)) {
        return true;
      }
    }

    for (const guid of serverItemGuids) {
      if (!currentItemGuids.has(guid)) {
        return true;
      }
    }

    // Check if any existing item was modified
    return items.some((currentItem) => {
      const serverItem = basePurchase.items.find((i) => i.guid === currentItem.guid);
      if (!serverItem) return true;

      return (
        currentItem.condition !== serverItem.condition ||
        currentItem.quantity !== serverItem.quantity ||
        currentItem.offerPrice !== serverItem.offerPrice ||
        currentItem.referencePrice !== serverItem.referencePrice
      );
    });
  }, [basePurchase, items]);

  const updateItemsOnly = useCallback(async () => {
    try {
      // Validate items before sending
      const invalidItems = items.filter((item) => item.quantity < 1 || item.offerPrice < 0);
      if (invalidItems.length > 0) {
        toast.error('Hay items con valores inválidos (cantidad >= 1, precio >= 0)');
        return;
      }

      const serverItemGuids = new Set((basePurchase?.items ?? []).map((i) => i.guid));
      const currentItemGuids = new Set(items.map((i) => i.guid));

      // Separate added, updated, and removed items
      const addItems = items.filter((i) => !serverItemGuids.has(i.guid));
      const removeItemGuids = Array.from(serverItemGuids).filter((guid) => !currentItemGuids.has(guid));
      const updateItems = items.filter((i) => serverItemGuids.has(i.guid) && i.guid);

      const tcgType = basePurchase?.tcgType ?? 'POKEMON';

      await updatePurchaseItemsMutation({
        variables: {
          updatePurchaseItemsInput: {
            purchaseGuid: purchaseId,
            addItems: addItems.map((item) => ({
              ...(tcgType === 'POKEMON'
                ? { pokemonCardGuid: item.cardGuid }
                : { magicCardGuid: item.cardGuid }),
              condition: item.condition,
              quantity: item.quantity,
              offerPrice: item.offerPrice,
              referencePrice: item.referencePrice,
            })),
            updateItems: updateItems.map((item) => ({
              itemGuid: item.guid,
              condition: item.condition,
              quantity: item.quantity,
              offerPrice: item.offerPrice,
            })),
            removeItemGuids,
          },
        },
      });

      toast.success('Items actualizados correctamente');
      void refetch();
    } catch (error) {
      toast.error(`Error al actualizar items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [purchaseId, basePurchase, items, updatePurchaseItemsMutation, refetch]);

  const updateStatus = useCallback(async (newStatus: PurchaseStatus) => {
    try {
      const serverItemGuids = new Set((basePurchase?.items ?? []).map((i) => i.guid));
      const pendingItems = items.filter((i) => !serverItemGuids.has(i.guid));

      if (pendingItems.length > 0) {
        const tcgType = basePurchase?.tcgType ?? 'POKEMON';
        await updatePurchaseItemsMutation({
          variables: {
            updatePurchaseItemsInput: {
              purchaseGuid: purchaseId,
              addItems: pendingItems.map((item) => ({
                ...(tcgType === 'POKEMON'
                  ? { pokemonCardGuid: item.cardGuid }
                  : { magicCardGuid: item.cardGuid }),
                condition: item.condition,
                quantity: item.quantity,
                offerPrice: item.offerPrice,
                referencePrice: item.referencePrice,
              })),
            },
          },
        });
      }

      await updatePurchaseStatusMutation({
        variables: {
          updatePurchaseStatusInput: {
            purchaseGuid: purchaseId,
            newStatus,
          },
        },
      });
      setStatus(newStatus);
      void refetchBudget();
    } catch {
    }
  }, [purchaseId, basePurchase, items, updatePurchaseItemsMutation, updatePurchaseStatusMutation, refetchBudget]);

  return {
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
    currentBuyerSpent,
    assignedBudget,
    budgetUtilization,
    loading,
    error,
    updateItem,
    removeItem,
    addItem,
    updatePayments,
    updateItems,
    updateStatus,
    updateItemsOnly,
  };
}
