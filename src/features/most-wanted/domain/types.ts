import { TCGType } from '@/lib/types/tcg.types';

export interface PokemonCardSummary {
  guid: string;
  name: string;
  setName: string | null;
  setCode: string | null;
  cardNumber: string | null;
  rarity: string | null;
  imageUri: string | null;
}

export interface MagicCardSummary {
  guid: string;
  name: string;
  edition: string | null;
  collectorNumber: string | null;
  rarity: string | null;
  imageUri: string | null;
  isFoil: boolean;
}

export interface IMostWantedCard {
  guid: string;
  tcg: TCGType;
  priority: MostWantedPriority;
  notes: string | null;
  active: boolean;
  pokemonCardSummary?: PokemonCardSummary | null;
  magicCardSummary?: MagicCardSummary | null;
  createdDate: string;
  updatedDate: string;
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
