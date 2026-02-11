import { useCallback, useMemo, useState } from 'react';

import {
  FULFILLMENT_STATUS,
  FulfillmentStatus,
  ISale,
  ISaleItem,
  SALE_STATUS,
  SaleStatus,
} from '../../domain/types';
import {
  calculateAdjustedTotal,
  calculateTotal,
  deriveFulfillmentStatus,
  formatSaleTotal,
} from '../../domain/sales.domain';
import { MOCK_SALES } from '../../adapters/api/sales.mock';

interface UseSaleDetailReturn {
  sale: ISale | undefined;
  total: number;
  adjustedTotal: number;
  formattedTotal: string;
  itemCount: number;
  isTerminal: boolean;
  updateStatus: (newStatus: SaleStatus) => void;
  updateFulfillment: (itemId: string, status: FulfillmentStatus) => void;
  updateFoundQuantity: (itemId: string, delta: number) => void;
  cancelSale: () => void;
}

export function useSaleDetail(saleId: string): UseSaleDetailReturn {
  const baseSale = useMemo(
    () => MOCK_SALES.find((s) => s.id === saleId),
    [saleId]
  );

  const [items, setItems] = useState<ISaleItem[]>(baseSale?.items ?? []);
  const [status, setStatus] = useState<SaleStatus>(
    baseSale?.status ?? SALE_STATUS.NEW
  );

  const sale = useMemo(() => {
    if (!baseSale) return undefined;
    return { ...baseSale, items, status };
  }, [baseSale, items, status]);

  const total = useMemo(() => calculateTotal(items), [items]);
  const adjustedTotal = useMemo(() => calculateAdjustedTotal(items), [items]);

  const formattedTotal = useMemo(
    () => formatSaleTotal(items),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const isTerminal =
    status === SALE_STATUS.COMPLETED || status === SALE_STATUS.CANCELLED;

  const updateStatus = useCallback((newStatus: SaleStatus) => {
    setStatus(newStatus);
  }, []);

  const updateFulfillment = useCallback(
    (itemId: string, fulfillmentStatus: FulfillmentStatus) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, fulfillmentStatus } : item
        )
      );
    },
    []
  );

  const updateFoundQuantity = useCallback(
    (itemId: string, delta: number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;

          if (delta < 0 && item.foundQuantity === 0) {
            return {
              ...item,
              foundQuantity: 0,
              fulfillmentStatus: FULFILLMENT_STATUS.NOT_AVAILABLE,
            };
          }

          if (delta > 0 && item.fulfillmentStatus === FULFILLMENT_STATUS.NOT_AVAILABLE) {
            return {
              ...item,
              foundQuantity: 1,
              fulfillmentStatus: deriveFulfillmentStatus(1, item.quantity),
            };
          }

          const newFound = Math.max(0, Math.min(item.quantity, item.foundQuantity + delta));
          return {
            ...item,
            foundQuantity: newFound,
            fulfillmentStatus: deriveFulfillmentStatus(newFound, item.quantity),
          };
        })
      );
    },
    []
  );

  const cancelSale = useCallback(() => {
    setStatus(SALE_STATUS.CANCELLED);
  }, []);

  return {
    sale,
    total,
    adjustedTotal,
    formattedTotal,
    itemCount,
    isTerminal,
    updateStatus,
    updateFulfillment,
    updateFoundQuantity,
    cancelSale,
  };
}
