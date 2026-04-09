import { FindMagicCardsPublicArgs } from '@/lib/api/schema-types';
import { DEFAULT_CARDS_SORT, DEFAULT_PAGE_SIZE } from './constants';
import { MagicCatalogFilters } from './types';

export const getMagicCatalogVars = (
  page: number,
  search?: string,
  filters?: MagicCatalogFilters
): { findMagicCardsPublicArgs: FindMagicCardsPublicArgs } => {
  const sort =
    filters?.sortBy
      ? { column: filters.sortBy, order: filters.sortOrder ?? 'ASC' }
      : DEFAULT_CARDS_SORT;

  return {
    findMagicCardsPublicArgs: {
      skip: (page - 1) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
      sort,
      search: search || undefined,
      filters: {
        edition: filters?.edition || undefined,
        rarity: filters?.rarity || undefined,
        isFoil: filters?.isFoil ?? undefined,
        condition: filters?.condition || undefined,
        stockStatus: filters?.stockStatus || undefined,
        sellPrice:
          filters?.sellPriceMin !== undefined || filters?.sellPriceMax !== undefined
            ? {
                filterType: ':numericrange:',
                range: {
                  from: filters.sellPriceMin,
                  to: filters.sellPriceMax,
                },
              }
            : undefined,
      },
    },
  };
};
