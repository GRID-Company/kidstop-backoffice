/**
 * ClickUp Data Hook
 * Server-side data fetching for ClickUp dashboard
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClickUpTask } from '@/features/clickup/domain/types';

interface DashboardData {
  tasks: ClickUpTask[];
  metrics: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    daysBehind?: number;
    daysToNextMilestone?: number;
    requiredVelocity?: number;
    currentVelocity?: number;
    totalStoryPoints?: number;
    completedStoryPoints?: number;
    projectStartDate?: string;
    criticalMilestoneDate?: string;
    phases?: Array<{
      name: string;
      total: number;
      completed: number;
      inProgress: number;
      todo: number;
      estimatedSP: number;
      color: string;
    }>;
    tags?: Record<string, number>;
    nextMilestone?: string;
    milestoneProgress?: number;
    milestoneTargetDate?: string;
    expectedCompletionByMilestone?: number;
    expectedTasksForMilestone?: number;
    tasksNeededForMilestone?: number;
    totalHours?: number;
    completedHours?: number;
    pendingHours?: number;
    totalCost?: number;
    completedCost?: number;
    pendingCost?: number;
    hoursPerDay?: number;
    listProgress?: Array<{
      name: string;
      estimatedHours: number;
      completedTasks: number;
      totalTasks: number;
      completedHours: number;
      pendingHours: number;
    }>;
  };
  lastUpdated: string;
  error?: string;
}

export function useClickUpData(listId?: string, refreshInterval?: number) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      if (showLoading) setError(null);

      // Fetch data from API route instead of direct ClickUp service
      const apiUrl = `/api/clickup/dashboard${listId ? `?listId=${listId}` : ''}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [listId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData(false);
  };

  useEffect(() => {
    fetchDashboardData();

    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchDashboardData(false);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [listId, refreshInterval, fetchDashboardData]);

  return {
    data,
    loading,
    error,
    isRefreshing,
    handleRefresh,
  };
}
