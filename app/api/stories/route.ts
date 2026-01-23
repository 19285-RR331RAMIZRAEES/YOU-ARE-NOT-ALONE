import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create pool with connection string
const getPool = () => {
  const connectionString = process.env.POSTGRES_URL1 || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('No PostgreSQL connection string found');
  }
  
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
};

let pool: Pool;

function getConnection() {
  if (!pool) {
    pool = getPool();
  }
  return pool;
}

// Initialize database
async function initDb() {
  const client = await getConnection().connect();
  try {
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
    
    // Add deletion_token column if it doesn't exist (for existing databases)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='stories' AND column_name='deletion_token') THEN
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
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// GET - Fetch all stories
export async function GET() {
  try {
    await initDb();
    const client = await getConnection().connect();
    try {
      const result = await client.query(`
        SELECT id, content, author_name, is_anonymous, created_at 
        FROM stories 
        WHERE is_approved = TRUE 
        ORDER BY created_at DESC
      `);
      
      const stories = result.rows.map(story => ({
        id: story.id,
        content: story.content,
        author: story.author_name && !story.is_anonymous ? story.author_name : 'Anonymous',
        date: story.created_at.toISOString()
      }));
      
      return NextResponse.json(stories);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stories',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Create new story
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, isAnonymous, authorName } = body;
    
    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Story content must be at least 10 characters' },
        { status: 400 }
      );
    }

    await initDb();
    const client = await getConnection().connect();
    try {
      const author = !isAnonymous && authorName ? authorName.trim().substring(0, 50) : null;
      
      // Generate a unique deletion token for this story
      const deletionToken = require('crypto').randomBytes(32).toString('hex');
      
      const result = await client.query(`
        INSERT INTO stories (content, author_name, is_anonymous, is_approved, is_flagged, deletion_token)
        VALUES ($1, $2, $3, TRUE, FALSE, $4)
        RETURNING id, content, author_name, is_anonymous, created_at, deletion_token
      `, [content.trim(), author, isAnonymous, deletionToken]);
      
      const story = result.rows[0];
      
      return NextResponse.json({
        id: story.id,
        content: story.content,
        author: author || 'Anonymous',
        date: story.created_at.toISOString(),
        deletionToken: story.deletion_token // Return token to client for storage
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error creating story:', error);
    return NextResponse.json({ 
      error: 'Failed to create story',
      details: error.message 
    }, { status: 500 });
  }
}
