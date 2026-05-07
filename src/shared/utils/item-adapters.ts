import { IPurchaseItem } from '@/features/purchases/domain/types';
import { ISaleItem } from '@/features/sales/domain/types';
import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';

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
  quantity: number;
  price: number;
  foundQuantity?: number;
}

export function adaptPurchaseItem(item: IPurchaseItem): AdaptedPurchaseItem {
  return {
    guid: item.guid,
    cardGuid: item.cardGuid,
    cardName: item.cardName,
    cardImageUrl: item.cardImageUrl,
    setName: item.setName,
    setCode: item.setCode,
    cardNumber: item.cardNumber,
    variant: item.variant,
    type: item.type,
    hp: item.hp,
    tcgType: item.tcgType,
    condition: item.condition,
    quantity: item.quantity,
    offerPrice: item.offerPrice,
    referencePrice: item.referencePrice,
    currentReferencePrice: item.currentReferencePrice,
    metrics: item.metrics,
  };
}

export function adaptSaleItem(item: ISaleItem & { foundQuantity?: number }): AdaptedSaleItem {
  const cardSummary = item.pokemonCardSummary || item.magicCardSummary;
  
  return {
    guid: item.guid,
    cardGuid: cardSummary?.guid || '',
    cardName: cardSummary?.name || 'Carta desconocida',
    cardImageUrl: item.pokemonCardSummary?.imageUri || item.magicCardSummary?.imageUri || '',
    setName: item.pokemonCardSummary?.setName || item.magicCardSummary?.edition || 'Set desconocido',
    setCode: item.pokemonCardSummary?.setCode || item.magicCardSummary?.collectorNumber || '',
    cardNumber: item.pokemonCardSummary?.cardNumber || item.magicCardSummary?.collectorNumber,
    rarity: item.pokemonCardSummary?.rarity || item.magicCardSummary?.rarity,
    hp: item.pokemonCardSummary?.hp,
    type: item.pokemonCardSummary?.type,
    variant: item.pokemonCardSummary?.variant,
    stage: item.pokemonCardSummary?.stage,
    isFoil: item.magicCardSummary?.isFoil,
    collectorNumber: item.magicCardSummary?.collectorNumber,
    tcgType: item.tcg,
    condition: item.condition,
    quantity: item.quantity,
    price: item.price,
    foundQuantity: item.foundQuantity,
  };
}
