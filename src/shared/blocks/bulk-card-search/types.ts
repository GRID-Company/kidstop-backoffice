import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';

export type BulkSearchVariant = 'purchases' | 'inventory';

export interface BulkCardInventoryData {
  guid: string;
  condition: CardCondition;
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
}

export interface BulkCardMetrics {
  referencePrice: number | null;
  stock: number;
  lastSaleDate: string | null;
  avgDaysInInventory: number;
  wishlistCount: number;
}

export interface BulkCardData {
  guid: string;
  name: string;
  edition: string;
  collectorNumber: string;
  isFoil?: boolean;
  rarity?: string;
  sellPrice: number | null;
  totalStock: number;
  imageUri: string | null;
  inventoryCards: BulkCardInventoryData[];
  referencePrice: number | null;
}

export interface BulkCardResult {
  originalLine: string;
  parsedQuantity?: number | null;
  parsedName: string | null;
  parsedSet: string | null;
  parsedNumber: string | null;
  bestMatch: BulkCardData | null;
  relatedCards: BulkCardData[];
  error: string | null;
}

export interface BulkCardFormDataPurchases {
  selectedCardGuid: string;
  condition: CardCondition;
  quantity: number;
  offerPrice: number;
}

export interface BulkCardFormDataInventory {
  selectedCardGuid: string;
  condition: CardCondition;
  quantity: number;
  publicPrice: number;
}

export type BulkCardFormData = BulkCardFormDataPurchases | BulkCardFormDataInventory;

export interface BulkSearchFormDataPurchases {
  searchText: string;
  cards: BulkCardFormDataPurchases[];
}

export interface BulkSearchFormDataInventory {
  searchText: string;
  cards: BulkCardFormDataInventory[];
}

export type BulkSearchFormData = BulkSearchFormDataPurchases | BulkSearchFormDataInventory;

export interface BulkCardSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export interface BulkCardSearchResultsProps {
  results: BulkCardResult[];
  variant: BulkSearchVariant;
  tcgType: TCGType;
  isLoading: boolean;
}

export interface BulkCardResultCardProps {
  result: BulkCardResult;
  index: number;
  variant: BulkSearchVariant;
  tcgType: TCGType;
}

export interface BulkCardRelatedSelectorProps {
  relatedCards: BulkCardData[];
  selectedCardGuid: string;
  onSelect: (cardGuid: string) => void;
}

export interface BulkCardFormControlsProps {
  variant: BulkSearchVariant;
  index: number;
  selectedCard: BulkCardData | null;
}

export interface BulkCardSearchPurchasesProps {
  variant: 'purchases';
  onConfirm: (data: BulkSearchFormDataPurchases, results: BulkCardResult[]) => void;
  onCancel: () => void;
  isOpen?: boolean;
}

export interface BulkCardSearchInventoryProps {
  variant: 'inventory';
  onConfirm: (data: BulkSearchFormDataInventory, results: BulkCardResult[]) => void;
  onCancel: () => void;
  isOpen?: boolean;
}

export type BulkCardSearchProps = BulkCardSearchPurchasesProps | BulkCardSearchInventoryProps;
