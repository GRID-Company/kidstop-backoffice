import { CardCondition } from '@/lib/types/card.types';
import { DateRange } from '@/lib/types/date.types';
import { MOVEMENT_TYPES, STOCK_STATUSES } from './constants';
import { CardLanguage } from '@/lib/api/schema-types';

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
  language: CardLanguage;
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
  rarity: string;
  tcg: string;
  condition: CardCondition;
  language: CardLanguage;
  movementType: MovementType;
  quantity: number;
  notes: string;
  userName: string;
  reference: string | null;
  createdDate: string;
}

export interface MovementFilters {
  movementType?: MovementType;
  condition?: CardCondition;
  language?: CardLanguage;
  search?: string;
  dateRange?: DateRange;
}

export type { DateRange };

export interface InventoryFilters {
  condition?: CardCondition;
  rarity?: string;
  language?: CardLanguage;
  set?: string;
  edition?: string;
  isFoil?: boolean;
  search?: string;
  dateRange?: DateRange;
}
