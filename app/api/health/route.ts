import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const client = await getConnection().connect();
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
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
