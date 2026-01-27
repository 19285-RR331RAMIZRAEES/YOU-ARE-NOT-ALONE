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

// DELETE - Delete a comment
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Get admin password from request headers
    const adminPassword = request.headers.get('x-admin-password');
    
    // Check if admin password is provided and valid
    const isAdmin = adminPassword && adminPassword === process.env.ADMIN_PASSWORD;
    
    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Unauthorized: Admin password required' 
      }, { status: 401 });
    }
    
    const client = await getConnection().connect();
    try {
      // Check if comment exists
      const checkResult = await client.query(
        'SELECT id FROM comments WHERE id = $1',
        [id]
      );
      
      if (checkResult.rows.length === 0) {
        return NextResponse.json({ 
          error: 'Comment not found' 
        }, { status: 404 });
      }
      
      // Delete the comment
      await client.query('DELETE FROM comments WHERE id = $1', [id]);
      return NextResponse.json({ message: 'Comment deleted successfully (admin)', id });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ 
      error: 'Failed to delete comment',
      details: error.message 
    }, { status: 500 });
  }
}
