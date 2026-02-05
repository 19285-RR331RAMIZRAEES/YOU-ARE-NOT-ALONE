/**
 * Story Reactions API Route
 * Handles GET (fetch) and POST (toggle) operations for reactions on a story
 * 
 * @module api/stories/[id]/reactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getReactions, toggleReaction } from '@/lib/services/reactions';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';

/** Route context with story ID parameter */
interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/stories/[id]/reactions
 * Fetch reaction counts and user's reactions for a story
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const userToken = request.headers.get('x-user-token') || 'anonymous';
    
    const data = await getReactions(id, userToken);
    return NextResponse.json(data);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reactions';
    console.error('Error fetching reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * POST /api/stories/[id]/reactions
 * Toggle a reaction on a story
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { reactionType } = body;
    const userToken = request.headers.get('x-user-token');
    
    const result = await toggleReaction(id, reactionType, userToken);
    
    return NextResponse.json({
      ...result.data,
      userToken: result.userToken,
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to toggle reaction';
    console.error('Error toggling reaction:', error);
    
    if (message === ERROR_MESSAGES.INVALID_REACTION) {
      return NextResponse.json(
        { error: message },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to toggle reaction', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
