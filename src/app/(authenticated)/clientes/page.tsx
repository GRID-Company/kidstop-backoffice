'use client';

import Customers from '@/features/customers/ui/views/customers';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Clientes ${TITLE_SUFFIX}`);

  return <Customers />;
}
