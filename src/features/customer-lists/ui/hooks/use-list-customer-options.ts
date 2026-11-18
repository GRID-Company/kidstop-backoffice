import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';

import { CustomersDocument } from '@/lib/api/generated/customers.generated';
import type { ISelectOption } from '@/shared/base/heorui-overrides/select';

const OPTIONS_LIMIT = 50;

interface UseListCustomerOptionsReturn {
  options: ISelectOption[];
  loading: boolean;
}

export function useListCustomerOptions(
  search?: string
): UseListCustomerOptionsReturn {
  const { data, loading } = useQuery(CustomersDocument, {
    variables: {
      findUsersArgs: {
        skip: 0,
        limit: OPTIONS_LIMIT,
        sort: { column: 'name', order: 'ASC' },
        ...(search?.trim() ? { search: search.trim() } : {}),
        filters: {
          role: {
            filterType: ':multiple_values:',
            values: ['CLIENT', 'CLIENT_KIOSK'],
          },
          active: true,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const options = useMemo(
    () =>
      (data?.users.data ?? []).map((user) => ({
        value: user.guid,
        label: `${user.name ?? user.emailAddress} · ${user.emailAddress}`,
      })),
    [data]
  );

  return { options, loading };
}
