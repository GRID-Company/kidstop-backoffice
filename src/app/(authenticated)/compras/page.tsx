'use client';

import Purchases from '@/features/purchases/ui/views/purchases';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Compras ${TITLE_SUFFIX}`);

  return <Purchases />;
}
