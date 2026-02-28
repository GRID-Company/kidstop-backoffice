import { useState, useCallback, useMemo } from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';

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
import { UsersQuery } from '@/lib/api/generated/users.generated';

type UserRow = NonNullable<NonNullable<UsersQuery['users']['data']>[number]>;

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>();
  const [filters, setFilters] = useState<UserFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  const { users, loading, creating, updating, toggleUserStatus, createUser, updateUser } =
    useUsers(page, search, filters);

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      setPage(1);
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

  const handleSearchChange = useCallback((value?: string) => {
    setPage(1);
    setSearch(value);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingUser(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((user: UserRow) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: UserFormData) => {
      if (editingUser) {
        await updateUser(editingUser.guid, data);
      } else {
        await createUser(data);
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
      customCol: (row: UserRow) => row.name ?? 'Sin nombre',
    },
    {
      key: 'emailAddress',
      label: 'Correo electrónico',
      allowSorting: true,
    },
    {
      key: 'role',
      label: 'Rol',
      customCol: (row: UserRow) => <UserRoleBadge role={row.role as UserRole} />,
    },
    {
      key: 'activated',
      label: 'Estado',
      customCol: (row: UserRow) => <UserStatusBadge activated={row.activated} />,
    },
    {
      key: 'actions',
      label: '',
      className: 'w-12',
      customCol: (row: UserRow) => (
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
              onPress={() => toggleUserStatus(row.guid, row.activated)}
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
              onSearchChange={handleSearchChange}
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
        loading={creating || updating}
      />
    </>
  );
}
