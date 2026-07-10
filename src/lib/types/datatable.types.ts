import { ReactNode } from 'react';

export interface ITableColumn {
  key: string;
  label: string;
  allowSorting?: boolean;
  className?: string;
  customCol?: (row: Record<string, unknown>) => ReactNode;
}

export interface ITableSort {
  order: string;
  column: string;
}

export interface IPaginatedApiArgs {
  skip: number;
  limit: number;
  sort: ITableSort;
  filters?: Record<string, unknown>;
  search?: string;
}

export interface InfiniteScrollData<T> {
  count: number;
  data: Array<T>;
}

export const DEFAULT_LIMIT = 0;
