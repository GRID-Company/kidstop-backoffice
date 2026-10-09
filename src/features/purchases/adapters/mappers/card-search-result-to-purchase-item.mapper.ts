import { generateTemporaryItemGuid } from '@/shared/utils/guid-utils';
import { CardLanguage } from '@/lib/api/schema-types';
import {
  CardCondition,
  ICardSearchResult,
  IPurchaseItem,
} from '../../domain/types';

export interface CardSearchResultAddConfig {
  condition: CardCondition;
  language: CardLanguage;
  quantity: number;
  offerPrice: number;
}

export function mapCardSearchResultToPurchaseItem(
  card: ICardSearchResult,
  config: CardSearchResultAddConfig,
  referencePrice: number
): IPurchaseItem {
  return {
    guid: generateTemporaryItemGuid(
      card.guid,
      config.condition,
      config.language
    ),
    cardGuid: card.guid,
    cardName: card.name,
    cardImageUrl: card.imageUrl,
    setName: card.setName,
    setCode: card.setCode,
    cardNumber: card.number ? `#${card.number}` : undefined,
    tcgType: card.tcgType,
    variant: card.variant,
    type: card.type,
    hp: card.hp,
    stage: card.stage,
    rarity: card.rarity,
    isFoil: card.isFoil,
    collectorNumber: card.collectorNumber,
    condition: config.condition,
    language: config.language,
    quantity: config.quantity,
    offerPrice: config.offerPrice,
    referencePrice,
    sellPrice: referencePrice,
  };
}
