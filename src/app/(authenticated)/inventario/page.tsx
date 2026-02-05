'use client';
import Inventories from '@/features/inventory/ui/views/inventories';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Inventario ${TITLE_SUFFIX}`);

  return <Inventories />;
}
