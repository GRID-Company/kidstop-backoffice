import { useCallback, useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { 
  PurchaseDocument,
  UpdatePurchaseStatusDocument,
} from '@/lib/api/generated/purchases.generated';
import {
  IPurchase,
  IPurchaseItem,
  IPaymentDetail,
  PurchaseStatus,
  PURCHASE_STATUS,
  ISeller,
} from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';

interface UsePurchaseDetailReturn {
  purchase: IPurchase | null;
  items: IPurchaseItem[];
  payments: IPaymentDetail[];
  isEditable: boolean;
  canSendQuote: boolean;
  canAcceptQuote: boolean;
  canRegisterPayment: boolean;
  canAdjustPrices: boolean;
  canFinalize: boolean;
  canReject: boolean;
  total: number;
  currentBuyerSpent: number;
  loading: boolean;
  error: Error | undefined;
  updateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  removeItem: (itemId: string) => void;
  addItem: (item: IPurchaseItem) => void;
  updatePayments: (payments: IPaymentDetail[]) => void;
  updateItems: (items: IPurchaseItem[]) => void;
  updateStatus: (status: PurchaseStatus) => void;
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
        setCode: item.pokemonCardSummary?.setCode || '',
        tcgType: p.tcg === 'POKEMON' ? 'POKEMON' : 'MAGIC',
        condition: item.condition as any,
        quantity: item.quantity,
        offerPrice: item.offerPrice,
        referencePrice: item.referencePrice || undefined,
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

  const [items, setItems] = useState<IPurchaseItem[]>([]);
  const [payments, setPayments] = useState<IPaymentDetail[]>([]);
  const [status, setStatus] = useState<PurchaseStatus>(PURCHASE_STATUS.DRAFT);

  useEffect(() => {
    if (basePurchase) {
      setItems(basePurchase.items);
      setPayments(basePurchase.payments);
      setStatus(basePurchase.status);
    }
  }, [basePurchase]);

  const purchase = useMemo(() => {
    if (!basePurchase) return null;
    return { ...basePurchase, items, payments, status };
  }, [basePurchase, items, payments, status]);

  const total = useMemo(() => calculateTotal(items), [items]);

  const currentBuyerSpent = 0;

  const isEditable = status === PURCHASE_STATUS.DRAFT;

  const canSendQuote =
    status === PURCHASE_STATUS.DRAFT && items.length > 0;

  const canAcceptQuote = status === PURCHASE_STATUS.QUOTED;

  const canRegisterPayment = status === PURCHASE_STATUS.WAITING_PRICE;

  const canAdjustPrices = status === PURCHASE_STATUS.WAITING_PRICE;

  const canFinalize =
    status === PURCHASE_STATUS.WAITING_PRICE && payments.length > 0;

  const canReject =
    status !== PURCHASE_STATUS.FINALIZED && status !== PURCHASE_STATUS.REJECTED;

  const existingItemIds = useMemo(
    () => new Set(items.map((i) => i.cardGuid)),
    [items]
  );

  const addItem = useCallback((item: IPurchaseItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback(
    (itemId: string, updates: Partial<IPurchaseItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.guid === itemId ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.guid !== itemId));
  }, []);

  const updatePayments = useCallback((newPayments: IPaymentDetail[]) => {
    setPayments(newPayments);
  }, []);

  const updateItems = useCallback((newItems: IPurchaseItem[]) => {
    setItems(newItems);
  }, []);

  const updateStatus = useCallback(async (newStatus: PurchaseStatus) => {
    try {
      await updatePurchaseStatusMutation({
        variables: {
          updatePurchaseStatusInput: {
            purchaseGuid: purchaseId,
            newStatus,
          },
        },
      });
      setStatus(newStatus);
    } catch (error) {
      // Error already handled by onError callback in mutation
    }
  }, [purchaseId, updatePurchaseStatusMutation]);

  return {
    purchase,
    items,
    payments,
    isEditable,
    canSendQuote,
    canAcceptQuote,
    canRegisterPayment,
    canAdjustPrices,
    canFinalize,
    canReject,
    total,
    currentBuyerSpent,
    loading,
    error,
    updateItem,
    removeItem,
    addItem,
    updatePayments,
    updateItems,
    updateStatus,
  };
}
