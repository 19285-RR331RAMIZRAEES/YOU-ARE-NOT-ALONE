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

// GET - Fetch reaction counts and user's reactions for a story
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userToken = request.headers.get('x-user-token') || 'anonymous';
    
    const client = await getConnection().connect();
    try {
      // Get reaction counts
      const countsResult = await client.query(`
        SELECT reaction_type, COUNT(*) as count
        FROM reactions
        WHERE story_id = $1
        GROUP BY reaction_type
      `, [id]);
      
      // Get user's reactions
      const userReactionsResult = await client.query(`
        SELECT reaction_type
        FROM reactions
        WHERE story_id = $1 AND user_token = $2
      `, [id, userToken]);
      
      const counts: Record<string, number> = {};
      countsResult.rows.forEach(row => {
        counts[row.reaction_type] = parseInt(row.count);
      });
      
      const userReactions = userReactionsResult.rows.map(row => row.reaction_type);
      
      return NextResponse.json({ counts, userReactions });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reactions',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Toggle a reaction on a story
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { reactionType } = body;
    
    const validReactions = ['love', 'support', 'relate', 'strength'];
    if (!validReactions.includes(reactionType)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    // Get or generate user token from header or cookie
    let userToken = request.headers.get('x-user-token');
    if (!userToken) {
      // Generate a unique token for this user
      userToken = require('crypto').randomBytes(32).toString('hex');
    }

    const client = await getConnection().connect();
    try {
      // Check if story exists
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

      // Check if user already reacted with this type
      const existingReaction = await client.query(
        'SELECT id FROM reactions WHERE story_id = $1 AND user_token = $2 AND reaction_type = $3',
        [id, userToken, reactionType]
      );

      let action = '';
      if (existingReaction.rows.length > 0) {
        // Remove reaction (toggle off)
        await client.query(
          'DELETE FROM reactions WHERE story_id = $1 AND user_token = $2 AND reaction_type = $3',
          [id, userToken, reactionType]
        );
        action = 'removed';
      } else {
        // Add reaction
        await client.query(
          'INSERT INTO reactions (story_id, user_token, reaction_type) VALUES ($1, $2, $3)',
          [id, userToken, reactionType]
        );
        action = 'added';
      }

      // Get updated counts
      const countsResult = await client.query(`
        SELECT reaction_type, COUNT(*) as count
        FROM reactions
        WHERE story_id = $1
        GROUP BY reaction_type
      `, [id]);
      
      const counts: Record<string, number> = {};
      countsResult.rows.forEach(row => {
        counts[row.reaction_type] = parseInt(row.count);
      });

      return NextResponse.json({ 
        action,
        counts,
        userToken // Return token so client can store it
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error toggling reaction:', error);
    return NextResponse.json({ 
      error: 'Failed to toggle reaction',
      details: error.message 
    }, { status: 500 });
  }
}
