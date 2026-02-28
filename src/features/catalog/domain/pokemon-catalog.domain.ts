import { FindPokemonCardsPublicArgs } from '@/lib/api/schema-types';
import { DEFAULT_CARDS_SORT, DEFAULT_PAGE_SIZE } from './constants';
import { PokemonCatalogFilters } from './types';

export const getPokemonCatalogVars = (
  page: number,
  search?: string,
  filters?: PokemonCatalogFilters
): { findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs } => {
  return {
    findPokemonCardsPublicArgs: {
      skip: (page - 1) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_CARDS_SORT,
      search: search || undefined,
      filters: {
        rarity: filters?.rarity || undefined,
        condition: filters?.condition || undefined,
        set: filters?.set || undefined,
        variant: filters?.variant || undefined,
        genre: filters?.genre || undefined,
      },
    },
  };
};
