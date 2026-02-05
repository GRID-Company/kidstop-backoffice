'use client';
import WindowsView from '@/features/windows/ui/views/windows';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Ventanas ${TITLE_SUFFIX}`);

  return <WindowsView />;
}
