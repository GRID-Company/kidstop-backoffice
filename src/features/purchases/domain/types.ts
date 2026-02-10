import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';

export type { CardCondition };

export const PURCHASE_STATUS = {
  DRAFT: 'DRAFT',
  QUOTED: 'QUOTED',
  WAITING_PRICE: 'WAITING_PRICE',
  FINALIZED: 'FINALIZED',
  REJECTED: 'REJECTED',
} as const;

export type PurchaseStatus =
  (typeof PURCHASE_STATUS)[keyof typeof PURCHASE_STATUS];

export const PAYMENT_METHOD = {
  CASH: 'CASH',
  TRANSFER: 'TRANSFER',
  STORE_CREDIT: 'STORE_CREDIT',
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export interface ISeller {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface IPurchaseItem {
  id: string;
  cardId: string;
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  tcgType: TCGType;
  condition: CardCondition;
  quantity: number;
  unitBuyPrice: number;
  unitSellPrice: number;
}

export interface IPaymentDetail {
  method: PaymentMethod;
  amount: number;
}

export interface IPurchase {
  id: string;
  code: string;
  status: PurchaseStatus;
  seller: ISeller;
  items: IPurchaseItem[];
  payments: IPaymentDetail[];
  tcgType: TCGType;
  buyerId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseFilters {
  tcgType?: TCGType;
  status?: PurchaseStatus;
  sellerId?: string;
  buyerId?: string;
  search?: string;
}
