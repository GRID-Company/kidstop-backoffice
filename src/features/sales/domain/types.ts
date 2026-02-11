import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';

export type { CardCondition };

export const SALE_STATUS = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type SaleStatus = (typeof SALE_STATUS)[keyof typeof SALE_STATUS];

export type SaleCode = string;

export interface ISaleItem {
  id: string;
  cardId: string;
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  tcgType: TCGType;
  condition: CardCondition;
  quantity: number;
  unitPrice: number;
}

export interface ISale {
  id: string;
  code: SaleCode;
  status: SaleStatus;
  items: ISaleItem[];
  customerId: string;
  customerName: string;
  customerEmail: string;
  tcgType: TCGType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleFilters {
  tcgType?: TCGType;
  status?: SaleStatus;
  customerId?: string;
  search?: string;
}
