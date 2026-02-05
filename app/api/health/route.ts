/**
 * Health Check API Route
 * Provides system health and database connectivity status
 * 
 * @module api/health
 */

import { NextResponse } from 'next/server';
import { withConnection } from '@/lib/database';
import { HTTP_STATUS } from '@/lib/constants';
import { HealthCheckResponse } from '@/lib/types';

/**
 * GET /api/health
 * Check system health and database connectivity
 */
export async function GET(): Promise<NextResponse> {
  try {
    const result = await withConnection(async (client) => {
      const queryResult = await client.query('SELECT COUNT(*) FROM stories');
      return parseInt(queryResult.rows[0].count);
    });
    
    const response: HealthCheckResponse = {
      status: 'healthy',
      database: 'PostgreSQL',
      total_stories: result,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    const response: HealthCheckResponse = {
      status: 'unhealthy',
      database: 'PostgreSQL',
      error: message,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
