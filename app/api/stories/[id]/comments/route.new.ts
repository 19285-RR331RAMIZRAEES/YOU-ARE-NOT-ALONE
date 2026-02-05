/**
 * Story Comments API Route
 * Handles GET (list) and POST (create) operations for comments on a story
 * 
 * @module api/stories/[id]/comments
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCommentsForStory, createComment } from '@/lib/services/comments';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';
import { CommentCreateRequest } from '@/lib/types';

/** Route context with story ID parameter */
interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/stories/[id]/comments
 * Fetch all comments for a story
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const comments = await getCommentsForStory(id);
    return NextResponse.json(comments);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch comments';
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * POST /api/stories/[id]/comments
 * Create a new comment on a story
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = await request.json() as CommentCreateRequest;
    
    const comment = await createComment(id, body);
    return NextResponse.json(comment, { status: HTTP_STATUS.CREATED });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create comment';
    console.error('Error creating comment:', error);
    
    // Check for validation or not found errors
    if (
      message === ERROR_MESSAGES.COMMENT_EMPTY ||
      message === ERROR_MESSAGES.COMMENT_TOO_LONG
    ) {
      return NextResponse.json(
        { error: message },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    if (message === ERROR_MESSAGES.STORY_NOT_FOUND) {
      return NextResponse.json(
        { error: message },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create comment', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
