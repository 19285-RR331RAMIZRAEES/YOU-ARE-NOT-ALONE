import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL1 || process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM stories');
      const count = parseInt(result.rows[0].count);
      
      return NextResponse.json({
        status: 'healthy',
        database: 'PostgreSQL',
        total_stories: count,
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
