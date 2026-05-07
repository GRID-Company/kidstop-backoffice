import { useCallback, useMemo, useState, useEffect } from 'react';
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
  items: ISaleItem[];
  total: number;
  itemCount: number;
  isTerminal: boolean;
  loading: boolean;
  mutating: boolean;
  hasChanges: boolean;
  updateStatus: (newStatus: SaleStatus) => Promise<void>;
  cancelSale: (reason: CancelReason) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<ISaleItem>) => void;
  removeItem: (itemId: string) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
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

  const [localItems, setLocalItems] = useState<ISaleItem[]>([]);
  const [itemsToRemove, setItemsToRemove] = useState<string[]>([]);

  useEffect(() => {
    if (sale?.items) {
      setLocalItems(sale.items);
      setItemsToRemove([]);
    }
  }, [sale?.guid]);

  const total = useMemo(
    () => calculateTotal(localItems),
    [localItems]
  );

  const itemCount = useMemo(
    () => localItems.reduce((sum, item) => sum + item.quantity, 0),
    [localItems]
  );

  const hasChanges = useMemo(() => {
    if (!sale) return false;
    if (itemsToRemove.length > 0) return true;
    if (localItems.length !== sale.items.length) return true;

    return localItems.some((localItem) => {
      const serverItem = sale.items.find((i) => i.guid === localItem.guid);
      if (!serverItem) return true;
      return localItem.quantity !== serverItem.quantity;
    });
  }, [sale, localItems, itemsToRemove]);

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
    (itemId: string, updates: Partial<ISaleItem>) => {
      if (updates.quantity !== undefined && updates.quantity < 1) {
        toast.error('La cantidad debe ser mayor o igual a 1');
        return;
      }

      setLocalItems((prev) =>
        prev.map((item) =>
          item.guid === itemId ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  const removeItem = useCallback(
    (itemId: string) => {
      if (localItems.length < 2) {
        toast.error('No se puede eliminar el último artículo de una venta');
        return;
      }

      setLocalItems((prev) => prev.filter((item) => item.guid !== itemId));
      setItemsToRemove((prev) => [...prev, itemId]);
    },
    [localItems.length]
  );

  const saveChanges = useCallback(async () => {
    if (!sale || !hasChanges) return;

    if (isTerminal) {
      toast.error('No se pueden editar items en una venta completada o cancelada');
      return;
    }

    try {
      for (const itemId of itemsToRemove) {
        await removeSaleItemMutation({
          variables: {
            removeSaleItemInput: {
              saleItemGuid: itemId,
            },
          },
        });
      }

      for (const localItem of localItems) {
        const serverItem = sale.items.find((i) => i.guid === localItem.guid);
        if (serverItem && serverItem.quantity !== localItem.quantity) {
          await updateSaleItemMutation({
            variables: {
              updateSaleItemInput: {
                saleItemGuid: localItem.guid,
                quantity: localItem.quantity,
              },
            },
          });
        }
      }

      toast.success('Cambios guardados correctamente');
      setItemsToRemove([]);
    } catch (error: any) {
      let errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Error al guardar los cambios';
      
      // Traducir mensajes comunes del backend
      if (errorMessage.includes('Insufficient stock')) {
        const match = errorMessage.match(/Available: (\d+), requested increase: (\d+)/);
        if (match) {
          errorMessage = `Stock insuficiente. Disponible: ${match[1]}, incremento solicitado: ${match[2]}.`;
        } else {
          errorMessage = 'Stock insuficiente para completar la operación.';
        }
      }
      
      toast.error(errorMessage);
    }
  }, [sale, hasChanges, isTerminal, localItems, itemsToRemove, updateSaleItemMutation, removeSaleItemMutation]);

  const discardChanges = useCallback(() => {
    if (sale?.items) {
      setLocalItems(sale.items);
      setItemsToRemove([]);
    }
  }, [sale]);

  return {
    sale,
    items: localItems,
    total,
    itemCount,
    isTerminal,
    loading,
    mutating: updatingStatus || cancelling || updatingItem || removingItem,
    hasChanges,
    updateStatus,
    cancelSale,
    updateItem,
    removeItem,
    saveChanges,
    discardChanges,
  };
}
