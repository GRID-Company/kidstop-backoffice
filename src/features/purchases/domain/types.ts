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
  guid: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface IPurchaseItem {
  guid: string;
  cardGuid: string;
  cardName: string;
  cardImageUrl: string;
  setName: string;
  setCode: string;
  tcgType: TCGType;
  variant?: string | null;
  type?: string | null;
  hp?: string | null;
  stage?: string | null;
  condition: CardCondition;
  quantity: number;
  offerPrice: number;
  referencePrice?: number;
  currentReferencePrice?: number;
  sellPrice?: number;
  metrics?: ICardSearchMetrics;
}

export interface IPaymentDetail {
  method: PaymentMethod;
  amount: number;
}

export interface IPurchase {
  guid: string;
  reference: string;
  status: PurchaseStatus;
  seller: ISeller;
  buyer?: { guid: string; name: string };
  items: IPurchaseItem[];
  payments: IPaymentDetail[];
  tcgType: TCGType;
  notes?: string;
  createdBy?: { guid: string; name: string };
  createdDate: string;
  updatedBy?: { guid: string; name: string };
  updatedDate: string;
}

export interface ICardSearchMetrics {
  referencePrice: number;
  currentStock: number;
  lastSaleDate: string | null;
  daysInInventory: number;
  wishlistCount: number;
}

export interface ICardSearchResult {
  guid: string;
  name: string;
  setName: string;
  setCode: string;
  number: string;
  rarity: string;
  imageUrl: string;
  tcgType: TCGType;
  metrics: ICardSearchMetrics;
}

export interface PurchaseFilters {
  tcgType?: TCGType;
  status?: PurchaseStatus;
  sellerGuid?: string;
  buyerGuid?: string;
  search?: string;
}
