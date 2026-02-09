import { ICardVariant } from '../../domain/types';
import { CardPriceFormData } from '../forms/card-price.schema';

export function toUpdateCardPricePayload(data: CardPriceFormData, variantId: string) {
  return {
    updateCardPriceInput: {
      variantId,
      condition: data.condition,
      buyPrice: data.buyPrice,
      sellPrice: data.sellPrice,
    },
  };
}

export function toCardPriceFormDefaults(variant: ICardVariant): Partial<CardPriceFormData> {
  return {
    condition: variant.condition,
    buyPrice: variant.buyPrice,
    sellPrice: variant.sellPrice,
  };
}
