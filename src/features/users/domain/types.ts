import { SortDescriptor } from '@heroui/react';
import {
  SortFn,
  SearchFn,
  FilterFn,
} from '@/lib/types/paginated-datatable.types';
import { USER_ROLES, USER_STATUS } from './constants';

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface UserFilters {
  role?: UserRole;
  activated?: boolean;
}

export interface UserListProps<T> {
  data: T[];
  loading: boolean;
  sortDescriptor: SortDescriptor;
  onSortChange: SortFn;
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
}
