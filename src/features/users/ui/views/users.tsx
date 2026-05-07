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
import ConfirmationModal from '@/shared/blocks/confirmation-modal/confirmation-modal';

import UserFiltersPanel from '../components/user-filters';
import UserFormModal from '../components/user-form-modal';
import UserRoleBadge from '../components/user-role-badge';
import UserStatusBadge from '../components/user-status-badge';
import { useUsers } from '../hooks/use-users';
import { UserFormData } from '../../adapters/forms/user-form.schema';
import { toUserFormDefaults } from '../../adapters/mappers/user.mapper';
import { UserFilters, UserRole } from '../../domain/types';
import { UsersQuery } from '@/lib/api/generated/users.generated';
import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';
import { DEFAULT_PAGE_SIZE } from '../../domain/constants';

type UserRow = NonNullable<NonNullable<UsersQuery['users']['data']>[number]>;

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>();
  const [filters, setFilters] = useState<UserFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [toggleTarget, setToggleTarget] = useState<UserRow | null>(null);
  const [resendTarget, setResendTarget] = useState<UserRow | null>(null);

  const { users, totalCount, loading, creating, updating, deleting, resending, toggleUserStatus, createUser, updateUser, deleteUser, resendEmailInvite } =
    useUsers(page, search, filters);

  const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE);

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

      if (key === 'active') {
        setFilters((prev) => ({ ...prev, active: value as boolean }));
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

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteUser(deleteTarget.guid);
    setDeleteTarget(null);
  }, [deleteTarget, deleteUser]);

  const handleConfirmToggle = useCallback(async () => {
    if (!toggleTarget) return;
    await toggleUserStatus(toggleTarget.guid, toggleTarget.active);
    setToggleTarget(null);
  }, [toggleTarget, toggleUserStatus]);

  const handleConfirmResend = useCallback(async () => {
    if (!resendTarget) return;
    await resendEmailInvite(resendTarget.guid);
    setResendTarget(null);
  }, [resendTarget, resendEmailInvite]);

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
      key: 'active',
      label: 'Estado',
      customCol: (row: UserRow) => <UserStatusBadge active={row.active} />,
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
              startContent={<Icon icon={row.active ? 'lucide:user-x' : 'lucide:user-check'} />}
              onPress={() => setToggleTarget(row)}
              className={row.active ? 'text-warning' : 'text-success'}
            >
              {row.active ? 'Desactivar' : 'Activar'}
            </DropdownItem>
            {!row.signedUp ? (
              <DropdownItem
                key="resend-invite"
                startContent={<Icon icon="lucide:mail" />}
                onPress={() => setResendTarget(row)}
                className="text-primary"
              >
                Reenviar invitación
              </DropdownItem>
            ) : null}
            <DropdownItem
              key="delete"
              startContent={<Icon icon="lucide:trash-2" />}
              onPress={() => setDeleteTarget(row)}
              className="text-danger"
              color="danger"
            >
              Eliminar
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ], [handleOpenEdit]);

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

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <KidstopPagination
                total={totalPages}
                page={page}
                onChange={setPage}
              />
            </div>
          )}
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

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar usuario"
        message={`¿Estás seguro de que deseas eliminar a ${deleteTarget?.name ?? deleteTarget?.emailAddress}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
      />

      <ConfirmationModal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        title={toggleTarget?.active ? 'Desactivar usuario' : 'Activar usuario'}
        message={
          toggleTarget?.active
            ? `¿Deseas desactivar a ${toggleTarget?.name ?? toggleTarget?.emailAddress}? El usuario no podrá iniciar sesión.`
            : `¿Deseas activar a ${toggleTarget?.name ?? toggleTarget?.emailAddress}?`
        }
        confirmLabel={toggleTarget?.active ? 'Desactivar' : 'Activar'}
        confirmVariant={toggleTarget?.active ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggle}
        isLoading={updating}
      />

      <ConfirmationModal
        isOpen={!!resendTarget}
        onClose={() => setResendTarget(null)}
        title="Reenviar invitación"
        message={`¿Deseas reenviar la invitación a ${resendTarget?.name ?? resendTarget?.emailAddress}? Se enviará un nuevo correo de registro.`}
        confirmLabel="Reenviar"
        confirmVariant="primary"
        onConfirm={handleConfirmResend}
        isLoading={resending}
      />
    </>
  );
}
