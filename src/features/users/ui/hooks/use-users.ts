import { useCallback, useMemo, useState } from 'react';
import { User } from '@/lib/api/schema-types';
import { MOCK_USERS } from '../../adapters/api/users.mock';
import { UserFilters } from '../../domain/types';

export function useUsers(
  search?: string,
  filters?: UserFilters
) {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading] = useState(false);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search && search.trim() !== '') {
      const term = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.emailAddress.toLowerCase().includes(term)
      );
    }

    if (filters?.role) {
      result = result.filter((u) => u.role === filters.role);
    }

    if (filters?.activated !== undefined) {
      result = result.filter((u) => u.activated === filters.activated);
    }

    return result;
  }, [users, search, filters]);

  const toggleUserStatus = useCallback((guid: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.guid === guid ? { ...u, activated: !u.activated } : u
      )
    );
  }, []);

  const createUser = useCallback((user: Omit<User, 'guid' | 'createdDate' | 'updatedDate'>) => {
    const newUser: User = {
      ...user,
      guid: crypto.randomUUID(),
      createdDate: Date.now(),
      updatedDate: Date.now(),
    };
    setUsers((prev) => [newUser, ...prev]);
  }, []);

  const updateUser = useCallback(
    (guid: string, data: Partial<Pick<User, 'name' | 'emailAddress' | 'role' | 'activated'>>) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.guid === guid ? { ...u, ...data, updatedDate: Date.now() } : u
        )
      );
    },
    []
  );

  return {
    users: filteredUsers,
    count: filteredUsers.length,
    loading,
    toggleUserStatus,
    createUser,
    updateUser,
  };
}
