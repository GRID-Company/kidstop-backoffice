/**
 * ClickUp Dashboard View
 * Main view for ClickUp dashboard integration
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@heroui/react';
import ProjectDashboard from '@/features/clickup/ui/components/dashboard/project-dashboard-simple';

export const ClickUpDashboardView: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const dashboardRef = useRef<{ handleRefresh: () => void }>(null);
  
  useEffect(() => {
    // Set current time only on client side to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleString());
  }, []);

  const handleRefresh = () => {
    if (dashboardRef.current?.handleRefresh) {
      dashboardRef.current.handleRefresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚨 Kidstop Project Emergency Dashboard</h1>
              <p className="text-gray-600 mt-1">Recovery Mode Activated - Real-time Project Metrics</p>
            </div>
            
            {/* Refresh Button */}
            <div className="flex items-center space-x-4">
              <Button 
                color="primary" 
                variant="flat"
                onPress={handleRefresh}
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content - Folder Specific */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectDashboard 
          ref={dashboardRef}
          refreshInterval={0} // Disabled auto-refresh - manual only
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Kidstop Backoffice Project (KSP-001) • GRID Software • Folder-Specific Dashboard
            </div>
            <div>
              Last sync: {currentTime || 'Loading...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickUpDashboardView;
