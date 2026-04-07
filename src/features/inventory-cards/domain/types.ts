import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';
import { DateRange } from '@/lib/types/date.types';
import { MOVEMENT_TYPES, STOCK_STATUSES } from './constants';

export type MovementType = (typeof MOVEMENT_TYPES)[keyof typeof MOVEMENT_TYPES];

export type StockStatus = (typeof STOCK_STATUSES)[keyof typeof STOCK_STATUSES];

export interface IInventoryItem {
  guid: string;
  cardGuid: string;
  name: string;
  setName: string;
  setCode: string;
  number: string;
  rarity: string;
  imageUrl: string;
  tcg: string;
  condition: CardCondition;
  stock: number;
  stockStatus: StockStatus;
  purchasePrice: number;
  sellPrice: number;
  lastSellDate: string | null;
  avgDaysInInventory: number | null;
}

export interface IInventoryMovement {
  guid: string;
  inventoryItemGuid: string;
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  cardNumber: string;
  tcg: string;
  movementType: MovementType;
  quantity: number;
  notes: string;
  userName: string;
  reference: string | null;
  createdDate: string;
}

export interface MovementFilters {
  movementType?: MovementType;
  search?: string;
  dateRange?: DateRange;
}

export type { DateRange };

export interface InventoryFilters {
  condition?: CardCondition;
  stockStatus?: StockStatus;
  rarity?: string;
  search?: string;
  dateRange?: DateRange;
}
