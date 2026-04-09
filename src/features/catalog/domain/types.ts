import { SortDescriptor } from '@heroui/react';
import {
  SortFn,
  SearchFn,
  FilterFn,
} from '@/lib/types/paginated-datatable.types';
import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';

export type { CardCondition };

export interface ICardVariant {
  id: string;
  condition: CardCondition;
  stock: number;
  buyPrice: number;
  sellPrice: number;
}

export interface ICard {
  id: string;
  name: string;
  setName: string;
  setCode: string;
  number: string;
  rarity: string;
  imageUrl: string;
  tcgType: TCGType;
  variants: ICardVariant[];
}

export interface CardFilters {
  tcgType?: TCGType;
  setCode?: string;
  rarity?: string;
  condition?: CardCondition;
  search?: string;
}

export interface CardListProps<T> {
  data: T[];
  loading: boolean;
  sortDescriptor: SortDescriptor;
  onSortChange: SortFn;
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
}

export interface IPokemonCardVariant {
  condition: string;
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
}

export interface IPokemonCard {
  guid: string;
  name: string;
  setName: string | null;
  setCode: string | null;
  sellPrice: number | null;
  availableStock: boolean;
  totalStock: number;
  imageUri: string | null;
  variants: IPokemonCardVariant[];
}

export interface PokemonCatalogFilters {
  set?: string;
  rarity?: string;
  condition?: string;
  variant?: string;
  genre?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IPokemonCollection {
  guid: string;
  name: string;
  code: string | null;
}

export interface IMagicCardVariant {
  guid: string;
  condition: string;
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
}

export interface IMagicCard {
  guid: string;
  name: string;
  edition: string | null;
  collectorNumber: string | null;
  isFoil: boolean;
  rarity: string | null;
  sellPrice: number | null;
  availableStock: boolean;
  totalStock: number;
  imageUri: string | null;
  variants: IMagicCardVariant[];
}

export interface MagicCatalogFilters {
  edition?: string;
  rarity?: string;
  isFoil?: boolean;
  condition?: string;
  stockStatus?: string;
  sellPriceMin?: number;
  sellPriceMax?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IMagicCollection {
  guid: string;
  name: string;
  editionIconUri: string | null;
}
