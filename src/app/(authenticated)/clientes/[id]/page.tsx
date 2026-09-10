'use client';

import { use } from 'react';
import CustomerDetail from '@/features/customers/ui/views/customer-detail';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);
  useTitle(`Detalle del cliente ${TITLE_SUFFIX}`);

  return <CustomerDetail customerId={id} />;
}
