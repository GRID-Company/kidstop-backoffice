'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { TASK_PRIORITY_LABELS } from '@/features/clickup/domain/constants';
import { ClickUpTask } from '@/features/clickup/domain/types';

interface RecentTasksProps {
  tasks: ClickUpTask[];
}

export const RecentTasks: React.FC<RecentTasksProps> = ({ tasks }) => {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'danger';
      case 2: return 'warning';
      case 4: return 'success';
      default: return 'primary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'in progress':
      case 'inprogress': return 'warning';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Tareas recientes</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.name}</h4>
                  <p className="text-sm text-gray-600">
                    {task.status || 'Sin estado'} · {task.assignees?.length || 0} asignados
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {task.priority && (
                    <Chip
                      size="sm"
                      color={getPriorityColor(task.priority)}
                      variant="flat"
                    >
                      {TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS] || 'Unknown'}
                    </Chip>
                  )}
                  <Chip
                    size="sm"
                    color={getStatusColor(task.status || '')}
                    variant="flat"
                  >
                    {task.status || 'No status'}
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
