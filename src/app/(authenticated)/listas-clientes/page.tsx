'use client';

import CustomerLists from '@/features/customer-lists/ui/views/customer-lists';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Listas de clientes ${TITLE_SUFFIX}`);

  return <CustomerLists />;
}
