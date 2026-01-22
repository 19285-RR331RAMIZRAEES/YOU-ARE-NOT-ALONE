from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import sqlite3
import uuid

app = FastAPI(title="StoryShare API")

# Configure CORS to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DB_PATH = "stories.db"

def init_db():
    """Initialize the SQLite database and create tables if they don't exist"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stories (
            id TEXT PRIMARY KEY,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Add sample data if table is empty
    cursor.execute("SELECT COUNT(*) FROM stories")
    count = cursor.fetchone()[0]
    
    if count == 0:
        sample_stories = [
            ("1", "After years of struggling with anxiety and depression, I finally found the courage to seek help. It wasn't easy—there were days I wanted to give up. But slowly, with therapy and support from loved ones, I started to see glimpses of light. Today, I can honestly say I'm in a better place. If you're reading this and struggling, please know: it gets better. You deserve help, and you deserve to heal.", "Anonymous", "2026-01-15"),
            ("2", "I never thought I'd be able to share my story, but here I am. Every day gets a little easier. The journey has taught me that healing isn't linear—some days are harder than others, but that's okay. I've learned to be gentle with myself and celebrate small victories.", "Anonymous", "2026-01-12"),
            ("3", "Reading others' stories gave me the strength to write my own. We're all in this together, and knowing I'm not alone has made all the difference. Thank you to this community for being a safe space where I can be vulnerable and honest. Your stories have been my light in the darkness.", "Anonymous", "2026-01-10")
        ]
        
        cursor.executemany(
            "INSERT INTO stories (id, content, author, date) VALUES (?, ?, ?, ?)",
            sample_stories
        )
        conn.commit()
    
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models for request/response validation
class StoryCreate(BaseModel):
    content: str
    isAnonymous: bool = True
    authorName: str = ""

class Story(BaseModel):
    id: str
    content: str
    author: str
    date: str

@app.get("/")
def read_root():
    return {"message": "Welcome to StoryShare API", "version": "2.0.0 (SQLite Database)"}

@app.get("/api/stories", response_model=List[Story])
def get_stories():
    """Get all stories from database, ordered by date (newest first)"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, content, author, date FROM stories ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    
    stories = [dict(row) for row in rows]
    return stories

@app.post("/api/stories", response_model=Story)
def create_story(story: StoryCreate):
    """Create a new story and save to database"""
    if not story.content or len(story.content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Story content must be at least 10 characters")
    
    # Determine author name
    author = "Anonymous"
    if not story.isAnonymous and story.authorName and story.authorName.strip():
        author = story.authorName.strip()[:50]  # Limit to 50 characters
    
    new_story = {
        "id": str(uuid.uuid4()),
        "content": story.content.strip(),
        "author": author,
        "date": datetime.now().strftime("%Y-%m-%d")
    }
    
    # Save to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO stories (id, content, author, date) VALUES (?, ?, ?, ?)",
        (new_story["id"], new_story["content"], new_story["author"], new_story["date"])
    )
    conn.commit()
    conn.close()
    
    return new_story

@app.delete("/api/stories/{story_id}")
def delete_story(story_id: str):
    """Delete a story by ID"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM stories WHERE id = ?", (story_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Story not found")
    
    return {"message": "Story deleted successfully"}

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM stories")
    count = cursor.fetchone()[0]
    conn.close()
    
    return {
        "status": "healthy",
        "database": "SQLite",
        "db_file": DB_PATH,
        "stories_count": count,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
