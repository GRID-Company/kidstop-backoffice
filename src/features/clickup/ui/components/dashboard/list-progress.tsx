'use client';

import React from 'react';
import { Card, CardBody, Progress, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';

interface ListProgressItem {
  name: string;
  estimatedHours: number;
  completedTasks: number;
  totalTasks: number;
  completedHours: number;
  pendingHours: number;
}

interface ListProgressProps {
  listProgress: ListProgressItem[];
}

const getProgressColor = (percentage: number): 'success' | 'warning' | 'danger' => {
  if (percentage >= 80) return 'success';
  if (percentage >= 50) return 'warning';
  return 'danger';
};

const getProgressTextColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

export const ListProgress: React.FC<ListProgressProps> = ({ listProgress }) => {
  if (!listProgress || listProgress.length === 0) return null;

  const sortedLists = [...listProgress].sort((a, b) => b.estimatedHours - a.estimatedHours);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Card>
        <CardBody>
          <Tooltip content="Avance de cada lista de ClickUp según las horas cotizadas. Las horas completadas se estiman proporcionalmente: (tareas completadas / total) × horas estimadas." placement="top" delay={300}>
            <h3 className="text-lg font-semibold mb-4 cursor-help">Progreso por lista</h3>
          </Tooltip>
          <div className="space-y-4">
            {sortedLists.map((list) => {
              const percentage = list.totalTasks > 0
                ? Math.round((list.completedTasks / list.totalTasks) * 100)
                : 0;

              return (
                <div key={list.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{list.name}</span>
                      <Tooltip content={`Horas asignadas a esta lista según la cotización del proyecto (${list.estimatedHours}h de 320h totales).`} placement="top" delay={300}>
                        <span className="text-xs text-gray-500 cursor-help">({list.estimatedHours}h estimadas)</span>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {list.completedTasks}/{list.totalTasks} tareas
                      </span>
                      <span className={`text-sm font-bold ${getProgressTextColor(percentage)}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={percentage}
                    color={getProgressColor(percentage)}
                    size="sm"
                    className="w-full"
                    aria-label={`${list.name} progress: ${percentage}%`}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {Math.round(list.completedHours)}h completadas
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(list.pendingHours)}h pendientes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
