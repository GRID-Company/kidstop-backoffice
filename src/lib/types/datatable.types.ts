import { ReactNode } from 'react';

export interface ITableColumn {
  key: string;
  label: string;
  allowSorting?: boolean;
  className?: string;
  customCol?: (row: any) => ReactNode;
}

export interface ITableSort {
  order: string;
  column: string;
}

export interface IPaginatedApiArgs {
  skip: number;
  limit: number;
  sort: ITableSort;
  filters?: any;
  search?: string;
}

export interface InfiniteScrollData<T> {
  count: number;
  data: Array<T>;
}

export const DEFAULT_LIMIT = 0;
