import { useMemo } from 'react';

import { ISale } from '../../domain/types';
import { calculateTotal, formatSaleTotal } from '../../domain/sales.domain';
import { MOCK_SALES } from '../../adapters/api/sales.mock';

interface UseSaleDetailReturn {
  sale: ISale | undefined;
  total: number;
  formattedTotal: string;
  itemCount: number;
}

export function useSaleDetail(saleId: string): UseSaleDetailReturn {
  const sale = useMemo(
    () => MOCK_SALES.find((s) => s.id === saleId),
    [saleId]
  );

  const total = useMemo(
    () => (sale ? calculateTotal(sale.items) : 0),
    [sale]
  );

  const formattedTotal = useMemo(
    () => (sale ? formatSaleTotal(sale.items) : '$0.00'),
    [sale]
  );

  const itemCount = useMemo(
    () => (sale ? sale.items.reduce((sum, item) => sum + item.quantity, 0) : 0),
    [sale]
  );

  return {
    sale,
    total,
    formattedTotal,
    itemCount,
  };
}
