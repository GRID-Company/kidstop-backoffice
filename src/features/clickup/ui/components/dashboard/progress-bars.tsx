'use client';

import React from 'react';
import { Card, CardBody, Progress, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';

interface ProgressBarsProps {
  metrics: {
    milestoneProgress?: number;
    nextMilestone?: string;
    daysToNextMilestone?: number;
  };
  isEmergencyMode: boolean;
}

export const ProgressBars: React.FC<ProgressBarsProps> = ({
  metrics,
  isEmergencyMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Card className={isEmergencyMode ? 'border-2 border-orange-500' : ''}>
        <CardBody>
          <div className="flex justify-between items-center mb-2">
            <Tooltip content="Porcentaje de avance dentro del ciclo de 30 días del hito actual. Cada hito representa un entregable parcial al cliente." placement="top" delay={300}>
              <h3 className="text-lg font-semibold cursor-help">Progreso del hito actual</h3>
            </Tooltip>
            <span className={`text-2xl font-bold ${isEmergencyMode ? 'text-orange-600' : 'text-blue-600'}`}>
              {Math.round(metrics.milestoneProgress || 0)}%
            </span>
          </div>
          <Progress
            value={metrics.milestoneProgress || 0}
            color={isEmergencyMode ? 'warning' : 'primary'}
            size="md"
            className="w-full"
            aria-label={`Milestone progress: ${Math.round(metrics.milestoneProgress || 0)}%`}
          />
          <div className="text-sm text-gray-600 mt-2">
            {metrics.nextMilestone} · {metrics.daysToNextMilestone || 0} días restantes
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
