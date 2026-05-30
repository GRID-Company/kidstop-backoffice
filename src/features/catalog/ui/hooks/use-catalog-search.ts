import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { DocumentNode } from 'graphql';

export interface CatalogFilters {
  [key: string]: string | boolean | undefined;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface UseCatalogSearchProps {
  listDocument: DocumentNode;
  collectionsDocument: DocumentNode;
  raritiesDocument: DocumentNode;
  variantsDocument?: DocumentNode;
  genresDocument?: DocumentNode;
  getVarsFunction: (page: number, search: string, filters: CatalogFilters) => any;
  mapCardFunction: (card: any) => any;
  mapCollectionFunction: (collection: any) => any;
  skip?: boolean;
}

export function useCatalogSearch({
  listDocument,
  collectionsDocument,
  raritiesDocument,
  variantsDocument,
  genresDocument,
  getVarsFunction,
  mapCardFunction,
  mapCollectionFunction,
  skip = false,
}: UseCatalogSearchProps) {
  const [page, setPage] = useState(1);
  const [search, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [resetKey, setResetKey] = useState(0);

  const vars = getVarsFunction(page, search, filters);

  const { data, loading } = useQuery(listDocument, {
    variables: vars,
    fetchPolicy: 'cache-and-network',
    skip,
    notifyOnNetworkStatusChange: true,
  });

  const { data: collectionsData, loading: collectionsLoading } = useQuery(
    collectionsDocument,
    { 
      fetchPolicy: 'cache-first',
      skip,
      notifyOnNetworkStatusChange: false,
    }
  );

  const { data: raritiesData, loading: raritiesLoading } = useQuery(
    raritiesDocument,
    { 
      fetchPolicy: 'cache-first',
      skip,
      notifyOnNetworkStatusChange: false,
    }
  );

  const { data: variantsData } = useQuery(variantsDocument || listDocument, {
    fetchPolicy: 'cache-first',
    skip: !variantsDocument || skip,
    notifyOnNetworkStatusChange: false,
  });

  const { data: genresData } = useQuery(genresDocument || listDocument, {
    fetchPolicy: 'cache-first',
    skip: !genresDocument || skip,
    notifyOnNetworkStatusChange: false,
  });

  // Extract cards from data - assumes data has a key like 'pokemonCardInternalList' or 'magicCardInternalList'
  const dataKey = Object.keys(data || {}).find(
    (key) => key.includes('InternalList') || key.includes('CardList')
  );
  const cardData = dataKey ? (data as any)?.[dataKey] : null;
  const cards = useMemo(() => {
    if (!cardData?.data) return [];
    return cardData.data.map(mapCardFunction);
  }, [cardData, mapCardFunction]);

  const totalCount = cardData?.count ?? 0;
  const DEFAULT_PAGE_SIZE = 20;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  // Extract collections from data
  const collectionsKey = Object.keys(collectionsData || {}).find(
    (key) => key.includes('Collections') || key.includes('Editions')
  );
  const collectionsRaw = collectionsKey ? (collectionsData as any)?.[collectionsKey] : [];
  const collections = useMemo(
    () => collectionsRaw?.map(mapCollectionFunction) ?? [],
    [collectionsRaw, mapCollectionFunction]
  );

  // Extract rarities
  const raritiesKey = Object.keys(raritiesData || {}).find(
    (key) => key.includes('Rarities') || key.includes('Rarity')
  );
  const rarities = useMemo(
    () => (raritiesKey ? (raritiesData as any)?.[raritiesKey] : []) ?? [],
    [raritiesData, raritiesKey]
  );

  // Extract variants
  const variantsKey = Object.keys(variantsData || {}).find(
    (key) => key.includes('Variants') || key.includes('Variant')
  );
  const variants = useMemo(
    () => (variantsKey ? (variantsData as any)?.[variantsKey] : []) ?? [],
    [variantsData, variantsKey]
  );

  // Extract genres
  const genresKey = Object.keys(genresData || {}).find(
    (key) => key.includes('Genres') || key.includes('Genre')
  );
  const genres = useMemo(
    () => (genresKey ? (genresData as any)?.[genresKey] : []) ?? [],
    [genresData, genresKey]
  );

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
        delete next[key as keyof CatalogFilters];
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
    variants,
    genres,
  };
}
