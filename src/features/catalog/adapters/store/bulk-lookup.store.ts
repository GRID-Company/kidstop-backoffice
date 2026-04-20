import { create } from 'zustand';
import { IBulkLookupState, IBatchSearchResult, IPriceAnalysis, IBulkLoadItem } from '../../domain/bulk-lookup.types';

interface BulkLookupStore extends IBulkLookupState {
  setTcgType: (tcgType: 'POKEMON' | 'MAGIC' | null) => void;
  setRawText: (text: string) => void;
  setSearchResults: (results: IBatchSearchResult[]) => void;
  setPriceAnalysis: (analysis: IPriceAnalysis[]) => void;
  setSelectedItems: (items: IBulkLoadItem[]) => void;
  toggleItemSelection: (cardGuid: string, condition: string) => void;
  updateItemPrice: (cardGuid: string, condition: string, sellPrice: number, purchasePrice: number) => void;
  setIsSearching: (loading: boolean) => void;
  setIsLoadingMetrics: (loading: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: IBulkLookupState = {
  tcgType: null,
  rawText: '',
  searchResults: [],
  metricsCache: {},
  priceAnalysis: [],
  selectedItems: [],
  isSearching: false,
  isLoadingMetrics: false,
  isLoading: false,
  error: null,
};

export const useBulkLookupStore = create<BulkLookupStore>((set) => ({
  ...initialState,

  setTcgType: (tcgType) => set({ tcgType }),

  setRawText: (text) => set({ rawText: text }),

  setSearchResults: (results) => set({ searchResults: results }),

  setPriceAnalysis: (analysis) => set({ priceAnalysis: analysis }),

  setSelectedItems: (items) => set({ selectedItems: items }),

  toggleItemSelection: (cardGuid, condition) =>
    set((state) => {
      const isSelected = state.selectedItems.some(
        (item) => item.cardGuid === cardGuid && item.condition === condition
      );

      if (isSelected) {
        return {
          selectedItems: state.selectedItems.filter(
            (item) => !(item.cardGuid === cardGuid && item.condition === condition)
          ),
        };
      }

      const analysis = state.priceAnalysis.find(
        (a) => a.cardGuid === cardGuid && a.condition === condition
      );

      if (!analysis) return state;

      const newItem: IBulkLoadItem = {
        cardGuid,
        tcgType: state.tcgType || 'POKEMON',
        condition,
        quantity: analysis.quantity,
        purchasePrice: analysis.currentPrice || 0,
        sellPrice: analysis.currentPrice || 0,
        isNew: true,
      };

      return {
        selectedItems: [...state.selectedItems, newItem],
      };
    }),

  updateItemPrice: (cardGuid, condition, sellPrice, purchasePrice) =>
    set((state) => ({
      selectedItems: state.selectedItems.map((item) =>
        item.cardGuid === cardGuid && item.condition === condition
          ? { ...item, sellPrice, purchasePrice }
          : item
      ),
    })),

  setIsSearching: (loading) => set({ isSearching: loading }),

  setIsLoadingMetrics: (loading) => set({ isLoadingMetrics: loading }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
