'use client';
import RegisterPage from '@/features/login/ui/views/register';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Registro ${TITLE_SUFFIX}`);
  return <RegisterPage />;
}
