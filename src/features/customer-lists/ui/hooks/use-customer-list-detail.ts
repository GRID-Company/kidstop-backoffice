import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';

import {
  CustomerCardListDocument,
  type CustomerCardListQuery,
} from '@/lib/api/generated/card-lists.generated';
import { toCustomerCardListDetail } from '../../adapters/mappers/customer-list.mapper';
import type { ICustomerCardListDetail } from '../../domain/types';

interface UseCustomerListDetailReturn {
  list: ICustomerCardListDetail | null;
  loading: boolean;
  error: Error | undefined;
}

export function useCustomerListDetail(
  cardListGuid: string
): UseCustomerListDetailReturn {
  const { data, loading, error } = useQuery<CustomerCardListQuery>(
    CustomerCardListDocument,
    {
      variables: { cardListGuid },
      fetchPolicy: 'cache-and-network',
    }
  );

  const list = useMemo(
    () =>
      data?.customerCardList
        ? toCustomerCardListDetail(data.customerCardList)
        : null,
    [data]
  );

  return { list, loading, error };
}
