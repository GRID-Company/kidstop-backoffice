import { IDeckListResolvedLine } from './deck-list-parser.types';
import { IPokemonCard, IMagicCard } from './types';

export interface IBatchCardVariant {
  guid: string;
  condition: string;
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
}

export interface IBatchMagicCard {
  guid: string;
  name: string;
  edition: string | null;
  collectorNumber: string | null;
  isFoil: boolean;
  sellPrice: number | null;
  availableStock: boolean;
  totalStock: number;
  imageUri: string | null;
  inventoryCards: IBatchCardVariant[] | null;
}

export interface IBatchPokemonCard {
  guid: string;
  name: string;
  cardNumber: string | null;
  setName: string | null;
  setCode: string | null;
  sellPrice: number | null;
  availableStock: boolean;
  totalStock: number;
  imageUri: string | null;
  inventoryCards: IBatchCardVariant[] | null;
}

export interface IBatchSearchResult {
  originalLine: string;
  parsedName: string | null;
  parsedSet: string | null;
  parsedNumber: string | null;
  bestMatch: IBatchMagicCard | IBatchPokemonCard | null;
  relatedCards: (IBatchMagicCard | IBatchPokemonCard)[];
  error?: string;
}

export interface ICardMetrics {
  condition: string;
  stock: number;
  lastSellDate: string | null | unknown;
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
