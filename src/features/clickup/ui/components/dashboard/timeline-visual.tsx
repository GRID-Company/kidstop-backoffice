'use client';

import React from 'react';
import { Card, CardBody, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';
import {
  PROJECT_TIMELINE,
  PROJECT_DURATION,
  MILESTONE_TARGETS,
  getDaysSinceStart,
} from '@/features/clickup/domain/constants/project-timeline.constants';

interface TimelineVisualProps {
  metrics: {
    completed: number;
    total: number;
  };
}

const MILESTONES = [
  { day: 30, label: 'Day 30', target: MILESTONE_TARGETS.DAY_30, date: PROJECT_TIMELINE.FIRST_DELIVERY_DATE },
  { day: 60, label: 'Day 60', target: MILESTONE_TARGETS.DAY_60, date: PROJECT_TIMELINE.SECOND_DELIVERY_DATE },
  { day: 90, label: 'Day 90', target: MILESTONE_TARGETS.DAY_90, date: PROJECT_TIMELINE.THIRD_DELIVERY_DATE },
];

const getStatusColor = (diff: number): { bg: string; text: string; dot: string } => {
  if (diff >= 0) return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
  if (diff >= -10) return { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' };
  return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
};

export const TimelineVisual: React.FC<TimelineVisualProps> = ({ metrics }) => {
  const totalDays = PROJECT_DURATION.TOTAL_DAYS;
  const currentDay = Math.min(getDaysSinceStart(), totalDays);
  const currentProgress = metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 0;
  const positionPercent = Math.min((currentDay / totalDays) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
    >
      <Card>
        <CardBody>
          <Tooltip content="Visualización del cronograma de 90 días con 3 entregas parciales. El punto azul indica el día actual. Los colores muestran si vas adelante (verde), ligeramente atrás (amarillo) o muy atrás (rojo) en cada hito." placement="top" delay={300}>
            <h3 className="text-lg font-semibold mb-6 cursor-help">Timeline del proyecto</h3>
          </Tooltip>

          <div className="relative px-4 pb-2">
            <div className="h-2 bg-gray-200 rounded-full relative">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${positionPercent}%` }}
              />

              {MILESTONES.map((m) => {
                const mPos = (m.day / totalDays) * 100;
                const isPast = currentDay >= m.day;
                return (
                  <div
                    key={m.day}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${mPos}%` }}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 border-white -ml-2 ${
                      isPast ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  </div>
                );
              })}

              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${positionPercent}%` }}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 border-3 border-white -ml-2.5 shadow-md" />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              {MILESTONES.map((m) => {
                const expectedPercent = m.target * 100;
                const diff = currentDay >= m.day
                  ? Math.round(currentProgress - expectedPercent)
                  : null;
                const colors = diff !== null ? getStatusColor(diff) : { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-300' };

                return (
                  <div key={m.day} className="text-center flex-1">
                    <Tooltip content={`Entrega parcial: se espera ${Math.round(m.target * 100)}% del proyecto completado para esta fecha.`} placement="bottom" delay={300}>
                      <div className="text-sm font-medium text-gray-700 cursor-help">{m.label}</div>
                    </Tooltip>
                    <div className="text-xs text-gray-500">
                      {m.date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Meta: {Math.round(expectedPercent)}%
                    </div>
                    {diff !== null ? (
                      <div className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${colors.bg} ${colors.text}`}>
                        {diff >= 0 ? `+${diff}%` : `${diff}%`}
                      </div>
                    ) : (
                      <div className="inline-block text-xs text-gray-400 mt-1">Pendiente</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            Día {currentDay} de {totalDays} · Progreso real: {Math.round(currentProgress)}%
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
