'use client';
import NewWindowView from '@/features/windows/ui/views/new-window';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Nueva ventana ${TITLE_SUFFIX}`);

  return <NewWindowView />;
}
