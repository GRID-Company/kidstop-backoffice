import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../../domain/constants';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';

interface UserFiltersProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
}

export default function UserFilters({
  onSearchChange,
  onFilterChange,
}: UserFiltersProps) {
  return (
    <>
      <Search
        label='Búsqueda'
        placeholder='Nombre o correo electrónico'
        onValueChange={onSearchChange}
        data-testid='users-search-input'
      />
      <Select
        placeholder='Todos los roles'
        label='Rol'
        items={USER_ROLE_OPTIONS}
        data-testid='users-filter-role'
        onChange={(e) => {
          onFilterChange('role', e.target.value !== '' ? e.target.value : '');
        }}
      />
      <Select
        placeholder='Todos los estados'
        label='Estado'
        items={USER_STATUS_OPTIONS}
        data-testid='users-filter-status'
        onChange={(e) => {
          const value = e.target.value;
          if (value === '') {
            onFilterChange('active', '');
            return;
          }
          onFilterChange('active', value === 'true');
        }}
      />
    </>
  );
}
