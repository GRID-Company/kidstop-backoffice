import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { IPurchaseItem } from '../../domain/types';
import { getItemKey } from '../../domain/purchases.domain';

interface DuplicateConfirmation {
  uniqueItems: IPurchaseItem[];
  duplicateItems: IPurchaseItem[];
}

interface UseDuplicateValidationReturn {
  duplicateConfirmation: DuplicateConfirmation | null;
  validateAndAddItems: (newItems: IPurchaseItem[]) => void;
  handleConfirmDuplicates: () => void;
  handleCancelDuplicates: () => void;
}

export function useDuplicateValidation(
  existingItemIds: Set<string>,
  addItem: (item: IPurchaseItem) => void,
  onComplete?: () => void
): UseDuplicateValidationReturn {
  const [duplicateConfirmation, setDuplicateConfirmation] = useState<DuplicateConfirmation | null>(null);

  const validateAndAddItems = useCallback((newItems: IPurchaseItem[]) => {
    const uniqueItems: IPurchaseItem[] = [];
    const duplicateItems: IPurchaseItem[] = [];
    
    newItems.forEach(item => {
      const itemKey = getItemKey(item);
      if (existingItemIds.has(itemKey)) {
        duplicateItems.push(item);
      } else {
        uniqueItems.push(item);
      }
    });
    
    if (duplicateItems.length > 0) {
      setDuplicateConfirmation({ uniqueItems, duplicateItems });
      return;
    }
    
    if (uniqueItems.length === 0) {
      toast.error('Todas las cartas ya están agregadas a la compra');
      return;
    }
    
    uniqueItems.forEach((item) => addItem(item));
    toast.success(`${uniqueItems.length} cartas agregadas exitosamente`);
    onComplete?.();
  }, [existingItemIds, addItem, onComplete]);

  const handleConfirmDuplicates = useCallback(() => {
    if (!duplicateConfirmation) return;
    
    duplicateConfirmation.uniqueItems.forEach((item) => addItem(item));
    toast.success(`${duplicateConfirmation.uniqueItems.length} cartas agregadas exitosamente`);
    
    setDuplicateConfirmation(null);
    onComplete?.();
  }, [duplicateConfirmation, addItem, onComplete]);

  const handleCancelDuplicates = useCallback(() => {
    setDuplicateConfirmation(null);
  }, []);

  return {
    duplicateConfirmation,
    validateAndAddItems,
    handleConfirmDuplicates,
    handleCancelDuplicates,
  };
}
