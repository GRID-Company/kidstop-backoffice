'use client';

import Sales from '@/features/sales/ui/views/sales';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Ventas ${TITLE_SUFFIX}`);

  return <Sales />;
}
