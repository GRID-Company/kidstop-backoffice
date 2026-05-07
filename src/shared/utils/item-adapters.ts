import { IPurchaseItem } from '@/features/purchases/domain/types';
import { ISaleItem } from '@/features/sales/domain/types';
import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';

export interface AdaptedPurchaseItem {
  guid: string;
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  tcgType: TCGType;
  condition: CardCondition;
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
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  tcgType: TCGType;
  condition: CardCondition;
  quantity: number;
  price: number;
  foundQuantity?: number;
}

export function adaptPurchaseItem(item: IPurchaseItem): AdaptedPurchaseItem {
  return {
    guid: item.guid,
    cardName: item.cardName,
    cardImageUrl: item.cardImageUrl,
    setName: item.setName,
    setCode: item.setCode,
    tcgType: item.tcgType,
    condition: item.condition,
    quantity: item.quantity,
    offerPrice: item.offerPrice,
    referencePrice: item.referencePrice,
    currentReferencePrice: item.currentReferencePrice,
    metrics: item.metrics,
  };
}

export function adaptSaleItem(item: ISaleItem): AdaptedSaleItem {
  const cardSummary = item.pokemonCardSummary || item.magicCardSummary;
  
  return {
    guid: item.guid,
    cardName: cardSummary?.name || 'Carta desconocida',
    cardImageUrl: item.pokemonCardSummary?.imageUri || item.magicCardSummary?.imageUri || '',
    setName: item.pokemonCardSummary?.setName || item.magicCardSummary?.edition || 'Set desconocido',
    setCode: item.pokemonCardSummary?.setCode || item.magicCardSummary?.collectorNumber || '',
    tcgType: item.tcg,
    condition: item.condition,
    quantity: item.quantity,
    price: item.price,
    foundQuantity: (item as any).foundQuantity,
  };
}
