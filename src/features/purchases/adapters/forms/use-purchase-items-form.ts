import { useForm, useFieldArray, Resolver, FieldArrayMethodProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemo } from 'react';
import { CardLanguage } from '@/lib/api/schema-types';

import { CardCondition, IPurchaseItem } from '../../domain/types';
import { offerPriceSchema, quantitySchema } from './price-schemas';

const purchaseItemFormSchema = z.object({
  cardGuid: z.string().min(1, 'Card GUID is required'),
  condition: z.enum(['NEAR_MINT', 'LIGHTLY_PLAYED', 'MODERATELY_PLAYED', 'HEAVILY_PLAYED', 'DAMAGED'] as const),
  language: z.nativeEnum(CardLanguage),
  quantity: quantitySchema,
  offerPrice: offerPriceSchema,
  referencePrice: z.number().optional(),
});

const purchaseItemsFormSchema = z.object({
  items: z.array(purchaseItemFormSchema).min(1, 'Debe agregar al menos una carta'),
});

export type PurchaseItemFormData = z.infer<typeof purchaseItemFormSchema>;
export type PurchaseItemsFormData = z.infer<typeof purchaseItemsFormSchema>;

interface UsePurchaseItemsFormOptions {
  initialItems: IPurchaseItem[];
}

interface UsePurchaseItemsFormReturn {
  form: ReturnType<typeof useForm<PurchaseItemsFormData>>;
  fieldArray: ReturnType<typeof useFieldArray<PurchaseItemsFormData>>;
  hasChanges: boolean;
}

export function usePurchaseItemsForm({ initialItems }: UsePurchaseItemsFormOptions): UsePurchaseItemsFormReturn {
  const form = useForm<PurchaseItemsFormData>({
    resolver: zodResolver(purchaseItemsFormSchema) as Resolver<PurchaseItemsFormData>,
    defaultValues: {
      items: initialItems.map((item) => ({
        cardGuid: item.cardGuid,
        condition: item.condition as CardCondition,
        language: item.language,
        quantity: item.quantity,
        offerPrice: item.offerPrice,
        referencePrice: item.referencePrice,
      })),
    },
    mode: 'all',
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const hasChanges = useMemo(() => {
    const currentItems = form.getValues('items');
    
    // Check if length changed
    if (currentItems.length !== initialItems.length) {
      return true;
    }

    // Check if any item was modified
    return currentItems.some((currentItem, index) => {
      const initialItem = initialItems[index];
      if (!initialItem) return true;

      return (
        currentItem.cardGuid !== initialItem.cardGuid ||
        currentItem.condition !== initialItem.condition ||
        currentItem.language !== initialItem.language ||
        currentItem.quantity !== initialItem.quantity ||
        currentItem.offerPrice !== initialItem.offerPrice ||
        currentItem.referencePrice !== initialItem.referencePrice
      );
    });
  }, [form, initialItems]);

  return {
    form,
    fieldArray,
    hasChanges,
  };
}
