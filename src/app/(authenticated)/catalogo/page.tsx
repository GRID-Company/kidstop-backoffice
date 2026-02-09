'use client';

import Catalog from '@/features/catalog/ui/views/catalog';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Catálogo ${TITLE_SUFFIX}`);

  return <Catalog />;
}
