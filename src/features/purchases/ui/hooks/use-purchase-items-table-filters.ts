import { useCallback, useEffect, useMemo, useState } from 'react';

import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { CardCondition, IPurchaseItem } from '../../domain/types';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';

interface SelectOption {
  value: string;
  label: string;
}

interface UsePurchaseItemsTableFiltersReturn {
  search: string;
  setSearch: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  filteredItems: IPurchaseItem[];
  paginatedItems: IPurchaseItem[];
  totalPages: number;
  languageOptions: SelectOption[];
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

const matchesSearch = (item: IPurchaseItem, term: string): boolean => {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return true;
  return [
    item.cardName,
    item.setName,
    item.setCode,
    item.cardNumber,
    item.collectorNumber,
  ].some((field) => field?.toLowerCase().includes(normalized));
};

export function usePurchaseItemsTableFilters(
  items: IPurchaseItem[]
): UsePurchaseItemsTableFiltersReturn {
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [language, setLanguage] = useState('');
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          matchesSearch(item, search) &&
          (!condition || item.condition === (condition as CardCondition)) &&
          (!language || item.language === language)
      ),
    [items, search, condition, language]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / DEFAULT_PAGE_SIZE)
  );

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return filteredItems.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [filteredItems, page]);

  const languageOptions = useMemo(() => {
    const languages = [...new Set(items.map((item) => item.language))];
    return languages.map((lang) => ({
      value: lang,
      label: LANGUAGE_LABELS[lang] ?? lang,
    }));
  }, [items]);

  const hasActiveFilters = !!(search || condition || language);

  const resetFilters = useCallback(() => {
    setSearch('');
    setCondition('');
    setLanguage('');
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, condition, language]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return {
    search,
    setSearch,
    condition,
    setCondition,
    language,
    setLanguage,
    page,
    setPage,
    filteredItems,
    paginatedItems,
    totalPages,
    languageOptions,
    hasActiveFilters,
    resetFilters,
  };
}
