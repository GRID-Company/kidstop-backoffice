import { ICustomerOrder, ICustomerOrdersSummary } from '../../domain/types';
import { ORDER_STATUSES } from '../../domain/constants';

const MOCK_ORDERS_BY_CUSTOMER: Record<string, ICustomerOrder[]> = {
  'cust-001': [
    {
      id: 'ord-001',
      code: 'KSP-2025-001',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 5,
      totalAmount: 2350.0,
      createdAt: '2025-01-28T14:00:00Z',
      completedAt: '2025-01-29T10:00:00Z',
    },
    {
      id: 'ord-002',
      code: 'KSP-2025-002',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 3,
      totalAmount: 1200.0,
      createdAt: '2025-01-15T09:00:00Z',
      completedAt: '2025-01-16T11:30:00Z',
    },
    {
      id: 'ord-003',
      code: 'KSP-2024-048',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 8,
      totalAmount: 4500.0,
      createdAt: '2024-12-20T16:00:00Z',
      completedAt: '2024-12-21T14:00:00Z',
    },
    {
      id: 'ord-004',
      code: 'KSP-2024-035',
      status: ORDER_STATUSES.CANCELLED,
      totalItems: 2,
      totalAmount: 800.0,
      createdAt: '2024-11-10T12:00:00Z',
      completedAt: null,
    },
    {
      id: 'ord-005',
      code: 'KSP-2024-020',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 4,
      totalAmount: 1750.0,
      createdAt: '2024-09-05T10:30:00Z',
      completedAt: '2024-09-06T09:00:00Z',
    },
  ],
  'cust-002': [
    {
      id: 'ord-010',
      code: 'KSP-2025-010',
      status: ORDER_STATUSES.IN_PROGRESS,
      totalItems: 2,
      totalAmount: 950.0,
      createdAt: '2025-01-15T09:30:00Z',
      completedAt: null,
    },
    {
      id: 'ord-011',
      code: 'KSP-2024-042',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 1,
      totalAmount: 350.0,
      createdAt: '2024-12-01T14:00:00Z',
      completedAt: '2024-12-02T10:00:00Z',
    },
    {
      id: 'ord-012',
      code: 'KSP-2024-030',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 3,
      totalAmount: 1100.0,
      createdAt: '2024-10-15T11:00:00Z',
      completedAt: '2024-10-16T09:30:00Z',
    },
  ],
  'cust-003': [
    {
      id: 'ord-020',
      code: 'KSP-2024-050',
      status: ORDER_STATUSES.CANCELLED,
      totalItems: 4,
      totalAmount: 1800.0,
      createdAt: '2024-12-20T11:00:00Z',
      completedAt: null,
    },
    {
      id: 'ord-021',
      code: 'KSP-2024-045',
      status: ORDER_STATUSES.CANCELLED,
      totalItems: 2,
      totalAmount: 600.0,
      createdAt: '2024-12-10T09:00:00Z',
      completedAt: null,
    },
    {
      id: 'ord-022',
      code: 'KSP-2024-038',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 3,
      totalAmount: 1400.0,
      createdAt: '2024-11-20T15:00:00Z',
      completedAt: '2024-11-21T12:00:00Z',
    },
    {
      id: 'ord-023',
      code: 'KSP-2024-025',
      status: ORDER_STATUSES.CANCELLED,
      totalItems: 1,
      totalAmount: 250.0,
      createdAt: '2024-10-05T10:00:00Z',
      completedAt: null,
    },
    {
      id: 'ord-024',
      code: 'KSP-2024-015',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 5,
      totalAmount: 2200.0,
      createdAt: '2024-08-15T13:00:00Z',
      completedAt: '2024-08-16T11:00:00Z',
    },
  ],
  'cust-004': [
    {
      id: 'ord-030',
      code: 'KSP-2025-015',
      status: ORDER_STATUSES.READY,
      totalItems: 6,
      totalAmount: 3200.0,
      createdAt: '2025-02-05T16:45:00Z',
      completedAt: null,
    },
    {
      id: 'ord-031',
      code: 'KSP-2025-008',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 4,
      totalAmount: 2100.0,
      createdAt: '2025-01-20T10:00:00Z',
      completedAt: '2025-01-21T09:00:00Z',
    },
    {
      id: 'ord-032',
      code: 'KSP-2024-055',
      status: ORDER_STATUSES.COMPLETED,
      totalItems: 7,
      totalAmount: 3800.0,
      createdAt: '2024-12-28T14:30:00Z',
      completedAt: '2024-12-29T11:00:00Z',
    },
  ],
};

function buildSummary(orders: ICustomerOrder[]): ICustomerOrdersSummary {
  const completedOrders = orders.filter((o) => o.status === ORDER_STATUSES.COMPLETED).length;
  const cancelledOrders = orders.filter((o) => o.status === ORDER_STATUSES.CANCELLED).length;

  return {
    totalOrders: orders.length,
    completedOrders,
    cancelledOrders,
    orders,
  };
}

export function getMockCustomerOrdersSummary(customerId: string): ICustomerOrdersSummary {
  const orders = MOCK_ORDERS_BY_CUSTOMER[customerId] ?? [];
  return buildSummary(orders);
}
