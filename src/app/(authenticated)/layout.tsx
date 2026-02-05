'use client';
import AuthenticatedLayout from '@/shared/layouts/authenticated';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
