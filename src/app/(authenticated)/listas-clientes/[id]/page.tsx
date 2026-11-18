'use client';

import { use } from 'react';
import CustomerListDetail from '@/features/customer-lists/ui/views/customer-list-detail';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  useTitle(`Lista de cliente ${TITLE_SUFFIX}`);

  return <CustomerListDetail listId={id} />;
}
