/**
 * Metrics Cards Component
 * Displays emergency and standard project metrics in card grid
 */

'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { getDaysSinceStart } from '@/features/clickup/domain/constants/project-timeline.constants';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  extra?: string;
  extra2?: string;
  color: string;
  borderClass?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  extra, 
  extra2, 
  color, 
  borderClass = '' 
}) => (
  <Card className={`border-2 ${borderClass}`}>
    <CardBody className="text-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <p className="text-gray-600 mt-1">{title}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      {extra && <div className="text-xs text-gray-400 mt-2">{extra}</div>}
      {extra2 && <div className="text-xs text-gray-500 mt-1">{extra2}</div>}
    </CardBody>
  </Card>
);

interface MetricsCardsProps {
  metrics: {
    daysBehind?: number;
    daysToNextMilestone?: number;
    requiredVelocity?: number;
    currentVelocity?: number;
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    totalStoryPoints?: number;
    completedStoryPoints?: number;
    projectStartDate?: string;
    nextMilestone?: string;
    milestoneTargetDate?: string;
    expectedCompletionByMilestone?: number;
    expectedTasksForMilestone?: number;
    tasksNeededForMilestone?: number;
  };
  isEmergencyMode: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  metrics,
  isEmergencyMode,
}) => {
  const emergencyCards = [
    {
      title: 'Days Behind',
      value: metrics.daysBehind || 0,
      subtitle: metrics.projectStartDate 
        ? `Since ${new Date(metrics.projectStartDate).toLocaleDateString()}`
        : undefined,
      color: isEmergencyMode ? 'text-red-600' : 'text-blue-600',
      borderClass: isEmergencyMode ? 'border-red-500 bg-red-50' : '',
    },
    {
      title: 'Days to Next Milestone',
      value: metrics.daysToNextMilestone || 0,
      subtitle: metrics.nextMilestone || 'Loading...',
      extra: metrics.milestoneTargetDate 
        ? `Target: ${new Date(metrics.milestoneTargetDate).toLocaleDateString()}`
        : undefined,
      color: isEmergencyMode ? 'text-orange-600' : 'text-blue-600',
      borderClass: isEmergencyMode ? 'border-orange-500 bg-orange-50' : '',
    },
    {
      title: 'Required Velocity',
      value: metrics.requiredVelocity?.toFixed(2) || '0.00',
      subtitle: `tasks/day to ${Math.round((metrics.expectedCompletionByMilestone || 0) * 100)}% milestone`,
      extra: `${metrics.tasksNeededForMilestone || 0} tasks needed ÷ ${metrics.daysToNextMilestone || 0} days`,
      extra2: `Target: ${metrics.expectedTasksForMilestone || 0} tasks (${Math.round((metrics.expectedCompletionByMilestone || 0) * 100)}% of project)`,
      color: isEmergencyMode ? 'text-yellow-600' : 'text-blue-600',
      borderClass: isEmergencyMode ? 'border-yellow-500 bg-yellow-50' : '',
    },
    {
      title: 'Current Velocity',
      value: metrics.currentVelocity?.toFixed(2) || '0.00',
      subtitle: 'tasks/day actual',
      extra: `${metrics.completed} tasks ÷ ${getDaysSinceStart()} days`,
      color: isEmergencyMode ? 'text-red-600' : 'text-blue-600',
      borderClass: isEmergencyMode ? 'border-red-500 bg-red-50' : '',
    },
  ];

  const standardCards = [
    {
      title: 'Total Tasks',
      value: metrics.total,
      subtitle: metrics.totalStoryPoints ? `${metrics.totalStoryPoints} SP estimated` : undefined,
      color: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: metrics.completed,
      subtitle: metrics.completedStoryPoints ? `${metrics.completedStoryPoints} SP done` : undefined,
      color: 'text-green-600',
    },
    {
      title: 'In Progress',
      value: metrics.inProgress,
      color: 'text-orange-600',
    },
    {
      title: 'Overdue',
      value: metrics.overdue,
      color: 'text-red-600',
      borderClass: isEmergencyMode ? 'border-red-500 bg-red-50' : '',
    },
  ];


  return (
    <>
      {/* Emergency Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {emergencyCards.map((card, index) => (
          <MetricCard key={`emergency-${index}`} {...card} />
        ))}
      </motion.div>

      {/* Standard Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {standardCards.map((card, index) => (
          <MetricCard key={`standard-${index}`} {...card} />
        ))}
      </motion.div>
    </>
  );
};
