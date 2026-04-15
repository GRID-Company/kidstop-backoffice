import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { MagicCardInternalDetailDocument } from '@/lib/api/generated/catalog-magic.generated';

export function useMagicCardDetail(guid: string | null) {
  const [fetchDetail, { data, loading, refetch }] = useLazyQuery(MagicCardInternalDetailDocument, {
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (guid) {
      void fetchDetail({ variables: { guid } });
    }
  }, [guid, fetchDetail]);

  return {
    detail: data?.magicCardInternalDetail ?? null,
    loading,
    refetch,
  };
}
