/**
 * Reaction service - Business logic for reaction operations
 * 
 * @module services/reactions
 */

import { withConnection, generateToken } from '@/lib/database';
import { ReactionData, ReactionType } from '@/lib/types';
import { VALID_REACTION_TYPES, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Validate that a reaction type is valid
 * 
 * @param type - Reaction type to validate
 * @returns True if valid
 */
export function isValidReactionType(type: string): type is ReactionType {
  return VALID_REACTION_TYPES.includes(type as ReactionType);
}

/**
 * Get reaction counts and user's reactions for a story
 * 
 * @param storyId - Story ID
 * @param userToken - User's unique token
 * @returns Reaction data including counts and user's reactions
 */
export async function getReactions(
  storyId: string, 
  userToken: string
): Promise<ReactionData> {
  return withConnection(async (client) => {
    // Get reaction counts
    const countsResult = await client.query(`
      SELECT reaction_type, COUNT(*) as count
      FROM reactions
      WHERE story_id = $1
      GROUP BY reaction_type
    `, [storyId]);
    
    // Get user's reactions
    const userReactionsResult = await client.query(`
      SELECT reaction_type
      FROM reactions
      WHERE story_id = $1 AND user_token = $2
    `, [storyId, userToken]);
    
    const counts: Record<string, number> = {};
    countsResult.rows.forEach((row: { reaction_type: string; count: string }) => {
      counts[row.reaction_type] = parseInt(row.count);
    });
    
    const userReactions = userReactionsResult.rows.map(
      (row: { reaction_type: string }) => row.reaction_type as ReactionType
    );
    
    return { counts: counts as Record<ReactionType, number>, userReactions };
  });
}

/**
 * Toggle a reaction on a story
 * Adds the reaction if it doesn't exist, removes it if it does
 * 
 * @param storyId - Story ID
 * @param reactionType - Type of reaction
 * @param userToken - User's unique token (will be generated if not provided)
 * @returns Updated reaction data and user token
 * @throws Error if reaction type is invalid
 */
export async function toggleReaction(
  storyId: string,
  reactionType: string,
  userToken: string | null
): Promise<{ data: ReactionData; userToken: string }> {
  if (!isValidReactionType(reactionType)) {
    throw new Error(ERROR_MESSAGES.INVALID_REACTION);
  }

  const token = userToken || generateToken();

  return withConnection(async (client) => {
    // Check if reaction already exists
    const existingResult = await client.query(`
      SELECT id FROM reactions
      WHERE story_id = $1 AND user_token = $2 AND reaction_type = $3
    `, [storyId, token, reactionType]);
    
    if (existingResult.rows.length > 0) {
      // Remove existing reaction
      await client.query(`
        DELETE FROM reactions
        WHERE story_id = $1 AND user_token = $2 AND reaction_type = $3
      `, [storyId, token, reactionType]);
    } else {
      // Add new reaction
      await client.query(`
        INSERT INTO reactions (story_id, user_token, reaction_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (story_id, user_token, reaction_type) DO NOTHING
      `, [storyId, token, reactionType]);
    }
    
    // Get updated reaction data
    const data = await getReactions(storyId, token);
    
    return { data, userToken: token };
  });
}
