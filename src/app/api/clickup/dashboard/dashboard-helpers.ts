/**
 * Dashboard API Helpers
 * Utility functions for dashboard API operations
 */

import { NextResponse } from 'next/server';
import { DEFAULT_METRICS } from '@/features/clickup/domain/constants/project-timeline.constants';
import { logger } from '@/lib/clickup/logger';

/**
 * Validates environment variables for dashboard API
 */
export function validateEnvironment(): {
  isValid: boolean;
  errorResponse?: NextResponse;
} {
  const apiKey = process.env.CLICKUP_API_KEY;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

  if (!apiKey || !workspaceId) {
    logger.error('Missing required environment variables', {
      hasApiKey: !!apiKey,
      hasWorkspaceId: !!workspaceId,
    });
    
    return {
      isValid: false,
      errorResponse: NextResponse.json(
        { 
          error: 'Failed to fetch dashboard data',
          message: 'Please set CLICKUP_API_KEY and CLICKUP_WORKSPACE_ID in environment variables',
          tasks: [],
          metrics: DEFAULT_METRICS,
          lastUpdated: new Date().toISOString(),
        },
        { status: 500 }
      ),
    };
  }

  return { isValid: true };
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(error: unknown): NextResponse {
  return NextResponse.json(
    { 
      error: 'Failed to fetch dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error',
      tasks: [],
      metrics: DEFAULT_METRICS,
      lastUpdated: new Date().toISOString(),
    },
    { status: 500 }
  );
}
