import { TCGType } from '@/lib/types/tcg.types';
import { CardCondition } from '@/lib/types/card.types';
import { CardLanguage } from '@/lib/api/schema-types';

export interface IListCustomer {
  guid: string;
  name: string;
  emailAddress: string;
  clientStatus: string | null;
}

export interface ICustomerCardList extends Record<string, unknown> {
  guid: string;
  name: string;
  tcg: TCGType;
  itemCount: number;
  customer: IListCustomer;
  createdDate: string;
  updatedDate: string;
}

export interface ICustomerCardListItem extends Record<string, unknown> {
  guid: string;
  condition: CardCondition;
  language: CardLanguage;
  quantity: number;
  availableStock: number | null;
  sellPrice: number | null;
  tcg: TCGType;
  cardGuid: string | null;
  cardName: string;
  cardSet: string | null;
  cardNumber: string | null;
  imageUri: string | null;
  createdDate: string;
}

export interface ICustomerCardListDetail extends ICustomerCardList {
  items: ICustomerCardListItem[];
}

export interface CustomerListFilters {
  search?: string;
  customerGuid?: string;
  dateFrom?: string;
  dateTo?: string;
}
