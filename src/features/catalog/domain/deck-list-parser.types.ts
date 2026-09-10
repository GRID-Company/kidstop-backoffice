import { ICard } from './types';

export type DeckListFormat = 'moxfield' | 'limitless';

export interface IDeckListLine {
  lineNumber: number;
  raw: string;
  quantity: number;
  cardName: string;
  setCode: string;
  collectorNumber: string;
  isValid: boolean;
  error?: string;
}

export interface IDeckListResolvedLine extends IDeckListLine {
  card: ICard | null;
  found: boolean;
}

export interface IDeckListImportResult {
  lines: IDeckListResolvedLine[];
  totalCards: number;
  totalQuantity: number;
  foundCount: number;
  missingCount: number;
  invalidCount: number;
}
