'use client';
import ChangePasswordPage from '@/features/login/ui/views/change-password';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Cambiar contraseña ${TITLE_SUFFIX}`);
  return <ChangePasswordPage />;
}
