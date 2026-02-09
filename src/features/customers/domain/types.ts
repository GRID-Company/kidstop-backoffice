import { CUSTOMER_TYPES, CUSTOMER_STATUSES } from './constants';

export type CustomerType = (typeof CUSTOMER_TYPES)[keyof typeof CUSTOMER_TYPES];

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[keyof typeof CUSTOMER_STATUSES];

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: CustomerType;
  status: CustomerStatus;
  notes: string | null;
  totalOrders: number;
  uncompletedOrders: number;
  blockedAt: string | null;
  createdAt: string;
}

export interface CustomerFilters {
  type?: CustomerType;
  status?: CustomerStatus;
  search?: string;
}
