/**
 * ClickUp Project Constants
 * Centralized project dates and milestone configurations
 */

import { TaskMetrics } from '../managers/task.manager';

// Project Timeline Configuration
export const PROJECT_TIMELINE = {
  START_DATE: new Date('2026-01-03'),
  FIRST_DELIVERY_DATE: new Date('2026-02-02'), // Day 30
  SECOND_DELIVERY_DATE: new Date('2026-03-04'), // Day 60  
  THIRD_DELIVERY_DATE: new Date('2026-04-03'), // Day 90
  CRITICAL_MILESTONE_DATE: new Date('2026-03-05'), // Day 60 milestone
} as const;

// Milestone Targets
export const MILESTONE_TARGETS = {
  DAY_30: 0.30, // 30% by Day 30
  DAY_60: 0.60, // 60% by Day 60  
  DAY_90: 0.90, // 90% by Day 90
} as const;

// Project Duration
export const PROJECT_DURATION = {
  TOTAL_DAYS: 90, // Total project duration in natural days
  MILESTONE_CYCLE: 30, // 30-day natural delivery cycles
} as const;

// Default Metrics Configuration
export const DEFAULT_METRICS: TaskMetrics = {
  total: 0,
  completed: 0,
  inProgress: 0,
  overdue: 0,
  byPriority: {},
  byStatus: {},
  // Emergency metrics
  daysBehind: 0,
  daysToCriticalMilestone: 0,
  requiredVelocity: 0,
  currentVelocity: 0,
  totalStoryPoints: 0,
  completedStoryPoints: 0,
  projectStartDate: PROJECT_TIMELINE.START_DATE.toISOString(),
  criticalMilestoneDate: PROJECT_TIMELINE.CRITICAL_MILESTONE_DATE.toISOString(),
  phases: [],
  tags: {},
};

// Helper functions for date calculations
export const getDaysSinceStart = (fromDate: Date = new Date()): number => {
  return Math.floor((fromDate.getTime() - PROJECT_TIMELINE.START_DATE.getTime()) / (1000 * 60 * 60 * 24));
};

export const getDaysToMilestone = (milestoneDate: Date, fromDate: Date = new Date()): number => {
  return Math.floor((milestoneDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const getCurrentMilestone = (currentDate: Date = new Date()): {
  name: string;
  date: Date;
  target: number;
  daysRemaining: number;
} => {
  const time = currentDate.getTime();
  
  if (time < PROJECT_TIMELINE.FIRST_DELIVERY_DATE.getTime()) {
    return {
      name: 'First Delivery (Day 30)',
      date: PROJECT_TIMELINE.FIRST_DELIVERY_DATE,
      target: MILESTONE_TARGETS.DAY_30,
      daysRemaining: getDaysToMilestone(PROJECT_TIMELINE.FIRST_DELIVERY_DATE, currentDate),
    };
  } else if (time < PROJECT_TIMELINE.SECOND_DELIVERY_DATE.getTime()) {
    return {
      name: 'Second Delivery (Day 60)',
      date: PROJECT_TIMELINE.SECOND_DELIVERY_DATE,
      target: MILESTONE_TARGETS.DAY_60,
      daysRemaining: getDaysToMilestone(PROJECT_TIMELINE.SECOND_DELIVERY_DATE, currentDate),
    };
  } else {
    return {
      name: 'Third Delivery (Day 90)',
      date: PROJECT_TIMELINE.THIRD_DELIVERY_DATE,
      target: MILESTONE_TARGETS.DAY_90,
      daysRemaining: getDaysToMilestone(PROJECT_TIMELINE.THIRD_DELIVERY_DATE, currentDate),
    };
  }
};

export const getExpectedCompletionByMilestone = (currentDate: Date = new Date()): number => {
  const time = currentDate.getTime();
  
  if (time < PROJECT_TIMELINE.FIRST_DELIVERY_DATE.getTime()) {
    return MILESTONE_TARGETS.DAY_30;
  } else if (time < PROJECT_TIMELINE.SECOND_DELIVERY_DATE.getTime()) {
    return MILESTONE_TARGETS.DAY_60;
  } else {
    return MILESTONE_TARGETS.DAY_90;
  }
};
