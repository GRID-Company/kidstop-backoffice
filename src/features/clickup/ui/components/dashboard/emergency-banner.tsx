/**
 * Emergency Banner Component
 * Displays critical project status and recovery mode information
 */

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
  const crisisLevel = daysBehind > 30 ? 'CODE RED' : 
                     daysBehind > 20 ? 'CODE YELLOW' : 'NORMAL';

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
          ⚠️ {crisisLevel}: PROJECT RECOVERY MODE
        </div>
        <div className="text-lg">
          {daysBehind} DAYS BEHIND • {daysToNextMilestone} DAYS TO {nextMilestone?.toUpperCase()} • HEALTH: {healthStatus}
        </div>
      </div>
    </motion.div>
  );
};
