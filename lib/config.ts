/**
 * Centralized application configuration
 * All environment variables are loaded and validated here
 * 
 * @module config
 */

/**
 * Get the database connection URL from environment variables
 * Checks multiple possible variable names for compatibility
 * 
 * @returns Database connection URL
 * @throws Error if no database URL is configured
 */
export function getDatabaseUrl(): string {
  const url = process.env.POSTGRES_URL1 
    || process.env.POSTGRES_URL 
    || process.env.DATABASE_URL;
  
  if (!url) {
    throw new Error(
      'Database connection string not found. ' +
      'Please set POSTGRES_URL, POSTGRES_URL1, or DATABASE_URL in your .env.local file.'
    );
  }
  
  return url;
}

/**
 * Get the admin password from environment variables
 * 
 * @returns Admin password
 * @throws Error if no admin password is configured
 */
export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  
  if (!password) {
    throw new Error(
      'Admin password not configured. ' +
      'Please set ADMIN_PASSWORD in your .env.local file.'
    );
  }
  
  return password;
}

/**
 * Validate that the admin password matches
 * 
 * @param password - Password to validate
 * @returns true if password is valid
 */
export function validateAdminPassword(password: string | null | undefined): boolean {
  if (!password) return false;
  try {
    return password === getAdminPassword();
  } catch {
    return false;
  }
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get the API base URL
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}