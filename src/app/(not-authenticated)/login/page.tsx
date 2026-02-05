'use client';
import LoginPage from '@/features/login/ui/views/login';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Inicia sesión ${TITLE_SUFFIX}`);
  return <LoginPage />;
}
