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

// GET - Fetch comments for a story
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const client = await getConnection().connect();
    try {
      const result = await client.query(`
        SELECT id, content, author_name, is_anonymous, created_at 
        FROM comments 
        WHERE story_id = $1 
        ORDER BY created_at ASC
      `, [id]);
      
      const comments = result.rows.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.author_name && !comment.is_anonymous ? comment.author_name : 'Anonymous',
        date: comment.created_at.toISOString()
      }));
      
      return NextResponse.json(comments);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comments',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Add a comment to a story
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { content, isAnonymous, authorName } = body;
    
    if (!content || content.trim().length < 1) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be less than 1000 characters' },
        { status: 400 }
      );
    }

    const client = await getConnection().connect();
    try {
      // Verify story exists
      const storyCheck = await client.query(
        'SELECT id FROM stories WHERE id = $1',
        [id]
      );
      
      if (storyCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }

      const author = !isAnonymous && authorName ? authorName.trim().substring(0, 50) : null;
      
      const result = await client.query(`
        INSERT INTO comments (story_id, content, author_name, is_anonymous)
        VALUES ($1, $2, $3, $4)
        RETURNING id, content, author_name, is_anonymous, created_at
      `, [id, content.trim(), author, isAnonymous]);
      
      const comment = result.rows[0];
      
      return NextResponse.json({
        id: comment.id,
        content: comment.content,
        author: author || 'Anonymous',
        date: comment.created_at.toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Failed to create comment',
      details: error.message 
    }, { status: 500 });
  }
}
