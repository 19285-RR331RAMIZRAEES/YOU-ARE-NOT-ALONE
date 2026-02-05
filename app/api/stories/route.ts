/**
 * Stories API Route
 * Handles GET (list all) and POST (create) operations for stories
 * 
 * @module api/stories
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllStories, createStory } from '@/lib/services/stories';
import { HTTP_STATUS } from '@/lib/constants';
import { StoryCreateRequest } from '@/lib/types';

/**
 * GET /api/stories
 * Fetch all approved stories ordered by date
 */
export async function GET(): Promise<NextResponse> {
  try {
    const stories = await getAllStories();
    return NextResponse.json(stories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stories';
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * POST /api/stories
 * Create a new story
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as StoryCreateRequest;
    const story = await createStory(body);
    
    return NextResponse.json(story, { status: HTTP_STATUS.CREATED });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create story';
    console.error('Error creating story:', error);
    
    // Check if it's a validation error
    if (message.includes('at least')) {
      return NextResponse.json(
        { error: message },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create story', details: message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
