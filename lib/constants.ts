/**
 * Application constants
 * Centralized location for all magic values
 * 
 * @module constants
 */

import { ReactionConfig } from './types';

/**
 * Available reaction types with their display configuration
 */
export const REACTION_TYPES: readonly ReactionConfig[] = [
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'support', emoji: '🤝', label: 'Support' },
  { type: 'relate', emoji: '🫂', label: 'Relate' },
  { type: 'strength', emoji: '💪', label: 'Strength' },
] as const;

/**
 * Valid reaction type values
 */
export const VALID_REACTION_TYPES = ['love', 'support', 'relate', 'strength'] as const;

/**
 * Content length constraints
 */
export const CONTENT_LIMITS = {
  STORY_MIN_LENGTH: 10,
  STORY_MAX_LENGTH: 10000,
  COMMENT_MIN_LENGTH: 1,
  COMMENT_MAX_LENGTH: 1000,
  AUTHOR_NAME_MAX_LENGTH: 50,
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  STORY_TOO_SHORT: `Story content must be at least ${CONTENT_LIMITS.STORY_MIN_LENGTH} characters`,
  COMMENT_EMPTY: 'Comment cannot be empty',
  COMMENT_TOO_LONG: `Comment must be less than ${CONTENT_LIMITS.COMMENT_MAX_LENGTH} characters`,
  INVALID_REACTION: 'Invalid reaction type',
  UNAUTHORIZED: 'Unauthorized access',
  ADMIN_REQUIRED: 'Admin password required',
  DELETION_TOKEN_REQUIRED: 'Deletion token or admin password required',
  STORY_NOT_FOUND: 'Story not found',
  COMMENT_NOT_FOUND: 'Comment not found',
  CANNOT_DELETE_OTHERS_STORY: 'You can only delete your own stories',
  FETCH_FAILED: 'Failed to fetch data',
  DELETE_FAILED: 'Failed to delete',
  CREATE_FAILED: 'Failed to create',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  STORY_DELETED: 'Story deleted successfully',
  STORY_DELETED_ADMIN: 'Story deleted successfully (admin)',
  COMMENT_DELETED: 'Comment deleted successfully (admin)',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  STORY_TOKENS: 'storyTokens',
  ADMIN_PASSWORD: 'adminPassword',
} as const;

/**
 * Session storage keys
 */
export const SESSION_KEYS = {
  ADMIN_PASSWORD: 'adminPassword',
} as const;
