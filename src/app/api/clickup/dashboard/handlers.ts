/**
 * Dashboard API Handlers
 * Separated handlers for different dashboard operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClickUpService } from '@/features/clickup/domain/services/clickup.service';
import { createDashboardService } from '@/features/clickup/domain/services/dashboard.service';
import { logger } from '@/lib/clickup/logger';
import { validateEnvironment, createErrorResponse } from './dashboard-helpers';

/**
 * Handles GET requests for dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    // Validate environment first
    const envValidation = validateEnvironment();
    if (!envValidation.isValid) {
      return envValidation.errorResponse;
    }

    const listId = request.nextUrl.searchParams.get('listId');
    const dashboardService = createDashboardService(getClickUpService());

    // Handle "overall" aggregation case
    if (listId === 'overall') {
      logger.info('Getting overall dashboard data (aggregated across all lists)');
      
      const result = await dashboardService.getDashboardData({
        aggregateAll: true,
        includeMetrics: true,
      });

      return NextResponse.json(result);
    }

    // Handle specific list or folder dashboard
    const result = await dashboardService.getDashboardData({
      listId: listId || undefined,
      includeMetrics: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Dashboard API error', error as any);
    return createErrorResponse(error);
  }
}
