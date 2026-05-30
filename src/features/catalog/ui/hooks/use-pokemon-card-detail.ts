import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { PokemonCardInternalDetailDocument } from '@/lib/api/generated/catalog-pokemon.generated';

export function usePokemonCardDetail(guid: string | null) {
  const [fetchDetail, { data, loading, refetch }] = useLazyQuery(PokemonCardInternalDetailDocument, {
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (guid) {
      void fetchDetail({ variables: { guid } });
    }
  }, [guid, fetchDetail]);

  return {
    detail: data?.pokemonCardInternalDetail ?? null,
    loading,
    refetch,
  };
}
