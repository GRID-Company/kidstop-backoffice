import { IDeckListResolvedLine } from './deck-list-parser.types';
import { IPokemonCard, IMagicCard } from './types';

export interface IBatchSearchResult {
  originalLine: string;
  parsedName: string;
  parsedSet: string;
  parsedNumber: string;
  bestMatch: IPokemonCard | IMagicCard | null;
  relatedCards: (IPokemonCard | IMagicCard)[];
}

export interface ICardMetrics {
  condition: string;
  stock: number;
  lastSellDate: string | null;
  avgDaysInInventory: number | null;
  wishlistCount: number;
}

export interface IPokemonCardMetricsResponse {
  variantsMetrics: ICardMetrics[];
  ungradedPrice: number | null;
  gradedPriceSeven: number | null;
  gradedPriceEightOrAbove: number | null;
}

export interface IMagicCardMetricsResponse {
  variantsMetrics: ICardMetrics[];
  priceRetail: number | null;
  priceBuy: number | null;
}

export interface IPriceAnalysis {
  cardGuid: string;
  cardName: string;
  currentPrice: number | null;
  suggestedPrice: number | null;
  marketPrice: number | null;
  margin: number | null;
  marginPercentage: number | null;
  condition: string;
  quantity: number;
}

export interface IBulkLoadItem {
  cardGuid: string;
  tcgType: 'POKEMON' | 'MAGIC';
  condition: string;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  isNew: boolean;
}

export interface IBulkLoadPayload {
  items: IBulkLoadItem[];
}

export interface IBulkLoadResult {
  success: boolean;
  createdCount: number;
  updatedCount: number;
  errors: string[];
}

export interface IBulkLookupState {
  tcgType: 'POKEMON' | 'MAGIC' | null;
  rawText: string;
  searchResults: IBatchSearchResult[];
  metricsCache: Record<string, IPokemonCardMetricsResponse | IMagicCardMetricsResponse>;
  priceAnalysis: IPriceAnalysis[];
  selectedItems: IBulkLoadItem[];
  isSearching: boolean;
  isLoadingMetrics: boolean;
  isLoading: boolean;
  error: string | null;
}
