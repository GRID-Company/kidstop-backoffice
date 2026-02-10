import { useCallback, useMemo, useState } from 'react';

import { MOCK_PURCHASES } from '../../adapters/api/purchases.mock';
import {
  IPurchase,
  IPurchaseItem,
  IPaymentDetail,
  PurchaseStatus,
  PURCHASE_STATUS,
} from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';

interface UsePurchaseDetailReturn {
  purchase: IPurchase | null;
  items: IPurchaseItem[];
  payments: IPaymentDetail[];
  isEditable: boolean;
  canSendQuote: boolean;
  canRegisterPayment: boolean;
  canAdjustPrices: boolean;
  canFinalize: boolean;
  canReject: boolean;
  total: number;
  currentBuyerSpent: number;
  updateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  removeItem: (itemId: string) => void;
  addItem: (item: IPurchaseItem) => void;
  updatePayments: (payments: IPaymentDetail[]) => void;
  updateItems: (items: IPurchaseItem[]) => void;
  updateStatus: (status: PurchaseStatus) => void;
}

const MOCK_BUYER_SPENT: Record<string, number> = {
  'buyer-001': 12500,
  'buyer-002': 8200,
};

export function usePurchaseDetail(purchaseId: string): UsePurchaseDetailReturn {
  const basePurchase = useMemo(
    () => MOCK_PURCHASES.find((p) => p.id === purchaseId) ?? null,
    [purchaseId]
  );

  const [items, setItems] = useState<IPurchaseItem[]>(basePurchase?.items ?? []);
  const [payments, setPayments] = useState<IPaymentDetail[]>(basePurchase?.payments ?? []);
  const [status, setStatus] = useState<PurchaseStatus>(
    basePurchase?.status ?? PURCHASE_STATUS.DRAFT
  );

  const purchase = useMemo(() => {
    if (!basePurchase) return null;
    return { ...basePurchase, items, payments, status };
  }, [basePurchase, items, payments, status]);

  const total = useMemo(() => calculateTotal(items), [items]);

  const currentBuyerSpent = useMemo(
    () => MOCK_BUYER_SPENT[basePurchase?.buyerId ?? ''] ?? 0,
    [basePurchase?.buyerId]
  );

  const isEditable = status === PURCHASE_STATUS.DRAFT;

  const canSendQuote =
    status === PURCHASE_STATUS.DRAFT && items.length > 0;

  const canRegisterPayment =
    status === PURCHASE_STATUS.QUOTED || status === PURCHASE_STATUS.WAITING_PRICE;

  const canAdjustPrices =
    status === PURCHASE_STATUS.QUOTED || status === PURCHASE_STATUS.WAITING_PRICE;

  const canFinalize =
    (status === PURCHASE_STATUS.QUOTED || status === PURCHASE_STATUS.WAITING_PRICE) &&
    payments.length > 0;

  const canReject =
    status !== PURCHASE_STATUS.FINALIZED && status !== PURCHASE_STATUS.REJECTED;

  const existingItemIds = useMemo(
    () => new Set(items.map((i) => i.cardId)),
    [items]
  );

  const addItem = useCallback((item: IPurchaseItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback(
    (itemId: string, updates: Partial<IPurchaseItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updatePayments = useCallback((newPayments: IPaymentDetail[]) => {
    setPayments(newPayments);
  }, []);

  const updateItems = useCallback((newItems: IPurchaseItem[]) => {
    setItems(newItems);
  }, []);

  const updateStatus = useCallback((newStatus: PurchaseStatus) => {
    setStatus(newStatus);
  }, []);

  return {
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
  };
}
