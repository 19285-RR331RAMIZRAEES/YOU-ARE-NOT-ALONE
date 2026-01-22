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

// DELETE - Delete a story
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const client = await getConnection().connect();
    try {
      await client.query('DELETE FROM stories WHERE id = $1', [id]);
      return NextResponse.json({ message: 'Story deleted successfully', id });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ 
      error: 'Failed to delete story',
      details: error.message 
    }, { status: 500 });
  }
}
