import { useCallback, useMemo, useState } from 'react';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import {
  IPurchaseItem,
  ISeller,
  PURCHASE_STATUS,
} from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';

const MOCK_BUYER_ID = 'buyer-001';
const MOCK_BUYER_SPENT = 12500;

interface UseNewPurchaseReturn {
  seller: ISeller | null;
  items: IPurchaseItem[];
  total: number;
  currentBuyerSpent: number;
  existingItemIds: Set<string>;
  setSeller: (seller: ISeller) => void;
  addItem: (item: IPurchaseItem) => void;
  updateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  removeItem: (itemId: string) => void;
  canSave: boolean;
  savePurchase: () => void;
}

export function useNewPurchase(): UseNewPurchaseReturn {
  const { selectedTCG } = useSelectedTCGStore();

  const [seller, setSeller] = useState<ISeller | null>(null);
  const [items, setItems] = useState<IPurchaseItem[]>([]);

  const total = useMemo(() => calculateTotal(items), [items]);

  const existingItemIds = useMemo(
    () => new Set(items.map((i) => i.cardId)),
    [items]
  );

  const canSave = seller !== null && items.length > 0;

  const addItem = useCallback((item: IPurchaseItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback(
    (itemId: string, updates: Partial<IPurchaseItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const savePurchase = useCallback(() => {
    if (!canSave || !seller) return;
    // eslint-disable-next-line no-console
    console.log('Mock: saving purchase', {
      status: PURCHASE_STATUS.DRAFT,
      seller,
      items,
      tcgType: selectedTCG,
      buyerId: MOCK_BUYER_ID,
    });
  }, [canSave, seller, items, selectedTCG]);

  return {
    seller,
    items,
    total,
    currentBuyerSpent: MOCK_BUYER_SPENT,
    existingItemIds,
    setSeller,
    addItem,
    updateItem,
    removeItem,
    canSave,
    savePurchase,
  };
}
