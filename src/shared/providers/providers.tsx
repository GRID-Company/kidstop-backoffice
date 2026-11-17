'use client';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/react';
import ApolloClientProvider from './apollo-provider';
import { useAuthStore } from '../../lib/store/auth';
import { useEffect } from 'react';
import { UserRole } from '@/lib/auth/user-roles';
import { useVisualViewportOffset } from '@/lib/hooks/use-visual-viewport-offset';
import ViewportDebugHud from '../components/viewport-debug-hud';

type ProvidersProps = {
  children: React.ReactNode;
  role: string;
  jwt: string | null;
};

export default function Providers({ children, role, jwt }: ProvidersProps) {
  const { setToken, setRole } = useAuthStore();
  useVisualViewportOffset(true);

  useEffect(() => {
    setToken(jwt);
    setRole(role as UserRole);
  }, [role, jwt]);

  return (
    <HeroUIProvider locale='es-MX' disableAnimation>
      <ApolloClientProvider>{children}</ApolloClientProvider>
      <ViewportDebugHud />
    </HeroUIProvider>
  );
}
