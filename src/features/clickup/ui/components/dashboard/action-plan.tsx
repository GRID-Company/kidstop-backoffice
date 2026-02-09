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
          <h2 className="text-2xl font-bold text-red-700 mb-4">PLAN DE RECUPERACIÓN</h2>
          
          {/* Velocity Analysis */}
          <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-red-500">
            <div className="font-semibold text-red-700 mb-2">ANÁLISIS DE VELOCIDAD:</div>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <div className="font-medium">Velocidad actual:</div>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.currentVelocity?.toFixed(2)} tareas/día
                </div>
                <div className="text-xs text-gray-500">
                  {metrics.completed} completadas ÷ {daysSinceStart} días desde inicio
                </div>
              </div>
              <div>
                <div className="font-medium">Velocidad requerida:</div>
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.requiredVelocity?.toFixed(2)} tareas/día
                </div>
                <div className="text-xs text-gray-500">
                  {metrics.tasksNeededForMilestone || 0} tareas necesarias ÷ {metrics.daysToNextMilestone || 0} días
                </div>
                <div className="text-xs text-gray-400">
                  Para hito del {Math.round((metrics.expectedCompletionByMilestone || 0) * 100)}%: {metrics.expectedTasksForMilestone || 0} tareas totales
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Brecha de velocidad: {velocityGap.toFixed(2)} tareas/día necesarias
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
              <div className="font-semibold text-red-700">INMEDIATO (HOY):</div>
              <div className="text-gray-700">
                Reunión de emergencia • Revisar dashboard • Identificar bloqueos • Definir metas diarias
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-l-4 border-orange-500">
              <div className="font-semibold text-orange-700">CORTO PLAZO (ESTA SEMANA):</div>
              <div className="text-gray-700">
                Standups diarios a las 9 AM • Completar {Math.ceil((metrics.requiredVelocity || 0) * 7)} tareas • 
                Alcanzar {metrics.requiredVelocity?.toFixed(2)}+ tareas/día • Primera demo al cliente
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-l-4 border-yellow-500">
              <div className="font-semibold text-yellow-700">MEDIANO PLAZO ({metrics.daysToNextMilestone} DÍAS):</div>
              <div className="text-gray-700">
                Completar {Math.ceil((metrics.requiredVelocity || 0) * (metrics.daysToNextMilestone || 0))} tareas • 
                Alcanzar {metrics.nextMilestone} • Restaurar confianza del cliente
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
              <div className="font-semibold text-green-700">META DE RECUPERACIÓN:</div>
              <div className="text-gray-700">
                Incrementar velocidad en {velocityIncreasePercent.toFixed(0)}% • 
                Completar {tasksToCompleteByDay60} tareas para el Día 60 • Volver al cronograma
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
