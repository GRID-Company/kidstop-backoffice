import { ITableSort } from '@/lib/types/datatable.types';

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

export const DEFAULT_CARDS_SORT: ITableSort = {
  column: 'name',
  order: 'ASC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const MIN_PRICE = 0;
export const DEFAULT_MARGIN_PERCENTAGE = 30;
