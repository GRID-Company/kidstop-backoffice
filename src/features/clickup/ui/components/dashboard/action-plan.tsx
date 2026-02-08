/**
 * Action Plan Component
 * Displays project recovery plan with velocity analysis and timeline
 */

'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { getDaysSinceStart } from '@/features/clickup/domain/constants/project-timeline.constants';

interface ActionPlanProps {
  metrics: {
    daysBehind?: number;
    daysToNextMilestone?: number;
    requiredVelocity?: number;
    currentVelocity?: number;
    completed?: number;
    projectStartDate?: string;
    tasksNeededForMilestone?: number;
    expectedCompletionByMilestone?: number;
    expectedTasksForMilestone?: number;
    nextMilestone?: string;
    total?: number;
  };
  isEmergencyMode: boolean;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ metrics, isEmergencyMode }) => {
  if (!isEmergencyMode) {
    return null;
  }

  const daysSinceStart = getDaysSinceStart();
  const velocityGap = Math.max(0, (metrics.requiredVelocity || 0) - (metrics.currentVelocity || 0));
  const velocityIncreasePercent = ((metrics.requiredVelocity || 0) / (metrics.currentVelocity || 1) * 100 - 100);
  const tasksToCompleteByDay60 = Math.ceil((metrics.total || 0) * 0.4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="border-2 border-red-500 bg-red-50">
        <CardBody>
          <h2 className="text-2xl font-bold text-red-700 mb-4">⚡ PROJECT RECOVERY PLAN</h2>
          
          {/* Velocity Analysis */}
          <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-red-500">
            <div className="font-semibold text-red-700 mb-2">VELOCITY ANALYSIS:</div>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <div className="font-medium">Current Velocity:</div>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.currentVelocity?.toFixed(2)} tasks/day
                </div>
                <div className="text-xs text-gray-500">
                  {metrics.completed} completed ÷ {daysSinceStart} days since start
                </div>
              </div>
              <div>
                <div className="font-medium">Required Velocity:</div>
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.requiredVelocity?.toFixed(2)} tasks/day
                </div>
                <div className="text-xs text-gray-500">
                  {metrics.tasksNeededForMilestone || 0} tasks needed ÷ {metrics.daysToNextMilestone || 0} days
                </div>
                <div className="text-xs text-gray-400">
                  For {Math.round((metrics.expectedCompletionByMilestone || 0) * 100)}% milestone: {metrics.expectedTasksForMilestone || 0} tasks total
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Velocity Gap: {velocityGap.toFixed(2)} tasks/day needed
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
              <div className="font-semibold text-red-700">IMMEDIATE (TODAY):</div>
              <div className="text-gray-700">
                Emergency team meeting • Review recovery dashboard • Identify blockers • Set daily targets
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-l-4 border-orange-500">
              <div className="font-semibold text-orange-700">SHORT TERM (THIS WEEK):</div>
              <div className="text-gray-700">
                Daily standups at 9 AM • Complete {Math.ceil((metrics.requiredVelocity || 0) * 7)} tasks • 
                Achieve {metrics.requiredVelocity?.toFixed(2)}+ tasks/day • First client demo
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-l-4 border-yellow-500">
              <div className="font-semibold text-yellow-700">MEDIUM TERM ({metrics.daysToNextMilestone} DAYS):</div>
              <div className="text-gray-700">
                Complete {Math.ceil((metrics.requiredVelocity || 0) * (metrics.daysToNextMilestone || 0))} tasks • 
                Reach {metrics.nextMilestone} • Restore client confidence
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
              <div className="font-semibold text-green-700">RECOVERY TARGET:</div>
              <div className="text-gray-700">
                Increase velocity by {velocityIncreasePercent.toFixed(0)}% • 
                Complete {tasksToCompleteByDay60} tasks by Day 60 • Get back on schedule
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
