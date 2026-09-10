'use client';

import Inventory from '@/features/inventory-cards/ui/views/inventory';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Inventario de Cartas ${TITLE_SUFFIX}`);

  return <Inventory />;
}
