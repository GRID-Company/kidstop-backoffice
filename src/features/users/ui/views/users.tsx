import { useState, useCallback, useMemo } from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { User } from '@/lib/api/schema-types';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import { ITableColumn } from '@/lib/types/datatable.types';

import UserFiltersPanel from '../components/user-filters';
import UserFormModal from '../components/user-form-modal';
import UserRoleBadge from '../components/user-role-badge';
import UserStatusBadge from '../components/user-status-badge';
import { useUsers } from '../hooks/use-users';
import { UserFormData } from '../../adapters/forms/user-form.schema';
import { toUserFormDefaults } from '../../adapters/mappers/user.mapper';
import { UserFilters, UserRole } from '../../domain/types';

export default function Users() {
  const [search, setSearch] = useState<string | undefined>();
  const [filters, setFilters] = useState<UserFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { users, loading, toggleUserStatus, createUser, updateUser } =
    useUsers(search, filters);

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      if (value === '') {
        setFilters((prev) => {
          const next = { ...prev };
          delete next[key as keyof UserFilters];
          return next;
        });
        return;
      }

      if (key === 'activated') {
        setFilters((prev) => ({ ...prev, activated: value as boolean }));
        return;
      }

      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleOpenCreate = useCallback(() => {
    setEditingUser(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
  }, []);

  const handleSubmit = useCallback(
    (data: UserFormData) => {
      if (editingUser) {
        updateUser(editingUser.guid, {
          name: data.name,
          emailAddress: data.emailAddress,
          role: data.role,
          activated: data.activated,
        });
      } else {
        createUser({
          name: data.name,
          emailAddress: data.emailAddress,
          role: data.role,
          activated: data.activated,
        });
      }
      handleCloseModal();
    },
    [editingUser, createUser, updateUser, handleCloseModal]
  );

  const COLS: ITableColumn[] = useMemo(() => [
    {
      key: 'name',
      label: 'Nombre',
      allowSorting: true,
      customCol: (row: User) => row.name ?? 'Sin nombre',
    },
    {
      key: 'emailAddress',
      label: 'Correo electrónico',
      allowSorting: true,
    },
    {
      key: 'role',
      label: 'Rol',
      customCol: (row: User) => <UserRoleBadge role={row.role as UserRole} />,
    },
    {
      key: 'activated',
      label: 'Estado',
      customCol: (row: User) => <UserStatusBadge activated={row.activated} />,
    },
    {
      key: 'actions',
      label: '',
      className: 'w-12',
      customCol: (row: User) => (
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm" isIconOnly>
              <Icon icon="lucide:more-horizontal" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Acciones de usuario">
            <DropdownItem
              key="edit"
              startContent={<Icon icon="lucide:pencil" />}
              onPress={() => handleOpenEdit(row)}
            >
              Editar
            </DropdownItem>
            <DropdownItem
              key="toggle-status"
              startContent={
                <Icon
                  icon={
                    row.activated
                      ? 'lucide:user-x'
                      : 'lucide:user-check'
                  }
                />
              }
              onPress={() => toggleUserStatus(row.guid)}
              className={row.activated ? 'text-danger' : 'text-success'}
            >
              {row.activated ? 'Desactivar' : 'Activar'}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ], [handleOpenEdit, toggleUserStatus]);

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Usuarios">
          <EntitiesPage.FlexRow>
            <AddNewButton label="Nuevo usuario" onPress={handleOpenCreate} />
          </EntitiesPage.FlexRow>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className="mb-4 flex items-center gap-4">
            <UserFiltersPanel
              onSearchChange={setSearch}
              onFilterChange={handleFilterChange}
            />
          </div>

          <DataTable
            cols={COLS}
            data={users}
            isLoading={loading}
          />
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        defaults={editingUser ? toUserFormDefaults(editingUser) : undefined}
        title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
        submitLabel={editingUser ? 'Actualizar' : 'Guardar'}
      />
    </>
  );
}
