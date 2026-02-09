import { ITableSort } from '@/lib/types/datatable.types';
import { CardCondition } from './types';

export const CARD_CONDITIONS = {
  NEAR_MINT: 'NEAR_MINT',
  LIGHTLY_PLAYED: 'LIGHTLY_PLAYED',
  MODERATELY_PLAYED: 'MODERATELY_PLAYED',
  HEAVILY_PLAYED: 'HEAVILY_PLAYED',
  DAMAGED: 'DAMAGED',
} as const;

export const CARD_CONDITION_LABELS: Record<CardCondition, string> = {
  [CARD_CONDITIONS.NEAR_MINT]: 'Near Mint',
  [CARD_CONDITIONS.LIGHTLY_PLAYED]: 'Lightly Played',
  [CARD_CONDITIONS.MODERATELY_PLAYED]: 'Moderately Played',
  [CARD_CONDITIONS.HEAVILY_PLAYED]: 'Heavily Played',
  [CARD_CONDITIONS.DAMAGED]: 'Damaged',
};

export const CARD_CONDITION_SHORT_LABELS: Record<CardCondition, string> = {
  [CARD_CONDITIONS.NEAR_MINT]: 'NM',
  [CARD_CONDITIONS.LIGHTLY_PLAYED]: 'LP',
  [CARD_CONDITIONS.MODERATELY_PLAYED]: 'MP',
  [CARD_CONDITIONS.HEAVILY_PLAYED]: 'HP',
  [CARD_CONDITIONS.DAMAGED]: 'DMG',
};

export const CARD_CONDITION_OPTIONS = Object.values(CARD_CONDITIONS).map((condition) => ({
  value: condition,
  label: CARD_CONDITION_LABELS[condition],
}));

export const DEFAULT_CARDS_SORT: ITableSort = {
  column: 'name',
  order: 'ASC',
};

export const DEFAULT_PAGE_SIZE = 20;

export const MIN_PRICE = 0;
export const DEFAULT_MARGIN_PERCENTAGE = 30;
