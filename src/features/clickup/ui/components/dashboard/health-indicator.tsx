/**
 * Health Indicator Component
 * Displays project health status with progress bar
 */

'use client';

import React from 'react';
import { Card, CardBody, Progress } from '@heroui/react';
import { motion } from 'framer-motion';

interface HealthIndicatorProps {
  healthScore: number;
  healthStatus: string;
  isEmergencyMode: boolean;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({
  healthScore,
  healthStatus,
  isEmergencyMode,
}) => {
  const healthColor = healthScore >= 80 ? 'text-green-600' : 
                     healthScore >= 50 ? 'text-yellow-600' : 
                     healthScore >= 20 ? 'text-orange-600' : 'text-red-600';

  const progressColor = healthScore >= 80 ? 'success' : 
                       healthScore >= 50 ? 'warning' : 'danger';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
    >
      <Card className={`border-2 ${isEmergencyMode ? 'border-red-500' : 'border-gray-200'}`}>
        <CardBody>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Project Health Status</h3>
              <p className="text-sm text-gray-600">
                Based on schedule adherence and delivery milestones
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${healthColor}`}>
                {healthScore}%
              </div>
              <div className={`text-sm font-medium ${healthColor}`}>
                {healthStatus}
              </div>
            </div>
          </div>
          <Progress 
            value={healthScore} 
            color={progressColor} 
            size="md"
            className="w-full mt-4"
            aria-label={`Project health: ${healthScore}%`}
          />
        </CardBody>
      </Card>
    </motion.div>
  );
};
