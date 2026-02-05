'use client';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/react';
import ApolloClientProvider from './apollo-provider';
import { useAuthStore } from '../../lib/store/auth';
import { useEffect } from 'react';
import { UserRole } from '@/lib/auth/user-roles';

type ProvidersProps = {
  children: React.ReactNode;
  role: string;
  jwt: string | null;
};

export default function Providers({ children, role, jwt }: ProvidersProps) {
  const { setToken, setRole } = useAuthStore();

  useEffect(() => {
    setToken(jwt);
    setRole(role as UserRole);
  }, [role, jwt]);

  return (
    <HeroUIProvider locale='es-MX'>
      <ApolloClientProvider>{children}</ApolloClientProvider>
    </HeroUIProvider>
  );
}
