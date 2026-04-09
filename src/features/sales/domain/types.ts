import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';

export type { CardCondition };

export const SALE_STATUS = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type SaleStatus = (typeof SALE_STATUS)[keyof typeof SALE_STATUS];

export const CANCEL_REASON = {
  CLIENT_UNREACHABLE: 'CLIENT_UNREACHABLE',
  NO_STOCK: 'NO_STOCK',
  OTHER: 'OTHER',
} as const;

export type CancelReason = (typeof CANCEL_REASON)[keyof typeof CANCEL_REASON];

export type SaleCode = string;

export interface IPokemonCardSummary {
  guid: string;
  name: string;
  setName: string | null;
  setCode: string | null;
  cardNumber: string | null;
  rarity: string | null;
  imageUri: string | null;
}

export interface IMagicCardSummary {
  guid: string;
  name: string;
  edition: string | null;
  collectorNumber: string | null;
  rarity: string | null;
  imageUri: string | null;
  isFoil: boolean;
}

export interface ISaleItem {
  guid: string;
  tcg: TCGType;
  condition: CardCondition;
  quantity: number;
  price: number;
  pokemonCardSummary: IPokemonCardSummary | null;
  magicCardSummary: IMagicCardSummary | null;
}

export interface ISaleCustomer {
  guid: string;
  name: string | null;
  emailAddress: string;
  phone: string | null;
}

export interface ISale {
  guid: string;
  saleCode: SaleCode;
  status: SaleStatus;
  tcg: TCGType;
  total: number;
  notes: string | null;
  cancelReason: CancelReason | null;
  emailNotificationSent: boolean;
  customer: ISaleCustomer | null;
  kioskCustomerName: string | null;
  kioskCustomerEmail: string | null;
  items: ISaleItem[];
  statusTimestamps: Record<string, string> | null;
  createdDate: string;
  updatedDate: string;
}

export interface SaleFilters {
  tcg?: TCGType;
  status?: SaleStatus;
  customer?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
