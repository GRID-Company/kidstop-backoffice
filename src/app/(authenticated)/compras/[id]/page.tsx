'use client';

import { use } from 'react';

import PurchaseDetail from '@/features/purchases/ui/views/purchase-detail';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);
  useTitle(`Detalle compra ${TITLE_SUFFIX}`);

  return <PurchaseDetail purchaseId={id} />;
}
