import type {
  CustomerCardListQuery,
  CustomerCardListsQuery,
} from '@/lib/api/generated/card-lists.generated';
import type { CardCondition } from '@/lib/types/card.types';
import type { TCGType } from '@/lib/types/tcg.types';
import type {
  ICustomerCardList,
  ICustomerCardListDetail,
  ICustomerCardListItem,
} from '../../domain/types';

type ListRow = NonNullable<
  CustomerCardListsQuery['customerCardLists']['data']
>[number];
type DetailRaw = CustomerCardListQuery['customerCardList'];
type ItemRaw = NonNullable<DetailRaw['items']>[number];

export function toCustomerCardList(raw: ListRow): ICustomerCardList {
  return {
    guid: raw.guid,
    name: raw.name,
    tcg: raw.tcg as TCGType,
    itemCount: raw.itemCount ?? 0,
    customer: {
      guid: raw.customer.guid,
      name: raw.customer.name ?? '',
      emailAddress: raw.customer.emailAddress,
      clientStatus: raw.customer.clientStatus ?? null,
    },
    createdDate: String(raw.createdDate ?? ''),
    updatedDate: String(raw.updatedDate ?? ''),
  };
}

export function toCustomerCardListItem(raw: ItemRaw): ICustomerCardListItem {
  const card = raw.pokemonCardSummary ?? raw.magicCardSummary;

  return {
    guid: raw.guid,
    condition: raw.condition as CardCondition,
    language: raw.language,
    quantity: raw.quantity,
    availableStock: raw.availableStock ?? null,
    sellPrice: raw.sellPrice ?? null,
    tcg: raw.tcg as TCGType,
    cardGuid: card?.guid ?? null,
    cardName: card?.name ?? '—',
    cardSet:
      raw.pokemonCardSummary?.setName ?? raw.magicCardSummary?.edition ?? null,
    cardNumber:
      raw.pokemonCardSummary?.cardNumber ??
      raw.magicCardSummary?.collectorNumber ??
      null,
    imageUri: card?.imageUri ?? null,
    createdDate: String(raw.createdDate ?? ''),
  };
}

export function toCustomerCardListDetail(
  raw: DetailRaw
): ICustomerCardListDetail {
  return {
    guid: raw.guid,
    name: raw.name,
    tcg: raw.tcg as TCGType,
    itemCount: raw.itemCount ?? raw.items?.length ?? 0,
    customer: {
      guid: raw.customer.guid,
      name: raw.customer.name ?? '',
      emailAddress: raw.customer.emailAddress,
      clientStatus: raw.customer.clientStatus ?? null,
    },
    items: (raw.items ?? []).map(toCustomerCardListItem),
    createdDate: String(raw.createdDate ?? ''),
    updatedDate: String(raw.updatedDate ?? ''),
  };
}
