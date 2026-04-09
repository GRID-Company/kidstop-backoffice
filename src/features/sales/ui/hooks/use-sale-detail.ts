import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import {
  SaleDocument,
  SalesDocument,
  UpdateSaleStatusDocument,
  CancelSaleDocument,
} from '@/lib/api/generated/sales.generated';
import { CancelReason, ISale, SALE_STATUS, SaleStatus } from '../../domain/types';
import { calculateTotal, formatSaleTotal } from '../../domain/sales.domain';

interface UseSaleDetailReturn {
  sale: ISale | undefined;
  total: number;
  formattedTotal: string;
  itemCount: number;
  isTerminal: boolean;
  loading: boolean;
  mutating: boolean;
  updateStatus: (newStatus: SaleStatus) => Promise<void>;
  cancelSale: (reason: CancelReason) => Promise<void>;
}

export function useSaleDetail(saleGuid: string): UseSaleDetailReturn {
  const { data, loading } = useQuery(SaleDocument, {
    variables: { guid: saleGuid },
    fetchPolicy: 'network-only',
  });

  const [updateStatusMutation, { loading: updatingStatus }] = useMutation(
    UpdateSaleStatusDocument,
    { refetchQueries: [SaleDocument, SalesDocument] }
  );

  const [cancelSaleMutation, { loading: cancelling }] = useMutation(
    CancelSaleDocument,
    { refetchQueries: [SaleDocument, SalesDocument] }
  );

  const sale = useMemo(() => {
    if (!data?.sale) return undefined;
    return data.sale as unknown as ISale;
  }, [data]);

  const total = useMemo(
    () => (sale ? calculateTotal(sale.items) : 0),
    [sale]
  );

  const formattedTotal = useMemo(
    () => (sale ? formatSaleTotal(sale.items) : ''),
    [sale]
  );

  const itemCount = useMemo(
    () => (sale ? sale.items.reduce((sum, item) => sum + item.quantity, 0) : 0),
    [sale]
  );

  const isTerminal =
    sale?.status === SALE_STATUS.COMPLETED ||
    sale?.status === SALE_STATUS.CANCELLED;

  const updateStatus = useCallback(
    async (newStatus: SaleStatus) => {
      try {
        await updateStatusMutation({
          variables: {
            updateSaleStatusInput: {
              saleGuid,
              newStatus,
            },
          },
        });
      } catch {
        toast.error('Error al actualizar el estado del pedido');
      }
    },
    [saleGuid, updateStatusMutation]
  );

  const cancelSale = useCallback(
    async (reason: CancelReason) => {
      try {
        await cancelSaleMutation({
          variables: {
            cancelSaleInput: {
              saleGuid,
              cancelReason: reason,
            },
          },
        });
      } catch {
        toast.error('Error al cancelar el pedido');
      }
    },
    [saleGuid, cancelSaleMutation]
  );

  return {
    sale,
    total,
    formattedTotal,
    itemCount,
    isTerminal,
    loading,
    mutating: updatingStatus || cancelling,
    updateStatus,
    cancelSale,
  };
}
