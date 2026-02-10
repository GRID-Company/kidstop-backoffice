'use client';

import React from 'react';
import { Card, CardBody, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';

interface ChartsSectionProps {
  metrics: {
    byPriority?: Record<string, number>;
    phases?: Array<{
      name: string;
      total: number;
      completed: number;
      inProgress: number;
      todo: number;
      estimatedSP: number;
      color: string;
    }>;
    total: number;
  };
  isEmergencyMode: boolean;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  metrics,
  isEmergencyMode,
}) => {
  const PriorityDistribution = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardBody>
          <Tooltip content="Tareas agrupadas por nivel de prioridad (Urgent, High, Normal, Low). Ayuda a identificar si hay demasiadas tareas urgentes sin resolver." placement="top" delay={300}>
            <h3 className="text-lg font-semibold mb-4 cursor-help">Distribución por prioridad</h3>
          </Tooltip>
          <div className="space-y-3">
            {metrics.byPriority && Object.entries(metrics.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    priority === 'Urgent' ? 'bg-red-500' :
                    priority === 'High' ? 'bg-orange-500' :
                    priority === 'Normal' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <span className="font-medium">{priority}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{count}</span>
                  <span className="text-sm text-gray-500">
                    ({metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const PhaseProgress = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card>
        <CardBody>
          <Tooltip content="Avance de cada fase del proyecto (Foundation, Catalog, etc.) basado en keywords de las tareas. Muestra tareas completadas y en progreso por fase." placement="top" delay={300}>
            <h3 className="text-lg font-semibold mb-4 cursor-help">Progreso por fase</h3>
          </Tooltip>
          <div className="space-y-3">
            {metrics.phases?.map((phase) => (
              <div key={phase.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{phase.name}</span>
                  <span className="text-sm text-gray-500">{phase.estimatedSP} SP</span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Completado</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${phase.total > 0 ? (phase.completed / phase.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{phase.completed}/{phase.total}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">En progreso</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${phase.total > 0 ? (phase.inProgress / phase.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{phase.inProgress}/{phase.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );


  return (
    <>
      <PriorityDistribution />

      {metrics.phases && metrics.phases.length > 0 && (
        <PhaseProgress />
      )}
    </>
  );
};
