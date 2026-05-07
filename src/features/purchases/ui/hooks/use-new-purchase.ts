import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { useAuthStore } from '@/lib/store/auth';
import { CreatePurchaseDocument, PurchasesDocument } from '@/lib/api/generated/purchases.generated';
import { BuyerBudgetDocument } from '@/lib/api/generated/buyer-budgets.generated';
import { IPurchaseItem, ISeller } from '../../domain/types';
import { calculateTotal } from '../../domain/purchases.domain';
import { toCreatePurchasePayload } from '../../adapters/mappers/purchase.mapper';
import { useNewPurchaseForm, NewPurchaseFormData } from '../../adapters/forms/use-new-purchase-form';

interface UseNewPurchaseReturn {
  seller: ISeller | null;
  items: IPurchaseItem[];
  total: number;
  currentBuyerSpent: number;
  assignedBudget: number;
  budgetUtilization: number;
  existingItemIds: Set<string>;
  form: UseFormReturn<NewPurchaseFormData>;
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
  const currentUser = useAuthStore((state) => state.user);

  const [seller, setSeller] = useState<ISeller | null>(null);
  const { form, fieldArray } = useNewPurchaseForm();

  const { data: budgetData } = useQuery(BuyerBudgetDocument, {
    variables: {
      buyerGuid: currentUser?.guid || '',
      tcg: selectedTCG || '',
    },
    skip: !currentUser?.guid || !selectedTCG,
  });

  const [createPurchase, { loading: saving }] = useMutation(CreatePurchaseDocument, {
    refetchQueries: [PurchasesDocument],
    onCompleted: () => {
      toast.success('Compra creada exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al crear compra: ${error.message}`);
    },
  });

  const items = form.getValues('items') as IPurchaseItem[];

  const total = useMemo(() => calculateTotal(items), [items]);

  const currentBuyerSpent = budgetData?.buyerBudget?.usedAmount || 0;
  const assignedBudget = budgetData?.buyerBudget?.assignedAmount || 0;
  const budgetUtilization = budgetData?.buyerBudget?.utilization || 0;

  const existingItemIds = useMemo(
    () => new Set(items.map((i: IPurchaseItem) => `${i.cardGuid}:${i.condition}`)),
    [items]
  );

  const canSave = seller !== null && items.length > 0 && !saving && form.formState.isValid;

  const addItem = useCallback((item: IPurchaseItem) => {
    fieldArray.append(item as any);
  }, [fieldArray]);

  const updateItem = useCallback(
    (itemId: string, updates: Partial<IPurchaseItem>) => {
      const index = items.findIndex((item) => item.guid === itemId);
      if (index !== -1) {
        fieldArray.update(index, { ...items[index], ...updates } as any);
      }
    },
    [items, fieldArray]
  );

  const removeItem = useCallback((itemId: string) => {
    const index = items.findIndex((item) => item.guid === itemId);
    if (index !== -1) {
      fieldArray.remove(index);
    }
  }, [items, fieldArray]);

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
    currentBuyerSpent,
    assignedBudget,
    budgetUtilization,
    existingItemIds,
    form,
    setSeller,
    addItem,
    updateItem,
    removeItem,
    canSave,
    savePurchase,
    saving,
  };
}
