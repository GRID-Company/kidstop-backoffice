import {
  PokemonCardInternalListDocument,
  PokemonCardCollectionsDocument,
  PokemonCardRaritiesDocument,
  PokemonCardVariantsDocument,
  PokemonCardGenresDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';
import { getPokemonCatalogVars } from '../../domain/pokemon-catalog.domain';
import { toPokemonCard } from '../../adapters/mappers/card.mapper';
import { IPokemonCollection } from '../../domain/types';
import { useCatalogSearch } from './use-catalog-search';

export function usePokemonCatalog(skip = false) {
  const result = useCatalogSearch({
    listDocument: PokemonCardInternalListDocument,
    collectionsDocument: PokemonCardCollectionsDocument,
    raritiesDocument: PokemonCardRaritiesDocument,
    variantsDocument: PokemonCardVariantsDocument,
    genresDocument: PokemonCardGenresDocument,
    getVarsFunction: getPokemonCatalogVars,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapCardFunction: toPokemonCard as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapCollectionFunction: (c: any) =>
      ({
        guid: c.guid,
        name: c.name,
        code: c.code ?? null,
      }) as IPokemonCollection,
    skip,
  });

  return result;
}
