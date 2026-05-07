import { CLIENT_STATUSES, CUSTOMER_ROLES, ORDER_STATUSES } from './constants';

export type ClientStatus = (typeof CLIENT_STATUSES)[keyof typeof CLIENT_STATUSES];
export type CustomerRole = (typeof CUSTOMER_ROLES)[keyof typeof CUSTOMER_ROLES];

export interface ICustomer {
  guid: string;
  name: string;
  emailAddress: string;
  phone: string | null;
  role: CustomerRole;
  clientStatus: ClientStatus;
  active: boolean;
  createdDate: string;
  updatedDate?: string;
  totalOrders?: number;
  lastOrderDate?: string | null;
  uncompletedOrders?: number;
  blockedAt?: string | null;
  notes?: string | null;
}

export interface CustomerFilters {
  clientStatus?: ClientStatus;
  role?: CustomerRole;
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

export interface IClientDetails {
  orderCount: number;
  totalOrdersAmount: number;
  completedOrdersAmount: number;
  unreachableCancellations: number;
  lastOrderDate: string | null;
}
