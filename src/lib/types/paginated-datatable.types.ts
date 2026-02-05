import { SortDescriptor } from '@heroui/react';

export type SearchFn = (search: string) => void;
export type FilterFn = (key: string, value: string | boolean) => void;
export type SortFn = (sort: SortDescriptor) => void;
