import {
  GetChapesQueryVariables,
  GetGlassesQueryVariables,
  GetProfileVariantsQueryVariables,
} from '@/lib/api/generated/inventory.generated';
import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import {
  SortFn,
  SearchFn,
  FilterFn,
} from '@/lib/types/paginated-datatable.types';
import { SortDescriptor } from '@heroui/react';

export const defaultSort = {
  column: 'createdDate',
  order: 'DESC',
};

export interface InventoryListProps<T> {
  data: T[];
  loading: boolean;
  sortDescriptor: SortDescriptor;
  onSortChange: SortFn;
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
}

export const getProfilesVars = (
  args: IPaginatedApiArgs,
  branchOfficeGuid: string
): GetProfileVariantsQueryVariables => {
  return {
    findProfilesArgs: {
      ...args,
      filters: {
        branchOfficeGuid: branchOfficeGuid,
      },
    },
  };
};

export const getChapesVars = (
  args: IPaginatedApiArgs,
  branchOfficeGuid: string
): GetChapesQueryVariables => {
  return {
    findChapesArgs: {
      ...args,
      filters: {
        branchOfficeGuid: branchOfficeGuid,
      },
    },
  };
};

export const getGlassesVars = (
  args: IPaginatedApiArgs,
  branchOfficeGuid: string
): GetGlassesQueryVariables => {
  return {
    findGlassesArgs: {
      ...args,
      filters: {
        branchOfficeGuid: branchOfficeGuid,
      },
    },
  };
};
