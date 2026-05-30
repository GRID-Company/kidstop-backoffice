'use client';
import { ClickUpDashboardView } from '@/features/clickup/ui/views/clickup-dashboard';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`ClickUp Dashboard ${TITLE_SUFFIX}`);

  return <ClickUpDashboardView />;
}
