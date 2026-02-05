/**
 * Comment by ID API Route
 * Handles DELETE operation for a specific comment
 * 
 * @module api/comments/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteComment } from '@/lib/services/comments';
import { validateAdminPassword } from '@/lib/config';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';

/** Route context with comment ID parameter */
interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/comments/[id]
 * Delete a comment by ID (admin only)
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    
    // Verify admin authentication
    const adminPassword = request.headers.get('x-admin-password');
    const isAdmin = validateAdminPassword(adminPassword);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.ADMIN_REQUIRED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    
    const result = await deleteComment(id);
    return NextResponse.json(result);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete comment';
    console.error('Error deleting comment:', error);
    
    if (message === ERROR_MESSAGES.COMMENT_NOT_FOUND) {
      return NextResponse.json(
        { error: message },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete comment', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
