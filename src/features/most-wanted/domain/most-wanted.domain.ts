import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { IMostWantedCard, MostWantedFilters, MOST_WANTED_PRIORITIES } from './types';

export const getMostWantedVars = (
  args: IPaginatedApiArgs,
  filters: MostWantedFilters
) => {
  return {
    findMostWantedArgs: {
      ...args,
      filters: {
        tcgType: filters.tcgType,
        priority: filters.priority || undefined,
        isActive: filters.isActive,
        search: filters.search || undefined,
      },
    },
  };
};

const PRIORITY_ORDER: Record<string, number> = {
  [MOST_WANTED_PRIORITIES.HIGH]: 1,
  [MOST_WANTED_PRIORITIES.MEDIUM]: 2,
  [MOST_WANTED_PRIORITIES.LOW]: 3,
};

export const sortByPriority = (cards: IMostWantedCard[]): IMostWantedCard[] => {
  return [...cards].sort((a, b) => {
    const priorityDiff = (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
    if (priorityDiff !== 0) return priorityDiff;
    return a.order - b.order;
  });
};
