/**
 * ClickUp Dashboard Page
 * Main page for ClickUp integration dashboard
 */

import { ClickUpDashboardView } from '@/features/clickup/ui/views/clickup-dashboard';

export default function ClickUpDashboardPage() {
  return <ClickUpDashboardView />;
}

export const metadata = {
  title: 'ClickUp Dashboard',
  description: 'Project management and task tracking dashboard',
};
