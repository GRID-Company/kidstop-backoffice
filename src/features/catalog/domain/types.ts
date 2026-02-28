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
}

export interface IPokemonCollection {
  guid: string;
  name: string;
  code: string | null;
}
