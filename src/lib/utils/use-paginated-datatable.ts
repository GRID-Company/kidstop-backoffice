import { SortDescriptor } from '@heroui/react';
import { type Key, useCallback, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_LIMIT,
  IPaginatedApiArgs,
  ITableSort,
} from '../types/datatable.types';

interface IUsePaginatedDatatable {
  defaultSort: ITableSort;
  defaultFilters?: any;
  onFiltersChange?: () => void;
}

export const usePaginatedDatatable = ({
  defaultSort,
  defaultFilters,
  onFiltersChange,
}: IUsePaginatedDatatable) => {
  const defaultArgs: IPaginatedApiArgs = useMemo(
    () => ({
      skip: 0,
      limit: DEFAULT_LIMIT,
      sort: defaultSort,
      filters: defaultFilters,
    }),
    [defaultSort, defaultFilters]
  );

  const filtersMap = useRef(new Map());
  const searchTimeout = useRef<any>(null);

  const [paginatedArgs, setPaginatedArgs] =
    useState<IPaginatedApiArgs>(defaultArgs);

  const [currentPage, setCurrentPage] = useState(1);

  const [tableSort, setTableSort] = useState<SortDescriptor>({
    column: defaultSort.column,
    direction: defaultSort.order === 'DESC' ? 'descending' : 'ascending',
  });

  // EMIT UPDATED FILTERS LIST CHANGE THROUGH PAGINATED ARGS
  const setArgsAfterFilterUpdate = () => {
    if (onFiltersChange !== undefined) onFiltersChange();
    if (filtersMap.current.size > 0 || defaultFilters !== null) {
      setPaginatedArgs({
        ...paginatedArgs,
        skip: 0,
        filters: {
          ...Object.fromEntries(filtersMap.current.entries()),
          ...defaultFilters,
        },
      });
    } else if (paginatedArgs.filters !== undefined) {
      const { filters, ...newArgs } = paginatedArgs;
      setPaginatedArgs({ ...newArgs, skip: 0 });
    }
    setCurrentPage(1);
  };

  // ADD SIMPLE FILTER TO FILTERS MAP, THEN EMIT UPDATED FILTERS LIST
  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      if (value === '') filtersMap.current.delete(key);
      if (value !== '') filtersMap.current.set(key, value);
      setArgsAfterFilterUpdate();
    },
    []
  );

  // ADD RELATIONAL FILTER TO FILTERS MAP, THEN EMIT UPDATED FILTERS LIST
  const handleFilterSingleRelation = useCallback(
    (key: string, relationKey: string, value: string | Key) => {
      if (value === '') filtersMap.current.delete(key);
      if (value !== '')
        filtersMap.current.set(key, {
          filterType: ':single_relation:',
          relationKey,
          value,
        });
      setArgsAfterFilterUpdate();
    },
    []
  );

  // ADD MULTIPLE RELATIONAL FILTER TO FILTERS MAP, THEN EMIT UPDATED FILTERS LIST
  const handleFilterMultipleRelations = useCallback(
    (key: string, relationKey: string, value: string[] | Key[]) => {
      if (value.length === 0) filtersMap.current.delete(key);
      if (value.length > 0)
        filtersMap.current.set(key, {
          filterType: ':multiple_relations:',
          values: value,
          relationKey,
        });
      setArgsAfterFilterUpdate();
    },
    []
  );

  // ADD DATERANGE FILTER TO FILTERS MAP, THEN EMIT UPDATED FILTERS LIST
  const handleFilterDateRange = useCallback(
    (key: string, value: any | null) => {
      if (value === null) filtersMap.current.delete(key);
      if (value !== null)
        filtersMap.current.set(key, {
          filterType: ':daterange:',
          range: {
            from: value.from?.toISOString(),
            to: value.to?.toISOString(),
          },
        });
      setArgsAfterFilterUpdate();
    },
    []
  );

  // ADD DATERANGE FILTER TO FILTERS MAP, THEN EMIT UPDATED FILTERS LIST
  const handleFilterNumericRange = useCallback(
    (key: string, value: any | null) => {
      if (value === null) filtersMap.current.delete(key);
      if (value !== null)
        filtersMap.current.set(key, {
          filterType: ':numericrange:',
          range: {
            from: Number(value.from),
            to: value.to ? Number(value.to) : null,
          },
        });
      setArgsAfterFilterUpdate();
    },
    []
  );

  // ADD RELATIONAL DATERANGE FILTER TO FILTERS MAP, THEN EMIT UPDATED FILTERS LIST
  const handleFilterRelationDateRange = useCallback(
    (key: string, relationKey: string, value: any | null) => {
      if (value === null) filtersMap.current.delete(key);
      if (value !== null)
        filtersMap.current.set(key, {
          filterType: ':relation_daterange:',
          relationKey,
          range: {
            from: value.from?.toISOString(),
            to: value.to?.toISOString(),
          },
        });
      setArgsAfterFilterUpdate();
    },
    []
  );

  // HANDLE SEARCH INPUT AND UPDATE PAGINATED ARGS RIGHT AFTER
  const handleSearchChange = useCallback((search: string) => {
    if (searchTimeout.current !== null) {
      clearInterval(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      if (onFiltersChange !== undefined) onFiltersChange();
      if (search !== '') {
        setCurrentPage(1);
        setPaginatedArgs({ ...paginatedArgs, search, skip: 0 });
        return;
      }
      if (paginatedArgs.search !== undefined) {
        const { search, ...newArgs } = paginatedArgs;
        setPaginatedArgs(newArgs);
      }
    }, 250);
  }, []);

  // HANDLE LIMIT CHANGE THEN UPDATE PAGINATED ARGS
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const newSkip = (page - 1) * paginatedArgs.limit;
    setPaginatedArgs({ ...paginatedArgs, skip: newSkip });
  }, []);

  // HANDLE SORT CHANGE THEN UPDATE PAGINATED ARGS
  const handleSortChange = useCallback((tableSort: SortDescriptor) => {
    if (onFiltersChange !== undefined) onFiltersChange();
    setTableSort(tableSort);
    const dir = tableSort.direction === 'ascending' ? 'ASC' : 'DESC';
    setCurrentPage(1);
    setPaginatedArgs({
      ...paginatedArgs,
      sort: { column: tableSort.column as string, order: dir },
      skip: 0,
    });
  }, []);

  return {
    paginatedArgs,
    currentPage,
    tableSort,
    setCurrentPage,
    setTableSort,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleFilterDateRange,
    handleFilterMultipleRelations,
    handleFilterSingleRelation,
    handleFilterRelationDateRange,
    handleFilterNumericRange,
  };
};
