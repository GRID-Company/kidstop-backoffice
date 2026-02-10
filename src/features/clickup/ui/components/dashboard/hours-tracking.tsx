'use client';

import React from 'react';
import { Card, CardBody, Progress, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';
import { PROJECT_BUDGET } from '@/features/clickup/domain/constants/project-timeline.constants';

interface HoursTrackingProps {
  metrics: {
    completedHours?: number;
  };
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);
};

export const HoursTracking: React.FC<HoursTrackingProps> = ({ metrics }) => {
  const totalHours = PROJECT_BUDGET.TOTAL_HOURS;
  const completedHours = metrics.completedHours || 0;
  const pendingHours = totalHours - completedHours;
  const completedCost = completedHours * PROJECT_BUDGET.COST_PER_HOUR;
  const hoursProgress = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  const cards = [
    {
      title: 'Horas totales',
      value: `${totalHours}h`,
      subtitle: `Presupuesto: ${formatCurrency(PROJECT_BUDGET.TOTAL_COST)}`,
      color: 'text-blue-600',
      tooltip: 'Total de horas cotizadas para el proyecto completo (320h). Cada Story Point equivale a 1 hora de trabajo.',
    },
    {
      title: 'Horas completadas',
      value: `${Math.round(completedHours)}h`,
      subtitle: `${hoursProgress}% del total`,
      color: 'text-green-600',
      tooltip: 'Suma de horas (SP) de todas las tareas marcadas como "done". Se calcula desde los Story Points en la descripción de cada tarea.',
    },
    {
      title: 'Costo ejecutado',
      value: formatCurrency(completedCost),
      subtitle: `de ${formatCurrency(PROJECT_BUDGET.TOTAL_COST)}`,
      color: 'text-purple-600',
      tooltip: `Costo acumulado basado en horas completadas × $${PROJECT_BUDGET.COST_PER_HOUR}/hora. Refleja cuánto del presupuesto se ha consumido.`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <Tooltip key={index} content={card.tooltip} placement="bottom" delay={300}>
            <Card className="cursor-help">
              <CardBody className="text-center">
                <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                <p className="text-gray-600 mt-1">{card.title}</p>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </CardBody>
            </Card>
          </Tooltip>
        ))}
      </div>

      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-2">
            <Tooltip content="Porcentaje de horas completadas vs las 320h totales del proyecto. Basado en SP de tareas terminadas." placement="top" delay={300}>
              <h3 className="text-lg font-semibold cursor-help">Progreso en horas</h3>
            </Tooltip>
            <span className="text-2xl font-bold text-blue-600">{hoursProgress}%</span>
          </div>
          <Progress
            value={hoursProgress}
            color="primary"
            size="md"
            className="w-full"
            aria-label={`Hours progress: ${hoursProgress}%`}
          />
          <div className="text-sm text-gray-600 mt-2">
            {Math.round(completedHours)}h / {totalHours}h completadas
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
