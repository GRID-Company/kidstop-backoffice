import { ITableSort } from '@/lib/types/datatable.types';
import { CARD_CONDITIONS } from '@/lib/types/card.types';

export {
  CARD_CONDITIONS,
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
  CARD_CONDITION_OPTIONS,
  POKEMON_RARITIES,
  MAGIC_RARITIES,
  POKEMON_RARITY_OPTIONS,
  MAGIC_RARITY_OPTIONS,
} from '@/lib/types/card.types';

export const DEFAULT_CARD_CONDITION = CARD_CONDITIONS.NEAR_MINT;

export function getDefaultVariant<T extends { condition: string }>(
  variants: T[]
): T {
  return variants.find((v) => v.condition === DEFAULT_CARD_CONDITION) ?? variants[0];
}

export const DEFAULT_CARDS_SORT: ITableSort = {
  column: 'releaseDate',
  order: 'DESC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const CARD_SEARCH_LIMIT = 6;

export const POKEMON_SORT_OPTIONS = [
  { label: 'Nombre A → Z', value: 'name_ASC' },
  { label: 'Nombre Z → A', value: 'name_DESC' },
  { label: 'Precio menor', value: 'sellPrice_ASC' },
  { label: 'Precio mayor', value: 'sellPrice_DESC' },
  { label: 'Mayor stock', value: 'totalStock_DESC' },
];

export const MAGIC_SORT_OPTIONS = [
  { label: 'Nombre A → Z', value: 'name_ASC' },
  { label: 'Nombre Z → A', value: 'name_DESC' },
  { label: 'Rareza', value: 'rarity_ASC' },
  { label: 'Set', value: 'setName_ASC' },
];

export const MIN_PRICE = 0;
export const DEFAULT_MARGIN_PERCENTAGE = 30;

export const STOCK_STATUS_OPTIONS = [
  { label: 'Disponible', value: 'AVAILABLE' },
  { label: 'No disponible', value: 'UNAVAILABLE' },
  { label: 'Esperando recolección', value: 'AWAITING_PICKUP' },
];
