/**
 * Admin Password Verification API Route
 * Validates admin password for login
 * 
 * @module api/admin/verify
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword } from '@/lib/config';
import { HTTP_STATUS } from '@/lib/constants';
import { AdminVerifyResponse } from '@/lib/types';

/**
 * POST /api/admin/verify
 * Verify admin password
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { password } = await request.json();
    
    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    
    const response: AdminVerifyResponse = { success: true };
    return NextResponse.json(response);
    
  } catch (error: unknown) {
    console.error('Error verifying admin password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
