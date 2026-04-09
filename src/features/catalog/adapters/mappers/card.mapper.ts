import { PokemonCardInternalListQuery } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardInternalListQuery } from '@/lib/api/generated/catalog-magic.generated';
import { ICardVariant, IPokemonCard, IMagicCard } from '../../domain/types';
import { CardPriceFormData } from '../forms/card-price.form.schema';

type PokemonCardInternalItem = NonNullable<
  NonNullable<PokemonCardInternalListQuery['pokemonCardInternalList']['data']>[number]
>;

type MagicCardInternalItem = NonNullable<
  NonNullable<MagicCardInternalListQuery['magicCardInternalList']['data']>[number]
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
      guid: ic.guid,
      condition: ic.condition,
      stock: ic.stock,
      purchasePrice: ic.purchasePrice ?? null,
      sellPrice: ic.sellPrice ?? null,
    })),
  };
}

export function toMagicCard(item: MagicCardInternalItem): IMagicCard {
  return {
    guid: item.guid,
    name: item.name,
    edition: item.edition ?? null,
    collectorNumber: item.collectorNumber ?? null,
    isFoil: item.isFoil,
    rarity: null,
    sellPrice: item.sellPrice ?? null,
    availableStock: item.availableStock,
    totalStock: item.totalStock,
    imageUri: item.imageUri ?? null,
    variants: (item.inventoryCards ?? []).map((ic) => ({
      guid: ic.guid,
      condition: ic.condition,
      stock: ic.stock,
      purchasePrice: ic.purchasePrice ?? null,
      sellPrice: ic.sellPrice ?? null,
    })),
  };
}
