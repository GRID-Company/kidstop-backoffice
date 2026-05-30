'use client';
import ResetPasswordPage from '@/features/login/ui/views/reset-password';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Recuperar contraseña ${TITLE_SUFFIX}`);
  return <ResetPasswordPage />;
}
