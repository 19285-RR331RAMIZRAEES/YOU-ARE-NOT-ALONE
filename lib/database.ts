/**
 * Database connection and pool management
 * Provides a singleton pool instance for PostgreSQL connections
 * 
 * @module database
 */

import { Pool, PoolClient } from 'pg';

/**
 * Database configuration
 */
interface DatabaseConfig {
  connectionString: string;
  ssl: { rejectUnauthorized: boolean };
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig(): DatabaseConfig {
  const connectionString = 
    process.env.POSTGRES_URL1 || 
    process.env.POSTGRES_URL || 
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'Database connection string not found. ' +
      'Set POSTGRES_URL, POSTGRES_URL1, or DATABASE_URL environment variable.'
    );
  }

  return {
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

/** Singleton pool instance */
let pool: Pool | null = null;

/**
 * Get the database connection pool
 * Creates a new pool if one doesn't exist
 * 
 * @returns PostgreSQL connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(getDatabaseConfig());
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
  }
  return pool;
}

/**
 * Execute a database operation with automatic connection management
 * 
 * @param operation - Async function to execute with database client
 * @returns Result of the operation
 */
export async function withConnection<T>(
  operation: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    return await operation(client);
  } finally {
    client.release();
  }
}

/**
 * Initialize the database tables
 * Creates all required tables if they don't exist
 */
export async function initializeDatabase(): Promise<void> {
  await withConnection(async (client) => {
    // Create stories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        author_name VARCHAR(50),
        is_anonymous BOOLEAN DEFAULT TRUE,
        is_approved BOOLEAN DEFAULT TRUE,
        is_flagged BOOLEAN DEFAULT FALSE,
        deletion_token VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add deletion_token column if it doesn't exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='stories' AND column_name='deletion_token'
        ) THEN
          ALTER TABLE stories ADD COLUMN deletion_token VARCHAR(64);
        END IF;
      END $$;
    `);

    // Create reactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
        reaction_type VARCHAR(20) NOT NULL,
        user_token VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(story_id, user_token, reaction_type)
      )
    `);

    // Create comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        author_name VARCHAR(50),
        is_anonymous BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

/**
 * Generate a secure random token
 * @param length - Number of bytes (token will be 2x this in hex)
 */
export function generateToken(length: number = 32): string {
  return require('crypto').randomBytes(length).toString('hex');
}

/** Database module exports */
export const database = { getPool, withConnection, initializeDatabase, generateToken };
