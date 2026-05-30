import {
  MagicCardInternalListDocument,
  MagicCardCollectionsDocument,
  MagicCardRaritiesDocument,
} from '@/lib/api/generated/catalog-magic.generated';
import { getMagicCatalogVars } from '../../domain/magic-catalog.domain';
import { toMagicCard } from '../../adapters/mappers/card.mapper';
import { IMagicCollection } from '../../domain/types';
import { useCatalogSearch } from './use-catalog-search';

export function useMagicCatalog(skip = false) {
  const result = useCatalogSearch({
    listDocument: MagicCardInternalListDocument,
    collectionsDocument: MagicCardCollectionsDocument,
    raritiesDocument: MagicCardRaritiesDocument,
    getVarsFunction: getMagicCatalogVars,
    mapCardFunction: toMagicCard,
    mapCollectionFunction: (c: any) => ({ guid: c.guid, name: c.name, editionIconUri: c.editionIconUri ?? null }) as IMagicCollection,
    skip,
  });

  return result;
}
