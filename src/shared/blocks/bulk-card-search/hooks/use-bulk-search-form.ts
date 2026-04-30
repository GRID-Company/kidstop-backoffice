import { useForm, useFieldArray } from 'react-hook-form';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import {
  bulkSearchFormSchemaPurchases,
  bulkSearchFormSchemaInventory,
  BulkSearchFormDataPurchases,
  BulkSearchFormDataInventory,
} from '../schemas';
import { BulkSearchVariant, BulkCardResult } from '../types';
import { DEFAULT_OFFER_PERCENTAGE } from '../constants';

interface UseBulkSearchFormReturn {
  form: ReturnType<typeof useForm<BulkSearchFormDataPurchases | BulkSearchFormDataInventory>>;
  fields: any[];
  addCard: (result: BulkCardResult) => void;
  removeCard: (index: number) => void;
  updateSelectedCard: (index: number, cardGuid: string) => void;
  initializeCards: (results: BulkCardResult[]) => void;
  resetForm: () => void;
}

export function useBulkSearchForm(
  variant: BulkSearchVariant,
  onSubmit: (data: BulkSearchFormDataPurchases | BulkSearchFormDataInventory) => void
): UseBulkSearchFormReturn {
  const schema =
    variant === 'purchases' ? bulkSearchFormSchemaPurchases : bulkSearchFormSchemaInventory;

  const form = useForm<BulkSearchFormDataPurchases | BulkSearchFormDataInventory>({
    resolver: zodResolver(schema),
    defaultValues: {
      searchText: '',
      cards: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'cards',
  });

  const addCard = useCallback(
    (result: BulkCardResult) => {
      const selectedCard = result.bestMatch;
      if (!selectedCard) return;

      if (variant === 'purchases') {
        const referencePrice = selectedCard.referencePrice || selectedCard.sellPrice || 0;
        const offerPrice = referencePrice > 0 
          ? Math.floor(referencePrice * DEFAULT_OFFER_PERCENTAGE) 
          : 0;
        
        append({
          selectedCardGuid: selectedCard.guid,
          condition: CARD_CONDITIONS.NEAR_MINT,
          quantity: 1,
          offerPrice,
        } as any);
      } else {
        const defaultPublicPrice = selectedCard.sellPrice || 0;
        
        append({
          selectedCardGuid: selectedCard.guid,
          condition: CARD_CONDITIONS.NEAR_MINT,
          quantity: 1,
          publicPrice: defaultPublicPrice,
        } as any);
      }
    },
    [variant, append]
  );

  const removeCard = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const updateSelectedCard = useCallback(
    (index: number, cardGuid: string) => {
      const currentField = fields[index];
      if (currentField) {
        update(index, {
          ...currentField,
          selectedCardGuid: cardGuid,
        } as any);
      }
    },
    [fields, update]
  );

  const initializeCards = useCallback(
    (results: BulkCardResult[]) => {
      form.setValue('cards', []);

      results.forEach((result) => {
        if (result.bestMatch && !result.error) {
          addCard(result);
        }
      });
    },
    [form, addCard]
  );

  const resetForm = useCallback(() => {
    form.reset({
      searchText: '',
      cards: [],
    });
  }, [form]);

  return {
    form,
    fields,
    addCard,
    removeCard,
    updateSelectedCard,
    initializeCards,
    resetForm,
  };
}
