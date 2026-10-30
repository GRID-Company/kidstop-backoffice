import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import {
  PokemonCardCollectionsDocument,
  PokemonCardRaritiesDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardCollectionsDocument } from '@/lib/api/generated/catalog-magic.generated';
import {
  IPokemonCollection,
  IMagicCollection,
} from '@/features/catalog/domain/types';

export function useInventoryFilterOptions() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  const { data: pokemonCollectionsData } = useQuery(
    PokemonCardCollectionsDocument,
    {
      fetchPolicy: 'cache-first',
      skip: !isPokemon,
      notifyOnNetworkStatusChange: false,
    }
  );

  const { data: magicCollectionsData } = useQuery(
    MagicCardCollectionsDocument,
    {
      fetchPolicy: 'cache-first',
      skip: isPokemon,
      notifyOnNetworkStatusChange: false,
    }
  );

  const { data: pokemonRaritiesData } = useQuery(PokemonCardRaritiesDocument, {
    fetchPolicy: 'cache-first',
    skip: !isPokemon,
    notifyOnNetworkStatusChange: false,
  });

  const collections = useMemo<IPokemonCollection[] | IMagicCollection[]>(() => {
    if (isPokemon) {
      return (pokemonCollectionsData?.pokemonCardCollections ?? []).map(
        (c) =>
          ({
            guid: c.guid,
            name: c.name,
            code: c.code ?? null,
          }) as IPokemonCollection
      );
    }
    return (magicCollectionsData?.magicCardCollections ?? []).map(
      (c) =>
        ({
          guid: c.guid,
          name: c.name,
          code: c.code ?? null,
          editionIconUri: c.editionIconUri ?? null,
        }) as IMagicCollection
    );
  }, [isPokemon, pokemonCollectionsData, magicCollectionsData]);

  const rarities = useMemo<string[]>(
    () => (isPokemon ? (pokemonRaritiesData?.pokemonCardRarities ?? []) : []),
    [isPokemon, pokemonRaritiesData]
  );

  return { collections, rarities };
}
