import { useCallback, useMemo, useState } from 'react';

import {
  FulfillmentStatus,
  ISale,
  ISaleItem,
  SALE_STATUS,
  SaleStatus,
} from '../../domain/types';
import { calculateTotal, formatSaleTotal } from '../../domain/sales.domain';
import { MOCK_SALES } from '../../adapters/api/sales.mock';

interface UseSaleDetailReturn {
  sale: ISale | undefined;
  total: number;
  formattedTotal: string;
  itemCount: number;
  isTerminal: boolean;
  updateStatus: (newStatus: SaleStatus) => void;
  updateFulfillment: (itemId: string, status: FulfillmentStatus) => void;
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

  const cancelSale = useCallback(() => {
    setStatus(SALE_STATUS.CANCELLED);
  }, []);

  return {
    sale,
    total,
    formattedTotal,
    itemCount,
    isTerminal,
    updateStatus,
    updateFulfillment,
    cancelSale,
  };
}
