import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useDebounce } from '@/lib/hooks/use-debounce';

import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import {
  PokemonCardInternalListDocument,
  PokemonCardCollectionsDocument,
  PokemonCardRaritiesDocument,
  PokemonCardVariantsDocument,
  PokemonCardGenresDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';
import {
  MagicCardInternalListDocument,
  MagicCardCollectionsDocument,
  MagicCardRaritiesDocument,
} from '@/lib/api/generated/catalog-magic.generated';
import {
  PokemonCatalogFilters,
  MagicCatalogFilters,
  IPokemonCollection,
  IMagicCollection,
} from '@/features/catalog/domain/types';
import { ICardSearchResult } from '../../domain/types';

export function useCardSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 800);
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const [filters, setFilters] = useState<PokemonCatalogFilters | MagicCatalogFilters>({});
  const [resetKey, setResetKey] = useState(0);

  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  const pokemonFilters = isPokemon ? (filters as PokemonCatalogFilters) : undefined;
  const magicFilters = !isPokemon ? (filters as MagicCatalogFilters) : undefined;

  const { data: pokemonData, loading: pokemonLoading } = useQuery(
    PokemonCardInternalListDocument,
    {
      variables: {
        findPokemonCardsPublicArgs: {
          skip: 0,
          limit: 5,
          sort: { column: 'name', order: 'ASC' },
          search: debouncedSearch.trim() || undefined,
          filters: {
            rarity: pokemonFilters?.rarity || undefined,
            condition: pokemonFilters?.condition || undefined,
            set: pokemonFilters?.set || undefined,
            variant: pokemonFilters?.variant || undefined,
            genre: pokemonFilters?.genre || undefined,
          },
        },
      },
      skip: selectedTCG !== TCG_TYPES.POKEMON || !debouncedSearch.trim(),
    }
  );

  const { data: magicData, loading: magicLoading } = useQuery(
    MagicCardInternalListDocument,
    {
      variables: {
        findMagicCardsPublicArgs: {
          skip: 0,
          limit: 5,
          sort: { column: 'name', order: 'ASC' },
          search: debouncedSearch.trim() || undefined,
          filters: {
            edition: magicFilters?.edition || undefined,
            rarity: magicFilters?.rarity || undefined,
            isFoil: magicFilters?.isFoil ?? undefined,
            condition: magicFilters?.condition || undefined,
            stockStatus: magicFilters?.stockStatus || undefined,
          },
        },
      },
      skip: selectedTCG !== TCG_TYPES.MAGIC || !debouncedSearch.trim(),
    }
  );

  const { data: pokemonCollectionsData } = useQuery(PokemonCardCollectionsDocument, {
    fetchPolicy: 'cache-first',
    skip: !isPokemon,
  });

  const { data: pokemonRaritiesData } = useQuery(PokemonCardRaritiesDocument, {
    fetchPolicy: 'cache-first',
    skip: !isPokemon,
  });

  const { data: pokemonVariantsData } = useQuery(PokemonCardVariantsDocument, {
    fetchPolicy: 'cache-first',
    skip: !isPokemon,
  });

  const { data: pokemonGenresData } = useQuery(PokemonCardGenresDocument, {
    fetchPolicy: 'cache-first',
    skip: !isPokemon,
  });

  const { data: magicCollectionsData } = useQuery(MagicCardCollectionsDocument, {
    fetchPolicy: 'cache-first',
    skip: isPokemon,
  });

  const { data: magicRaritiesData } = useQuery(MagicCardRaritiesDocument, {
    fetchPolicy: 'cache-first',
    skip: isPokemon,
  });

  const collections: IPokemonCollection[] | IMagicCollection[] = useMemo(() => {
    if (isPokemon) {
      return (pokemonCollectionsData?.pokemonCardCollections ?? []).map((c) => ({
        guid: c.guid,
        name: c.name,
        code: c.code ?? null,
      }));
    }
    return (magicCollectionsData?.magicCardCollections ?? []).map((c) => ({
      guid: c.guid,
      name: c.name,
      editionIconUri: c.editionIconUri ?? null,
    }));
  }, [isPokemon, pokemonCollectionsData, magicCollectionsData]);

  const rarities: string[] = useMemo(() => {
    if (isPokemon) return pokemonRaritiesData?.pokemonCardRarities ?? [];
    return magicRaritiesData?.magicCardRarities ?? [];
  }, [isPokemon, pokemonRaritiesData, magicRaritiesData]);

  const variants: string[] = pokemonVariantsData?.pokemonCardVariants ?? [];
  const genres: string[] = pokemonGenresData?.pokemonCardGenres ?? [];

  const results = useMemo(() => {
    if (!debouncedSearch.trim()) return [];

    if (selectedTCG === TCG_TYPES.POKEMON) {
      if (!pokemonData?.pokemonCardInternalList?.data) return [];

      return pokemonData.pokemonCardInternalList.data.map((card): ICardSearchResult => ({
        guid: card.guid,
        name: card.name,
        setName: card.setName || '',
        setCode: card.setCode || '',
        number: '',
        rarity: '',
        imageUrl: card.imageUri || '',
        tcgType: TCG_TYPES.POKEMON,
        metrics: {
          referencePrice: card.sellPrice || 0,
          currentStock: card.availableStock ? 1 : 0,
          lastSaleDate: null,
          daysInInventory: 0,
          wishlistCount: 0,
        },
      }));
    }

    if (selectedTCG === TCG_TYPES.MAGIC) {
      if (!magicData?.magicCardInternalList?.data) return [];

      return magicData.magicCardInternalList.data.map((card): ICardSearchResult => ({
        guid: card.guid,
        name: card.name,
        setName: card.edition || '',
        setCode: '',
        number: card.collectorNumber || '',
        rarity: '',
        imageUrl: card.imageUri || '',
        tcgType: TCG_TYPES.MAGIC,
        metrics: {
          referencePrice: card.sellPrice || 0,
          currentStock: card.availableStock ? 1 : 0,
          lastSaleDate: null,
          daysInInventory: 0,
          wishlistCount: 0,
        },
      }));
    }

    return [];
  }, [debouncedSearch, selectedTCG, pokemonData, magicData]);

  const handleFilterChange = useCallback((key: string, value: string | boolean) => {
    setFilters((prev) => {
      if (value === '') {
        const next = { ...prev };
        delete next[key as keyof typeof next];
        return next;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setResetKey((k) => k + 1);
  }, []);

  const resetSearch = useCallback(() => {
    setSearch('');
    resetFilters();
  }, [resetFilters]);

  const activeFilterCount = Object.keys(filters).filter(
    (k) => k !== 'sortBy' && k !== 'sortOrder'
  ).length;
  const hasActiveFilters = activeFilterCount > 0;

  return {
    search,
    setSearch,
    results,
    resetSearch,
    selectedTCG,
    loading: isPokemon ? pokemonLoading : magicLoading,
    filters,
    handleFilterChange,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    resetKey,
    collections,
    rarities,
    variants,
    genres,
  };
}
