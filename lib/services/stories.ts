/**
 * Story service - Business logic for story operations
 * 
 * @module services/stories
 */

import { withConnection, initializeDatabase, generateToken } from '@/lib/database';
import { Story, StoryCreateRequest, StoryCreateResponse } from '@/lib/types';
import { CONTENT_LIMITS, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Database row type for stories
 */
interface StoryRow {
  id: string;
  content: string;
  author_name: string | null;
  is_anonymous: boolean;
  created_at: Date;
  deletion_token?: string;
}

/**
 * Transform database row to Story type
 */
function transformStoryRow(row: StoryRow): Story {
  return {
    id: row.id,
    content: row.content,
    author: row.author_name && !row.is_anonymous ? row.author_name : 'Anonymous',
    date: row.created_at.toISOString(),
  };
}

/**
 * Get all approved stories
 * 
 * @returns Array of stories ordered by date descending
 */
export async function getAllStories(): Promise<Story[]> {
  await initializeDatabase();
  
  return withConnection(async (client) => {
    const result = await client.query<StoryRow>(`
      SELECT id, content, author_name, is_anonymous, created_at 
      FROM stories 
      WHERE is_approved = TRUE 
      ORDER BY created_at DESC
    `);
    
    return result.rows.map(transformStoryRow);
  });
}

/**
 * Create a new story
 * 
 * @param data - Story creation data
 * @returns Created story with deletion token
 * @throws Error if content is too short
 */
export async function createStory(data: StoryCreateRequest): Promise<StoryCreateResponse> {
  if (!data.content || data.content.trim().length < CONTENT_LIMITS.STORY_MIN_LENGTH) {
    throw new Error(ERROR_MESSAGES.STORY_TOO_SHORT);
  }

  await initializeDatabase();
  
  return withConnection(async (client) => {
    const author = !data.isAnonymous && data.authorName 
      ? data.authorName.trim().substring(0, CONTENT_LIMITS.AUTHOR_NAME_MAX_LENGTH) 
      : null;
    const deletionToken = generateToken();
    
    const result = await client.query<StoryRow>(`
      INSERT INTO stories (content, author_name, is_anonymous, is_approved, is_flagged, deletion_token)
      VALUES ($1, $2, $3, TRUE, FALSE, $4)
      RETURNING id, content, author_name, is_anonymous, created_at, deletion_token
    `, [data.content.trim(), author, data.isAnonymous, deletionToken]);
    
    const story = result.rows[0];
    
    return {
      ...transformStoryRow(story),
      deletionToken: story.deletion_token || deletionToken,
    };
  });
}

/**
 * Delete a story by ID
 * 
 * @param id - Story ID
 * @param deletionToken - Token provided when story was created
 * @param isAdmin - Whether the request is from an admin
 * @returns Success message
 * @throws Error if story not found or unauthorized
 */
export async function deleteStory(
  id: string, 
  deletionToken: string | null, 
  isAdmin: boolean
): Promise<{ message: string; id: string }> {
  return withConnection(async (client) => {
    if (isAdmin) {
      // Admin deletion - verify story exists
      const checkResult = await client.query(
        'SELECT id FROM stories WHERE id = $1',
        [id]
      );
      
      if (checkResult.rows.length === 0) {
        throw new Error(ERROR_MESSAGES.STORY_NOT_FOUND);
      }
      
      await client.query('DELETE FROM stories WHERE id = $1', [id]);
      return { message: 'Story deleted successfully (admin)', id };
    }
    
    // Regular user deletion - verify token
    const verifyResult = await client.query(
      'SELECT deletion_token FROM stories WHERE id = $1',
      [id]
    );
    
    if (verifyResult.rows.length === 0) {
      throw new Error(ERROR_MESSAGES.STORY_NOT_FOUND);
    }
    
    const storedToken = verifyResult.rows[0].deletion_token;
    
    if (storedToken !== deletionToken) {
      throw new Error(ERROR_MESSAGES.CANNOT_DELETE_OTHERS_STORY);
    }
    
    await client.query('DELETE FROM stories WHERE id = $1', [id]);
    return { message: 'Story deleted successfully', id };
  });
}

/**
 * Check if a story exists
 * 
 * @param id - Story ID
 * @returns True if story exists
 */
export async function storyExists(id: string): Promise<boolean> {
  return withConnection(async (client) => {
    const result = await client.query(
      'SELECT id FROM stories WHERE id = $1',
      [id]
    );
    return result.rows.length > 0;
  });
}
