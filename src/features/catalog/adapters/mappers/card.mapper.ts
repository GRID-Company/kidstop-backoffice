import { PokemonCardInternalListQuery } from '@/lib/api/generated/catalog-pokemon.generated';
import { ICardVariant, IPokemonCard } from '../../domain/types';
import { CardPriceFormData } from '../forms/card-price.form.schema';

type PokemonCardInternalItem = NonNullable<
  NonNullable<PokemonCardInternalListQuery['pokemonCardInternalList']['data']>[number]
>;

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

export function toCardPriceFormDefaults(variant: ICardVariant): CardPriceFormData {
  return {
    condition: variant.condition,
    buyPrice: variant.buyPrice,
    sellPrice: variant.sellPrice,
  };
}

export function toPokemonCard(item: PokemonCardInternalItem): IPokemonCard {
  return {
    guid: item.guid,
    name: item.name,
    setName: item.setName ?? null,
    setCode: item.setCode ?? null,
    sellPrice: item.sellPrice ?? null,
    availableStock: item.availableStock,
    totalStock: item.totalStock,
    imageUri: item.imageUri ?? null,
    variants: (item.inventoryCards ?? []).map((ic) => ({
      condition: ic.condition,
      stock: ic.stock,
      purchasePrice: ic.purchasePrice ?? null,
      sellPrice: ic.sellPrice ?? null,
    })),
  };
}
