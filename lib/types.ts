/**
 * Centralized type definitions for the application
 * All shared interfaces and types are defined here
 * 
 * @module types
 */

/**
 * Story entity as stored in the database
 */
export interface Story {
  id: string;
  content: string;
  author: string;
  date: string;
}

/**
 * Story creation request payload
 */
export interface StoryCreateRequest {
  content: string;
  isAnonymous: boolean;
  authorName?: string;
}

/**
 * Story response with deletion token (returned after creation)
 */
export interface StoryCreateResponse extends Story {
  deletionToken: string;
}

/**
 * Comment entity
 */
export interface Comment {
  id: string;
  content: string;
  author: string;
  date: string;
}

/**
 * Comment creation request payload
 */
export interface CommentCreateRequest {
  content: string;
  isAnonymous: boolean;
  authorName?: string;
}

/**
 * Reaction data for a story
 */
export interface ReactionData {
  counts: Record<ReactionType, number>;
  userReactions: ReactionType[];
}

/**
 * Valid reaction types
 */
export type ReactionType = 'love' | 'support' | 'relate' | 'strength';

/**
 * Reaction type configuration
 */
export interface ReactionConfig {
  type: ReactionType;
  emoji: string;
  label: string;
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  details?: string;
}

/**
 * API success response
 */
export interface ApiSuccess {
  message: string;
  id?: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  database: string;
  total_stories?: number;
  error?: string;
  timestamp: string;
}

/**
 * Admin verify response
 */
export interface AdminVerifyResponse {
  success: boolean;
}
