import { useCallback, useMemo, useState } from 'react';

import { ISeller } from '../../domain/types';
import { MOCK_SELLERS } from '../../adapters/api/sellers.mock';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';

export function useSellers(search?: string) {
  const [sellers, setSellers] = useState<ISeller[]>(MOCK_SELLERS);

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
    (data: SellerFormData): ISeller => {
      const newSeller: ISeller = {
        id: `seller-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        notes: data.notes || undefined,
      };
      setSellers((prev) => [newSeller, ...prev]);
      return newSeller;
    },
    []
  );

  const getSellerById = useCallback(
    (id: string): ISeller | undefined => {
      return sellers.find((s) => s.id === id);
    },
    [sellers]
  );

  return {
    sellers: filteredSellers,
    createSeller,
    getSellerById,
  };
}
