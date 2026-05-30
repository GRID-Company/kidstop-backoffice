'use client';

import React, { useRef } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import ProjectDashboard from '@/features/clickup/ui/components/dashboard/project-dashboard-simple';

export const ClickUpDashboardView: React.FC = () => {
  const dashboardRef = useRef<{ handleRefresh: () => void }>(null);

  const handleRefresh = () => {
    dashboardRef.current?.handleRefresh();
  };

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="ClickUp Dashboard">
        <EntitiesPage.FlexRow>
          <Button
            color="primary"
            variant="flat"
            onPress={handleRefresh}
            startContent={<Icon icon="lucide:refresh-cw" />}
          >
            Actualizar datos
          </Button>
        </EntitiesPage.FlexRow>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <ProjectDashboard
          ref={dashboardRef}
          refreshInterval={0}
        />
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
};

export default ClickUpDashboardView;
