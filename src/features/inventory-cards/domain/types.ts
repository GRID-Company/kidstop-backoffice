import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/features/catalog/domain/types';
import { MOVEMENT_TYPES, STOCK_STATUSES } from './constants';

export type MovementType = (typeof MOVEMENT_TYPES)[keyof typeof MOVEMENT_TYPES];

export type StockStatus = (typeof STOCK_STATUSES)[keyof typeof STOCK_STATUSES];

export interface IInventoryItem {
  id: string;
  cardId: string;
  name: string;
  setName: string;
  setCode: string;
  number: string;
  rarity: string;
  imageUrl: string;
  tcgType: TCGType;
  condition: CardCondition;
  stock: number;
  stockStatus: StockStatus;
  buyPrice: number;
  sellPrice: number;
  lastSoldAt: string | null;
  avgDaysInInventory: number | null;
}

export interface IInventoryMovement {
  id: string;
  inventoryItemId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface InventoryFilters {
  tcgType?: TCGType;
  condition?: CardCondition;
  stockStatus?: StockStatus;
  rarity?: string;
  search?: string;
}
