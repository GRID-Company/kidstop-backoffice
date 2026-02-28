import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { CombinedGraphQLErrors } from '@apollo/client';
import toast from 'react-hot-toast';
import {
  UsersDocument,
  CreateUserDocument,
  UpdateUserDocument,
  ActivateUserDocument,
  DeactivateUserDocument,
} from '@/lib/api/generated/users.generated';
import { getUsersVars } from '../../domain/users.domain';
import { UserFilters } from '../../domain/types';
import { toCreateUserPayload, toUpdateUserPayload } from '../../adapters/mappers/user.mapper';
import { UserFormData } from '../../adapters/forms/user-form.schema';
import { DEFAULT_USERS_SORT, DEFAULT_PAGE_SIZE } from '../../domain/constants';

export function useUsers(
  page: number,
  search?: string,
  filters?: UserFilters
) {
  const vars = getUsersVars(
    {
      skip: (page - 1) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_USERS_SORT,
      search,
    },
    filters
  );

  const { data, loading } = useQuery(UsersDocument, {
    variables: vars,
    fetchPolicy: 'cache-and-network',
  });

  const [createMutation, { loading: creating }] = useMutation(CreateUserDocument, {
    refetchQueries: [UsersDocument],
  });

  const [updateMutation, { loading: updating }] = useMutation(UpdateUserDocument, {
    refetchQueries: [UsersDocument],
  });

  const [activateMutation] = useMutation(ActivateUserDocument, {
    refetchQueries: [UsersDocument],
  });

  const [deactivateMutation] = useMutation(DeactivateUserDocument, {
    refetchQueries: [UsersDocument],
  });

  const createUser = useCallback(
    async (formData: UserFormData) => {
      try {
        await createMutation({ variables: toCreateUserPayload(formData) });
        toast.success('Usuario creado');
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al crear usuario');
      }
    },
    [createMutation]
  );

  const updateUser = useCallback(
    async (guid: string, formData: UserFormData) => {
      try {
        await updateMutation({ variables: toUpdateUserPayload(formData, guid) });
        toast.success('Usuario actualizado');
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al actualizar usuario');
      }
    },
    [updateMutation]
  );

  const toggleUserStatus = useCallback(
    async (guid: string, currentlyActive: boolean) => {
      try {
        if (currentlyActive) {
          await deactivateMutation({ variables: { guid } });
        } else {
          await activateMutation({ variables: { guid } });
        }
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al cambiar estado del usuario');
      }
    },
    [activateMutation, deactivateMutation]
  );

  return {
    users: data?.users.data ?? [],
    totalCount: data?.users.count ?? 0,
    loading,
    creating,
    updating,
    createUser,
    updateUser,
    toggleUserStatus,
  };
}
