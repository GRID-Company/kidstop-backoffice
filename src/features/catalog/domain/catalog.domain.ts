import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { DEFAULT_MARGIN_PERCENTAGE, MIN_PRICE } from './constants';
import { CardFilters } from './types';

export const getCardsVars = (
  args: IPaginatedApiArgs,
  filters: CardFilters
) => {
  return {
    findCardsArgs: {
      ...args,
      filters: {
        tcgType: filters.tcgType,
        setCode: filters.setCode || undefined,
        rarity: filters.rarity || undefined,
        search: filters.search || undefined,
      },
    },
  };
};

export const calculatePriceMargin = (
  buyPrice: number,
  marginPercentage: number = DEFAULT_MARGIN_PERCENTAGE
): number => {
  if (buyPrice < MIN_PRICE) return MIN_PRICE;
  if (marginPercentage < 0) return buyPrice;

  return Math.round(buyPrice * (1 + marginPercentage / 100) * 100) / 100;
};
