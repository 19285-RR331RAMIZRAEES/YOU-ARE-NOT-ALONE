/**
 * Story by ID API Route
 * Handles DELETE operation for a specific story
 * 
 * @module api/stories/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteStory } from '@/lib/services/stories';
import { validateAdminPassword } from '@/lib/config';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';

/** Route context with story ID parameter */
interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/stories/[id]
 * Delete a story by ID
 * Requires either deletion token (for story owner) or admin password
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    
    // Get authentication from headers
    const deletionToken = request.headers.get('x-deletion-token');
    const adminPassword = request.headers.get('x-admin-password');
    const isAdmin = validateAdminPassword(adminPassword);
    
    // Check authorization
    if (!deletionToken && !isAdmin) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.DELETION_TOKEN_REQUIRED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    
    const result = await deleteStory(id, deletionToken, isAdmin);
    return NextResponse.json(result);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete story';
    console.error('Error deleting story:', error);
    
    if (message === ERROR_MESSAGES.STORY_NOT_FOUND) {
      return NextResponse.json(
        { error: message },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    if (message === ERROR_MESSAGES.CANNOT_DELETE_OTHERS_STORY) {
      return NextResponse.json(
        { error: message },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete story', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
