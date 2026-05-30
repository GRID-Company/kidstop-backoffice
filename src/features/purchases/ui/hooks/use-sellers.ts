import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { ISeller } from '../../domain/types';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';
import { CreateSellerDocument, SellersDocument, UpdateSellerDocument, DeleteSellerDocument } from '@/lib/api/generated/purchases.generated';

export function useSellers(search?: string) {
  const { data, loading, refetch } = useQuery(SellersDocument, {
    variables: {
      findSellersArgs: {
        limit: 100,
        skip: 0,
        search: search || undefined,
        sort: {
          column: 'name',
          order: 'ASC',
        },
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [createSellerMutation, { loading: creating }] = useMutation(
    CreateSellerDocument,
    {
      onCompleted: (data) => {
        if (data.createSeller) {
          refetch();
          toast.success('Vendedor creado exitosamente');
        }
      },
      onError: (error) => {
        toast.error(`Error al crear vendedor: ${error.message}`);
      },
    }
  );

  const [updateSellerMutation, { loading: updating }] = useMutation(
    UpdateSellerDocument,
    {
      onCompleted: (data) => {
        if (data.updateSeller) {
          refetch();
          toast.success('Vendedor actualizado exitosamente');
        }
      },
      onError: (error) => {
        toast.error(`Error al actualizar vendedor: ${error.message}`);
      },
    }
  );

  const [deleteSellerMutation, { loading: deleting }] = useMutation(
    DeleteSellerDocument,
    {
      onCompleted: () => {
        refetch();
        toast.success('Vendedor eliminado exitosamente');
      },
      onError: (error) => {
        toast.error(`Error al eliminar vendedor: ${error.message}`);
      },
    }
  );

  const sellers = useMemo(() => {
    if (!data?.sellers?.data) return [];
    return data.sellers.data.map((s) => ({
      guid: s.guid,
      name: s.name,
      phone: s.phone || '',
      email: s.email || undefined,
      notes: s.notes || undefined,
    }));
  }, [data]);

  const filteredSellers = useMemo(() => {
    if (!search || search.trim() === '') return sellers;
    return sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(search.toLowerCase()) ||
        seller.phone.includes(search)
    );
  }, [sellers, search]);

  const createSeller = useCallback(
    async (data: SellerFormData): Promise<ISeller | undefined> => {
      try {
        const result = await createSellerMutation({
          variables: {
            createSellerInput: {
              name: data.name,
              phone: data.phone,
              email: data.email || undefined,
              notes: data.notes || undefined,
            },
          },
        });

        if (result.data?.createSeller) {
          return {
            guid: result.data.createSeller.guid,
            name: result.data.createSeller.name,
            phone: result.data.createSeller.phone || '',
            email: result.data.createSeller.email || undefined,
            notes: result.data.createSeller.notes || undefined,
          };
        }
      } catch {
        // Error already handled by onError callback
      }
      return undefined;
    },
    [createSellerMutation]
  );

  const updateSeller = useCallback(
    async (guid: string, data: SellerFormData): Promise<ISeller | undefined> => {
      try {
        const result = await updateSellerMutation({
          variables: {
            updateSellerInput: {
              guid,
              name: data.name || undefined,
              phone: data.phone || undefined,
              email: data.email || undefined,
              notes: data.notes || undefined,
            },
          },
        });

        if (result.data?.updateSeller) {
          return {
            guid: result.data.updateSeller.guid,
            name: result.data.updateSeller.name,
            phone: result.data.updateSeller.phone || '',
            email: result.data.updateSeller.email || undefined,
            notes: result.data.updateSeller.notes || undefined,
          };
        }
      } catch {
        // Error already handled by onError callback
      }
      return undefined;
    },
    [updateSellerMutation]
  );

  const deleteSeller = useCallback(
    async (guid: string): Promise<boolean> => {
      try {
        const result = await deleteSellerMutation({
          variables: { guid },
        });

        return result.data?.deleteSeller ?? false;
      } catch {
        // Error already handled by onError callback
        return false;
      }
    },
    [deleteSellerMutation]
  );

  const getSellerById = useCallback(
    (id: string): ISeller | undefined => {
      return sellers.find((s) => s.guid === id);
    },
    [sellers]
  );

  return {
    sellers: filteredSellers,
    loading,
    createSeller,
    updateSeller,
    deleteSeller,
    getSellerById,
    creating,
    updating,
    deleting,
  };
}
