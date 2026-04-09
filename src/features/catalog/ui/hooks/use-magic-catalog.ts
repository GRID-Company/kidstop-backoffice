import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  MagicCardInternalListDocument,
  MagicCardCollectionsDocument,
  MagicCardRaritiesDocument,
} from '@/lib/api/generated/catalog-magic.generated';
import { getMagicCatalogVars } from '../../domain/magic-catalog.domain';
import { toMagicCard } from '../../adapters/mappers/card.mapper';
import { MagicCatalogFilters, IMagicCard, IMagicCollection } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';

export function useMagicCatalog(skip = false) {
  const [page, setPage] = useState(1);
  const [search, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<MagicCatalogFilters>({});
  const [resetKey, setResetKey] = useState(0);

  const vars = getMagicCatalogVars(page, search, filters);

  const { data, loading } = useQuery(MagicCardInternalListDocument, {
    variables: vars,
    fetchPolicy: 'cache-and-network',
    skip,
  });

  const { data: collectionsData, loading: collectionsLoading } = useQuery(
    MagicCardCollectionsDocument,
    { fetchPolicy: 'cache-first', skip }
  );

  const { data: raritiesData, loading: raritiesLoading } = useQuery(
    MagicCardRaritiesDocument,
    { fetchPolicy: 'cache-first', skip }
  );

  const cards: IMagicCard[] = (data?.magicCardInternalList.data ?? []).map(toMagicCard);
  const totalCount = data?.magicCardInternalList.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  const collections: IMagicCollection[] = (collectionsData?.magicCardCollections ?? []).map(
    (c) => ({ guid: c.guid, name: c.name, editionIconUri: c.editionIconUri ?? null })
  );

  const rarities: string[] = raritiesData?.magicCardRarities ?? [];

  const setSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setPage(1);
    },
    []
  );

  const handleFilterChange = useCallback((key: string, value: string | boolean) => {
    setFilters((prev) => {
      if (value === '') {
        const next = { ...prev };
        delete next[key as keyof MagicCatalogFilters];
        return next;
      }
      return { ...prev, [key]: value };
    });
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sortValue: string) => {
    setFilters((prev) => {
      if (!sortValue) {
        const next = { ...prev };
        delete next.sortBy;
        delete next.sortOrder;
        return next;
      }
      const [column, order] = sortValue.split('_');
      return { ...prev, sortBy: column, sortOrder: order as 'ASC' | 'DESC' };
    });
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({});
    setPage(1);
    setResetKey((k) => k + 1);
  }, []);

  const activeFilterCount = Object.keys(filters).filter(
    (k) => k !== 'sortBy' && k !== 'sortOrder'
  ).length;
  const hasActiveFilters = search.trim() !== '' || activeFilterCount > 0;

  return {
    cards,
    totalCount,
    totalPages,
    page,
    setPage,
    loading,
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleSortChange,
    resetFilters,
    resetKey,
    hasActiveFilters,
    activeFilterCount,
    collections,
    rarities,
    collectionsLoading,
    raritiesLoading,
  };
}
