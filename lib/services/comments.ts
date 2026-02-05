/**
 * Comment service - Business logic for comment operations
 * 
 * @module services/comments
 */

import { withConnection } from '@/lib/database';
import { Comment, CommentCreateRequest } from '@/lib/types';
import { CONTENT_LIMITS, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Database row type for comments
 */
interface CommentRow {
  id: string;
  content: string;
  author_name: string | null;
  is_anonymous: boolean;
  created_at: Date;
}

/**
 * Transform database row to Comment type
 */
function transformCommentRow(row: CommentRow): Comment {
  return {
    id: row.id,
    content: row.content,
    author: row.author_name && !row.is_anonymous ? row.author_name : 'Anonymous',
    date: row.created_at.toISOString(),
  };
}

/**
 * Get all comments for a story
 * 
 * @param storyId - Story ID
 * @returns Array of comments ordered by date ascending
 */
export async function getCommentsForStory(storyId: string): Promise<Comment[]> {
  return withConnection(async (client) => {
    const result = await client.query<CommentRow>(`
      SELECT id, content, author_name, is_anonymous, created_at 
      FROM comments 
      WHERE story_id = $1 
      ORDER BY created_at ASC
    `, [storyId]);
    
    return result.rows.map(transformCommentRow);
  });
}

/**
 * Create a new comment on a story
 * 
 * @param storyId - Story ID
 * @param data - Comment creation data
 * @returns Created comment
 * @throws Error if content is empty or story doesn't exist
 */
export async function createComment(
  storyId: string, 
  data: CommentCreateRequest
): Promise<Comment> {
  const content = data.content?.trim();
  
  if (!content || content.length < CONTENT_LIMITS.COMMENT_MIN_LENGTH) {
    throw new Error(ERROR_MESSAGES.COMMENT_EMPTY);
  }
  
  if (content.length > CONTENT_LIMITS.COMMENT_MAX_LENGTH) {
    throw new Error(ERROR_MESSAGES.COMMENT_TOO_LONG);
  }

  return withConnection(async (client) => {
    // Verify story exists
    const storyCheck = await client.query(
      'SELECT id FROM stories WHERE id = $1',
      [storyId]
    );
    
    if (storyCheck.rows.length === 0) {
      throw new Error(ERROR_MESSAGES.STORY_NOT_FOUND);
    }
    
    const author = !data.isAnonymous && data.authorName 
      ? data.authorName.trim().substring(0, CONTENT_LIMITS.AUTHOR_NAME_MAX_LENGTH) 
      : null;
    
    const result = await client.query<CommentRow>(`
      INSERT INTO comments (story_id, content, author_name, is_anonymous)
      VALUES ($1, $2, $3, $4)
      RETURNING id, content, author_name, is_anonymous, created_at
    `, [storyId, content, author, data.isAnonymous]);
    
    return transformCommentRow(result.rows[0]);
  });
}

/**
 * Delete a comment by ID (admin only)
 * 
 * @param commentId - Comment ID
 * @returns Success message
 * @throws Error if comment not found
 */
export async function deleteComment(commentId: string): Promise<{ message: string; id: string }> {
  return withConnection(async (client) => {
    const checkResult = await client.query(
      'SELECT id FROM comments WHERE id = $1',
      [commentId]
    );
    
    if (checkResult.rows.length === 0) {
      throw new Error(ERROR_MESSAGES.COMMENT_NOT_FOUND);
    }
    
    await client.query('DELETE FROM comments WHERE id = $1', [commentId]);
    return { message: 'Comment deleted successfully (admin)', id: commentId };
  });
}
