'use client';

import React from 'react';
import { Card, CardBody, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';
import { PROJECT_BUDGET, PROJECT_DURATION, getDaysSinceStart } from '@/features/clickup/domain/constants/project-timeline.constants';

interface BurndownChartProps {
  metrics: {
    completedHours?: number;
    totalHours?: number;
    hoursPerDay?: number;
  };
}

const MILESTONES = [
  { day: 30, label: 'Day 30' },
  { day: 60, label: 'Day 60' },
  { day: 90, label: 'Day 90' },
];

export const BurndownChart: React.FC<BurndownChartProps> = ({ metrics }) => {
  const totalHours = PROJECT_BUDGET.TOTAL_HOURS;
  const completedHours = metrics.completedHours || 0;
  const pendingHours = totalHours - completedHours;
  const totalDays = PROJECT_DURATION.TOTAL_DAYS;
  const currentDay = Math.min(getDaysSinceStart(), totalDays);

  const idealPendingAtCurrentDay = totalHours - (totalHours / totalDays) * currentDay;
  const diff = pendingHours - idealPendingAtCurrentDay;
  const isAhead = diff <= 0;

  const bars = MILESTONES.map(m => {
    const idealRemaining = Math.max(0, totalHours - (totalHours / totalDays) * m.day);
    const realRemaining = currentDay >= m.day
      ? Math.max(0, pendingHours + (completedHours / currentDay) * (currentDay - m.day))
      : pendingHours - (metrics.hoursPerDay || 0) * (m.day - currentDay);

    return {
      ...m,
      idealRemaining: Math.round(idealRemaining),
      realRemaining: Math.round(Math.max(0, realRemaining)),
      isPast: currentDay >= m.day,
    };
  });

  const maxHeight = totalHours;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <Tooltip content="Gráfica de quemado: compara las horas pendientes reales vs el ritmo ideal (línea recta de 320h a 0h en 90 días). Si la barra naranja está por encima de la azul, vas atrás del plan." placement="top" delay={300}>
              <h3 className="text-lg font-semibold cursor-help">Burndown Chart</h3>
            </Tooltip>
            <div className={`text-sm font-medium px-3 py-1 rounded-full ${
              isAhead ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isAhead ? 'Adelante del ideal' : `${Math.round(Math.abs(diff))}h atrás del ideal`}
            </div>
          </div>

          <div className="flex items-end justify-around gap-2 h-48 px-4">
            {/* Start bar */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                <div
                  className="w-6 bg-blue-400 rounded-t"
                  style={{ height: `${(totalHours / maxHeight) * 100}%` }}
                  title={`Ideal: ${totalHours}h`}
                />
                <div
                  className="w-6 bg-orange-400 rounded-t"
                  style={{ height: `${(totalHours / maxHeight) * 100}%` }}
                  title={`Real: ${totalHours}h`}
                />
              </div>
              <span className="text-xs text-gray-500">Inicio</span>
            </div>

            {bars.map((bar) => (
              <div key={bar.day} className="flex flex-col items-center gap-1 flex-1">
                <div className="flex items-end gap-1 h-40 w-full justify-center">
                  <div
                    className="w-6 bg-blue-400 rounded-t transition-all"
                    style={{ height: `${maxHeight > 0 ? (bar.idealRemaining / maxHeight) * 100 : 0}%` }}
                    title={`Ideal: ${bar.idealRemaining}h`}
                  />
                  <div
                    className={`w-6 rounded-t transition-all ${bar.isPast ? 'bg-orange-400' : 'bg-orange-300 opacity-60'}`}
                    style={{ height: `${maxHeight > 0 ? (bar.realRemaining / maxHeight) * 100 : 0}%` }}
                    title={`Real: ${bar.realRemaining}h`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  currentDay >= bar.day ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {bar.label}
                </span>
              </div>
            ))}

            {/* End bar */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                <div className="w-6 bg-blue-400 rounded-t" style={{ height: '0%' }} />
                <div className="w-6 bg-orange-400 rounded-t" style={{ height: '0%' }} />
              </div>
              <span className="text-xs text-gray-500">Meta</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <Tooltip content="Horas pendientes si el trabajo se distribuyera uniformemente en 90 días." placement="top" delay={300}>
              <div className="flex items-center gap-2 cursor-help">
                <div className="w-3 h-3 bg-blue-400 rounded" />
                <span className="text-xs text-gray-600">Ideal</span>
              </div>
            </Tooltip>
            <Tooltip content="Horas pendientes reales basadas en el avance actual del equipo." placement="top" delay={300}>
              <div className="flex items-center gap-2 cursor-help">
                <div className="w-3 h-3 bg-orange-400 rounded" />
                <span className="text-xs text-gray-600">Real</span>
              </div>
            </Tooltip>
          </div>

          <div className="text-center mt-3 text-sm text-gray-500">
            Día actual: {currentDay} de {totalDays} · {Math.round(pendingHours)}h pendientes
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
