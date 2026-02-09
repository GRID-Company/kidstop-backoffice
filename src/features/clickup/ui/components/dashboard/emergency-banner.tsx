'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface EmergencyBannerProps {
  daysBehind: number;
  daysToNextMilestone: number;
  nextMilestone?: string;
  healthStatus: string;
  isEmergencyMode: boolean;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  daysBehind,
  daysToNextMilestone,
  nextMilestone,
  healthStatus,
  isEmergencyMode,
}) => {
  const crisisLevel = daysBehind > 30 ? 'CÓDIGO ROJO' : 
                     daysBehind > 20 ? 'CÓDIGO AMARILLO' : 'NORMAL';

  if (!isEmergencyMode) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-600 text-white p-6 rounded-xl shadow-lg"
    >
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">
          {crisisLevel}: MODO DE RECUPERACIÓN
        </div>
        <div className="text-lg">
          {daysBehind} DÍAS DE ATRASO • {daysToNextMilestone} DÍAS PARA {nextMilestone?.toUpperCase()} • SALUD: {healthStatus}
        </div>
      </div>
    </motion.div>
  );
};
