import { CUSTOMER_TYPES, CUSTOMER_STATUSES, ORDER_STATUSES } from './constants';

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
  lastOrderDate: string | null;
  uncompletedOrders: number;
  blockedAt: string | null;
  createdAt: string;
}

export interface CustomerFilters {
  type?: CustomerType;
  status?: CustomerStatus;
  search?: string;
}

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export interface ICustomerOrder {
  id: string;
  code: string;
  status: OrderStatus;
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  completedAt: string | null;
}

export interface ICustomerOrdersSummary {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  orders: ICustomerOrder[];
}
