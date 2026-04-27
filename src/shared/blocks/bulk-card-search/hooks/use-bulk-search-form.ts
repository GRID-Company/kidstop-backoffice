import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import {
  bulkSearchFormSchemaPurchases,
  bulkSearchFormSchemaInventory,
  BulkSearchFormDataPurchases,
  BulkSearchFormDataInventory,
} from '../schemas';
import { BulkSearchVariant, BulkCardResult } from '../types';

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

  const addCard = (result: BulkCardResult) => {
    const selectedCard = result.bestMatch;
    if (!selectedCard) return;

    const defaultReferencePrice = selectedCard.sellPrice || 0;

    if (variant === 'purchases') {
      append({
        selectedCardGuid: selectedCard.guid,
        condition: CARD_CONDITIONS.NEAR_MINT,
        quantity: 1,
        offerPrice: defaultReferencePrice * 0.7,
      } as any);
    } else {
      append({
        selectedCardGuid: selectedCard.guid,
        condition: CARD_CONDITIONS.NEAR_MINT,
        quantity: 1,
        publicPrice: defaultReferencePrice,
      } as any);
    }
  };

  const removeCard = (index: number) => {
    remove(index);
  };

  const updateSelectedCard = (index: number, cardGuid: string) => {
    const currentField = fields[index];
    if (currentField) {
      update(index, {
        ...currentField,
        selectedCardGuid: cardGuid,
      } as any);
    }
  };

  const initializeCards = (results: BulkCardResult[]) => {
    form.setValue('cards', []);
    
    results.forEach((result) => {
      if (result.bestMatch && !result.error) {
        addCard(result);
      }
    });
  };

  const resetForm = () => {
    form.reset({
      searchText: '',
      cards: [],
    });
  };

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
