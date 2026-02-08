/**
 * ClickUp Project Dashboard - Simple Version
 * Modern React component for displaying project metrics and tasks
 * Refactored to use sub-components for better maintainability
 */

'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { Button, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { useClickUpData } from '@/features/clickup/ui/hooks/use-clickup-data';

// Import sub-components
import { EmergencyBanner } from './emergency-banner';
import { HealthIndicator } from './health-indicator';
import { MetricsCards } from './metrics-cards';
import { ProgressBars } from './progress-bars';
import { ChartsSection } from './charts-section';
import { ActionPlan } from './action-plan';
import { RecentTasks } from './recent-tasks';

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
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Dashboard Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button color="primary" onPress={handleRefresh}>
              Try Again
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
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Emergency Banner */}
      <EmergencyBanner
        daysBehind={data.metrics.daysBehind || 0}
        daysToNextMilestone={data.metrics.daysToNextMilestone || 0}
        nextMilestone={data.metrics.nextMilestone}
        healthStatus={healthStatus}
        isEmergencyMode={isEmergencyMode}
      />

      {/* Project Health Indicator */}
      <HealthIndicator
        healthScore={healthScore}
        healthStatus={healthStatus}
        isEmergencyMode={isEmergencyMode}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEmergencyMode ? '🚨 Emergency Project Dashboard' : 'Project Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
            {data.metrics.projectStartDate && ` • Started: ${new Date(data.metrics.projectStartDate).toLocaleDateString()}`}
          </p>
        </div>
        <Button
          color="primary"
          variant="flat"
          onPress={handleRefresh}
          isLoading={isRefreshing}
        >
          Refresh
        </Button>
      </motion.div>

      {/* Metrics Cards */}
      <MetricsCards
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      {/* Progress Bars */}
      <ProgressBars
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      {/* Charts Section */}
      <ChartsSection
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      {/* Timeline Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {data.metrics.total}
          </div>
          <div className="text-gray-600 mb-4">Total Tasks</div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* Action Plan */}
      <ActionPlan
        metrics={data.metrics}
        isEmergencyMode={isEmergencyMode}
      />

      {/* Recent Tasks */}
      <RecentTasks
        tasks={data.tasks}
      />
    </div>
  );
});

ProjectDashboard.displayName = 'ProjectDashboard';

export default ProjectDashboard;