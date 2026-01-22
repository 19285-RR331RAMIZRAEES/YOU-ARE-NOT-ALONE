import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL1 || process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// DELETE - Delete a story
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM stories WHERE id = $1', [params.id]);
      return NextResponse.json({ message: 'Story deleted successfully', id: params.id });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
