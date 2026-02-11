import { TCGType } from '@/lib/types/tcg.types';
import { ICard } from '@/features/catalog/domain/types';

export interface IMostWantedCard {
  id: string;
  card: ICard;
  tcgType: TCGType;
  priority: MostWantedPriority;
  notes: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type MostWantedPriority =
  (typeof MOST_WANTED_PRIORITIES)[keyof typeof MOST_WANTED_PRIORITIES];

export const MOST_WANTED_PRIORITIES = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export interface MostWantedFilters {
  tcgType?: TCGType;
  priority?: MostWantedPriority;
  isActive?: boolean;
  search?: string;
}
