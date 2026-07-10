import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';
import { CardLanguage } from '@/lib/api/schema-types';

export type ItemVariant = 'purchase' | 'sale';

export interface AdaptedPurchaseItem {
  guid: string;
  cardGuid: string;
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  cardNumber?: string | null;
  variant?: string | null;
  type?: string | null;
  hp?: string | null;
  stage?: string | null;
  rarity?: string | null;
  isFoil?: boolean;
  collectorNumber?: string | null;
  tcgType: TCGType;
  condition: CardCondition;
  language: CardLanguage;
  quantity: number;
  offerPrice: number;
  referencePrice?: number;
  currentReferencePrice?: number;
  metrics?: {
    currentStock?: number;
  };
}

export interface AdaptedSaleItem {
  guid: string;
  cardGuid: string;
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  cardNumber?: string | null;
  variant?: string | null;
  type?: string | null;
  hp?: string | null;
  stage?: string | null;
  rarity?: string | null;
  isFoil?: boolean;
  collectorNumber?: string | null;
  tcgType: TCGType;
  condition: CardCondition;
  language: CardLanguage;
  quantity: number;
  price: number;
  foundQuantity?: number;
}
