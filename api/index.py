from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import os

app = FastAPI(title="Hope Stories API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (will reset on each deployment)
stories_db = []

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
        "status": "running"
    }

@app.get("/api/stories", response_model=List[StoryResponse])
def get_stories():
    """Get all stories"""
    return stories_db

@app.post("/api/stories", response_model=StoryResponse)
def create_story(story_data: StoryCreate):
    """Create a new story"""
    if not story_data.content or len(story_data.content.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Story content must be at least 10 characters"
        )
    
    # Determine author info
    author_name = None
    if not story_data.isAnonymous and story_data.authorName:
        author_name = story_data.authorName.strip()[:50]
    
    # Create new story
    new_story = {
        "id": str(len(stories_db) + 1),
        "content": story_data.content.strip(),
        "author": author_name if author_name else "Anonymous",
        "date": datetime.now().isoformat()
    }
    
    stories_db.append(new_story)
    return new_story

@app.delete("/api/stories/{story_id}")
def delete_story(story_id: str):
    """Delete a story by ID"""
    global stories_db
    stories_db = [s for s in stories_db if s["id"] != story_id]
    return {"message": "Story deleted successfully", "id": story_id}

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "total_stories": len(stories_db),
        "timestamp": datetime.now().isoformat()
    }

# Vercel serverless handler
handler = app
