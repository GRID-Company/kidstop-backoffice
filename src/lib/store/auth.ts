'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/api/schema-types';
import createStorage from '../utils/create-storage.util';

type AuthState = {
  user: User | null;
  token: string | null;
  role: User['role'] | null;
  setSession: (p: { user: User; token: string }) => void;
  clearSession: () => void;
  setRole: (r: User['role'] | null) => void;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  updateUser: (p: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,

      setSession: ({ user, token }) =>
        set(() => ({
          user,
          token,
          role: user.role ?? null,
        })),

      clearSession: () => set(() => ({ user: null, token: null, role: null })),

      setRole: (r) => set(() => ({ role: r })),
      setToken: (t) => set(() => ({ token: t })),
      setUser: (u) => set(() => ({ user: u })),

      updateUser: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    {
      name: 'auth',
      version: 1,
      storage: createStorage(),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
