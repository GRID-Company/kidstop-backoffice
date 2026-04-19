import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { ISeller } from '../../domain/types';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';
import { CreateSellerDocument, SellersDocument } from '@/lib/api/generated/purchases.generated';

export function useSellers(search?: string) {
  const { data, loading, refetch } = useQuery(SellersDocument, {
    variables: {
      findSellersArgs: {
        skip: 0,
        limit: 100,
        sort: { column: 'name', order: 'ASC' },
        search: search || undefined,
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
      } catch (error) {
        // Error already handled by onError callback
      }
      return undefined;
    },
    [createSellerMutation]
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
    getSellerById,
    creating,
  };
}
