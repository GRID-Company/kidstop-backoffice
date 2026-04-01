import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { ISeller } from '../../domain/types';
import { MOCK_SELLERS } from '../../adapters/api/sellers.mock';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';
import { CreateSellerDocument } from '@/lib/api/generated/purchases.generated';

export function useSellers(search?: string) {
  const [sellers, setSellers] = useState<ISeller[]>(MOCK_SELLERS);

  const [createSellerMutation, { loading: creating }] = useMutation(
    CreateSellerDocument,
    {
      onCompleted: (data) => {
        if (data.createSeller) {
          const newSeller: ISeller = {
            guid: data.createSeller.guid,
            name: data.createSeller.name,
            phone: data.createSeller.phone || '',
            email: data.createSeller.email || undefined,
            notes: data.createSeller.notes || undefined,
            createdDate: (data.createSeller.createdDate as string) || undefined,
            updatedDate: (data.createSeller.updatedDate as string) || undefined,
          };
          setSellers((prev) => [newSeller, ...prev]);
          toast.success('Vendedor creado exitosamente');
        }
      },
      onError: (error) => {
        toast.error(`Error al crear vendedor: ${error.message}`);
      },
    }
  );

  const filteredSellers = useMemo(() => {
    if (!search || search.trim() === '') return sellers;

    const term = search.toLowerCase().trim();
    return sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(term) ||
        seller.phone.includes(term) ||
        seller.email?.toLowerCase().includes(term)
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
            createdDate: (result.data.createSeller.createdDate as string) || undefined,
            updatedDate: (result.data.createSeller.updatedDate as string) || undefined,
          };
        }
      } catch (error) {
        console.error('Error creating seller:', error);
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
    createSeller,
    getSellerById,
    creating,
  };
}
