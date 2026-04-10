import { useQuery } from '@apollo/client/react';
import { ClientDetailsDocument } from '@/lib/api/generated/customers.generated';
import { IClientDetails } from '../../domain/types';

export function useClientDetails(clientGuid: string) {
  const { data, loading } = useQuery(ClientDetailsDocument, {
    variables: { clientGuid },
    skip: !clientGuid,
    fetchPolicy: 'cache-and-network',
  });

  const details: IClientDetails | null = data?.clientDetails
    ? {
        orderCount: data.clientDetails.orderCount,
        totalOrdersAmount: data.clientDetails.totalOrdersAmount,
        completedOrdersAmount: data.clientDetails.completedOrdersAmount,
        unreachableCancellations: data.clientDetails.unreachableCancellations,
        lastOrderDate: data.clientDetails.lastOrderDate
          ? String(data.clientDetails.lastOrderDate)
          : null,
      }
    : null;

  return { details, loading };
}
