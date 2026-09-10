'use client';
import Settings from '@/features/settings/ui/views/settings';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Configuración ${TITLE_SUFFIX}`);

  return <Settings />;
}
