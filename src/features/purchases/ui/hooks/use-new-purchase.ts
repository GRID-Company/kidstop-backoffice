import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { CreatePurchaseDocument } from '@/lib/api/generated/purchases.generated';
import { IPurchaseItem, ISeller } from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';
import { toCreatePurchasePayload } from '../../adapters/mappers/purchase.mapper';

interface UseNewPurchaseReturn {
  seller: ISeller | null;
  items: IPurchaseItem[];
  total: number;
  currentBuyerSpent: number;
  existingItemIds: Set<string>;
  setSeller: (seller: ISeller | null) => void;
  addItem: (item: IPurchaseItem) => void;
  updateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  removeItem: (itemId: string) => void;
  canSave: boolean;
  savePurchase: () => void;
  saving: boolean;
}

export function useNewPurchase(): UseNewPurchaseReturn {
  const { selectedTCG } = useSelectedTCGStore();

  const [seller, setSeller] = useState<ISeller | null>(null);
  const [items, setItems] = useState<IPurchaseItem[]>([]);

  const [createPurchase, { loading: saving }] = useMutation(CreatePurchaseDocument, {
    onCompleted: () => {
      toast.success('Compra creada exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al crear compra: ${error.message}`);
    },
  });

  const total = useMemo(() => calculateTotal(items), [items]);

  const existingItemIds = useMemo(
    () => new Set(items.map((i) => i.cardGuid)),
    [items]
  );

  const canSave = seller !== null && items.length > 0 && !saving;

  const addItem = useCallback((item: IPurchaseItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback(
    (itemId: string, updates: Partial<IPurchaseItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.guid === itemId ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.guid !== itemId));
  }, []);

  const savePurchase = useCallback(async () => {
    if (!canSave || !seller) return;

    try {
      const formData = {
        sellerGuid: seller.guid,
        items: items.map(item => ({
          cardGuid: item.cardGuid,
          cardName: item.cardName,
          cardImageUrl: item.cardImageUrl,
          setName: item.setName,
          setCode: item.setCode,
          condition: item.condition,
          quantity: item.quantity,
          offerPrice: item.offerPrice,
          referencePrice: item.referencePrice,
          sellPrice: item.sellPrice,
        })),
        payments: [],
        notes: '',
      };

      const payload = toCreatePurchasePayload(formData, selectedTCG);

      await createPurchase({
        variables: payload,
      });
    } catch (error) {
      // Error already handled by onError callback
    }
  }, [canSave, seller, items, selectedTCG, createPurchase]);

  return {
    seller,
    items,
    total,
    currentBuyerSpent: 0,
    existingItemIds,
    setSeller,
    addItem,
    updateItem,
    removeItem,
    canSave,
    savePurchase,
    saving,
  };
}
