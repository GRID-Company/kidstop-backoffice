'use client';

import NotAuthenticatedLayout from '@/shared/layouts/not-authenticated';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <NotAuthenticatedLayout>{children}</NotAuthenticatedLayout>;
}
