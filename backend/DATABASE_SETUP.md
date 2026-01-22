# Hope Stories - PostgreSQL Database Setup

## 🚀 Quick Start with Docker

### 1. Start PostgreSQL Database

```powershell
# From the project root directory
docker-compose up -d
```

This will:
- Download PostgreSQL 16 Alpine image
- Create a container named `hope-stories-db`
- Initialize the database with the schema from `init.sql`
- Insert sample stories
- Expose PostgreSQL on port 5432

### 2. Install Python Dependencies

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Backend

```powershell
# Option 1: Using uvicorn directly
uvicorn main_postgres:app --reload --host 0.0.0.0 --port 8000

# Option 2: Using Python
python main_postgres.py
```

### 4. Verify Setup

Open browser to: http://localhost:8000/api/health

You should see:
```json
{
  "status": "healthy",
  "database": "PostgreSQL",
  "total_stories": 3,
  "approved_stories": 3,
  "timestamp": "2026-01-20T..."
}
```

## 🗄️ Database Details

**Connection Info:**
- Host: `localhost`
- Port: `5432`
- Database: `stories_db`
- Username: `storyshare`
- Password: `hopestories2026`

**Connection String:**
```
postgresql://storyshare:hopestories2026@localhost:5432/stories_db
```

## 📊 Database Schema

```sql
Table: stories
- id (UUID, Primary Key)
- content (TEXT, 10-10000 chars)
- is_anonymous (BOOLEAN)
- author_name (VARCHAR(50), nullable)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- is_approved (BOOLEAN)
- is_flagged (BOOLEAN)
- view_count (INTEGER)
- helpful_count (INTEGER)
```

## 🛠️ Docker Commands

```powershell
# Start database
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop database
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes all data!)
docker-compose down -v

# Access PostgreSQL CLI
docker exec -it hope-stories-db psql -U storyshare -d stories_db
```

## 🔍 PostgreSQL CLI Commands

Once inside PostgreSQL CLI (`psql`):

```sql
-- List all tables
\dt

-- Describe stories table
\d stories

-- View all stories
SELECT id, author_name, LEFT(content, 50) as preview, created_at FROM stories;

-- Count stories
SELECT COUNT(*) FROM stories;

-- Exit
\q
```

## 🌐 For Vercel Deployment

1. **Add PostgreSQL Database** (e.g., Vercel Postgres, Neon, Supabase)
2. **Set Environment Variable** in Vercel:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```
3. **Update CORS** in production to match your Vercel domain

## 🔄 Migrating from SQLite

Your old `stories.db` data can be migrated:

```powershell
# Export from SQLite
python migrate_sqlite_to_postgres.py
```

## 📝 API Endpoints

- `GET /` - API info
- `GET /api/health` - Health check
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create new story
- `DELETE /api/stories/{id}` - Delete story

## 🚨 Troubleshooting

**Problem:** Can't connect to database
```powershell
# Check if container is running
docker ps

# Check logs
docker-compose logs postgres
```

**Problem:** Port 5432 already in use
```powershell
# Change port in docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 on host instead

# Update DATABASE_URL accordingly
```

**Problem:** Database not initialized
```powershell
# Recreate with fresh data
docker-compose down -v
docker-compose up -d
```

## 🔐 Security Notes

**For Production:**
- Change default password in `docker-compose.yml`
- Use environment variables for sensitive data
- Enable SSL for PostgreSQL connections
- Implement rate limiting
- Add content moderation
