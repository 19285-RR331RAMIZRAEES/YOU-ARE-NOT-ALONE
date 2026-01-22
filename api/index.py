from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid

app = FastAPI(title="Hope Stories API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    """Get database connection using Neon Postgres URL"""
    postgres_url = os.environ.get('POSTGRES_URL1') or os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL')
    if not postgres_url:
        raise Exception("POSTGRES_URL1/POSTGRES_URL environment variable not set")
    return psycopg2.connect(postgres_url)

def init_db():
    """Initialize database tables"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS stories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                content TEXT NOT NULL,
                author_name VARCHAR(50),
                is_anonymous BOOLEAN DEFAULT TRUE,
                is_approved BOOLEAN DEFAULT TRUE,
                is_flagged BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database initialization error: {e}")

class StoryCreate(BaseModel):
    content: str = Field(..., min_length=10, max_length=10000)
    isAnonymous: bool = True
    authorName: Optional[str] = Field(None, max_length=50)

class StoryResponse(BaseModel):
    id: str
    content: str
    author: str
    date: str

@app.get("/")
def read_root():
    return {
        "message": "Hope Stories API - You Are Not Alone",
        "version": "2.0.0",
        "status": "running",
        "database": "PostgreSQL"
    }

@app.get("/api/stories", response_model=List[StoryResponse])
def get_stories():
    """Get all approved stories"""
    try:
        init_db()
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT id, content, author_name, is_anonymous, created_at 
            FROM stories 
            WHERE is_approved = TRUE 
            ORDER BY created_at DESC
        """)
        
        stories = cur.fetchall()
        cur.close()
        conn.close()
        
        return [
            StoryResponse(
                id=str(story['id']),
                content=story['content'],
                author=story['author_name'] if story['author_name'] and not story['is_anonymous'] else "Anonymous",
                date=story['created_at'].isoformat()
            )
            for story in stories
        ]
    except Exception as e:
        print(f"Error fetching stories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stories", response_model=StoryResponse)
def create_story(story_data: StoryCreate):
    """Create a new story"""
    if not story_data.content or len(story_data.content.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Story content must be at least 10 characters"
        )
    
    try:
        init_db()
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        author_name = None
        if not story_data.isAnonymous and story_data.authorName:
            author_name = story_data.authorName.strip()[:50]
        
        cur.execute("""
            INSERT INTO stories (content, author_name, is_anonymous, is_approved, is_flagged)
            VALUES (%s, %s, %s, TRUE, FALSE)
            RETURNING id, content, author_name, is_anonymous, created_at
        """, (story_data.content.strip(), author_name, story_data.isAnonymous))
        
        new_story = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return StoryResponse(
            id=str(new_story['id']),
            content=new_story['content'],
            author=author_name if author_name else "Anonymous",
            date=new_story['created_at'].isoformat()
        )
    except Exception as e:
        print(f"Error creating story: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/stories/{story_id}")
def delete_story(story_id: str):
    """Delete a story by ID"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("DELETE FROM stories WHERE id = %s", (story_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return {"message": "Story deleted successfully", "id": story_id}
    except Exception as e:
        print(f"Error deleting story: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM stories")
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        
        return {
            "status": "healthy",
            "database": "PostgreSQL",
            "total_stories": count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Vercel serverless handler
handler = app
