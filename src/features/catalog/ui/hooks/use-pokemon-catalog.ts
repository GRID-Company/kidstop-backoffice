import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  PokemonCardInternalListDocument,
  PokemonCardCollectionsDocument,
  PokemonCardRaritiesDocument,
  PokemonCardVariantsDocument,
  PokemonCardGenresDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';
import { getPokemonCatalogVars } from '../../domain/pokemon-catalog.domain';
import { toPokemonCard } from '../../adapters/mappers/card.mapper';
import { PokemonCatalogFilters, IPokemonCard, IPokemonCollection } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';

export function usePokemonCatalog() {
  const [page, setPage] = useState(1);
  const [search, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PokemonCatalogFilters>({});
  const [resetKey, setResetKey] = useState(0);

  const vars = getPokemonCatalogVars(page, search, filters);

  const { data, loading } = useQuery(PokemonCardInternalListDocument, {
    variables: vars,
    fetchPolicy: 'cache-and-network',
  });

  const { data: collectionsData, loading: collectionsLoading } = useQuery(
    PokemonCardCollectionsDocument,
    { fetchPolicy: 'cache-first' }
  );

  const { data: raritiesData, loading: raritiesLoading } = useQuery(
    PokemonCardRaritiesDocument,
    { fetchPolicy: 'cache-first' }
  );

  const { data: variantsData } = useQuery(PokemonCardVariantsDocument, {
    fetchPolicy: 'cache-first',
  });

  const { data: genresData } = useQuery(PokemonCardGenresDocument, {
    fetchPolicy: 'cache-first',
  });

  const cards: IPokemonCard[] = (data?.pokemonCardInternalList.data ?? []).map(toPokemonCard);
  const totalCount = data?.pokemonCardInternalList.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));

  const collections: IPokemonCollection[] = (collectionsData?.pokemonCardCollections ?? []).map(
    (c) => ({ guid: c.guid, name: c.name, code: c.code ?? null })
  );

  const rarities: string[] = raritiesData?.pokemonCardRarities ?? [];
  const variants: string[] = variantsData?.pokemonCardVariants ?? [];
  const genres: string[] = genresData?.pokemonCardGenres ?? [];

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
        delete next[key as keyof PokemonCatalogFilters];
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

  const hasActiveFilters = search.trim() !== '' || Object.keys(filters).length > 0;
  const activeFilterCount = Object.keys(filters).filter(
    (k) => k !== 'sortBy' && k !== 'sortOrder'
  ).length;

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
