/**
 * ClickUp Project Dashboard - Simple Version
 * Modern React component for displaying project metrics and tasks
 * Refactored to use sub-components for better maintainability
 */

'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { Button, Spinner } from '@heroui/react';
import { useClickUpData } from '@/features/clickup/ui/hooks/use-clickup-data';

// Import sub-components
import { EmergencyBanner } from './emergency-banner';
import { MetricsCards } from './metrics-cards';
import { ProgressBars } from './progress-bars';
import { ChartsSection } from './charts-section';
import { ActionPlan } from './action-plan';
import { HoursTracking } from './hours-tracking';
import { TimelineVisual } from './timeline-visual';
import { ListProgress } from './list-progress';
import { BurndownChart } from './burndown-chart';
import { TasksTable } from './tasks-table';

interface ProjectDashboardProps {
  listId?: string;
  refreshInterval?: number;
  className?: string;
}

export const ProjectDashboard = forwardRef<
  { handleRefresh: () => void },
  ProjectDashboardProps
>(({ listId, refreshInterval = 0, className = '' }, ref) => {
  const { data, loading, error, isRefreshing, handleRefresh } = useClickUpData(listId, refreshInterval);

  // Expose handleRefresh to parent via ref
  useImperativeHandle(ref, () => ({
    handleRefresh
  }));

  // Emergency metrics calculations
  const isEmergencyMode = (data?.metrics.daysBehind || 0) > 20;
  
  // Calculate health status
  const healthScore = Math.max(0, 100 - (data?.metrics.daysBehind || 0));
  const healthStatus = healthScore >= 80 ? 'HEALTHY' : 
                      healthScore >= 50 ? 'WARNING' : 
                      healthScore >= 20 ? 'CRITICAL' : 'EMERGENCY';

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-20 ${className}`}>
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center py-20 ${className}`}>
        <div className="max-w-md">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Error en el dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button color="primary" onPress={handleRefresh}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <EmergencyBanner
        daysBehind={data.metrics.daysBehind || 0}
        daysToNextMilestone={data.metrics.daysToNextMilestone || 0}
        nextMilestone={data.metrics.nextMilestone}
        healthStatus={healthStatus}
        isEmergencyMode={isEmergencyMode}
      />

      <div className="text-sm text-gray-500">
        Actualizado: {new Date(data.lastUpdated).toLocaleString()}
        {data.metrics.projectStartDate && ` · Inicio: ${new Date(data.metrics.projectStartDate).toLocaleDateString()}`}
      </div>

      <HoursTracking metrics={data.metrics} />

      <MetricsCards
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      <TimelineVisual metrics={data.metrics} />

      <ProgressBars
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      {data.metrics.listProgress && data.metrics.listProgress.length > 0 && (
        <ListProgress listProgress={data.metrics.listProgress} />
      )}

      <ChartsSection
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      <BurndownChart metrics={data.metrics} />

      <ActionPlan
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      <TasksTable
        tasks={data.tasks}
        listProgress={data.metrics.listProgress}
      />
    </div>
  );
});

ProjectDashboard.displayName = 'ProjectDashboard';

export default ProjectDashboard;