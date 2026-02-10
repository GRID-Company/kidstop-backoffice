'use client';

import PurchaseNew from '@/features/purchases/ui/views/purchase-new';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Nueva compra ${TITLE_SUFFIX}`);

  return <PurchaseNew />;
}
