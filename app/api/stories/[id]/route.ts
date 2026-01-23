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
    
    // Get deletion token and admin password from request headers
    const deletionToken = request.headers.get('x-deletion-token');
    const adminPassword = request.headers.get('x-admin-password');
    
    // Check if admin password is provided and valid
    const isAdmin = adminPassword && adminPassword === process.env.ADMIN_PASSWORD;
    
    if (!deletionToken && !isAdmin) {
      return NextResponse.json({ 
        error: 'Unauthorized: Deletion token or admin password required' 
      }, { status: 401 });
    }
    
    const client = await getConnection().connect();
    try {
      // If admin, skip token verification and delete directly
      if (isAdmin) {
        const checkResult = await client.query(
          'SELECT id FROM stories WHERE id = $1',
          [id]
        );
        
        if (checkResult.rows.length === 0) {
          return NextResponse.json({ 
            error: 'Story not found' 
          }, { status: 404 });
        }
        
        await client.query('DELETE FROM stories WHERE id = $1', [id]);
        return NextResponse.json({ message: 'Story deleted successfully (admin)', id });
      }
      
      // Regular user deletion - verify token matches the story
      const verifyResult = await client.query(
        'SELECT deletion_token FROM stories WHERE id = $1',
        [id]
      );
      
      if (verifyResult.rows.length === 0) {
        return NextResponse.json({ 
          error: 'Story not found' 
        }, { status: 404 });
      }
      
      const storedToken = verifyResult.rows[0].deletion_token;
      
      if (storedToken !== deletionToken) {
        return NextResponse.json({ 
          error: 'Unauthorized: You can only delete your own stories' 
        }, { status: 403 });
      }
      
      // Token matches, proceed with deletion
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
