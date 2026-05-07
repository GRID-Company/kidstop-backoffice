import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import {
  SaleDocument,
  SalesDocument,
  UpdateSaleStatusDocument,
  CancelSaleDocument,
  UpdateSaleItemDocument,
  RemoveSaleItemDocument,
} from '@/lib/api/generated/sales.generated';
import { CancelReason, ISale, ISaleItem, SALE_STATUS, SaleStatus } from '../../domain/types';
import { calculateTotal } from '../../domain/sales.domain';

interface UseSaleDetailReturn {
  sale: ISale | undefined;
  total: number;
  itemCount: number;
  isTerminal: boolean;
  loading: boolean;
  mutating: boolean;
  updateStatus: (newStatus: SaleStatus) => Promise<void>;
  cancelSale: (reason: CancelReason) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<ISaleItem>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
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

  const [updateSaleItemMutation, { loading: updatingItem }] = useMutation(
    UpdateSaleItemDocument,
    { refetchQueries: [SaleDocument, SalesDocument] }
  );

  const [removeSaleItemMutation, { loading: removingItem }] = useMutation(
    RemoveSaleItemDocument,
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

  const updateItem = useCallback(
    async (itemId: string, updates: Partial<ISaleItem>) => {
      if (!sale) return;

      if (isTerminal) {
        toast.error('No se pueden editar items en una venta completada o cancelada');
        return;
      }

      if (updates.quantity !== undefined && updates.quantity < 1) {
        toast.error('La cantidad debe ser mayor o igual a 1');
        return;
      }

      try {
        await updateSaleItemMutation({
          variables: {
            updateSaleItemInput: {
              saleItemGuid: itemId,
              quantity: updates.quantity!,
            },
          },
        });
      } catch (error) {
        toast.error('Error al actualizar el item');
      }
    },
    [sale, isTerminal, updateSaleItemMutation]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!sale) return;

      if (isTerminal) {
        toast.error('No se pueden eliminar items de una venta completada o cancelada');
        return;
      }

      if (sale.items.length < 2) {
        toast.error('No se puede eliminar el último artículo de una venta');
        return;
      }

      try {
        await removeSaleItemMutation({
          variables: {
            removeSaleItemInput: {
              saleItemGuid: itemId,
            },
          },
        });
      } catch (error) {
        toast.error('Error al eliminar el item');
      }
    },
    [sale, isTerminal, removeSaleItemMutation]
  );

  return {
    sale,
    total,
    itemCount,
    isTerminal,
    loading,
    mutating: updatingStatus || cancelling || updatingItem || removingItem,
    updateStatus,
    cancelSale,
    updateItem,
    removeItem,
  };
}
