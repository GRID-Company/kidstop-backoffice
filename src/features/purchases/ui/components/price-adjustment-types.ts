import { Control } from 'react-hook-form';
import { IPurchaseItem } from '../../domain/types';
import { PriceAdjustmentFormData } from '../../adapters/forms/use-price-adjustment-form';

export interface PriceAdjustmentItemsListHandle {
  scrollToFirstInvalid: () => void;
}

export interface PriceAdjustmentItemProps {
  item: IPurchaseItem;
  index: number;
  control: Control<PriceAdjustmentFormData>;
  displayCurrency: (value: number) => string;
  hasError: boolean;
  autoCalculatedItems: Set<string>;
}

export interface PriceAdjustmentItemsListProps {
  items: IPurchaseItem[];
  control: Control<PriceAdjustmentFormData>;
  displayCurrency: (value: number) => string;
  itemsWithoutPrice: string[];
  autoCalculatedItems: Set<string>;
}
