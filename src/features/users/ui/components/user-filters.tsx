import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { USER_ROLES, USER_ROLE_LABELS } from '../../domain/constants';
import { SearchFn, FilterFn } from '@/lib/types/paginated-datatable.types';

interface UserFiltersProps {
  onSearchChange: SearchFn;
  onFilterChange: FilterFn;
}

const ROLE_OPTIONS = Object.values(USER_ROLES).map((role) => ({
  value: role,
  label: USER_ROLE_LABELS[role],
}));

const STATUS_OPTIONS = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
];

export default function UserFilters({
  onSearchChange,
  onFilterChange,
}: UserFiltersProps) {
  return (
    <>
      <Search
        label="Búsqueda"
        placeholder="Nombre o correo electrónico"
        onValueChange={onSearchChange}
      />
      <Select
        placeholder="Todos los roles"
        label="Rol"
        items={ROLE_OPTIONS}
        onChange={(e) => {
          onFilterChange('role', e.target.value !== '' ? e.target.value : '');
        }}
      />
      <Select
        placeholder="Todos los estados"
        label="Estado"
        items={STATUS_OPTIONS}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '') {
            onFilterChange('activated', '');
            return;
          }
          onFilterChange('activated', value === 'true');
        }}
      />
    </>
  );
}
