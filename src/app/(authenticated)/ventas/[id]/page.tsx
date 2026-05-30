'use client';

import { use } from 'react';

import SaleDetail from '@/features/sales/ui/views/sale-detail';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);
  useTitle(`Detalle venta ${TITLE_SUFFIX}`);

  return <SaleDetail saleId={id} />;
}
